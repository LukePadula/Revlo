const footerLinks = [
  {
    label: "Product",
    items: [
      { name: "Features", href: "#product" },
      { name: "Security", href: "#security" },
      { name: "Pricing", href: "#pricing" },
      { name: "API", href: "#api" },
    ],
  },
  {
    label: "Company",
    items: [
      { name: "About", href: "#about" },
      { name: "Blog", href: "#blog" },
      { name: "Careers", href: "#careers" },
      { name: "Contact", href: "#contact" },
    ],
  },
  {
    label: "Support",
    items: [
      { name: "Help Center", href: "#help" },
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Status", href: "#status" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex flex-col gap-10 border-b border-white/10 pb-10 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-300">
              Ready to secure?
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Ready to Secure Your Document Exchange?
            </h2>
            <p className="text-slate-300">
              Start collecting documents securely today with our 14-day free
              trial.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5">
              Start Free Trial
            </button>
            <button className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
              Schedule Demo
            </button>
          </div>
        </div>

        <div className="py-10">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300">
                  R
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Revlo
                  </p>
                  <p className="text-base font-semibold text-white">
                    SecureDoc Exchange
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Secure document exchange platform for businesses and
                individuals.
              </p>
            </div>
            {footerLinks.map((column) => (
              <div key={column.label} className="space-y-3">
                <p className="text-sm font-semibold text-white">
                  {column.label}
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  {column.items.map((item) => (
                    <li key={item.name}>
                      <a
                        className="transition hover:text-white"
                        href={item.href}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Revlo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
