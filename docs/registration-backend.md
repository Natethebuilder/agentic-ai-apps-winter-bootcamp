# Foundry Agentic Development registration backend

This event uses the existing Agentic Data Winter Bootcamp Power Automate registration flow rather than a separate flow. The protected API sends:

```json
{
  "eventId": "foundry-agentic-development-winter-bootcamp"
}
```

The API calculates `SHA256(eventId + ":" + application-scoped GitHub user ID)` so one GitHub identity can register for multiple bootcamps without cross-event collisions.

## Dedicated SharePoint target

- Site title: `Foundry Agentic Development Winter Bootcamp`
- Site URL: `https://microsofteur.sharepoint.com/teams/FoundryAgenticDevelopmentWinterBootcamp`
- Classification: `Confidential \ Internal-Only`
- Privacy: private
- List: `Foundry Agentic Development Bootcamp Registrations`
- List ID: `b2367510-4900-4925-85af-f082b92d2f56`
- Permissions: inherited from the private site and restricted to its operations owners
- Version history: enabled, 50 versions

## List schema

| Display name | Type | Required | Notes |
| --- | --- | --- | --- |
| Title | Single line text | No | Standard column; the flow always writes the verified GitHub username |
| RegistrationId | Single line text | Yes | Unique and indexed |
| GitHubUserId | Single line text | Yes | Application-scoped GitHub identity |
| GitHubUsername | Single line text | Yes | Verified username |
| Company | Single line text | Yes | Organisation |
| CompanyEmail | Single line text | Yes | Event communication |
| Sessions | Multiple lines text | Yes | Semicolon-delimited session IDs |
| Environment | Choice | Yes | Only `local` or `cloud` |
| Consent | Yes/No | Yes | Explicit consent; default `No` |
| UpdatedAt | Date and time | Yes | Latest submission timestamp, including time |

## Deployed shared-flow routing

The shared flow keeps `eventId` optional for the legacy Data client and validates `x-registration-secret` before any SharePoint action.

1. `Route_registration` sends `agentic-software-development-winter-bootcamp` to the Software branch.
2. Its false path evaluates `Route_foundry`.
3. `Route_foundry` sends `foundry-agentic-development-winter-bootcamp` to the Foundry branch.
4. The Foundry branch runs `Get_foundry_items` with `RegistrationId` and a top count of `1`.
5. An existing row runs `Update_foundry_registration`; otherwise `Create_foundry_registration` runs.
6. The false path preserves the unchanged Data fallback for missing or unrecognized event IDs.
7. Accepted registrations use the shared `202` response; an invalid shared secret returns `401`.

## Azure Static Web Apps settings

The settings are configured on:

- Resource group: `rg-agentic-ai-apps-winter-bootcamp`
- Static Web App: `swa-agentic-ai-apps-winter-bootcamp`

| Name | Status |
| --- | --- |
| `REGISTRATION_FLOW_URL` | Configured with the existing shared flow endpoint |
| `REGISTRATION_FLOW_SHARED_SECRET` | Configured with the existing server-side secret |

Do not expose either value in source, browser responses, documentation or logs.

## Live verification

- A Foundry-shaped request with an invalid secret returned HTTP `401`.
- The first GitHub-authenticated submission executed `Create_foundry_registration`, skipped `Update_foundry_registration`, and skipped every Software and Data action.
- The List contained exactly one row with all six session IDs, `local` environment and consent enabled.
- Repeating the same registration executed `Update_foundry_registration`, skipped `Create_foundry_registration`, and again skipped every Software and Data action.
- The List remained at exactly one row and `UpdatedAt` advanced from `2026-10-11 13:15` to `2026-10-11 13:23` Pacific time.
