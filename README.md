# Agentic AI Apps Winter Bootcamp

Interactive public website and DECKIO presentation for a six-session winter bootcamp serving the broader agent builder community.

The experience is intentionally a skeleton: dates, topics, speakers and headshots remain explicit placeholders until the programme is confirmed.

| Route | Experience |
| --- | --- |
| `#/` | Public event website, Foundry-inspired interactive labs and registration |
| `#/deck` | Presentation deck driven by the same event content |

## Develop

```bash
npm install
npm run dev
npm test
npm run build
```

The production architecture uses one Azure Static Web App for the website, deck, GitHub authentication and protected registration API.

## Registration architecture

1. Azure Static Web Apps supplies the verified GitHub identity through `/.auth/me`.
2. The browser submits only event choices and contact fields to `/api/register`.
3. The API independently verifies `x-ms-client-principal`, validates the request and hashes the application-scoped user ID.
4. Power Automate deterministically upserts a row in the private `Agentic AI Apps Bootcamp Registrations` Microsoft List.

See [docs/registration-backend.md](docs/registration-backend.md) for the dedicated SharePoint site, List schema, Power Automate flow, settings and verification checklist.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`.

| Setting | Value |
| --- | --- |
| App location | `/` |
| API location | `api` |
| Output location | `dist` |
| Build command | `npm run build:swa` |
| Deployment secret | `AZURE_STATIC_WEB_APPS_API_TOKEN_AI_APPS_WINTER` |

The workflow contains no credentials. The deployment token is stored as the repository secret above. Configure `REGISTRATION_FLOW_URL` and `REGISTRATION_FLOW_SHARED_SECRET` only after the dedicated Power Automate flow exists.

## Programme placeholders

Update `src/content.js` when dates, topics and speakers are confirmed. The website and deck consume the same six session records, so changes remain synchronized.
