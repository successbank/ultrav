import Link from "next/link";
import { UserPlus, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Membership Registration Guide",
};

const steps = [
  {
    icon: UserPlus,
    title: "① Sign Up",
    description:
      "Create your account with your company name, email, and basic contact information.",
  },
  {
    icon: FileText,
    title: "② Business Registration Certificate Submission",
    description:
      "Submit your business registration certificate (or equivalent document) for verification as a B2B partner.",
  },
  {
    icon: CheckCircle2,
    title: "③ Approval Process",
    description:
      "Our team reviews your submission. Once approved, you will gain full access to wholesale pricing and quotation services.",
  },
];

export default function EnRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 타이틀 배너 */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-14 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Membership Registration Guide
          </h1>
          <p className="text-gray-300 mb-1">Welcome to Ultra V.</p>
          <p className="text-gray-400 text-sm">
            Please review the information below before using the website.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14 max-w-3xl">
        <div className="space-y-8 mb-12">
          {steps.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex gap-5 bg-white border rounded-lg p-6"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Icon className="text-blue-600" size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-10">
          <Link
            href="/en/signup"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
          >
            Go to Membership Registration
          </Link>
        </div>

        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>Main Tel. +82-2-539-3450</p>
          <p>Fax +82-2-517-3438</p>
        </div>
      </div>
    </div>
  );
}
