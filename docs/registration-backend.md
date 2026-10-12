# Foundry Agentic Development registration backend

This event uses the existing Agentic Data Winter Bootcamp Power Automate registration flow rather than a separate flow. GitHub OAuth is not used for registration. The API sends:

```json
{
  "eventId": "foundry-agentic-development-winter-bootcamp"
}
```

The API calculates `SHA256(eventId + ":" + registrationToken)`, where `registrationToken` is an opaque UUID stored in the attendee's browser after the first successful submission.

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
| Title | Single line text | No | Standard column currently receives `not-collected` |
| RegistrationId | Single line text | Yes | Unique and indexed |
| GitHubUserId | Single line text | Yes | Legacy compatibility field set to `not-collected` |
| GitHubUsername | Single line text | Yes | Legacy compatibility field set to `not-collected` |
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

The attendee enters the company email twice, and the browser and API reject values that do not match. This reduces typing mistakes but does not verify ownership of the mailbox. The browser-held token lets the same browser update its registration without treating the email address as an authentication credential.

## Golden Ticket access

A few days before the event starts, the event invitation supplies the Golden Ticket link used to join the event GitHub organization. The environment includes $100 worth of AI credits for GitHub Copilot.

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
- The earlier GitHub-authenticated create/update checks were completed before the Golden Ticket registration migration.
- The List contained exactly one row with all six session IDs, `local` environment and consent enabled.
- New registrations use `not-collected` in the legacy GitHub fields and return an opaque token for same-browser updates.
