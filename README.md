# Project Lazarus Station 7 Final Mission Brief, Netlify + Google Sheets

Students use:
https://YOUR-SITE.netlify.app/

Teacher dashboard:
https://YOUR-SITE.netlify.app/admin.html

Google Sheets diagnostic:
https://YOUR-SITE.netlify.app/.netlify/functions/check-sheets

## Required Netlify environment variables

OPENAI_API_KEY
OPENAI_MODEL = gpt-4.1-mini
TEACHER_PASSWORD
GOOGLE_SHEET_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY

Optional:
SAPLING_API_KEY

Make sure environment variables include the Functions scope.

## Google setup

1. Create a Google Sheet.
2. Copy the spreadsheet ID from the URL into GOOGLE_SHEET_ID.
3. In Google Cloud, enable Google Sheets API.
4. Create a service account.
5. Create a JSON key for the service account.
6. Copy client_email into GOOGLE_SERVICE_ACCOUNT_EMAIL.
7. Copy private_key into GOOGLE_PRIVATE_KEY.
8. Share the Google Sheet with the service account email as Editor.

The app automatically creates:
- Active Projects
- Project Submissions
- Project Log
- Diagnostics, when you run check-sheets

## Files

package.json
netlify.toml
public/index.html
public/admin.html
public/app.js
public/styles.css
netlify/functions/shared.mjs
netlify/functions/start-project.mjs
netlify/functions/save-project.mjs
netlify/functions/feedback-project.mjs
netlify/functions/submit-project.mjs
netlify/functions/admin.mjs
netlify/functions/check-sheets.mjs
