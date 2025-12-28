"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate flex md:h-[100vh] w-full items-center justify-center overflow-hidden bg-linear-to-br from-slate-100 via-white to-sky-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#93c5fd33,transparent_60%)]" />
      <div className="pointer-events-none absolute -right-32 top-10 hidden h-72 w-72 rounded-full bg-sky-200 blur-3xl md:block" />
      <div className="pointer-events-none absolute -left-16 bottom-10 hidden h-64 w-64 rounded-full bg-indigo-100 blur-3xl md:block" />

      <div className="relative mx-auto  flex w-full max-w-3xl flex-col gap-12 px-6 py-20 md:mx-28 md:flex-row md:items-start md:gap-36 lg:px-1">
        <div className="flex-1 space-y-5 text-center md:text-left md:self-center">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-semibold leading-tight text-slate-900 md:text-4xl lg:text-5xl"
          >
            Secure Document Exchange Made{" "}
            <span className="font-bold text-brand">Simple</span>
          </motion.h1>

          {/* Supporting text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-3xl text-lg text-slate-600 md:mx-0"
          >
            Request and collect documents with enterprise-grade security.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4 pt-2 sm:flex-row sm:justify-center md:justify-start"
          >
            <button className="flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-3 text-base font-medium text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:opacity-95">
              Get Started <ArrowRight size={18} />
            </button>

            <button className="rounded-full border border-brand/60 px-8 py-3 text-base font-semibold text-brand transition hover:bg-brand/10">
              Learn More
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-1 justify-center md:self-center"
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-2xl backdrop-blur">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Lifecycle preview
              </p>
              <div className="space-y-4">
                {["Request", "Collect", "Review"].map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-base font-semibold text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        {step}
                      </p>
                      <p className="text-base font-medium text-slate-900">
                        {index === 0 && "Launch a secure request"}
                        {index === 1 && "Clients upload confidently"}
                        {index === 2 && "Your team approves faster"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
