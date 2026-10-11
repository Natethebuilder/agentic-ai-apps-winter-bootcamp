# Deployment runbook

## GitHub

The repository is already configured with `.github/workflows/deploy.yml`. Add the dedicated Azure deployment token as:

`AZURE_STATIC_WEB_APPS_API_TOKEN_AI_APPS_WINTER`

Do not put token values in source files, workflow logs or documentation.

## Azure Static Web Apps

Create a free-plan Static Web App with:

| Field | Value |
| --- | --- |
| Source | GitHub |
| Repository | `Natethebuilder/agentic-ai-apps-winter-bootcamp` |
| Branch | `main` |
| Build preset | Custom |
| App location | `/` |
| API location | `api` |
| Output location | `dist` |

If Azure generates its own workflow, keep the repository's `deploy.yml` and remove the duplicate generated workflow before the next push.

Add the application settings from `docs/registration-backend.md` only after the dedicated Power Automate flow exists.

## Smoke test

1. Load the public website.
2. Open `#/deck` and traverse every slide.
3. Test widths of 320px, iPhone 13 and desktop.
4. Confirm the navbar and hero registration actions reach the embedded form.
5. Complete the authenticated registration verification checklist.
