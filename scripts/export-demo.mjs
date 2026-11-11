/**
 * Builds a static demo of the marketing site into /out, for dragging onto
 * Netlify.
 *
 * Anything that needs a server is moved aside for the duration of the build
 * and restored afterwards, even if the build fails: the signup server action,
 * the auth route handlers, the signed-in pages and the session middleware.
 * The join page is swapped for a static stand-in that says plainly that
 * signup is not live in the demo, rather than showing a form that silently
 * does nothing.
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const parked = join(root, ".demo-parked");

// [source, name-in-park]
const SERVER_ONLY = [
  ["src/app/auth", "auth"],
  ["src/app/dashboard", "dashboard"],
  ["src/app/welcome", "welcome"],
  ["src/app/join", "join"],
  ["src/middleware.ts", "middleware.ts"],
  // The staff console needs a server for its role checks.
  ["src/app/admin", "admin"],
  // These import the parked server actions, so they cannot typecheck
  // without them even though nothing in the demo renders them.
  ["src/components/profile-form.tsx", "profile-form.tsx"],
  ["src/components/signup-form.tsx", "signup-form.tsx"],
  ["src/components/join-button.tsx", "join-button.tsx"],
  ["src/components/admin-forms.tsx", "admin-forms.tsx"],
];

const STATIC_JOIN = `import type { Metadata } from "next";
import { Button, Card, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { Money } from "@/components/money";

export const metadata: Metadata = { title: "Join" };

export default function JoinPage() {
  return (
    <div data-page="home">
      <Section tone="forest">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow tone="reversed">Join Stormm</Eyebrow>
            <H2 className="mt-5">Three ways to earn. One account.</H2>
            <Lede tone="reversed" className="mx-auto mt-6">
              Joining is free. Pick one of the three opportunities, or run all three,
              and your progress appears on your dashboard.
            </Lede>
          </Reveal>

          <Reveal delay={120}>
            <Card tone="forest" className="mt-10 border border-paper/20 text-left">
              <Eyebrow tone="reversed">The standard referral reward</Eyebrow>
              <div className="mt-4">
                <Money usd={25} size="lg" tone="earned-reversed" />
              </div>
              <div className="mt-5">
                <FinePrint tone="reversed">
                  Per approved referral on Software Service Referrals. Terms apply.
                </FinePrint>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-10 rounded-[1.75rem] border border-paper/20 p-6">
              <p className="font-bold">This is a preview of the site.</p>
              <p className="mt-2 text-paper/75">
                Sign-up and Google sign-in run on the live build, which needs a server.
                Nothing you type here would be saved, so the form is not shown.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button href="/opportunities" variant="light">Explore opportunities</Button>
                <Button href="/how-it-works" variant="light">See how it works</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
`;

function park() {
  mkdirSync(parked, { recursive: true });
  for (const [rel, name] of SERVER_ONLY) {
    const from = join(root, rel);
    if (existsSync(from)) renameSync(from, join(parked, name));
  }
  mkdirSync(join(root, "src/app/join"), { recursive: true });
  writeFileSync(join(root, "src/app/join/page.tsx"), STATIC_JOIN, "utf8");
}

function restore() {
  rmSync(join(root, "src/app/join"), { recursive: true, force: true });
  for (const [rel, name] of SERVER_ONLY) {
    const from = join(parked, name);
    if (existsSync(from)) renameSync(from, join(root, rel));
  }
  rmSync(parked, { recursive: true, force: true });
}

let failed = false;
try {
  park();
  // Both dist directories go: .next-build holds generated route types from
  // the last production build, and those reference the very routes this
  // export parks, so a stale copy fails the type check.
  rmSync(join(root, ".next"), { recursive: true, force: true });
  rmSync(join(root, ".next-build"), { recursive: true, force: true });
  rmSync(join(root, "out"), { recursive: true, force: true });
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, STATIC_EXPORT: "1" },
  });
  // Netlify: send unknown paths to the 404 page rather than a blank response.
  writeFileSync(join(root, "out/_redirects"), "/*  /404.html  404\n", "utf8");
  cpSync(join(root, "public/photos/README.md"), join(root, "out/PHOTOS.md"));
} catch (error) {
  failed = true;
  console.error("\nExport failed:", error.message);
} finally {
  restore();
}

if (failed) process.exit(1);
console.log("\nStatic demo written to ./out");
