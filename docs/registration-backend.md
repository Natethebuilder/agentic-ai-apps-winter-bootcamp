# AI Apps registration backend

This event reuses the existing Agentic Data Winter Bootcamp Power Automate registration flow. The API adds:

```json
{
  "eventId": "agentic-ai-apps-winter-bootcamp"
}
```

The shared flow validates the request, switches on `eventId`, and routes this event into its own private SharePoint List.

## Dedicated SharePoint target

- Site title: `Agentic AI Apps Winter Bootcamp`
- Site path: `AgenticAIAppsWinterBootcamp`
- List: `Agentic AI Apps Bootcamp Registrations`
- Privacy: private
- Permissions: inherited from the private operations site
- Version history: enabled, 50 versions

## List schema

| Display name | Type | Required | Notes |
| --- | --- | --- | --- |
| Title | Single line text | Yes | GitHub username |
| RegistrationId | Single line text | Yes | Unique and indexed |
| GitHubUserId | Single line text | Yes | Application-scoped GitHub identity |
| GitHubUsername | Single line text | Yes | Verified username |
| Company | Single line text | Yes | Organisation |
| CompanyEmail | Single line text | Yes | Event communication |
| Sessions | Multiple lines text | Yes | JSON or newline-delimited session IDs |
| Environment | Choice | Yes | `local` or `cloud` |
| Consent | Yes/No | Yes | Explicit consent |
| UpdatedAt | Date and time | Yes | Latest submission timestamp |

## Shared flow routing

Extend the existing Data registration flow rather than creating another flow:

1. Add required `eventId` to the HTTP request schema.
2. Keep the existing shared-secret rejection path (`401`).
3. Switch on `eventId`.
4. Preserve the current Data branch unchanged.
5. Add `agentic-ai-apps-winter-bootcamp`.
6. In that branch, query this event's List by `RegistrationId` with top count `1`.
7. Update the returned item when present; otherwise create it.
8. Return the shared `202` success response.

The AI Apps API hashes `eventId + GitHub application-scoped user ID`, so repeat submissions update one event-specific registration.

## Azure settings

Configure on the canonical AI Apps Static Web App:

| Name | Value |
| --- | --- |
| `REGISTRATION_FLOW_URL` | The existing shared registration flow endpoint |
| `REGISTRATION_FLOW_SHARED_SECRET` | The secret validated by the shared flow |

Do not expose these values in source, browser responses, documentation or logs.
