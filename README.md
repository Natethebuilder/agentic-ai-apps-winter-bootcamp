# Foundry Agentic Development Winter Bootcamp

Interactive public website and DECKIO presentation for a six-session community bootcamp about dependable agent development with Microsoft Foundry and GitHub Copilot.

Topics, dates, speakers and headshots intentionally remain visible placeholders until the programme is confirmed.

| Route | Experience |
| --- | --- |
| `#/` | Public website with Microsoft Foundry interactions, programme placeholders, setup, FAQ and registration |
| `#/deck` | Horizontal DECKIO presentation with the same content and embedded registration |

## Live

- Website: <https://mango-mushroom-0c5c73e0f.6.azurestaticapps.net/>
- Deck: <https://mango-mushroom-0c5c73e0f.6.azurestaticapps.net/#/deck>
- Registration: Public form with confirmed company email, routed through the shared multi-event flow to the dedicated private Foundry SharePoint List

## Develop

```powershell
npm install
npm test
npm run dev
npm run build
npm run build:swa
```

Azure Static Web Apps hosts the website, deck and registration API on one origin.

## Registration architecture

The registration API:

1. validates company, matching email entries, session IDs, environment and consent;
2. uses a browser-held opaque token to derive an event-scoped SHA-256 `RegistrationId`;
3. sends legacy GitHub fields as explicit `not-collected` compatibility markers;
4. sends `eventId: foundry-agentic-development-winter-bootcamp` to the shared registration flow;
5. lets that flow route the submission into the dedicated Foundry Agentic Development SharePoint List.

A few days before the event, the attendee receives a Golden Ticket invitation containing the link to join the event GitHub organization. The environment includes $100 worth of GitHub Copilot AI credits.

| Setting | Purpose |
| --- | --- |
| `REGISTRATION_FLOW_URL` | Existing shared Data Winter Bootcamp registration flow endpoint |
| `REGISTRATION_FLOW_SHARED_SECRET` | Server-side secret validated by the shared flow |

Never commit either value. See [docs/registration-backend.md](docs/registration-backend.md).

The backend uses the browser-held registration token for repeat updates from the same browser without relying on GitHub OAuth.

## Deploy

Pushing to `main` deploys through `.github/workflows/deploy.yml` using the repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN_FOUNDRY_AGENTIC_DEVELOPMENT`. The existing Azure Static Web Apps resource is reused.
