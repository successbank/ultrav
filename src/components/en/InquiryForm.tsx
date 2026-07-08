"use client";

import { useState } from "react";

interface CategoryOption {
  id: string;
  name: string;
  nameEn: string | null;
}

interface InquiryFormProps {
  categories: CategoryOption[];
  presetProduct?: string;
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

const INQUIRY_TYPES: { value: string; label: string }[] = [
  { value: "PRODUCT_QUOTATION", label: "Product Quotation" },
  { value: "OEM_ODM", label: "OEM·ODM Inquiry" },
  { value: "DISTRIBUTOR", label: "Distributor Partnership" },
  { value: "TECHNICAL", label: "Technical Support" },
  { value: "GENERAL", label: "General Question" },
];

export default function InquiryForm({
  categories,
  presetProduct,
}: InquiryFormProps) {
  const [type, setType] = useState("PRODUCT_QUOTATION");
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    presetProduct ? [presetProduct] : [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const toggleProduct = (label: string) => {
    setSelectedProducts((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      type,
      companyName: formData.get("companyName"),
      country: formData.get("country"),
      website: formData.get("website") || undefined,
      contactPerson: formData.get("contactPerson") || undefined,
      email: formData.get("email"),
      phone: formData.get("phone"),
      orderQuantity: formData.get("orderQuantity"),
      orderTimeline: formData.get("orderTimeline") || undefined,
      targetMarket: formData.get("targetMarket") || undefined,
      interestedProducts: selectedProducts,
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to submit inquiry");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-white border rounded-lg p-10 text-center">
        <p className="text-xl font-semibold text-gray-900 mb-2">Thank you!</p>
        <p className="text-gray-600">
          Your inquiry has been submitted. We will get back to you within 24
          hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-2 gap-10"
    >
      {/* 좌측: Inquiry Type + Interested Product */}
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-bold mb-4 text-gray-900">Inquiry Type</h2>
          <div className="space-y-2">
            {INQUIRY_TYPES.map((t) => (
              <label
                key={t.value}
                className="flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="type"
                  value={t.value}
                  checked={type === t.value}
                  onChange={() => setType(t.value)}
                  className="text-gray-900"
                />
                <span className="text-sm text-gray-800">{t.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4 text-gray-900">
            Interested Product{" "}
            <span className="text-sm font-normal text-gray-500">
              (select all that apply)
            </span>
          </h2>
          <div className="space-y-2">
            {presetProduct &&
              !categories.some(
                (c) => (c.nameEn ?? c.name) === presetProduct,
              ) && (
                <label className="flex items-center gap-3 px-4 py-3 border rounded-lg bg-blue-50">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(presetProduct)}
                    onChange={() => toggleProduct(presetProduct)}
                  />
                  <span className="text-sm text-gray-800">{presetProduct}</span>
                </label>
              )}
            <label className="flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selectedProducts.includes("All Categories")}
                onChange={() => toggleProduct("All Categories")}
              />
              <span className="text-sm text-gray-800">All Categories</span>
            </label>
            {categories.map((cat) => {
              const label = cat.nameEn ?? cat.name;
              return (
                <label
                  key={cat.id}
                  className="flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(label)}
                    onChange={() => toggleProduct(label)}
                  />
                  <span className="text-sm text-gray-800">{label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* 우측: Company Information */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-gray-900">
          Company Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              name="companyName"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              name="country"
              required
              defaultValue=""
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select a country
              </option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              name="website"
              type="url"
              placeholder="https://"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              name="contactPerson"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Order Quantity <span className="text-red-500">*</span>
            </label>
            <input
              name="orderQuantity"
              required
              placeholder="e.g. 1,000 units"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Order Timeline
            </label>
            <input
              name="orderTimeline"
              placeholder="e.g. Within 3 months"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Market
            </label>
            <input
              name="targetMarket"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              required
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Submitting…" : "Submit Inquiry"}
          </button>
        </div>
      </div>
    </form>
  );
}
