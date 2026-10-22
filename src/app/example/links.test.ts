// EXAMPLE: a unit test. Run it with `pnpm test`.
//
// A test calls your code with some input and checks the output. If someone
// changes parseLink and breaks a rule, this test fails in CI before the
// change can merge.

import { describe, expect, it } from "vitest";

import { parseLink } from "./links";

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    data.set(key, value);
  }
  return data;
}

describe("parseLink", () => {
  it("accepts a valid link and cleans it up", () => {
    const result = parseLink(
      form({
        title: "  Workshop slides  ",
        url: "https://example.com/slides",
        tag: "Slides",
      }),
    );

    expect(result).toEqual({
      ok: true,
      link: {
        title: "Workshop slides",
        url: "https://example.com/slides",
        tag: "slides",
      },
    });
  });

  it("rejects an empty title", () => {
    const result = parseLink(
      form({ title: "", url: "https://example.com", tag: "slides" }),
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.title).toBe("Give the link a title.");
    }
  });

  it("rejects a web address that is not http or https", () => {
    const result = parseLink(
      form({ title: "Bad", url: "javascript:alert(1)", tag: "slides" }),
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.url).toBeDefined();
    }
  });

  it("rejects a tag with spaces", () => {
    const result = parseLink(
      form({ title: "Notes", url: "https://example.com", tag: "two words" }),
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.tag).toBe(
        "Use one word: letters, numbers and dashes only.",
      );
    }
  });
});
