// EXAMPLE: delete this whole folder (src/app/example/) when you start your
// real project. See "Delete the example" in the README.
//
// This file holds the data and the rules for it. It is plain TypeScript with
// no React, so tests can import it directly (see links.test.ts).

import { z } from "zod";

export type Link = {
  title: string;
  url: string;
  tag: string;
};

// In a real project this data comes from a database. Here it is a list in a
// file so the example works with no setup.
export const links: Link[] = [
  {
    title: "Next.js docs",
    url: "https://nextjs.org/docs",
    tag: "framework",
  },
  {
    title: "Tailwind CSS docs",
    url: "https://tailwindcss.com/docs",
    tag: "styling",
  },
  {
    title: "shadcn/ui components",
    url: "https://ui.shadcn.com/docs/components",
    tag: "components",
  },
];

// The rules a new link must follow. The server checks these, because anyone
// can send any data to a server action, not only our form.
export const linkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Give the link a title.")
    .max(80, "Keep the title under 80 characters."),
  url: z.url({
    protocol: /^https?$/,
    error: "Enter a full web address that starts with https://",
  }),
  tag: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Add one tag, for example: slides.")
    .regex(/^[a-z0-9-]+$/, "Use one word: letters, numbers and dashes only."),
});

export type LinkFieldErrors = Partial<Record<keyof Link, string>>;

export type ParseResult =
  { ok: true; link: Link } | { ok: false; errors: LinkFieldErrors };

// Reads the form fields and checks them against linkSchema. Returns the clean
// link, or one error message for each field that is wrong.
export function parseLink(formData: FormData): ParseResult {
  const result = linkSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    tag: formData.get("tag"),
  });

  if (result.success) {
    return { ok: true, link: result.data };
  }

  const errors: LinkFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof Link;
    errors[field] ??= issue.message;
  }
  return { ok: false, errors };
}
