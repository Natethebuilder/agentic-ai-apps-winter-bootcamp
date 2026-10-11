# Agentic AI Apps registration backend

The event uses one Azure Static Web App for the website, `#/deck`, GitHub authentication and the protected registration API. Registration storage is a dedicated private SharePoint site, Microsoft List and Power Automate flow.

Never reuse or reveal another event's deployment token, flow URL or shared secret.

## Dedicated operations resources

| Resource | Name |
| --- | --- |
| Azure resource group | `rg-agentic-ai-apps-winter-bootcamp` |
| Azure Static Web App | `swa-agentic-ai-apps-winter-bootcamp` |
| Private SharePoint site/path | `AgenticAIAppsWinterBootcamp` |
| Microsoft List | `Agentic AI Apps Bootcamp Registrations` |
| Power Automate flow | `Agentic AI Apps Winter Bootcamp Registration Upsert` |
| Static Web Apps setting | `REGISTRATION_FLOW_URL` |
| Static Web Apps setting | `REGISTRATION_FLOW_SHARED_SECRET` |
| GitHub deployment secret | `AZURE_STATIC_WEB_APPS_API_TOKEN_AI_APPS_WINTER` |

## Private SharePoint site and List

Create a private team site with the path `AgenticAIAppsWinterBootcamp`. Keep inherited private-site permissions and restrict membership to the event operations team.

Create `Agentic AI Apps Bootcamp Registrations` with 50-version history and these columns:

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `Title` | Single line of text | Yes | Verified GitHub username |
| `RegistrationId` | Single line of text | Yes | Unique and indexed; SHA-256 identifier supplied by the API |
| `GitHubUserId` | Single line of text | Yes | Static Web Apps application-scoped provider identifier |
| `GitHubUsername` | Single line of text | Yes | Verified GitHub handle |
| `Company` | Single line of text | Yes | Maximum 160 characters |
| `CompanyEmail` | Single line of text | Yes | Lower-case email address |
| `Sessions` | Multiple lines of text | Yes | JSON array or semicolon-delimited session IDs |
| `Environment` | Choice | Yes | `local` or `cloud` |
| `Consent` | Yes/No | Yes | Must be `Yes` |
| `UpdatedAt` | Date and time | Yes | ISO timestamp supplied by the API |

Enforce unique values and an index on `RegistrationId`. Define a deletion date after the event administration and feedback period.

## Power Automate deterministic upsert

Create an automated cloud flow named `Agentic AI Apps Winter Bootcamp Registration Upsert` with **When an HTTP request is received**.

Use this strict request schema:

```json
{
  "type": "object",
  "required": [
    "registrationId",
    "githubUserId",
    "githubUsername",
    "company",
    "email",
    "sessions",
    "environment",
    "consent",
    "updatedAt"
  ],
  "properties": {
    "registrationId": { "type": "string" },
    "githubUserId": { "type": "string" },
    "githubUsername": { "type": "string" },
    "company": { "type": "string" },
    "email": { "type": "string" },
    "sessions": {
      "type": "array",
      "items": { "type": "string" }
    },
    "environment": {
      "type": "string",
      "enum": ["local", "cloud"]
    },
    "consent": { "type": "boolean" },
    "updatedAt": { "type": "string" }
  }
}
```

Configure the flow:

1. Reject with HTTP `401` unless the `x-registration-secret` header exactly equals the flow's dedicated shared secret.
2. Use **Get items** on `Agentic AI Apps Bootcamp Registrations` with filter query `RegistrationId eq '<registrationId>'` and top count `1`.
3. Add a condition on the returned array length.
4. If one row exists, update it. Otherwise, create it.
5. Map `Title` to `githubUsername`; map the remaining fields to `RegistrationId`, `GitHubUserId`, `GitHubUsername`, `Company`, `CompanyEmail`, `Sessions`, `Environment`, `Consent` and `UpdatedAt`.
6. Return HTTP `202` with `{ "ok": true }`.

The deterministic API hash and update-or-create branch mean a repeat submission must leave one row and advance `UpdatedAt`.

Do not log the request body, email address or secret header. Restrict flow ownership to the operations team and use the shortest practical run-history retention period.

## Azure Static Web Apps

Add these application settings to `swa-agentic-ai-apps-winter-bootcamp`:

| Application setting | Required | Value |
| --- | --- | --- |
| `REGISTRATION_FLOW_URL` | Yes | This flow's HTTP trigger URL |
| `REGISTRATION_FLOW_SHARED_SECRET` | Yes | A newly generated random secret validated by the flow |

GitHub authentication is supplied by `/.auth/login/github`. The browser reads only the verified principal from `/.auth/me`. The API independently requires the platform-generated `x-ms-client-principal`, validates all submitted fields and never trusts a browser-submitted username.

`public/staticwebapp.config.json` protects `/api/register` with the `authenticated` role. The function uses `authLevel: anonymous` because Static Web Apps performs the platform route check and the function verifies the forwarded principal again.

## End-to-end verification

1. In a private browser window, confirm an unauthenticated `POST /api/register` redirects to GitHub sign-in.
2. Sign in with GitHub and confirm the displayed handle matches the signed-in account.
3. Submit one registration and confirm exactly one List item is created.
4. Change the session choices and submit again.
5. Confirm the existing item is updated, `UpdatedAt` advances and the List count remains one.
6. Send a flow request with an invalid shared secret and confirm HTTP `401` with no List change.
7. Confirm browser responses, Azure Function logs and flow diagnostics do not expose the submitted email or secret.
