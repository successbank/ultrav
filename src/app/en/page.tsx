import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { Award, BadgeCheck, Globe, Factory, Package } from "lucide-react";
import EnProductCard from "@/components/en/EnProductCard";
import QuickInquiryForm from "@/components/en/QuickInquiryForm";

const productInclude = {
  reviews: { where: { status: "APPROVED" as const }, select: { rating: true } },
};

function computeRating(reviews: { rating: number }[]) {
  if (reviews.length === 0) return { averageRating: 0, reviewCount: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return { averageRating: sum / reviews.length, reviewCount: reviews.length };
}

const whyUltraV = [
  { icon: Award, label: "15+ Years Manufacturing" },
  { icon: BadgeCheck, label: "CE / ISO Certified" },
  { icon: Globe, label: "60+ Global Distributors" },
  { icon: Factory, label: "OEM / ODM Available" },
  { icon: Package, label: "MOQ Flexible" },
];

export default async function EnHomePage() {
  const [heroCarousel, level1Categories, rawFeatured] = await Promise.all([
    prisma.carousel.findFirst({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.category.findMany({
      where: { level: 1 },
      include: {
        children: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: 4,
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeaturedEn: true },
      include: productInclude,
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  let featuredRaw = rawFeatured;
  if (featuredRaw.length === 0) {
    featuredRaw = await prisma.product.findMany({
      where: { isActive: true },
      include: productInclude,
      take: 4,
      orderBy: { createdAt: "desc" },
    });
  }

  const featuredProducts = featuredRaw.map(({ reviews, ...rest }) => ({
    ...rest,
    ...computeRating(reviews),
  }));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-gray-900">
              Global Manufacturer of PDO Threads &amp; Collagen Stimulators
            </h1>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white border rounded-full text-sm font-medium text-gray-700">
                CE / ISO Certified
              </span>
              <span className="px-4 py-2 bg-white border rounded-full text-sm font-medium text-gray-700">
                15+ Years Manufacturing
              </span>
              <span className="px-4 py-2 bg-white border rounded-full text-sm font-medium text-gray-700">
                60+ Countries Exported
              </span>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            {heroCarousel ? (
              <Image
                src={heroCarousel.imageUrl}
                alt={heroCarousel.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-gray-900" />
            )}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">
          Product Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {level1Categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border rounded-lg p-6 flex flex-col"
            >
              <h3 className="font-semibold text-lg mb-3 text-gray-900">
                {cat.nameEn ?? cat.name}
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 mb-4 flex-1">
                {cat.children.map((child) => (
                  <li key={child.id}>{child.nameEn ?? child.name}</li>
                ))}
              </ul>
              <Link
                href={`/en/products?category=${cat.slug}`}
                className="text-blue-600 font-medium text-sm hover:underline"
              >
                View Products →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Ultra V */}
      <section className="bg-gray-50 border-y">
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

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Link
            href="/en/products"
            className="text-blue-600 font-medium hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <EnProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* Quick Inquiry */}
      <QuickInquiryForm
        categories={level1Categories.map((c) => ({
          id: c.id,
          name: c.name,
          nameEn: c.nameEn,
        }))}
      />
    </div>
  );
}
