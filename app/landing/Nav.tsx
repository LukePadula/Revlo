"use client";
import { useState } from "react";
import Image from "next/image";
import Logo from "./Logo.png";
import { X, Menu } from "lucide-react";

const links = [
  { label: "Product", href: "#product" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
];

export default function LandingNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <Image
              src={Logo}
              alt="Revlo logo"
              className="w-7 h-7 object-cover"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">
                Revlo
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-slate-900 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50">
              Log in
            </button>
            <button className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/40">
              Get started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-[57px] sm:top-[65px] left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-lg transition-all duration-300 ease-in-out lg:hidden ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="px-4 py-6 space-y-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              className="block py-3 px-4 text-base font-medium text-slate-700 rounded-lg transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <button
              onClick={closeMenu}
              className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              Log in
            </button>
            <button
              onClick={closeMenu}
              className="w-full rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-all hover:shadow-xl hover:shadow-brand/40"
            >
              Get started
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
