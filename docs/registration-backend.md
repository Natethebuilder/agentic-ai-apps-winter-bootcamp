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
| `Title` | Single line of text | Indexed email-key hash used for dedupe; legacy rows may temporarily contain the company email until lazily migrated |
| `RegistrationId` | Single line of text | Unique, indexed event-scoped identifier |
| `Company` | Single line of text | Company or organisation |
| `CompanyEmail` | Single line of text | Normalized communication address; immutable after the row is created |
| `SessionSelections` | Choice, multiple selections | The 36 allowlisted `YYYY-MM-DD|HH:MM|session-id` selections |
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

The API separately derives a downstream-only email dedupe key:

```text
SHA256("foundry-agentic-development-winter-bootcamp:" + normalizedCompanyEmail)
```

`RegistrationEmailKey` is never accepted from the browser and is never returned to it. The shared flow stores the key in `Title` and uses it to prevent the same normalized email from creating duplicate rows across browsers while preserving the browser token behavior.

## API payload

```json
{
  "eventId": "foundry-agentic-development-winter-bootcamp",
  "registrationId": "event-scoped SHA-256 value",
  "registrationEmailKey": "event-scoped normalized-email SHA-256 value",
  "company": "Example organisation",
  "companyEmail": "person@example.com",
  "sessionSelections": [
    "2026-12-04|09:00|foundations",
    "2027-01-22|14:30|govern"
  ],
  "environmentPreference": "local",
  "consent": true,
  "updatedAt": "2026-01-01T12:00:00.000Z"
}
```

The shared flow temporarily accepts `email`, `sessions`, and `environment` as aliases during deployment migration. New clients use only the canonical fields above.

## Schedule selection contract

Every Friday runs the same six sessions, at the same times as the Agentic Data Engineering Winter Bootcamp. The six dates are preliminary and subject to confirmation. Registration accepts all six sessions on each of these dates:

| Date | Session times |
| --- | --- |
| `2026-12-04` | `09:00`, `10:00`, `11:00`, `12:30`, `13:30`, `14:30` |
| `2026-12-11` | `09:00`, `10:00`, `11:00`, `12:30`, `13:30`, `14:30` |
| `2026-12-18` | `09:00`, `10:00`, `11:00`, `12:30`, `13:30`, `14:30` |
| `2027-01-08` | `09:00`, `10:00`, `11:00`, `12:30`, `13:30`, `14:30` |
| `2027-01-15` | `09:00`, `10:00`, `11:00`, `12:30`, `13:30`, `14:30` |
| `2027-01-22` | `09:00`, `10:00`, `11:00`, `12:30`, `13:30`, `14:30` |

The canonical stored selection format is:

```text
YYYY-MM-DD|HH:MM|session-id
```

Session times are fixed by session ID:

| Session ID | Time | Session | Replaces placeholder |
| --- | --- | --- | --- |
| `foundations` | `09:00` | Build it - Foundations | `09:30|session-01` |
| `advanced-patterns` | `10:00` | Build it - Advanced patterns | `10:30|session-02` |
| `evaluate` | `11:00` | Evaluate it | `11:30|session-03` |
| `deploy` | `12:30` | Deploy it | `13:00|session-04` |
| `operate` | `13:30` | Operate and integrate it | `14:00|session-05` |
| `govern` | `14:30` | Govern it | `15:00|session-06` |

The API allowlists exactly 36 combinations and rejects unknown dates, mismatched times, unknown session IDs, duplicate selections and the retired placeholder values.

**Before deploying this schedule**, replace the 36 placeholder values in the `SessionSelections` choice column with the 36 values above (for example `2026-12-04|09:00|foundations`), so the flow can write the new selections. Any existing rows that hold placeholder values can be mapped with the "Replaces placeholder" column.

## Registration states

`api/site-state.json` switches registration on and off without removing the working form, API or flow:

| `registration` | Website and deck | API |
| --- | --- | --- |
| `1` | Registration form is open | Validates and forwards submissions to the flow |
| `2` | Every register entry point says registration will open soon | Returns HTTP `403` without calling the flow |

The same file sets `prerequisites` to `"soon"` (prerequisites will be shared soon) or `"microhack"` (MicroHack lab preparation). Commit the change and push to `main` to deploy it.

## Confirmation email

**Not enabled yet.** The email waits for send access to the bootcamp's shared mailbox. Until then, the website's success message tells registrants that their registration is confirmed and that a formal invitation will follow by email.

Once enabled, in state 1 the flow sends each new registrant a confirmation email from the shared mailbox: "Thank you for registering, you will receive a formal invitation with more details closer to the date of the bootcamp." Send it only when a row is created, never on updates or on the existing-email path. Steps and the template are in [registration-confirmation-email.md](registration-confirmation-email.md).

## Shared flow behavior

The shared flow `Agentic Winter Bootcamps Registration Upsert` must implement this behavior before the hardening change is deployed:

1. Invalid shared secrets return HTTP `401`.
2. `foundry-agentic-development-winter-bootcamp` routes only to this List.
3. Missing or unrecognized event IDs return HTTP `400`.
4. Keep synchronous Response actions so validation and storage failures return the correct HTTP `400`, `401`, or `202` result only after SharePoint processing completes.
5. Configure secure inputs and outputs on steps that contain the shared secret or registration payload, restrict flow ownership, and use the shortest practical run-history retention period.
6. During cutover, `Get_foundry_items` queries with top count `1` for either `Title` equal to `registrationEmailKey` or immutable `CompanyEmail` equal to the normalized submitted email.
7. The branch updates the first matching row or creates one when absent.
8. Creates set `Title` to `registrationEmailKey`, store `RegistrationId`, the normalized `CompanyEmail`, and set `OrganizationAccessStatus` to `Pending`.
9. Creates set `CloudEnvironmentStatus` to `Requested` for cloud or `Not requested` for local.
10. Updates never change `CompanyEmail`.
11. A valid same-token, same-email update of a legacy row lazily replaces an email-valued `Title` with `registrationEmailKey`; no manual SharePoint Title backfill is required.
12. If `Company` changes, reset `OrganizationAccessStatus` to `Pending` when the existing approval or invitation state depends on the previous company.
13. If `Environment` changes, reset `CloudEnvironmentStatus` to `Requested` for cloud or `Not requested` for local so provisioning reflects the new request.
14. Otherwise, updates preserve both operational status fields.
15. Accepted registrations return HTTP `202`.

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

## Event access

Registration does not grant any access by itself. Closer to the date, registrants receive a formal invitation with more details about the bootcamp and how to join their sessions.

## Verification

- The public site and registration API do not require GitHub sign-in.
- The disabled GitHub OAuth route returns `404`.
- Registration tests validate email confirmation, valid and invalid date-time-session selections, the retired placeholder values, all 36 valid selections, the state-2 refusal, backend settings, and the canonical payload.
- Registration tests verify the normalized deterministic email key, caller override resistance, and preservation of the existing token-derived `RegistrationId`.
- Test submissions require explicit approval because they create or update SharePoint data.
- A create should initialize the two operational status fields.
- A repeat submission from the same browser should update the same row.
- A submission from a different browser using the same normalized company email should dedupe to that row without changing `CompanyEmail`.
- A valid same-token, same-email update of a legacy row should replace the email-valued `Title` with the email-key hash.
- Company and environment changes should reset only the operational statuses described above.

This document describes the required flow changes. It does not claim that the email-key dedupe behavior is live until the flow and List schema are updated and verified.
