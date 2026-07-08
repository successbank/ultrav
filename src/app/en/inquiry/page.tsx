import prisma from "@/lib/prisma";
import InquiryForm from "@/components/en/InquiryForm";

export const metadata = {
  title: "Inquiry",
};

export default async function EnInquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const params = await searchParams;

  const level1Categories = await prisma.category.findMany({
    where: { level: 1 },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 배너 */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-14 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Inquiry</h1>
          <p className="text-gray-300 mb-1">Global Partnership Starts Here</p>
          <p className="text-lg">
            Get a Quotation{" "}
            <span className="text-red-500 font-semibold">Within 24 Hours</span>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <InquiryForm
          categories={level1Categories.map((c) => ({
            id: c.id,
            name: c.name,
            nameEn: c.nameEn,
          }))}
          presetProduct={params.product}
        />
      </div>
    </div>
  );
}
