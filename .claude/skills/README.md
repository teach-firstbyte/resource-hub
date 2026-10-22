# Claude Code skills

A skill is a folder of instructions Claude Code loads when your request
matches its description. You can also run one by name, for example
`/pr-description`.

| Skill            | What it does                                                          | Source                                                                                                                                                              | Copied     |
| ---------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `pr-description` | Writes a PR description in FirstByte format                           | Written for this template                                                                                                                                           | -          |
| `simple-english` | Rewrites docs and comments in ASD-STE100 Simplified Technical English | [`AminBlg/SimpleEnglish`](https://github.com/AminBlg/SimpleEnglish), `skills/simple-english`, version 2.1.1 at commit `a6fcb4f` (MIT, see `simple-english/LICENSE`) | 2026-10-20 |
| `shadcn`         | shadcn/ui CLI, components, composition and theming                    | [`shadcn-ui/ui`](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn), `skills/shadcn` (MIT, see `shadcn/LICENSE.md`)                                           | 2026-10-20 |

## Updating a copied skill

Copied skills are kept exactly as their source has them. Prettier skips them
(see `.prettierignore`). To update one, replace the whole folder with the new
version from its source, keep its license file, and change the date above.
Don't edit a copied skill by hand. Your change would be lost at the next update.

## Adding a skill

Put it in `.claude/skills/<name>/SKILL.md`, add a row to the table, and open a
pull request. If you copied it from somewhere, check its license allows that,
add the license file, and add the folder to `.prettierignore`.
