---
name: pr-description
description: Write a pull request description in FirstByte format. Use when opening a pull request or when asked to write or fix a PR description.
---

Write the PR description in this format, in simple English. It matches
`.github/pull_request_template.md`.

````
Closes #<issue number>

## Summary

What changed and why, in a few sentences. When it helps a reviewer, add a
small diagram, file tree, or diff sketch in a ```text or ```diff block.
Say what is out of scope.

## Evidence

- **Before:** what happened before (a screenshot, output, or failing test).
  **After:** what happens now (a screenshot, output, or passing test).
- The checks that passed: format, lint, typecheck, test, build.
- What was checked by hand, step by step, for example "As a member: opened
  /resources, searched 'slides', saw 3 results."

## Merge Danger

**Door:** two-way (or one-way)

One or two sentences. Two-way means reverting the PR undoes it completely.
One-way means it can't be fully undone (deleted data, a changed URL people
use, a new secret or setting outside the code). For one-way, say what could
go wrong.

**Blast Radius:** small (or a short label, for example "permissions")

One or two sentences naming the pages, features or people this touches.
````

Steps:

1. Read the diff against main (`git diff main...HEAD`) and the commit messages.
2. Find the issue number. Look in the branch name first (for example
   `feat/resource-search-42` is issue 42). If there is none, ask the author.
   Never leave out `Closes #N`: the project board moves cards with it.
3. Only list checks that actually ran, with real output (test counts, error
   messages). If you didn't run something, say so. For UI changes, remind the
   author to add a screenshot.
4. Don't use emoji or marketing words. Describe what the code does.
