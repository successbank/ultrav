"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

// 영문 회원가입 폼 — 기존 한국어 API(/api/auth/register)를 수정 없이 재사용하고,
// 검증/에러 메시지는 클라이언트에서 영문으로 처리한다.
export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError("Name, email and password are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register-en", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
        }),
      });

      if (res.status === 201) {
        setDone(true);
      } else {
        const data = await res.json().catch(() => null);
        setError(
          data?.error || "Something went wrong. Please try again later.",
        );
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="bg-white border rounded-lg p-10 text-center">
        <CheckCircle2 className="mx-auto text-green-600 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Registration Complete
        </h2>
        <p className="text-gray-600 mb-2">
          Welcome to Ultra V. Your account has been created.
        </p>
        <p className="text-gray-600 mb-8">
          Please submit your business registration certificate by fax
          (+82-2-517-3438) or through the{" "}
          <Link href="/en/inquiry" className="text-blue-600 hover:underline">
            Inquiry
          </Link>{" "}
          section. Your membership will be activated after administrator
          approval.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/en/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/en"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-lg p-8 space-y-5"
    >
      <div>
        <label
          htmlFor="signup-name"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="signup-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name or company representative"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="signup-email"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="signup-password"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Password <span className="text-red-500">*</span>
        </label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          minLength={8}
        />
      </div>

      <div>
        <label
          htmlFor="signup-confirm"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <input
          id="signup-confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="signup-phone"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Phone
        </label>
        <input
          id="signup-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+82-2-000-0000 (optional)"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full px-8 py-3.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors"
      >
        {submitting ? "Creating account…" : "Create Account"}
      </button>

      <p className="text-sm text-gray-500 text-center">
        Already have an account?{" "}
        <Link href="/en/login" className="text-blue-600 hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}
