# Agentic AI Apps Winter Bootcamp

Interactive public website and DECKIO presentation for a six-session community bootcamp about dependable agent applications.

Topics, dates, speakers and headshots intentionally remain visible placeholders until the programme is confirmed.

| Route | Experience |
| --- | --- |
| `#/` | Public website with Foundry-inspired interactions, programme placeholders, setup, FAQ and registration |
| `#/deck` | Horizontal DECKIO presentation with the same content and embedded registration |

## Develop

```powershell
npm install
npm test
npm run dev
npm run build
npm run build:swa
```

Azure Static Web Apps hosts the website, deck, GitHub authentication and protected registration API on one origin.

## Registration architecture

The protected API:

1. reads the authenticated GitHub identity from `x-ms-client-principal`;
2. validates company, email, session IDs, environment and consent;
3. derives an event-scoped SHA-256 `RegistrationId`;
4. sends `eventId: agentic-ai-apps-winter-bootcamp` to the shared registration flow;
5. lets that flow route the submission into the dedicated AI Apps SharePoint List.

| Setting | Purpose |
| --- | --- |
| `REGISTRATION_FLOW_URL` | Existing shared Data Winter Bootcamp registration flow endpoint |
| `REGISTRATION_FLOW_SHARED_SECRET` | Server-side secret validated by the shared flow |

Never commit either value. See [docs/registration-backend.md](docs/registration-backend.md).

## Deploy

Pushing to `main` deploys through `.github/workflows/deploy.yml` using the repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN_AI_APPS_WINTER`.
