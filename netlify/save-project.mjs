import {
  jsonResponse, parseBody, cleanText, ensureSheetSetup, findActiveProjectByKey,
  updateActiveProject, sanitizeResponses, appendProjectLog
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

    const project = found.project;
    const updatedProject = await updateActiveProject(projectKey, {
      productType: cleanText(body.productType || project.productType, 80),
      productLink: cleanText(body.productLink || "", 500),
      responses: sanitizeResponses(body.responses || {})
    });
    await appendProjectLog(project.projectId, project.groupName, project.period, "SAVE_DRAFT", "Draft saved.");
    return jsonResponse(200, { saved: true, project: updatedProject });
  } catch (error) {
    return jsonResponse(500, { error: String(error.message || error) });
  }
};
