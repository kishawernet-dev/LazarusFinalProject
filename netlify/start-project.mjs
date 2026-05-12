import {
  jsonResponse, parseBody, cleanText, uuid, makeProjectKey, ensureSheetSetup,
  sanitizeMembers, defaultResponses, findActiveProjectByKey, createActiveProject,
  appendProjectLog
} from "./shared.mjs";

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return jsonResponse(405, { error: "Method not allowed" });
    await ensureSheetSetup();

    const body = parseBody(event);
    const groupName = cleanText(body.groupName, 120);
    const period = cleanText(body.period, 20);
    const accessCode = cleanText(body.accessCode, 60);
    const productType = cleanText(body.productType, 80);
    const members = sanitizeMembers(body.members || []);

    if (!groupName) return jsonResponse(400, { error: "Enter a group name." });
    if (!period) return jsonResponse(400, { error: "Choose a class period." });
    if (!accessCode || accessCode.length < 4) return jsonResponse(400, { error: "Enter a group access code with at least 4 characters." });
    if (!productType) return jsonResponse(400, { error: "Choose a final product type." });
    if (members.length < 3) return jsonResponse(400, { error: "Enter the three required roles: Diagnosis Lead, Ecology Lead, and Restoration Lead." });

    const requiredRoles = ["Diagnosis Lead", "Ecology Lead", "Restoration Lead"];
    for (const role of requiredRoles) {
      if (!members.some((member) => member.role === role)) return jsonResponse(400, { error: `Missing required role: ${role}.` });
    }

    const projectKey = makeProjectKey(groupName, period, accessCode);
    const existing = await findActiveProjectByKey(projectKey);
    if (existing) {
      await appendProjectLog(existing.project.projectId, groupName, period, "RESUME", "Group resumed project.");
      return jsonResponse(200, { ...existing.project, resumed: true });
    }

    const project = {
      projectKey, projectId: uuid(), groupName, period, accessCode, productType,
      productLink: "", members, responses: defaultResponses(), feedback: null,
      status: "ACTIVE", resumed: false
    };

    await createActiveProject(project);
    await appendProjectLog(project.projectId, groupName, period, "START", "Group started project.");
    return jsonResponse(200, project);
  } catch (error) {
    return jsonResponse(500, { error: String(error.message || error) });
  }
};
