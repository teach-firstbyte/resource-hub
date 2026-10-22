import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-6 py-24">
      {/* public/firstbyte-logo.png. The image has white space around the mark,
          so -ml-3 lines the mark up with the text below it. */}
      <Image
        src="/firstbyte-logo.png"
        alt="FirstByte"
        width={80}
        height={80}
        preload
        className="-ml-3"
      />
      <h1 className="text-3xl font-semibold tracking-tight">
        Your FirstByte project
      </h1>
      <p className="text-muted-foreground">
        This page is <code className="font-mono">src/app/page.tsx</code>. Edit
        it and save. The browser updates by itself.
      </p>
      {/* Example: delete this link when you delete src/app/example/. */}
      <div>
        <Button asChild>
          <Link href="/example">See the example feature</Link>
        </Button>
      </div>
    </main>
  );
}
