import { Award, BadgeCheck, Globe, Factory, Package } from "lucide-react";

export const metadata = {
  title: "About Us",
};

const whyUltraV = [
  { icon: Award, label: "15+ Years Manufacturing" },
  { icon: BadgeCheck, label: "CE / ISO Certified" },
  { icon: Globe, label: "60+ Global Distributors" },
  { icon: Factory, label: "OEM / ODM Available" },
  { icon: Package, label: "MOQ Flexible" },
];

export default function EnAboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">About Ultra V</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Global manufacturer of PDO threads and collagen stimulators, trusted
            by clinics and distributors in 60+ countries worldwide.
          </p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Company Overview
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Ultra V Co., Ltd. has been manufacturing high-quality PDO threads and
          collagen stimulators for over 15 years. Our products are CE and ISO
          certified, meeting rigorous international quality and safety
          standards. With strong OEM/ODM capabilities and flexible minimum order
          quantities, we partner with distributors and clinics across the globe
          to deliver reliable, innovative aesthetic solutions.
        </p>
      </section>

      {/* Why Ultra V */}
      <section className="bg-white border-y">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
            Why Ultra V
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {whyUltraV.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                  <Icon className="text-blue-600" size={26} />
                </div>
                <p className="text-sm font-medium text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Contact</h2>
        <p className="text-gray-700">Main Tel. +82-2-539-3450</p>
        <p className="text-gray-700">Fax +82-2-517-3438</p>
      </section>
    </div>
  );
}
