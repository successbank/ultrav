import type { Metadata } from "next";
import Link from "next/link";
import SignInForm from "@/components/en/SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your ULTRAVMALL account.",
};

export default function EnLoginPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* 타이틀 배너 */}
      <section className="bg-gray-100 border-b">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Sign In
          </h1>
          <p className="text-gray-600">
            Sign in to your ULTRAVMALL account to continue.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-xl">
        <SignInForm />

        {/* 멤버십 안내 */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-6 text-sm text-gray-700 text-center space-y-1">
          <p>
            New to ULTRAVMALL?{" "}
            <Link
              href="/en/register"
              className="text-blue-600 hover:underline font-medium"
            >
              View the Membership Guide
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
