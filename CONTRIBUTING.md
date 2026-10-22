# How we make changes

Every change goes through the same steps: **issue → branch → commits → pull
request → review → merge.** Nobody pushes straight to `main`. GitHub blocks it.

## 1. Pick an issue

Work comes from issues on the project board. Assign yourself to the issue
before you start, so two people don't do the same thing. If what you want to do
has no issue yet, make one with the **Feature Addition**, **Bug Report** or
**Task** template. Use **Task** for work that is not a feature or a bug: docs,
package updates, refactors, setup.

## 2. Make a branch

A branch is your own copy of the code to work on. Start from the newest `main`:

```bash
git switch main
git pull
git switch -c feat/resource-search-42
```

Name it `type/short-description-<issue number>`, in lowercase with dashes.

| Type        | Use it for                                     |
| ----------- | ---------------------------------------------- |
| `feat/`     | Something new                                  |
| `fix/`      | Fixing a bug                                   |
| `ui/`       | Changes to how something looks                 |
| `docs/`     | Docs only (README, guides, comments)           |
| `refactor/` | Changing how code is written, not what it does |
| `chore/`    | Packages, settings, other upkeep               |
| `ci/`       | GitHub Actions workflows                       |

## 3. Commit small, commit often

A commit is a saved step in the project's history. Make one each time you
finish a small piece that works.

Write the message as one plain sentence saying what the commit does:

```
Add a search box to the resources page
Fix the date showing in the wrong time zone
```

Not like this: `stuff`, `fixes`, `wip`, `final final v2`.

Before you commit, run:

```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm test
```

**Read your own diff before you commit.** If you can't explain a line, don't
commit it. That goes for code from Claude too: you're the author of every line
you commit.

## 4. Open a pull request

```bash
git push -u origin feat/resource-search-42
```

Then open a pull request on GitHub. The description is filled in with our
template. Fill in every part:

- **Closes #42** (first line): the issue number. This moves the card on the
  project board, so don't leave it out.
- **Summary:** what changed and why.
- **Evidence:** how you know it works, as **Before** and **After**. Add
  screenshots for UI changes.
- **Merge Danger:**
  - **Door:** "two-way" if reverting the PR undoes it completely, "one-way"
    if it can't be fully undone.
  - **Blast Radius:** what could break if this is wrong, for example "small:
    only the /resources page".

In Claude Code, type `/pr-description` and it writes this for you from your
changes. Check what it wrote before you post it.

## 5. CI and review

CI checks formatting, lint, types, tests and the build. If a check fails, click
**Details** to see the error, fix it on your branch, and push again. The
pull request updates by itself.

| Check failed | Fix it with                                          |
| ------------ | ---------------------------------------------------- |
| format:check | `pnpm format`, then commit                           |
| lint         | `pnpm lint` shows each problem and the file and line |
| typecheck    | `pnpm typecheck` shows each type error               |
| test         | `pnpm test` shows which test failed and why          |
| build        | `pnpm build` on your computer shows the same error   |
| install      | Run `pnpm install` and commit `pnpm-lock.yaml`       |

You need **one approval** to merge. When a reviewer asks for changes, push new
commits to the same branch. If you push after an approval, the approval resets
and someone has to look again.

Vercel also adds a **preview link** to the pull request: your branch running
as a real website. Reviewers use it to try your change.

## 6. Merge

When CI passes and someone has approved it, click **Merge pull request**, then
**Delete branch**.

## Stuck?

Ask in the team channel early. Say what you tried and paste the error. Being
stuck for 20 minutes is normal. Being stuck alone for two days isn't.
