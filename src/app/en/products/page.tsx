import Link from "next/link";
import prisma from "@/lib/prisma";
import { Search } from "lucide-react";
import EnProductCard from "@/components/en/EnProductCard";

const productInclude = {
  reviews: { where: { status: "APPROVED" as const }, select: { rating: true } },
};

function computeRating(reviews: { rating: number }[]) {
  if (reviews.length === 0) return { averageRating: 0, reviewCount: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return { averageRating: sum / reviews.length, reviewCount: reviews.length };
}

// 선택된 slug들(대/중/소 어느 레벨이든)에 해당하는 카테고리 + 하위 카테고리 id를 모두 모은다.
function collectIds(cat: { id: string; children?: any[] }): string[] {
  const childIds = (cat.children ?? []).flatMap((child) => collectIds(child));
  return [cat.id, ...childIds];
}

export default async function EnProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string | string[];
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const selectedSlugs = params.category
    ? Array.isArray(params.category)
      ? params.category
      : [params.category]
    : [];
  const search = params.search ?? "";

  const level1Categories = await prisma.category.findMany({
    where: { level: 1 },
    include: {
      children: {
        include: { children: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  const where: any = { isActive: true };

  if (selectedSlugs.length > 0) {
    const allCategories = level1Categories.flatMap((c) => [c, ...c.children]);
    const matched = allCategories.filter((c) => selectedSlugs.includes(c.slug));
    const categoryIds = Array.from(
      new Set(matched.flatMap((c) => collectIds(c))),
    );
    if (categoryIds.length > 0) {
      where.categoryId = { in: categoryIds };
    } else {
      // 존재하지 않는 slug만 선택된 경우 결과 없음 처리
      where.categoryId = { in: ["__none__"] };
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { nameEn: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { descriptionEn: { contains: search, mode: "insensitive" } },
    ];
  }

  const rawProducts = await prisma.product.findMany({
    where,
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });

  const products = rawProducts.map(({ reviews, ...rest }) => ({
    ...rest,
    ...computeRating(reviews),
  }));

  function buildToggleUrl(slug: string) {
    const isSelected = selectedSlugs.includes(slug);
    const next = isSelected
      ? selectedSlugs.filter((s) => s !== slug)
      : [...selectedSlugs, slug];
    const qs = new URLSearchParams();
    next.forEach((s) => qs.append("category", s));
    if (search) qs.set("search", search);
    const str = qs.toString();
    return str ? `/en/products?${str}` : "/en/products";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* All Categories 카드 영역 */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">
            All Categories
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {level1Categories.map((cat) => (
              <div key={cat.id} className="bg-white border rounded-lg p-6">
                <div className="aspect-video bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400 text-sm">
                  {cat.nameEn ?? cat.name}
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">
                  {cat.nameEn ?? cat.name}
                </h3>
                <ul className="text-sm text-gray-500 space-y-0.5">
                  {cat.children.map((child) => (
                    <li key={child.id}>{child.nameEn ?? child.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 검색 + Inquiry */}
        <form
          action="/en/products"
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search products…"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {selectedSlugs.map((s) => (
            <input key={s} type="hidden" name="category" value={s} />
          ))}
          <button
            type="submit"
            className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
          >
            Search
          </button>
          <Link
            href="/en/inquiry"
            className="px-6 py-2.5 border border-gray-900 text-gray-900 hover:bg-gray-100 font-semibold rounded-lg transition-colors text-center"
          >
            Inquiry
          </Link>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Filter</h2>
              <div className="space-y-5">
                {level1Categories.map((topCat) => (
                  <div key={topCat.id}>
                    <p className="font-medium text-gray-900 mb-2">
                      {topCat.nameEn ?? topCat.name}
                    </p>
                    <div className="space-y-1.5 ml-1">
                      {topCat.children.map((child) => (
                        <label
                          key={child.id}
                          className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                        >
                          <Link
                            href={buildToggleUrl(child.slug)}
                            className="flex items-center gap-2 w-full hover:text-blue-600"
                          >
                            <input
                              type="checkbox"
                              readOnly
                              checked={selectedSlugs.includes(child.slug)}
                              className="rounded border-gray-300"
                            />
                            {child.nameEn ?? child.name}
                          </Link>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            <p className="text-gray-600 mb-4">
              {products.length} products found
            </p>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              All Products
            </h2>
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500 text-lg">
                  No products match your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <EnProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
