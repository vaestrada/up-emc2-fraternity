# Member Data Privacy — READ BEFORE SHARING ANYTHING

## What's in this repo that must stay private

`assets/docs/members_master.csv` holds the merged, deduplicated roster of **490 real members**
(1967–2023 batches), including:

- Full names, nicknames, and batch years
- Birthdates
- Home addresses (city/province/country)
- Mobile and landline numbers
- Personal email addresses
- Employment details
- **Emergency contact persons**

This is sensitive personal information under the **Philippine Data Privacy Act of 2012 (RA 10173)**.
The UP EMC² Fraternity Alumni Association, Inc. is SEC-registered and is accountable as a
personal information controller for this data.

## Rules

1. **The `assets/` directory is git-ignored. Never remove that entry.** Verify with
   `git check-ignore assets/docs/members_master.csv` before any commit if unsure.
2. Never upload the roster to any third-party service (chat tools, file-sharing, AI services)
   without BOT approval.
3. The public website must never render personal contact details. The future member directory
   will be login-gated with per-member visibility consent (private by default).
4. The Supabase member portal is invite-gated for verified members. **The roster is never
   bulk-imported into the portal database.** Only an HMAC hash of a member's verified email,
   a masked label, and their batch ever enter the database; those are written by the board
   (in `/admin`) after verifying the member against the roster held offline. `before-user-created`
   and `custom-access-token` auth hooks enforce that only allow-listed, verified members can
   sign in or read the brods-only directory, and RLS keeps everything private by default.
   Delete local roster copies after each offline token/allowlist run, so raw member data never
   persists in a Supabase table or beyond the brief offline step.
5. Deceased members are marked in the data — handle memorial listings with family consent.

## Source

Merged from the shared Google Sheet ("Copy of Directory", 8 tabs) on 2026-07-03.
Original: 611 rows across tabs; 490 unique after deduplication by (last name, first name, batch year).
