import {
  jsonResponse, parseBody, cleanText, ensureSheetSetup, findActiveProjectByKey,
  updateActiveProject, sanitizeResponses, validateProject, compactProjectText,
  PROJECT_REQUIREMENTS, APPROVED_EVIDENCE, feedbackInstructions, feedbackResponseFormat,
  callOpenAI, appendProjectLog
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
    validateProject(project, responses, false);

    const input = `
You are giving revision feedback before final submission.

Project requirements:
${PROJECT_REQUIREMENTS}

Approved evidence:
${APPROVED_EVIDENCE}

Student project:
${compactProjectText(project, responses)}
`;
    const feedbackText = await callOpenAI(feedbackInstructions(), input, 1500, feedbackResponseFormat());
    const feedback = JSON.parse(feedbackText);
    await updateActiveProject(projectKey, { productType: project.productType, productLink: project.productLink, responses, feedback });
    await appendProjectLog(project.projectId, project.groupName, project.period, "FEEDBACK", "Revision feedback generated.");
    return jsonResponse(200, { feedback });
  } catch (error) {
    return jsonResponse(500, { error: String(error.message || error) });
  }
};
