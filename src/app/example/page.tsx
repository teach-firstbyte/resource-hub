// EXAMPLE: the page at /example. It is a server component (the default), so
// it runs on the server and sends finished HTML to the browser.
//
// How the pieces connect:
//   links.ts          the data and the rules for a valid link
//   links.test.ts     tests for those rules
//   actions.ts        the server action the form calls
//   add-link-form.tsx the form (a client component)
//   page.tsx          this file, which puts it all on the page

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AddLinkForm } from "./add-link-form";
import { links } from "./links";

export default function ExamplePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Useful links</h1>
        <p className="text-muted-foreground">
          An example feature. Read the files in{" "}
          <code className="font-mono">src/app/example/</code> to see how a page,
          a form, a server action and a test work together.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              className="flex items-center justify-between gap-4 rounded-lg border p-4 hover:bg-muted"
            >
              <span className="font-medium">{link.title}</span>
              <Badge variant="secondary">{link.tag}</Badge>
            </a>
          </li>
        ))}
      </ul>

      <Card>
        <CardHeader>
          <CardTitle>Add a link</CardTitle>
          <CardDescription>
            The server checks what you type. Try leaving a field empty or typing
            a tag with a space in it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddLinkForm />
        </CardContent>
      </Card>
    </main>
  );
}
