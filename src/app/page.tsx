import Link from 'next/link'
import prisma from '@/lib/prisma'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'

export default async function Home() {
  // 상품 목록 가져오기
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    take: 12,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Ultra 쇼핑몰에 오신 것을 환영합니다
          </h1>
          <p className="text-xl mb-8">
            최고 품질의 패션 아이템을 합리적인 가격에 만나보세요
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            쇼핑 시작하기
          </Link>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">신상품</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const discountedPrice = calculateDiscountedPrice(product.price, product.discount)

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    이미지 준비중
                  </div>
                  {product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                  <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {product.discount > 0 ? (
                      <>
                        <span className="text-lg font-bold">{formatPrice(discountedPrice)}</span>
                        <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {product.category.name}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
