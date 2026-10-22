# Setting up a new project (leads only)

"Use this template" copies the **files** only. It does **not** copy GitHub
settings, branch rules, secrets, or the Vercel project. This checklist covers
those. Do the steps in order. It takes about 30 minutes.

Everything here uses free features only.

## 1. Make the repo

- [ ] On [github.com/teach-firstbyte/firstbyte-template](https://github.com/teach-firstbyte/firstbyte-template),
      click **Use this template → Create a new repository**.
- [ ] Owner: **teach-firstbyte**. Name: lowercase with dashes, for example
      `resource-hub`.
- [ ] Choose **Public** unless the code must stay secret. Some free GitHub
      features below (secret scanning, rulesets on the Free plan) only work on
      public repos.
- [ ] Clone it, then follow "First day" in the README to check it runs.

## 2. Fill in the TODOs

- [ ] `README.md`: the project name and a sentence about it.
- [ ] `CLAUDE.md`: the sentence at the top.
- [ ] `package.json`: change `"name"` to the repo name.
- [ ] `src/app/layout.tsx`: the page `title` and `description`.
- [ ] `.github/CODEOWNERS`: the lead for this project.
- [ ] Delete the example feature (see "Delete the example" in the README), or
      leave it for the team's first week and make an issue to delete it.
- [ ] Commit these on a branch and open a pull request. This first pull
      request also runs CI once, which step 4 needs.

## 3. Repository settings

In the repo, go to **Settings → General**:

- [ ] Under **Pull Requests**, turn on **Automatically delete head branches**.
- [ ] Under **Features**, turn on **Issues**. Turn off **Wiki** (docs live in
      the repo).

Go to **Settings → Advanced Security** (or **Code security**). The org turns
these off for new repos, so turn them on:

- [ ] **Dependabot alerts** and **Dependabot security updates**.
- [ ] **Secret scanning** and **Push protection** (public repos). Push
      protection blocks a push that contains an API key.

## 4. Protect `main`

This is what makes "every change goes through a pull request" a real rule.

- [ ] Go to **Settings → Rules → Rulesets → New ruleset → New branch ruleset**.
- [ ] Name: `Protect main`. Enforcement: **Active**.
- [ ] Bypass list: add **Organization admin** (for emergencies only).
- [ ] Target branches: **Include default branch**.
- [ ] Turn on:
  - [ ] **Restrict deletions**
  - [ ] **Block force pushes**
  - [ ] **Require a pull request before merging**, with:
    - Required approvals: **1**
    - **Dismiss stale pull request approvals when new commits are pushed**
    - **Require approval of the most recent reviewable push**
  - [ ] **Require status checks to pass**, then **Add checks** and pick
        **check** (the CI job). It only shows up after CI has run once, which
        is why step 2 ends with a pull request.
- [ ] Click **Create**.

## 5. Vercel

- [ ] In Vercel, open the **firstbyte-neu** team, then **Add New → Project**,
      and import the repo. Vercel finds Next.js by itself. Leave the build
      settings as they are.
- [ ] Before you deploy, add any variables from `.env.example` under
      **Environment Variables**, with real values.
- [ ] After it deploys, go to **Settings → Build and Deployment → Node.js
      Version** and pick **24.x**, the same as `.nvmrc`.
- [ ] Open a test pull request and check that Vercel comments a preview link
      on it.
- [ ] (Optional) Add a domain under **Settings → Domains**.

## 6. Project board

- [ ] In the org's GitHub Project for this team, add the repo (**Settings →
      Manage access** on the project, or link it from the repo's
      **Projects** tab).
- [ ] Check the board's workflow **Pull request merged → Done** (or **Item
      closed → Done**) is on. `Closes #N` in a PR description closes the
      issue when the PR merges, and this moves the card.

## 7. Adding a database or login

- [ ] Using Supabase? Follow [docs/guides/supabase.md](docs/guides/supabase.md).
- [ ] Using something else? Write a guide in `docs/guides/` as you set it up.

## Later

- [ ] Create a GitHub team, `@teach-firstbyte/website-leads`
      (org **Teams → New team**), add the leads, and put it in
      `.github/CODEOWNERS` in place of one person. A team still works after a
      lead graduates.
