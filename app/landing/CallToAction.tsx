export default function CallToAction() {
  return (
    <section
      id="cta"
      className="bg-[#1d63f2] px-6 py-20 text-center text-white md:py-24"
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-3xl font-semibold md:text-4xl">
          Ready to Secure Your Document Exchange?
        </h2>
        <p className="text-base text-white/80 md:text-lg">
          Start collecting documents securely today with our 14-day free trial.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button className="rounded-xl bg-white px-8 py-3 text-sm font-semibold text-[#1d63f2] shadow-sm transition hover:-translate-y-0.5">
            Start Free Trial
          </button>
          <button className="rounded-xl border border-white/70 px-8 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
            Schedule Demo
          </button>
        </div>
        <p className="text-xs text-white/70">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}
