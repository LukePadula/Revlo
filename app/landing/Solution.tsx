const lifecycle = [
  {
    phase: "Request",
    title: "Send a secure document request",
    description:
      "Generate branded, time-boxed upload links with granular requirements for each document you need.",
    detail: "Custom forms • reminders • audit trail",
    color: "from-sky-400/90 to-indigo-500/70",
  },
  {
    phase: "Collect",
    title: "Recipients upload with guided experience",
    description:
      "Clients authenticate via email or SMS, then drag-and-drop files with inline validation and progress tracking.",
    detail: "Multi-file upload • client OTP • progress alerts",
    color: "from-indigo-500/80 to-violet-500/70",
  },
  {
    phase: "Review",
    title: "Triage, annotate, and approve",
    description:
      "Route incoming files to reviewers, leave internal notes, and request fixes without exposing your inbox.",
    detail: "Reviewer routing • comments • version history",
    color: "from-violet-500/70 to-rose-500/70",
  },
  {
    phase: "Share",
    title: "Deliver finalized packets securely",
    description:
      "Compile approved documents into a single, watermarked package with expiration controls.",
    detail: "Watermarking • download controls • e-sign ready",
    color: "from-rose-500/70 to-orange-400/70",
  },
  {
    phase: "Archive",
    title: "Retain and prove compliance",
    description:
      "Store every interaction—uploads, approvals, deliveries—in an immutable audit log synced to your DMS.",
    detail: "Retention policies • evidence report • DMS sync",
    color: "from-emerald-400/80 to-sky-400/70",
  },
];

export default function Solution() {
  return (
    <section className="relative overflow-hidden bg-white py-20 text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#dbeafe80,transparent_70%)]" />
      <div className="relative mx-auto max-w-3xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand/80">
            Product lifecycle
          </p>
          <div className="mt-3 space-y-4">
            <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
              Every touchpoint, choreographed
            </h2>
            <p className="text-base text-slate-600 md:text-lg">
              Revlo guides your team from the initial request to
              compliance-ready archival, keeping security, visibility, and
              velocity in sync.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6">
          {lifecycle.map((stage, index) => (
            <div
              key={stage.phase}
              className="relative flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_35px_80px_-45px_rgba(15,23,42,0.35)] md:flex-row md:items-center md:justify-between"
            >
              <div className="absolute left-6 top-6 hidden h-full w-px bg-linear-to-b from-slate-200 to-transparent md:block" />
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${stage.color} text-base font-semibold text-white shadow-lg`}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    {stage.phase}
                  </p>
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {stage.title}
                  </h3>
                </div>
              </div>
              <div className="md:max-w-3xl">
                <p className="text-base text-slate-600">{stage.description}</p>
                <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  {stage.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
