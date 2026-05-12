import {
  jsonResponse, parseBody, cleanText, ensureSheetSetup, findActiveProjectByKey,
  updateActiveProject, appendSubmissionRecord, sanitizeResponses, validateProject,
  compactProjectText, PROJECT_REQUIREMENTS, APPROVED_EVIDENCE, evaluationInstructions,
  evaluationResponseFormat, callOpenAI, sanitizeEvaluation, runSaplingSafely, appendProjectLog
} from "./shared.mjs";

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return jsonResponse(405, { error: "Method not allowed" });
    await ensureSheetSetup();
    const body = parseBody(event);
    const projectKey = cleanText(body.projectKey, 240);
    if (!projectKey) return jsonResponse(400, { error: "Project session missing." });

    const found = await findActiveProjectByKey(projectKey);
    if (!found) return jsonResponse(404, { error: "Active project not found. Start or resume the project again." });

    const project = {
      ...found.project,
      productType: cleanText(body.productType || found.project.productType, 80),
      productLink: cleanText(body.productLink || found.project.productLink || "", 500)
    };
    const responses = sanitizeResponses(body.responses || {});
    const validated = validateProject(project, responses, true);
    project.members = validated.members;

    const input = `
Evaluate this condensed 3-day final project. Return JSON only.

Project requirements:
${PROJECT_REQUIREMENTS}

Approved evidence:
${APPROVED_EVIDENCE}

Student project:
${compactProjectText(project, responses)}
`;

    const evaluationText = await callOpenAI(evaluationInstructions(), input, 1800, evaluationResponseFormat());
    const evaluation = sanitizeEvaluation(JSON.parse(evaluationText));
    const suggestedTotal = evaluation.diagnosisScore + evaluation.ecosystemScore + evaluation.blueprintScore + evaluation.reasoningScore + evaluation.individualDefenseScore;
    const aiDetection = await runSaplingSafely(compactProjectText(project, responses));
    const submittedAt = new Date().toISOString();

    const submission = {
      submittedAt, groupName: project.groupName, period: project.period, projectId: project.projectId,
      productType: project.productType, productLink: project.productLink, members: project.members,
      responses, evaluation, suggestedTotal, aiDetection, feedback: found.project.feedback
    };
    await appendSubmissionRecord(submission);
    await updateActiveProject(projectKey, { productType: project.productType, productLink: project.productLink, responses, status: "SUBMITTED", submittedAt });
    await appendProjectLog(project.projectId, project.groupName, project.period, "SUBMIT", `Final project submitted. Suggested score: ${suggestedTotal}/20.`);
    return jsonResponse(200, { submitted: true, suggestedTotal, evaluation });
  } catch (error) {
    return jsonResponse(500, { error: String(error.message || error) });
  }
};
