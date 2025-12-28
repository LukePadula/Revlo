"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/core/button";
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/landing/Logo.png";
import { authClient } from "@/app/lib/auth-client";
import { createOrganization } from "../actions/createOrganization";

type RegistrationStep = "form" | "licenses" | "payment";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<RegistrationStep>("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
  });
  const [licenseCount, setLicenseCount] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.organizationName.trim()) {
      setError("Organization name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  // Replace your old handleSubmit with this simplified version
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await createOrganization({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        organizationName: formData.organizationName,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // 2. IMPORTANT: Even though the user is in the DB,
      // the browser needs a session cookie.
      // Use Better-Auth's signIn to get the cookie.
      const loginRes = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (loginRes.error) {
        throw new Error(
          "Account created, but failed to sign in automatically."
        );
      }

      // 3. Set the active organization for the session
      if (result.organisation?.id) {
        await authClient.organization.setActive({
          organizationId: result.organisation.id,
        });
      }

      // 4. Move to next step
      setStep("licenses");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLicenseSelection = () => {
    if (licenseCount < 1) {
      setError("Please select at least 1 license");
      return;
    }
    setStep("payment");
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    setError("");

    try {
      // Get the price ID from environment variable or use a default
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "";

      if (!priceId) {
        throw new Error("Stripe price ID not configured");
      }

      const { createCheckoutSession } = await import(
        "@/app/actions/createCheckoutSession"
      );
      const { url } = await createCheckoutSession(priceId, licenseCount);

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process payment. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  const passwordRequirements = [
    { met: formData.password.length >= 8, text: "At least 8 characters" },
    {
      met: /[A-Z]/.test(formData.password),
      text: "One uppercase letter",
    },
    {
      met: /[a-z]/.test(formData.password),
      text: "One lowercase letter",
    },
    {
      met: /[0-9]/.test(formData.password),
      text: "One number",
    },
  ];

  // License selection step UI
  if (step === "licenses") {
    const pricePerLicense = 20;
    const totalPrice = licenseCount * pricePerLicense;

    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100/50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Image
                src={Logo}
                alt="Revlo logo"
                className="w-12 h-12 object-cover"
                width={48}
                height={48}
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Select Number of Licenses
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Choose how many licenses your organization needs
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="licenses"
                  className="block text-sm font-medium text-gray-900 mb-3"
                >
                  Number of Licenses
                </label>
                <div className="flex items-center gap-4 w-full">
                  <button
                    type="button"
                    onClick={() =>
                      setLicenseCount(Math.max(1, licenseCount - 1))
                    }
                    className="h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={licenseCount <= 1}
                  >
                    <span className="text-xl p-4 text-gray-600">−</span>
                  </button>
                  <input
                    id="licenses"
                    type="number"
                    min="1"
                    value={licenseCount}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setLicenseCount(Math.max(1, value));
                    }}
                    className="flex-1 text-center text-2xl font-bold text-gray-900 border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setLicenseCount(licenseCount + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl p-4 text-gray-600">+</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    Price per license
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    £{pricePerLicense}/month
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900">
                    Total (per month)
                  </span>
                  <span className="text-2xl font-bold text-brand">
                    £{totalPrice}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  After 30-day free trial
                </p>
              </div>

              <Button
                label="Continue to Payment"
                variant="brand"
                type="button"
                onClick={handleLicenseSelection}
                fullWidth
                size="large"
              />

              <button
                onClick={() => setStep("form")}
                className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    const pricePerLicense = 20;
    const totalPrice = licenseCount * pricePerLicense;
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100/50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Image
                src={Logo}
                alt="Revlo logo"
                className="w-12 h-12 object-cover"
                width={48}
                height={48}
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Complete Your Subscription
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Choose a plan to get started with Revlo
            </p>
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-3">
                  30-Day Free Trial
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {formData.organizationName}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  {licenseCount} {licenseCount === 1 ? "license" : "licenses"}
                </p>
                <p className="text-3xl font-bold text-brand mb-1">
                  £{totalPrice}
                  <span className="text-lg font-normal text-gray-600">
                    /month
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  £{pricePerLicense} per license · Start your free trial today.
                  No charge for 30 days.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-sm text-gray-700">
                    Unlimited document requests
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-sm text-gray-700">
                    Priority support
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-sm text-gray-700">
                    Advanced security features
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-sm text-gray-700">Custom branding</span>
                </div>
              </div>

              <Button
                label={
                  isProcessingPayment ? "Processing..." : "Start Free Trial"
                }
                variant="brand"
                type="button"
                onClick={handlePayment}
                fullWidth
                loading={isProcessingPayment}
                disabled={isProcessingPayment}
                size="large"
              />

              <p className="text-xs text-center text-gray-500">
                You'll be charged £{totalPrice}/month ({licenseCount}{" "}
                {licenseCount === 1 ? "license" : "licenses"}) after your 30-day
                free trial ends. Cancel anytime during the trial to avoid
                charges.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100/50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src={Logo}
              alt="Revlo logo"
              className="w-12 h-12 object-cover"
              width={48}
              height={48}
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Get started with Revlo today
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Full name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-colors text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Organization Name Field */}
            <div>
              <label
                htmlFor="organizationName"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Organization name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  autoComplete="organization"
                  required
                  value={formData.organizationName}
                  onChange={(e) =>
                    handleChange("organizationName", e.target.value)
                  }
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-colors text-sm"
                  placeholder="Acme Inc."
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-colors text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-colors text-sm"
                  placeholder="Create a password"
                />
              </div>
              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      {req.met ? (
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
                      )}
                      <span
                        className={req.met ? "text-green-700" : "text-gray-500"}
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Confirm password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-colors text-sm ${
                    formData.confirmPassword &&
                    formData.password !== formData.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm your password"
                />
              </div>
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    Passwords do not match
                  </p>
                )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded mt-0.5"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-brand hover:text-brand/80">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-brand hover:text-brand/80"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              label={isLoading ? "Creating account..." : "Create account"}
              variant="brand"
              type="submit"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              size="large"
            />
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-brand hover:text-brand/80"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
