"use server";

// EXAMPLE: a server action. This code runs on the server, never in the
// browser. The form in add-link-form.tsx calls it when someone presses Add.

import { type Link, type LinkFieldErrors, parseLink } from "./links";

export type AddLinkState =
  | { status: "idle" }
  | { status: "error"; errors: LinkFieldErrors; values: Record<string, string> }
  | { status: "success"; link: Link };

export async function addLink(
  _previousState: AddLinkState,
  formData: FormData,
): Promise<AddLinkState> {
  const result = parseLink(formData);

  if (!result.ok) {
    // React empties the form after every submit. Sending back what the person
    // typed lets the form show it again, so they only fix the wrong field.
    const values = {
      title: String(formData.get("title") ?? ""),
      url: String(formData.get("url") ?? ""),
      tag: String(formData.get("tag") ?? ""),
    };
    return { status: "error", errors: result.errors, values };
  }

  // This is where a real project saves the link to its database. The example
  // has no database, so it only sends the checked link back to the form.
  return { status: "success", link: result.link };
}
