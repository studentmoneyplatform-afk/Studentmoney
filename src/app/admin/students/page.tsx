import type { Metadata } from "next";
import { EmptyState, Panel } from "@/components/dashboard-ui";
import { VerifyToggle } from "@/components/admin-forms";
import { Chip, FinePrint } from "@/components/ui";
import { getStudents } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Students" };

export default async function AdminStudentsPage() {
  const students = await getStudents();
  const waiting = students.filter((s) => !s.verifiedAt);

  if (students.length === 0) {
    return (
      <EmptyState
        title="No students yet"
        body="Registered students appear here as they join, with their verification state."
      />
    );
  }

  return (
    <div className="space-y-8">
      <Panel title={`${waiting.length} awaiting verification`}>
        {waiting.length === 0 ? (
          <p className="text-[color:var(--ink-2)]">Everyone registered has been verified.</p>
        ) : (
          <ul className="divide-y divide-[color:var(--hair)]">
            {waiting.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-bold">{s.fullName}</p>
                  <p className="text-caption text-[color:var(--ink-3)]">
                    {s.phone}
                    {s.university ? ` · ${s.university}` : ""}
                  </p>
                </div>
                <VerifyToggle studentId={s.id} verified={false} />
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5">
          <FinePrint>
            An unverified student can browse, but no reward can be attributed to them —
            attribution has to belong to a real person.
          </FinePrint>
        </div>
      </Panel>

      <Panel title={`All students (${students.length})`}>
        <ul className="divide-y divide-[color:var(--hair)]">
          {students.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
              <div className="min-w-0">
                <p className="truncate font-bold">
                  {s.fullName}
                  {s.isAdmin && <span className="ml-2"><Chip>Staff</Chip></span>}
                </p>
                <p className="text-caption text-[color:var(--ink-3)]">
                  {s.phone}
                  {s.university ? ` · ${s.university}` : ""}
                </p>
              </div>
              {s.verifiedAt ? (
                <VerifyToggle studentId={s.id} verified />
              ) : (
                <span className="text-caption text-[color:var(--ink-3)]">Not verified</span>
              )}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
