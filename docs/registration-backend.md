# AI Apps registration backend

The event uses a dedicated Azure Static Web App, private SharePoint operations site, Microsoft List and Power Automate flow. It does not share settings, secrets, identifiers or storage with another bootcamp.

## Resource names

Use these names so the AI Apps registration workflow remains self-contained:

| Resource | Name |
| --- | --- |
| Event ID | `agentic-ai-apps-winter-bootcamp-2026` |
| Private SharePoint site | `AI Apps Winter Bootcamp Operations` |
| Site path suggestion | `/sites/AIAppsWinterBootcampOps` |
| Microsoft List | `AI Apps Winter Bootcamp Registrations` |
| Power Automate flow | `AI Apps Winter Registration - Deterministic Upsert` |
| Static Web Apps setting | `AI_APPS_REGISTRATION_FLOW_URL` |
| Static Web Apps setting | `AI_APPS_REGISTRATION_FLOW_SHARED_SECRET` |
| GitHub deployment secret | `AZURE_STATIC_WEB_APPS_API_TOKEN_AI_APPS_WINTER` |
| Flow secret header | `x-ai-apps-registration-secret` |

Never reuse or copy a deployment token, HTTP trigger URL or shared secret from another event.

## Private SharePoint operations site

Create a dedicated private team site named `AI Apps Winter Bootcamp Operations`. Restrict membership to the event operations team and do not enable external sharing. Store the registration List on this site rather than on a public communication site.

Create a List named `AI Apps Winter Bootcamp Registrations` with version history enabled:

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `Title` | Single line of text | Yes | Verified GitHub username |
| `EventId` | Single line of text | Yes | Always `agentic-ai-apps-winter-bootcamp-2026` |
| `RegistrationKey` | Single line of text | Yes | Unique and indexed; SHA-256 of event ID plus Static Web Apps GitHub user ID |
| `GitHubUserId` | Single line of text | Yes | Application-scoped provider identifier |
| `GitHubUsername` | Single line of text | Yes | Verified GitHub handle |
| `Organisation` | Single line of text | Yes | Maximum 160 characters |
| `CompanyEmail` | Single line of text | Yes | Lower-case email address |
| `Sessions` | Multiple lines of text | Yes | JSON array or semicolon-delimited session IDs |
| `Environment` | Choice | Yes | `local`, `codespaces` or `cloud` |
| `Consent` | Yes/No | Yes | Must be `Yes` |
| `UpdatedAt` | Date and time | Yes | ISO timestamp supplied by the API |

Index `RegistrationKey` and enforce unique values. Define a registration-data deletion date after the event administration and feedback period.

## Power Automate deterministic upsert

Create an automated cloud flow named `AI Apps Winter Registration - Deterministic Upsert` with **When an HTTP request is received**.

Use this request schema:

```json
{
  "type": "object",
  "required": [
    "eventId",
    "registrationKey",
    "githubUserId",
    "githubUsername",
    "organisation",
    "email",
    "sessions",
    "environment",
    "consent",
    "updatedAt"
  ],
  "properties": {
    "eventId": { "type": "string" },
    "registrationKey": { "type": "string" },
    "githubUserId": { "type": "string" },
    "githubUsername": { "type": "string" },
    "organisation": { "type": "string" },
    "email": { "type": "string" },
    "sessions": {
      "type": "array",
      "items": { "type": "string" }
    },
    "environment": { "type": "string" },
    "consent": { "type": "boolean" },
    "updatedAt": { "type": "string" }
  }
}
```

Configure these steps:

1. Reject the request with HTTP `401` unless the `x-ai-apps-registration-secret` header exactly equals the flow's dedicated secret.
2. Reject the request with HTTP `400` unless `eventId` exactly equals `agentic-ai-apps-winter-bootcamp-2026`.
3. Use **Get items** on `AI Apps Winter Bootcamp Registrations` with filter query `RegistrationKey eq '<registrationKey>'` and top count `1`.
4. If a row exists, update that row. Otherwise, create a row.
5. Map `Title` to `githubUsername` and map every other field to its same-named List column.
6. Return HTTP `202` with `{ "ok": true }`.

The unique indexed key and the update-or-create branch make repeat submissions deterministic. Keep trigger concurrency enabled only if the unique List constraint is present; otherwise set trigger concurrency to `1` to avoid simultaneous duplicate creates.

Do not log the request body, email addresses or secret header. Restrict flow ownership to the operations team and choose the shortest practical run-history retention period.

## Azure Static Web Apps

Create a dedicated free-plan Static Web Apps resource for this repository. Add:

| Application setting | Required | Value |
| --- | --- | --- |
| `AI_APPS_REGISTRATION_FLOW_URL` | Yes | This flow's HTTP trigger URL |
| `AI_APPS_REGISTRATION_FLOW_SHARED_SECRET` | Yes | A newly generated random secret validated by the flow |

The application reads the GitHub principal from `/.auth/me`. The API independently requires the platform-generated `x-ms-client-principal` header and injects the immutable event ID server-side. It never accepts a GitHub username or event ID from the browser.

The protected `/api/*` route is declared in `staticwebapp.config.json`. The function keeps `authLevel` set to `anonymous` because Static Web Apps authentication is enforced at the platform route layer and the function verifies the forwarded principal again.

## End-to-end verification

1. In a private browser window, confirm `POST /api/register` cannot complete without GitHub authentication.
2. Sign in with GitHub and confirm the displayed handle matches the signed-in account.
3. Submit one registration and confirm exactly one List item is created.
4. Change the session choices and submit again.
5. Confirm the existing item is updated, `UpdatedAt` advances and the List count remains one.
6. Send a request with an invalid flow secret and confirm HTTP `401` with no List change.
7. Confirm browser responses, Azure Function logs and flow diagnostics do not expose the submitted email or secret.
