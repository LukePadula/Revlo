const features = [
  {
    title: "Secure Link Generation",
    description:
      "Create time-limited, encrypted links for external users to upload documents without needing an account.",
  },
  {
    title: "End-to-End Encryption",
    description:
      "Documents stay encrypted in transit and at rest with military-grade AES-256 security.",
  },
  {
    title: "Document Templates",
    description:
      "Use pre-built templates for passports, IDs, bank statements, and any repeatable request.",
  },
  {
    title: "Real-time Notifications",
    description:
      "Get alerted the moment files are uploaded, viewed, or when a secure link is about to expire.",
  },
  {
    title: "Time-Limited Access",
    description:
      "Set custom expiration windows so sensitive files stay available only as long as you need.",
  },
  {
    title: "Audit Trail",
    description:
      "Capture every upload, download, and approval in a tamper-proof log for compliance.",
  },
];

export default function Features() {
  return (
    <section
      id="product"
      className="mx-auto max-w-3xl px-6 py-20 text-center md:py-24"
    >
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          Powerful Features for Secure Document Exchange
        </h2>
        <p className="text-base text-slate-600 md:text-lg">
          Everything you need to securely request, collect, and manage sensitive
          documents from external parties.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <span className="text-sm font-semibold">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
