# How we work: branches, previews, and getting back

## The short version

`main` is what the public sees. Everything else is built on its own branch, and **Vercel
builds every branch you push and gives it its own live URL**. That is the whole trick: you
never have to imagine what a change looks like or take my word for it. You open two links on
your phone, compare them, and merge the one you want.

## The three things you can always do

**Look at any branch.** Push it and Vercel posts a preview URL. It is the real site, with the
real database, on a real phone. Nothing about it touches what the public sees.

**Merge what you like.** One branch at a time, in any order. If you like the assistance fund
but not the awards page, merge the assistance fund and leave the other sitting there.

**Get back to a known-good version.** Every good state is tagged. Today's verified build is
`v1.0-demo`. To return to it:

```bash
git checkout main && git reset --hard v1.0-demo && git push --force-with-lease origin main
```

That is the emergency brake. It puts the public site back to exactly what you saw and
approved, in about ninety seconds including the redeploy.

## The branches

| Branch | What it adds | Preview |
|---|---|---|
| `main` | The live site. Always deployable. | [up-emc2-fraternity.vercel.app](https://up-emc2-fraternity.vercel.app) |
| `launch/v2` | **All four features together.** This is the launch candidate. | [preview](https://up-emc2-fraternity-git-launch-v2-hype-kidz.vercel.app) |
| `feat/claim-record` | Brods claim their own Portal record; the board still verifies against the offline roster | [preview](https://up-emc2-fraternity-git-feat-claim-record-hype-kidz.vercel.app/portal/claim) |
| `feat/assistance-fund` | The Brotherhood Assistance Fund: programme page, private intake, public ledger | [preview](https://up-emc2-fraternity-git-feat-assistance-fund-hype-kidz.vercel.app/assistance) |
| `feat/awards` | The Anniversary Awards: categories, criteria, process, nomination intake, screening | [preview](https://up-emc2-fraternity-git-feat-awards-hype-kidz.vercel.app/awards) |
| `feat/sponsorship` | Sponsorship tiers, souvenir rate card, enquiry pipeline | [preview](https://up-emc2-fraternity-git-feat-sponsorship-hype-kidz.vercel.app/sponsorship) |

### How to use these

Look at `launch/v2` first — it is everything at once, which is what launching
actually looks like. If one feature is wrong, look at its own branch to judge it
in isolation, and say so; each can be dropped without touching the others.

When you are happy, `launch/v2` merges into `main` and the public site changes.
Until you say so, `main` stays exactly where you approved it.

## Naming

`feat/` for something new, `fix/` for something broken, `launch/` for pre-launch work.
Lowercase, hyphens, no dates. The branch name is the sentence you would say out loud:
"the assistance fund branch".

## Tags: the restore points

A tag is a permanent bookmark on a commit. Unlike a branch it never moves, so it is the
thing you fall back to.

| Tag | What it is |
|---|---|
| `v1.0-demo` | The board-demo build, 3 September 2026. Modern Charter design, metal seal, scroll hero, Join page, graded photographs. Verified live. |

I will cut a new tag at every state worth returning to, and say so.

## What I need from you

Only two things, and neither is technical:

1. **Look at the preview links** when I send them and say which you want.
2. **Fill the board list** in `PLAN.md` §0, "Waiting on the Board". Every line there is real
   content the site is holding a space for: the SEC number, the ten founders, the officers,
   the GCash details, the Instagram handle. Code cannot invent any of it.
