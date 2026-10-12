# Foundry Agentic Development registration backend

The public form uses the shared multi-event Power Automate flow and a dedicated private SharePoint List. GitHub OAuth and GitHub identity are not used for registration.

## SharePoint target

- Site: `https://microsofteur.sharepoint.com/teams/FoundryAgenticDevelopmentWinterBootcamp`
- List: `Foundry Agentic Development Bootcamp Registrations`
- List ID: `b2367510-4900-4925-85af-f082b92d2f56`
- Classification: `Confidential \ Internal-Only`
- Privacy: private
- Permissions: inherited from the operations site
- Version history: enabled, 50 versions

| Column | Type | Purpose |
| --- | --- | --- |
| `Title` | Single line of text | Standard field; receives the company email and can be hidden from the operational view |
| `RegistrationId` | Single line of text | Unique, indexed event-scoped identifier |
| `Company` | Single line of text | Company or organisation |
| `CompanyEmail` | Single line of text | Normalized communication address |
| `SessionSelections` | Choice, multiple selections | Filterable `session-01` through `session-06` selections |
| `Sessions` | Multiple lines of text | Temporary semicolon-delimited compatibility copy |
| `Environment` | Choice | `local` or `cloud` |
| `OrganizationAccessStatus` | Choice | `Pending`, `Invitation queued`, `Invitation sent`, `Joined`, or `Issue` |
| `CloudEnvironmentStatus` | Choice | `Not requested`, `Requested`, `Allocated`, `Ready`, `Waitlisted`, or `Issue` |
| `Consent` | Yes/No | Explicit data consent |
| `UpdatedAt` | Date and time | Latest submitted timestamp |

`GitHubUserId` and `GitHubUsername` are obsolete and should not exist in the final schema.

## Registration identity

The attendee enters the company email twice. The browser and API normalize both values and reject the submission unless they match.

The first accepted response returns an opaque UUID token stored in the browser. The API derives:

```text
SHA256("foundry-agentic-development-winter-bootcamp:" + registrationToken)
```

This lets the same browser update the same row without using the email address as an authentication credential.

## API payload

```json
{
  "eventId": "foundry-agentic-development-winter-bootcamp",
  "registrationId": "event-scoped SHA-256 value",
  "company": "Example organisation",
  "companyEmail": "person@example.com",
  "sessionSelections": ["session-01", "session-06"],
  "environmentPreference": "local",
  "consent": true,
  "updatedAt": "2026-01-01T12:00:00.000Z"
}
```

The shared flow temporarily accepts `email`, `sessions`, and `environment` as aliases during deployment migration. New clients use only the canonical fields above.

## Shared flow behavior

The live flow is `Agentic Winter Bootcamps Registration Upsert`:

1. Invalid shared secrets return HTTP `401`.
2. `foundry-agentic-development-winter-bootcamp` routes only to this List.
3. Missing or unrecognized event IDs return HTTP `400`.
4. `Get_foundry_items` queries `RegistrationId` with top count `1`.
5. The branch updates the first matching row or creates one when absent.
6. Creates set `OrganizationAccessStatus` to `Pending`.
7. Creates set `CloudEnvironmentStatus` to `Requested` for cloud or `Not requested` for local.
8. Updates preserve both operational status fields.
9. Accepted registrations return HTTP `202`.

The flow writes filterable `SessionSelections` and the temporary `Sessions` text copy.

## Operational view

Prioritize `CompanyEmail`, `Company`, `SessionSelections`, `Environment`, both status columns, `Consent`, and `UpdatedAt`. Hide `Title`, `RegistrationId`, and `Sessions` from the default view where practical.

## Azure Static Web Apps

- Resource group: `rg-agentic-ai-apps-winter-bootcamp`
- Static Web App: `swa-agentic-ai-apps-winter-bootcamp`

| Setting | Purpose |
| --- | --- |
| `REGISTRATION_FLOW_URL` | Shared flow endpoint |
| `REGISTRATION_FLOW_SHARED_SECRET` | Server-side secret validated by the flow |

Do not expose either value in source, documentation, browser responses, or logs.

## GitHub organization access

A few days before the event, the invitation provides the link for joining the event GitHub organization. The event environment includes $100 worth of GitHub Copilot AI credits.

## Verification

- The public site and registration API do not require GitHub sign-in.
- The disabled GitHub OAuth route returns `404`.
- Registration tests validate email confirmation, session IDs, backend settings, and the canonical payload.
- Test submissions require explicit approval because they create or update SharePoint data.
- A create should initialize the two operational status fields.
- A repeat submission from the same browser should update the same row and preserve status progress.
