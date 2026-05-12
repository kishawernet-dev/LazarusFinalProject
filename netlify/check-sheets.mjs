import { JWT } from "google-auth-library";

function jsonResponse(statusCode, body) {
  return { statusCode, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }, body: JSON.stringify(body, null, 2) };
}
function getPrivateKey() {
  const raw = process.env.GOOGLE_PRIVATE_KEY;
  if (!raw) throw new Error("Missing GOOGLE_PRIVATE_KEY.");
  let key = String(raw).trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) key = key.slice(1, -1);
  key = key.replace(/\\n/g, "\n").replace(/\r\n/g, "\n").trim();
  if (!key.includes("-----BEGIN PRIVATE KEY-----")) throw new Error("GOOGLE_PRIVATE_KEY does not contain BEGIN PRIVATE KEY.");
  if (!key.includes("-----END PRIVATE KEY-----")) throw new Error("GOOGLE_PRIVATE_KEY does not contain END PRIVATE KEY.");
  return key + "\n";
}
async function getAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  if (!email) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL.");
  const client = new JWT({ email, key: getPrivateKey(), scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  const tokenResponse = await client.getAccessToken();
  const token = typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;
  if (!token) throw new Error("Could not get Google access token.");
  return token;
}
async function sheetsFetch(path, options = {}) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) throw new Error("Missing GOOGLE_SHEET_ID.");
  const token = await getAccessToken();
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}${path}`, {
    ...options,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json", ...(options.headers || {}) }
  });
  const raw = await response.text();
  if (!response.ok) throw new Error(`Google Sheets API error ${response.status}: ${raw}`);
  return raw ? JSON.parse(raw) : {};
}
export const handler = async () => {
  try {
    const envCheck = {
      hasGoogleSheetId: Boolean(process.env.GOOGLE_SHEET_ID),
      hasServiceAccountEmail: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL),
      hasPrivateKey: Boolean(process.env.GOOGLE_PRIVATE_KEY),
      hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
      hasTeacherPassword: Boolean(process.env.TEACHER_PASSWORD),
      hasSapling: Boolean(process.env.SAPLING_API_KEY),
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
      sheetIdPreview: String(process.env.GOOGLE_SHEET_ID || "").slice(0, 10)
    };
    const metadata = await sheetsFetch("?fields=properties.title,sheets.properties.title");
    const sheetTitles = (metadata.sheets || []).map((sheet) => sheet.properties.title);
    if (!sheetTitles.includes("Diagnostics")) {
      await sheetsFetch(":batchUpdate", { method: "POST", body: JSON.stringify({ requests: [{ addSheet: { properties: { title: "Diagnostics" } } }] }) });
    }
    const range = encodeURIComponent("'Diagnostics'!A:C");
    await sheetsFetch(`/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
      method: "POST",
      body: JSON.stringify({ range: "'Diagnostics'!A:C", majorDimension: "ROWS", values: [[new Date().toISOString(), "Station 7 Netlify connection test", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || ""]] })
    });
    return jsonResponse(200, { ok: true, message: "Google Sheets connection works. A test row was added to the Diagnostics tab.", envCheck, spreadsheetTitle: metadata.properties?.title || "", sheetTitles });
  } catch (error) {
    return jsonResponse(500, { ok: false, error: String(error.message || error), hint: "Check Sheet ID, service account email, private key formatting, Google Sheets API enabled, and whether the Sheet is shared with the service account as Editor." });
  }
};
