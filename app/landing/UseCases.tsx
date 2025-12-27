const industries = [
  {
    title: "Legal",
    description:
      "Route NDAs, case files, and contracts through secure review queues with full audit capture.",
  },
  {
    title: "Property",
    description:
      "Collect appraisals, inspections, and closing packets in a single source of truth for every property.",
  },
  {
    title: "Recruitment",
    description:
      "Verify employee paperwork, certifications, and right-to-work evidence without email attachments.",
  },
  {
    title: "Customer Identification",
    description:
      "Launch KYC/KYB flows that request IDs, ownership records, and risk questionnaires automatically.",
  },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="bg-slate-50 py-20">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-12 lg:flex-row lg:items-center">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand/80">
            Industries
          </p>
          <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Built for the teams that move regulated work forward
          </h2>
          <p className="text-base text-slate-600 md:text-lg">
            Revlo adapts to compliance-heavy workflows across legal, property,
            recruitment, and identity operations—no custom build required.
          </p>
        </div>

        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          {industries.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-brand to-sky-400" />
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
