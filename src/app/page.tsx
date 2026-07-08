import prisma from '@/lib/prisma'
import HeroCarousel from '@/components/home/HeroCarousel'
import LayerPopup from '@/components/home/LayerPopup'
import ProductCard from '@/components/ProductCard'
import CategoryProductSection from '@/components/home/CategoryProductSection'

function computeRating(reviews: { rating: number }[]) {
  if (reviews.length === 0) return { averageRating: 0, reviewCount: 0 }
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return { averageRating: sum / reviews.length, reviewCount: reviews.length }
}

const productInclude = {
  category: { select: { name: true } },
  reviews: { where: { status: 'APPROVED' as const }, select: { rating: true } },
}

async function getProductsByParentSlug(slug: string, take: number = 10) {
  const parent = await prisma.category.findUnique({
    where: { slug },
    include: { children: { select: { id: true } } },
  })
  if (!parent || parent.children.length === 0) return { parentId: '', products: [] }

  const childIds = parent.children.map((c) => c.id)
  const raw = await prisma.product.findMany({
    where: { isActive: true, categoryId: { in: childIds } },
    include: productInclude,
    take,
    orderBy: { createdAt: 'desc' },
  })

  const products = raw.map(({ reviews, ...rest }) => ({
    ...rest,
    ...computeRating(reviews),
  }))

  return { parentId: parent.id, products }
}

export default async function Home() {
  const [rawNewProducts, ultracol, liftingThreads, medicalDevices] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, isNew: true },
      include: productInclude,
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    getProductsByParentSlug('ultracol', 10),
    getProductsByParentSlug('lifting-threads', 10),
    getProductsByParentSlug('medical-devices', 10),
  ])

  const newProducts = rawNewProducts.map(({ reviews, ...rest }) => ({
    ...rest,
    ...computeRating(reviews),
  }))

  return (
    <div className="min-h-screen">
      <LayerPopup />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* 신상품 */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">신상품</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* 카테고리별 상품 */}
      <CategoryProductSection
        title="ULTRACOL"
        categoryId={ultracol.parentId}
        products={ultracol.products}
      />
      <CategoryProductSection
        title="LIFTING THREADS"
        categoryId={liftingThreads.parentId}
        products={liftingThreads.products}
      />
      <CategoryProductSection
        title="MEDICAL DEVICES"
        categoryId={medicalDevices.parentId}
        products={medicalDevices.products}
      />
    </div>
  )
}
