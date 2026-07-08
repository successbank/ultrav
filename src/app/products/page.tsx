import Link from 'next/link'
import prisma from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string
    sort?: string
    search?: string
  }>
}) {
  const params = await searchParams

  // 필터 및 정렬 조건 구성
  const where: any = { isActive: true }

  if (params.category) {
    // 선택된 카테고리가 대분류인지 확인 (하위 카테고리 포함 여부)
    const selectedCat = await prisma.category.findUnique({
      where: { id: params.category },
      include: { children: { select: { id: true } } },
    })
    if (selectedCat && selectedCat.children.length > 0) {
      // 대분류 → 자신 + 하위 카테고리 상품 모두 포함
      where.categoryId = {
        in: [selectedCat.id, ...selectedCat.children.map((c: { id: string }) => c.id)],
      }
    } else {
      where.categoryId = params.category
    }
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { brand: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  const orderBy: any = {}
  switch (params.sort) {
    case 'price_asc':
      orderBy.price = 'asc'
      break
    case 'price_desc':
      orderBy.price = 'desc'
      break
    case 'name':
      orderBy.name = 'asc'
      break
    default:
      orderBy.createdAt = 'desc'
  }

  // 필터 URL 생성 헬퍼 (기존 파라미터 보존)
  function buildFilterUrl(overrides: { category?: string | null; sort?: string | null }) {
    const qs = new URLSearchParams()
    const category = overrides.category !== undefined ? overrides.category : params.category
    const sort = overrides.sort !== undefined ? overrides.sort : params.sort
    if (category) qs.set('category', category)
    if (sort) qs.set('sort', sort)
    if (params.search) qs.set('search', params.search)
    const str = qs.toString()
    return str ? `/products?${str}` : '/products'
  }

  // 데이터 가져오기
  const [rawProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
        reviews: { where: { status: 'APPROVED' as const }, select: { rating: true } },
      },
      orderBy,
    }),
    prisma.category.findMany({
      where: { level: 1 },
      include: {
        children: {
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }),
  ])

  const products = rawProducts.map(({ reviews, ...rest }) => {
    const reviewCount = reviews.length
    const averageRating = reviewCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0
    return { ...rest, averageRating, reviewCount }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {params.search ? (
              <>&ldquo;{params.search}&rdquo; 검색 결과</>
            ) : (
              '전체 상품'
            )}
          </h1>
          <p className="text-gray-600">
            총 {products.length}개의 상품
            {params.search && (() => {
              const qs = new URLSearchParams()
              if (params.category) qs.set('category', params.category)
              if (params.sort) qs.set('sort', params.sort)
              const str = qs.toString()
              return (
                <Link href={str ? `/products?${str}` : '/products'} className="ml-3 text-blue-600 hover:underline text-sm">
                  검색 해제
                </Link>
              )
            })()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">필터</h2>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">카테고리</h3>
                <div className="space-y-2">
                  <Link
                    href={buildFilterUrl({ category: null })}
                    className={`block text-sm hover:text-blue-600 transition-colors ${
                      !params.category ? 'text-blue-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    전체
                  </Link>
                  {categories.map((topCat) => {
                    const isTopActive = params.category === topCat.id
                    return (
                      <div key={topCat.id}>
                        <Link
                          href={buildFilterUrl({ category: topCat.id })}
                          className={`block text-sm font-medium hover:text-blue-600 transition-colors ${
                            isTopActive ? 'text-blue-600 font-semibold' : 'text-gray-900'
                          }`}
                        >
                          {topCat.name}
                        </Link>
                        {topCat.children?.map((subCat: any) => (
                          <Link
                            key={subCat.id}
                            href={buildFilterUrl({ category: subCat.id })}
                            className={`block text-sm ml-3 hover:text-blue-600 transition-colors ${
                              params.category === subCat.id
                                ? 'text-blue-600 font-semibold'
                                : isTopActive
                                  ? 'text-blue-500'
                                  : 'text-gray-500'
                            }`}
                          >
                            └ {subCat.name}
                          </Link>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="font-semibold mb-3">정렬</h3>
                <div className="space-y-2">
                  <Link
                    href={buildFilterUrl({ sort: null })}
                    className={`block text-sm hover:text-blue-600 transition-colors ${
                      !params.sort ? 'text-blue-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    최신순
                  </Link>
                  <Link
                    href={buildFilterUrl({ sort: 'price_asc' })}
                    className={`block text-sm hover:text-blue-600 transition-colors ${
                      params.sort === 'price_asc'
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    가격 낮은순
                  </Link>
                  <Link
                    href={buildFilterUrl({ sort: 'price_desc' })}
                    className={`block text-sm hover:text-blue-600 transition-colors ${
                      params.sort === 'price_desc'
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    가격 높은순
                  </Link>
                  <Link
                    href={buildFilterUrl({ sort: 'name' })}
                    className={`block text-sm hover:text-blue-600 transition-colors ${
                      params.sort === 'name'
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    이름순
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                {params.search ? (
                  <>
                    <p className="text-gray-500 text-lg mb-4">
                      &ldquo;{params.search}&rdquo;에 대한 검색 결과가 없습니다.
                    </p>
                    <Link href="/products" className="text-blue-600 hover:underline">
                      전체 상품 보기
                    </Link>
                  </>
                ) : (
                  <p className="text-gray-500 text-lg">조건에 맞는 상품이 없습니다.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
