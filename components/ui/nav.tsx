"use client";
import Logo from "../../app/landing/Logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { signOut } from "@/app/actions/signOut";
import { useState } from "react";

export default function Nav() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogoClick = () => {
    router.push("/portal/dashboard");
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 shrink-0 transition-opacity hover:opacity-80 active:opacity-70 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 rounded-lg px-2 py-1 -ml-2"
          aria-label="Go to dashboard"
        >
          <Image
            src={Logo}
            alt="Revlo logo"
            className="w-7 h-7 object-cover"
            width={28}
            height={28}
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">
              Revlo
            </p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/portal/account")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            aria-label="Account settings"
          >
            <User className="w-4 h-4" />
            <span>Account</span>
          </button>

          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
            <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
