"use client";

import { useState } from "react";

interface CategoryOption {
  id: string;
  name: string;
  nameEn: string | null;
}

interface QuickInquiryFormProps {
  categories: CategoryOption[];
}

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Canada",
  "Australia",
  "Japan",
  "China",
  "Brazil",
  "Mexico",
  "India",
  "Russia",
  "Saudi Arabia",
  "United Arab Emirates",
  "Thailand",
  "Vietnam",
  "Indonesia",
  "Philippines",
  "Other",
];

export default function QuickInquiryForm({
  categories,
}: QuickInquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const product = formData.get("product") as string;

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "PRODUCT_QUOTATION",
          companyName: formData.get("companyName"),
          country: formData.get("country"),
          email: formData.get("email"),
          interestedProducts: product ? [product] : [],
          message: formData.get("message"),
          orderQuantity: "N/A",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to submit inquiry");
      }

      setSuccess(true);
      form.reset();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Get a Quotation{" "}
            <span className="text-red-500">Within 24 Hours</span>
          </h2>
          <p className="text-gray-400">
            Tell us what you need — our team will respond fast.
          </p>
        </div>

        {success ? (
          <div className="max-w-xl mx-auto bg-white/10 border border-white/20 rounded-lg p-6 text-center">
            <p className="text-lg font-semibold mb-1">
              Thank you for your inquiry!
            </p>
            <p className="text-gray-300 text-sm">
              We will get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-5xl mx-auto"
          >
            <input
              name="companyName"
              required
              placeholder="Company Name"
              className="md:col-span-1 px-4 py-3 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="country"
              required
              defaultValue=""
              className="md:col-span-1 px-4 py-3 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Country
              </option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="md:col-span-1 px-4 py-3 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="product"
              defaultValue=""
              className="md:col-span-1 px-4 py-3 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Interested Product</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.nameEn ?? cat.name}>
                  {cat.nameEn ?? cat.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading}
              className="md:col-span-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold text-sm transition-colors"
            >
              {loading ? "Sending…" : "Send Inquiry"}
            </button>
            <textarea
              name="message"
              required
              placeholder="Message"
              rows={3}
              className="md:col-span-5 px-4 py-3 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {error && (
              <p className="md:col-span-5 text-red-400 text-sm">{error}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
