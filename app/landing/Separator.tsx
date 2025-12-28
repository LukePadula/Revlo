const stats = [
  { value: "40K+", label: "Secure docs exchanged monthly" },
  { value: "500+", label: "Organizations onboarded" },
  { value: "2.5x", label: "Faster client turnaround" },
];

export default function Separator() {
  return (
    <section className="relative border-y border-slate-200 bg-white py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6 text-center md:flex-row md:items-center md:text-left">
        <div className="flex-1 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            Why Revlo
          </p>
          <h2 className="text-3xl font-semibold leading-tight">
            Compliance-grade security with consumer-grade simplicity.
          </h2>
          <p className="text-base text-slate-600">
            Keep every document request auditable, encrypted, and accessible to
            the right people—without slowing down your workflow.
          </p>
        </div>

        <div className="flex flex-1 justify-center gap-6 md:justify-end">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1 text-left">
              <p className="text-3xl font-semibold text-slate-900">
                {stat.value}
              </p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
