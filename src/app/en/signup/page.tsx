import type { Metadata } from "next";
import SignUpForm from "@/components/en/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your ULTRAVMALL account. Membership is activated after business registration certificate verification.",
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* 타이틀 배너 */}
      <section className="bg-gray-100 border-b">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Sign Up
          </h1>
          <p className="text-gray-600">
            Create an account on the ULTRAVMALL website.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-xl">
        <SignUpForm />

        {/* 가입 절차 안내 */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-6 text-sm text-gray-700 space-y-2">
          <p className="font-semibold text-gray-900">After signing up:</p>
          <p>
            ① Submit your business registration certificate by fax
            (+82-2-517-3438) or through the Inquiry section.
          </p>
          <p>
            ② Your membership will be approved after verification by the
            administrator.
          </p>
          <p className="text-gray-500">
            Main Tel. +82-2-539-3450 / Fax +82-2-517-3438
          </p>
        </div>
      </section>
    </main>
  );
}
