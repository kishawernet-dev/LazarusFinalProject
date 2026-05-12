import { JWT } from "google-auth-library";

export const CONFIG = {
  OPENAI_API_URL: "https://api.openai.com/v1/chat/completions",
  SAPLING_API_URL: "https://api.sapling.ai/api/v1/aidetect",
  GOOGLE_SHEETS_API_URL: "https://sheets.googleapis.com/v4/spreadsheets",
  DEFAULT_MODEL: "gpt-4.1-mini",
  ACTIVE_SHEET: "Active Projects",
  SUBMISSIONS_SHEET: "Project Submissions",
  LOG_SHEET: "Project Log"
};

export const ACTIVE_HEADERS = [
  "Created Timestamp", "Updated Timestamp", "Group Name", "Period", "Access Code",
  "Project Key", "Project ID", "Product Type", "Product Link", "Members JSON",
  "Responses JSON", "Feedback JSON", "Status", "Submitted Timestamp"
];

export const SUBMISSION_HEADERS = [
  "Timestamp", "Group Name", "Period", "Project ID", "Product Type", "Product Link", "Members",
  "Outbreak Diagnosis", "Ecosystem Damage Report", "Restoration Blueprint",
  "Diagnosis Lead Defense", "Ecology Lead Defense", "Restoration Lead Defense", "Command Briefing Editor Defense",
  "Diagnosis Score", "Ecosystem Score", "Blueprint Score", "Reasoning Score", "Individual Defense Score", "Suggested Total",
  "Completion Check", "Evidence Strength", "Missing Evidence", "Misconceptions", "Needs Teacher Review",
  "Sapling AI Score", "AI Risk Level", "AI Detector Notes", "Feedback JSON", "Teacher Final Score", "Teacher Notes"
];

export const LOG_HEADERS = ["Timestamp", "Project ID", "Group Name", "Period", "Action", "Details"];

export const PROJECT_REQUIREMENTS = `
Project Lazarus Station 7 Final Mission Brief requirements:
Students are completing a condensed 3-day restoration mission brief.

Recommended group structure:
- Groups should have 3 students whenever possible.
- A fourth student may be added only if needed.
- The three required roles are Diagnosis Lead, Ecology Lead, and Restoration Lead.
- The optional fourth role is Command Briefing Editor.
- Everyone is responsible for evidence quality and scientific reasoning.

Required sections:
1. Outbreak Diagnosis
- Led by the Diagnosis Lead.
- Explain what the Lazarus Virus is doing to the body.
- Include at least two pieces of evidence from genetics, cells, organelles, macromolecules, immune response, ATP loss, or lactic acid buildup.

2. Ecosystem Damage Report
- Led by the Ecology Lead.
- Explain what happened to the ecosystem after the outbreak.
- Use at least one graph or data reference from food webs, nutrient cycles, biodiversity, symbiosis, or succession.

3. Restoration Blueprint
- Led by the Restoration Lead.
- Explain what Genesis Global Command should do first, next, and long-term.
- Include a first 24 hours action, first month action, and long-term recovery action.

4. Individual Scientific Defense
- Every listed student explains their role, evidence used, why the evidence matters, and one limitation or weakness in the plan.
- If there is a Command Briefing Editor, they must explain how they improved claim, evidence, reasoning, organization, and final product quality.

Final product:
- Students must create a final product: one-page report, 4-slide mini deck, poster, or infographic.
- Students must paste a shareable URL to the final product.
- Students must make sure the final product is shared with the teacher.
`;

export const APPROVED_EVIDENCE = `
Approved evidence students may use:

Stations 1-3:
- Infected cells show carbohydrate depletion.
- Lipids and proteins are broken down and repurposed.
- Digestive enzymes increase activity while metabolic control decreases.
- Infected cells become acidic.
- The immune system fails to recognize infected cells.
- The nervous system degenerates, causing erratic movement.
- Subject 47 maintains white blood cell levels and resists infection.
- Subject 48's white blood cell count drops sharply.
- Subject 47 shows little or no viral replication.
- Subject 48's viral load rises quickly.
- Rapidly dividing cells show greater infection.
- Nerve cells show limited infection because they rarely divide.
- Cell membranes are damaged, disrupting transport and homeostasis.
- ATP production drops in infected cells.
- Protein production drops in infected cells.
- Endocytosis and exocytosis can be hijacked to move viral material.

Station 4:
- Oxygen saturation dropped from 96 percent to 74 percent.
- ATP production collapsed from 36 ATP to 6 ATP.
- Blood pH dropped from 7.4 to 6.6, showing acidosis.
- Mitochondria show dysfunction.
- Anaerobic respiration increases lactic acid buildup.
- Brain, heart, and muscles rely heavily on oxygen and ATP.
- Emergency support may include oxygen stabilization, mitochondrial boosters, and buffering agents.

Station 5:
- LZR-Delta6 is connected to immune resistance.
- Subject 47 carries the GGA mutation linked to resistance.
- Subject 48 carries the AGG mutation linked to vulnerability.
- Bacteria, plants, Subject 47, and ancestral DNA share the 1500 bp band.
- Subject 48 lacks the 1500 bp resistance band.
- Shared DNA fragments can suggest molecular homology or common ancestry.
- Gel electrophoresis separates DNA fragments by size.

Station 6:
- Producers dropped from 10,000 to 4,000.
- Primary consumers increased from 2,500 to 4,000.
- Secondary consumers dropped from 800 to 300.
- Tertiary consumers dropped from 200 to 20.
- Decomposers dropped from 3,000 to 500.
- Plant nitrogen uptake dropped from 100 to 30.
- Decomposition rate dropped from 100 to 25.
- Nitrogen fixation rate dropped from 100 to 10.
- Atmospheric CO2 rose from 400 to 650.
- Mutualism dropped from 90 percent to 10 percent.
- Parasitism increased from 60 percent to 90 percent.
- Predation dropped from 85 percent to 15 percent.
- Pioneer species and succession can support recovery.
- Gene flow can increase biodiversity.
- Low genetic variation can reduce survival.
`;

export function jsonResponse(statusCode, body) {
  return { statusCode, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }, body: JSON.stringify(body) };
}
export function parseBody(event) { if (!event.body) return {}; try { return JSON.parse(event.body); } catch { throw new Error("Invalid JSON body."); } }
export function cleanText(value, maxLength = 5000) { if (value == null) return ""; return String(value).replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength); }
export function cleanLongText(value, maxLength = 12000) { if (value == null) return ""; return String(value).replace(/[<>]/g, "").trim().slice(0, maxLength); }
export function normalizeKey(value) { return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 80); }
export function uuid() { return crypto.randomUUID(); }
export function makeProjectKey(groupName, period, accessCode) { return `p${normalizeKey(period)}_${normalizeKey(groupName)}_${normalizeKey(accessCode)}`; }
export function defaultResponses() { return { outbreakDiagnosis: "", ecosystemDamage: "", restorationBlueprint: "", defense1: "", defense2: "", defense3: "", defense4: "" }; }
export function sanitizeResponses(responses = {}) { return { outbreakDiagnosis: cleanLongText(responses.outbreakDiagnosis, 12000), ecosystemDamage: cleanLongText(responses.ecosystemDamage, 12000), restorationBlueprint: cleanLongText(responses.restorationBlueprint, 12000), defense1: cleanLongText(responses.defense1, 6000), defense2: cleanLongText(responses.defense2, 6000), defense3: cleanLongText(responses.defense3, 6000), defense4: cleanLongText(responses.defense4, 6000) }; }

export function sanitizeMembers(members = []) {
  const roleOrder = ["Diagnosis Lead", "Ecology Lead", "Restoration Lead", "Command Briefing Editor"];
  if (!Array.isArray(members)) return [];
  return members.slice(0, 4).map((member, index) => {
    const firstName = cleanText(member.firstName, 50);
    const lastName = cleanText(member.lastName, 50);
    const role = cleanText(member.role || roleOrder[index] || "Team Member", 80);
    if (!firstName || !lastName) return null;
    return { role, firstName, lastName, fullName: `${firstName} ${lastName}` };
  }).filter(Boolean);
}
export function formatMembers(members = []) { return members.length ? members.map((m, i) => `${i + 1}. ${m.role}: ${m.fullName}`).join("\n") : "No members listed."; }
export function formatMembersInline(members = []) { return members.map((m) => `${m.role}: ${m.fullName}`).join(", "); }

function getSheetId() { const id = process.env.GOOGLE_SHEET_ID; if (!id) throw new Error("Missing GOOGLE_SHEET_ID environment variable."); return id; }
function getPrivateKey() {
  const raw = process.env.GOOGLE_PRIVATE_KEY;
  if (!raw) throw new Error("Missing GOOGLE_PRIVATE_KEY environment variable.");
  let key = String(raw).trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) key = key.slice(1, -1);
  key = key.replace(/\\n/g, "\n").replace(/\r\n/g, "\n").trim();
  if (!key.includes("-----BEGIN PRIVATE KEY-----")) throw new Error("GOOGLE_PRIVATE_KEY does not start with -----BEGIN PRIVATE KEY-----. Copy the private_key value from the service account JSON.");
  if (!key.includes("-----END PRIVATE KEY-----")) throw new Error("GOOGLE_PRIVATE_KEY does not end with -----END PRIVATE KEY-----. Copy the complete private_key value from the service account JSON.");
  return key + "\n";
}
async function getGoogleAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  if (!email) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable.");
  const client = new JWT({ email, key: getPrivateKey(), scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  const tokenResponse = await client.getAccessToken();
  const token = typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;
  if (!token) throw new Error("Could not get Google access token.");
  return token;
}
function quoteSheetName(name) { return `'${String(name).replace(/'/g, "''")}'`; }
export async function sheetsFetch(path, options = {}) {
  const token = await getGoogleAccessToken();
  const response = await fetch(`${CONFIG.GOOGLE_SHEETS_API_URL}/${getSheetId()}${path}`, { ...options, headers: { authorization: `Bearer ${token}`, "content-type": "application/json", ...(options.headers || {}) } });
  const raw = await response.text();
  if (!response.ok) throw new Error(`Google Sheets API error ${response.status}: ${raw}`);
  return raw ? JSON.parse(raw) : {};
}
export async function ensureSheetSetup() {
  const meta = await sheetsFetch("?fields=sheets.properties.title");
  const existing = new Set((meta.sheets || []).map((s) => s.properties.title));
  const required = [CONFIG.ACTIVE_SHEET, CONFIG.SUBMISSIONS_SHEET, CONFIG.LOG_SHEET];
  const requests = required.filter((title) => !existing.has(title)).map((title) => ({ addSheet: { properties: { title } } }));
  if (requests.length) await sheetsFetch(":batchUpdate", { method: "POST", body: JSON.stringify({ requests }) });
  await ensureHeaders(CONFIG.ACTIVE_SHEET, ACTIVE_HEADERS);
  await ensureHeaders(CONFIG.SUBMISSIONS_SHEET, SUBMISSION_HEADERS);
  await ensureHeaders(CONFIG.LOG_SHEET, LOG_HEADERS);
}
async function ensureHeaders(sheetName, headers) { const values = await getValues(`${quoteSheetName(sheetName)}!1:1`); const firstRow = values[0] || []; if (firstRow.length === 0 || firstRow[0] !== headers[0]) await updateValues(`${quoteSheetName(sheetName)}!A1:${columnLetter(headers.length)}1`, [headers]); }
export async function getValues(a1Range) { const data = await sheetsFetch(`/values/${encodeURIComponent(a1Range)}`); return data.values || []; }
export async function updateValues(a1Range, values) { return sheetsFetch(`/values/${encodeURIComponent(a1Range)}?valueInputOption=RAW`, { method: "PUT", body: JSON.stringify({ range: a1Range, majorDimension: "ROWS", values }) }); }
export async function appendValues(sheetName, rangeColumns, values) { const a1Range = `${quoteSheetName(sheetName)}!${rangeColumns}`; return sheetsFetch(`/values/${encodeURIComponent(a1Range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, { method: "POST", body: JSON.stringify({ range: a1Range, majorDimension: "ROWS", values }) }); }
function columnLetter(columnNumber) { let temp = columnNumber, letter = ""; while (temp > 0) { const mod = (temp - 1) % 26; letter = String.fromCharCode(65 + mod) + letter; temp = Math.floor((temp - mod) / 26); } return letter; }
export async function appendProjectLog(projectId, groupName, period, action, details) { await appendValues(CONFIG.LOG_SHEET, "A:F", [[new Date().toISOString(), projectId, groupName, period, action, cleanLongText(details, 2000)]]); }

export async function findActiveProjectByKey(projectKey) {
  const rows = await getValues(`${quoteSheetName(CONFIG.ACTIVE_SHEET)}!A2:N`);
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = normalizeRow(rows[i], ACTIVE_HEADERS.length);
    if (String(row[5]) === String(projectKey) && String(row[12]).toUpperCase() === "ACTIVE") return { rowNumber: i + 2, row, project: activeRowToProject(row) };
  }
  return null;
}
export async function createActiveProject(project) {
  const now = new Date().toISOString();
  const row = [now, now, project.groupName, project.period, project.accessCode, project.projectKey, project.projectId, project.productType, project.productLink || "", JSON.stringify(project.members || []), JSON.stringify(sanitizeResponses(project.responses || defaultResponses())), project.feedback ? JSON.stringify(project.feedback) : "", "ACTIVE", ""];
  await appendValues(CONFIG.ACTIVE_SHEET, "A:N", [row]);
}
export async function updateActiveProject(projectKey, updates) {
  const found = await findActiveProjectByKey(projectKey);
  if (!found) throw new Error("Active project not found.");
  const row = found.row;
  row[1] = new Date().toISOString();
  if (updates.productType !== undefined) row[7] = cleanText(updates.productType, 80);
  if (updates.productLink !== undefined) row[8] = cleanText(updates.productLink, 500);
  if (updates.members !== undefined) row[9] = JSON.stringify(sanitizeMembers(updates.members));
  if (updates.responses !== undefined) row[10] = JSON.stringify(sanitizeResponses(updates.responses));
  if (updates.feedback !== undefined) row[11] = updates.feedback ? JSON.stringify(updates.feedback) : "";
  if (updates.status !== undefined) row[12] = updates.status;
  if (updates.submittedAt !== undefined) row[13] = updates.submittedAt;
  await updateValues(`${quoteSheetName(CONFIG.ACTIVE_SHEET)}!A${found.rowNumber}:N${found.rowNumber}`, [row]);
  return activeRowToProject(row);
}
function activeRowToProject(row) { return { createdAt: row[0], updatedAt: row[1], groupName: row[2], period: row[3], accessCode: row[4], projectKey: row[5], projectId: row[6], productType: row[7], productLink: row[8], members: parseJson(row[9], []), responses: sanitizeResponses(parseJson(row[10], defaultResponses())), feedback: parseJson(row[11], null), status: row[12], submittedAt: row[13] || "" }; }
function normalizeRow(row, length) { const out = Array.from(row || []); while (out.length < length) out.push(""); return out.slice(0, length); }
function parseJson(value, fallback) { if (!value) return fallback; try { return JSON.parse(String(value)); } catch { return fallback; } }
export async function appendSubmissionRecord(record) {
  const ev = record.evaluation || {}, ai = record.aiDetection || {}, responses = sanitizeResponses(record.responses || {});
  const row = [record.submittedAt, record.groupName, record.period, record.projectId, record.productType, record.productLink, formatMembersInline(record.members || []), responses.outbreakDiagnosis, responses.ecosystemDamage, responses.restorationBlueprint, responses.defense1, responses.defense2, responses.defense3, responses.defense4, ev.diagnosisScore, ev.ecosystemScore, ev.blueprintScore, ev.reasoningScore, ev.individualDefenseScore, record.suggestedTotal, ev.completionCheck, ev.evidenceStrength, ev.missingEvidence, ev.misconceptions, ev.needsTeacherReview ? "YES" : "NO", ai.score, ai.riskLevel, ai.notes, record.feedback ? JSON.stringify(record.feedback) : "", "", ""];
  await appendValues(CONFIG.SUBMISSIONS_SHEET, "A:AE", [row]);
}
export async function getSubmissionRecords() {
  await ensureSheetSetup();
  const rows = await getValues(`${quoteSheetName(CONFIG.SUBMISSIONS_SHEET)}!A2:AE`);
  return rows.map((raw) => {
    const row = normalizeRow(raw, SUBMISSION_HEADERS.length);
    return { submittedAt: row[0], groupName: row[1], period: row[2], projectId: row[3], productType: row[4], productLink: row[5], members: row[6], responses: { outbreakDiagnosis: row[7], ecosystemDamage: row[8], restorationBlueprint: row[9], defense1: row[10], defense2: row[11], defense3: row[12], defense4: row[13] }, evaluation: { diagnosisScore: row[14], ecosystemScore: row[15], blueprintScore: row[16], reasoningScore: row[17], individualDefenseScore: row[18], completionCheck: row[20], evidenceStrength: row[21], missingEvidence: row[22], misconceptions: row[23], needsTeacherReview: row[24] }, suggestedTotal: row[19], aiDetection: { score: row[25], riskLevel: row[26], notes: row[27] }, feedback: parseJson(row[28], null) };
  }).reverse();
}
export function looksLikeUrl(value) { const text = String(value || "").trim().toLowerCase(); return text.startsWith("http://") || text.startsWith("https://"); }
export function validateProject(project, responses, finalSubmission = false) {
  const members = sanitizeMembers(project.members || []), safeResponses = sanitizeResponses(responses || {});
  if (!project.groupName) throw new Error("Enter a group name.");
  if (!project.period) throw new Error("Choose a class period.");
  if (!project.accessCode || String(project.accessCode).length < 4) throw new Error("Enter a group access code with at least 4 characters.");
  if (!project.productType) throw new Error("Choose a final product type.");
  if (members.length < 3) throw new Error("Enter the three required roles: Diagnosis Lead, Ecology Lead, and Restoration Lead.");
  for (const role of ["Diagnosis Lead", "Ecology Lead", "Restoration Lead"]) if (!members.some((m) => m.role === role)) throw new Error(`Missing required role: ${role}.`);
  if (finalSubmission) {
    if (!project.productLink) throw new Error("Paste the shareable URL to your final product before submitting. Make sure you share it with your teacher.");
    if (!looksLikeUrl(project.productLink)) throw new Error("The final product link must start with http:// or https://. Make sure you share it with your teacher.");
    if (safeResponses.outbreakDiagnosis.length < 80) throw new Error("Outbreak Diagnosis needs more detail before submission.");
    if (safeResponses.ecosystemDamage.length < 80) throw new Error("Ecosystem Damage Report needs more detail before submission.");
    if (safeResponses.restorationBlueprint.length < 100) throw new Error("Restoration Blueprint needs more detail before submission.");
    for (let i = 0; i < members.length; i++) if ((safeResponses[`defense${i + 1}`] || "").length < 40) throw new Error("Each listed group member needs an individual scientific defense before submission.");
  }
  return { members, responses: safeResponses };
}
export function compactProjectText(project, responses) { const r = sanitizeResponses(responses || {}); return `
Group: ${project.groupName}
Period: ${project.period}
Product type: ${project.productType}
Product link: ${project.productLink || "No link yet"}

Members:
${formatMembers(project.members || [])}

Outbreak Diagnosis:
${r.outbreakDiagnosis}

Ecosystem Damage Report:
${r.ecosystemDamage}

Restoration Blueprint:
${r.restorationBlueprint}

Diagnosis Lead Defense:
${r.defense1}

Ecology Lead Defense:
${r.defense2}

Restoration Lead Defense:
${r.defense3}

Command Briefing Editor Defense:
${r.defense4}
`; }

export function feedbackInstructions() { return `
You are a high school biology project coach. Give revision feedback only. Do not rewrite the students' project for them.

Rules:
- Do not give a complete model answer.
- Identify missing evidence and weak reasoning.
- Ask guiding questions that help students revise.
- Be direct, specific, and classroom appropriate.
- Use the approved evidence only.
- Return JSON only.
`; }
export function evaluationInstructions() { return `
You are a high school biology teacher assistant evaluating a condensed final project.

Use this 20-point rubric:
Outbreak Diagnosis, 0 to 5:
- Explains body-system failure and uses relevant genetics, cell, organelle, macromolecule, immune, ATP, or lactic acid evidence.

Ecosystem Damage, 0 to 4:
- Uses ecological data accurately from food webs, nutrient cycles, biodiversity, symbiosis, or succession.

Restoration Blueprint, 0 to 5:
- Gives realistic first 24 hours, first month, and long-term actions, with evidence-based reasoning.

Scientific Reasoning, 0 to 4:
- Explains why evidence supports the plan rather than merely listing facts.

Individual Defense, 0 to 2:
- Every listed student explains their contribution, evidence, reasoning, and limitations.
- If a Command Briefing Editor is listed, their defense should explain how they improved claim, evidence, reasoning, organization, and final product quality.

Be honest. Do not inflate scores. This is a suggested score only. The teacher makes the final decision.
Return JSON only.
`; }
export function feedbackResponseFormat() { return { type: "json_schema", json_schema: { name: "project_feedback", strict: true, schema: { type: "object", additionalProperties: false, properties: { overallFeedback: { type: "string" }, nextSteps: { type: "string" }, sectionFeedback: { type: "array", items: { type: "object", additionalProperties: false, properties: { section: { type: "string" }, strength: { type: "string" }, revisionNeeded: { type: "string" }, guidingQuestion: { type: "string" } }, required: ["section", "strength", "revisionNeeded", "guidingQuestion"] } } }, required: ["overallFeedback", "nextSteps", "sectionFeedback"] } } }; }
export function evaluationResponseFormat() { return { type: "json_schema", json_schema: { name: "project_evaluation", strict: true, schema: { type: "object", additionalProperties: false, properties: { diagnosisScore: { type: "integer" }, ecosystemScore: { type: "integer" }, blueprintScore: { type: "integer" }, reasoningScore: { type: "integer" }, individualDefenseScore: { type: "integer" }, completionCheck: { type: "string" }, evidenceStrength: { type: "string" }, missingEvidence: { type: "string" }, misconceptions: { type: "string" }, needsTeacherReview: { type: "boolean" } }, required: ["diagnosisScore", "ecosystemScore", "blueprintScore", "reasoningScore", "individualDefenseScore", "completionCheck", "evidenceStrength", "missingEvidence", "misconceptions", "needsTeacherReview"] } } }; }
export async function callOpenAI(instructions, input, maxTokens = 1200, responseFormat = null) {
  const apiKey = process.env.OPENAI_API_KEY, model = process.env.OPENAI_MODEL || CONFIG.DEFAULT_MODEL;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY environment variable.");
  const payload = { model, messages: [{ role: "system", content: instructions }, { role: "user", content: input }], temperature: responseFormat ? 0 : 0.25, max_completion_tokens: Math.max(maxTokens, 900) };
  if (responseFormat) payload.response_format = responseFormat;
  const response = await fetch(CONFIG.OPENAI_API_URL, { method: "POST", headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" }, body: JSON.stringify(payload) });
  const raw = await response.text();
  if (!response.ok) throw new Error(`OpenAI API error ${response.status}: ${raw}`);
  const data = JSON.parse(raw), content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error(`No text returned from OpenAI. Raw: ${raw.slice(0, 1000)}`);
  return String(content).trim();
}
function clamp(value, min, max) { const number = Number(value); if (Number.isNaN(number)) return min; return Math.max(min, Math.min(max, Math.round(number))); }
export function sanitizeEvaluation(evaluation = {}) { return { diagnosisScore: clamp(evaluation.diagnosisScore, 0, 5), ecosystemScore: clamp(evaluation.ecosystemScore, 0, 4), blueprintScore: clamp(evaluation.blueprintScore, 0, 5), reasoningScore: clamp(evaluation.reasoningScore, 0, 4), individualDefenseScore: clamp(evaluation.individualDefenseScore, 0, 2), completionCheck: cleanLongText(evaluation.completionCheck || "Completion check unavailable.", 1200), evidenceStrength: cleanLongText(evaluation.evidenceStrength || "Evidence strength unavailable.", 1200), missingEvidence: cleanLongText(evaluation.missingEvidence || "Missing evidence unavailable.", 1200), misconceptions: cleanLongText(evaluation.misconceptions || "Misconceptions unavailable.", 1200), needsTeacherReview: Boolean(evaluation.needsTeacherReview) }; }
export async function runSaplingSafely(text) {
  try {
    const key = process.env.SAPLING_API_KEY;
    if (!key) return { score: "", riskLevel: "Not checked", notes: "SAPLING_API_KEY was not configured. Detection applies only to the typed workspace sections, not the linked product." };
    const response = await fetch(CONFIG.SAPLING_API_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ key, text: String(text || ""), sent_scores: false, score_string: false }) });
    const raw = await response.text();
    if (!response.ok) throw new Error(`Sapling API error ${response.status}: ${raw}`);
    const data = JSON.parse(raw), score = typeof data.score === "number" ? data.score : "";
    let riskLevel = "Unavailable";
    if (typeof score === "number") { if (score >= 0.85) riskLevel = "High"; else if (score >= 0.65) riskLevel = "Medium"; else if (score >= 0.4) riskLevel = "Low-Medium"; else riskLevel = "Low"; }
    return { score, riskLevel, notes: "Detector score is probabilistic, not proof. Detection applies only to typed workspace sections, not the linked product." };
  } catch (error) { return { score: "", riskLevel: "Not checked", notes: `Sapling check failed: ${String(error.message || error).slice(0, 500)}` }; }
}
