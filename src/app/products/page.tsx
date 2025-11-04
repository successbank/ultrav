import Link from 'next/link'
import prisma from '@/lib/prisma'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string
    brand?: string
    sort?: string
  }>
}) {
  const params = await searchParams

  // 필터 및 정렬 조건 구성
  const where: any = { isActive: true }

  if (params.category) {
    where.categoryId = params.category
  }

  if (params.brand) {
    where.brand = params.brand
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

  // 데이터 가져오기
  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    }),
  ])

  const uniqueBrands = brands.map((b) => b.brand)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">전체 상품</h1>
          <p className="text-gray-600">
            총 {products.length}개의 상품
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
                    href="/products"
                    className={`block text-sm hover:text-blue-600 transition-colors ${
                      !params.category ? 'text-blue-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    전체
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.id}`}
                      className={`block text-sm hover:text-blue-600 transition-colors ${
                        params.category === category.id
                          ? 'text-blue-600 font-semibold'
                          : 'text-gray-700'
                      }`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">브랜드</h3>
                <div className="space-y-2">
                  <Link
                    href="/products"
                    className={`block text-sm hover:text-blue-600 transition-colors ${
                      !params.brand ? 'text-blue-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    전체
                  </Link>
                  {uniqueBrands.map((brand) => (
                    <Link
                      key={brand}
                      href={`/products?brand=${brand}`}
                      className={`block text-sm hover:text-blue-600 transition-colors ${
                        params.brand === brand
                          ? 'text-blue-600 font-semibold'
                          : 'text-gray-700'
                      }`}
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="font-semibold mb-3">정렬</h3>
                <div className="space-y-2">
                  <Link
                    href="/products"
                    className={`block text-sm hover:text-blue-600 transition-colors ${
                      !params.sort ? 'text-blue-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    최신순
                  </Link>
                  <Link
                    href="/products?sort=price_asc"
                    className={`block text-sm hover:text-blue-600 transition-colors ${
                      params.sort === 'price_asc'
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    가격 낮은순
                  </Link>
                  <Link
                    href="/products?sort=price_desc"
                    className={`block text-sm hover:text-blue-600 transition-colors ${
                      params.sort === 'price_desc'
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    가격 높은순
                  </Link>
                  <Link
                    href="/products?sort=name"
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
                <p className="text-gray-500 text-lg">조건에 맞는 상품이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const discountedPrice = calculateDiscountedPrice(
                    product.price,
                    product.discount
                  )

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      {/* Product Image */}
                      <div className="aspect-square bg-gray-200 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          이미지 준비중
                        </div>
                        {product.discount > 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                        <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {product.name}
                        </h3>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-2">
                          {product.discount > 0 ? (
                            <>
                              <span className="text-lg font-bold">
                                {formatPrice(discountedPrice)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>

                        {/* Category */}
                        <p className="text-sm text-gray-500">{product.category.name}</p>

                        {/* Stock Status */}
                        {product.stock === 0 && (
                          <span className="inline-block mt-2 text-sm text-red-600 font-semibold">
                            품절
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
