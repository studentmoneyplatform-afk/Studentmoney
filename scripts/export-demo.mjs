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
  // These two import the parked server actions, so they cannot typecheck
  // without them even though nothing in the demo renders them.
  ["src/components/profile-form.tsx", "profile-form.tsx"],
  ["src/components/signup-form.tsx", "signup-form.tsx"],
];

const STATIC_JOIN = `import type { Metadata } from "next";
import { Button, Card, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { Money } from "@/components/money";
import { RewardBar } from "@/components/reward-bar";
import { PROJECT_REWARD_USD } from "@/lib/rewards";

export const metadata: Metadata = { title: "Join" };

export default function JoinPage() {
  return (
    <div data-page="home">
      <Section tone="forest">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow tone="reversed">Join StudentMoney</Eyebrow>
            <H2 className="mt-5">One introduction is all it takes to start.</H2>
            <Lede tone="reversed" className="mx-auto mt-6">
              Campaigns, lessons and earning updates arrive on WhatsApp. Joining is
              free, and you decide which campaigns you take.
            </Lede>
          </Reveal>

          <Reveal delay={120}>
            <Card tone="forest" className="mt-10 border border-[color:var(--hair-reversed)] text-left">
              <Eyebrow tone="reversed">The standard referral reward</Eyebrow>
              <div className="mt-4">
                <Money usd={PROJECT_REWARD_USD} size="lg" tone="earned-reversed" />
              </div>
              <RewardBar className="mt-6" />
              <div className="mt-5">
                <FinePrint tone="reversed">
                  Per qualifying project, released as the client pays. Terms apply.
                </FinePrint>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-10 rounded-[var(--radius-xl)] border border-[color:var(--hair-reversed)] p-6">
              <p className="font-bold">This is a preview of the site.</p>
              <p className="mt-2 text-[color:var(--on-dark-2)]">
                Sign-up and Google sign-in run on the live build, which needs a server.
                Nothing you type here would be saved, so the form is not shown.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button href="/opportunities" variant="light">See the ways to earn</Button>
                <Button href="/marketplace" variant="light">Browse the marketplace</Button>
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
  rmSync(join(root, ".next"), { recursive: true, force: true });
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
