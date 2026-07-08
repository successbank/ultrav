import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import AddToCartButton from '@/components/AddToCartButton'
import AddToWishlistButton from '@/components/AddToWishlistButton'
import ShareButton from '@/components/ShareButton'
import ProductImageGallery from '@/components/ProductImageGallery'
import ReviewForm from '@/components/reviews/ReviewForm'
import ReviewList from '@/components/reviews/ReviewList'
import StarRating from '@/components/reviews/StarRating'
import { ChevronDown, Package, Truck, RefreshCw } from 'lucide-react'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true, description: true, imageUrl: true, price: true, discount: true },
  })

  if (!product) return { title: '상품을 찾을 수 없습니다' }

  const discountedPrice = calculateDiscountedPrice(product.price, product.discount)

  return {
    title: product.name,
    description: product.description || `${product.name} - Ultra 쇼핑몰에서 만나보세요.`,
    openGraph: {
      title: product.name,
      description: product.description || `${product.name} - Ultra 쇼핑몰`,
      ...(product.imageUrl && { images: [{ url: product.imageUrl }] }),
    },
    other: {
      'product:price:amount': String(discountedPrice),
      'product:price:currency': 'KRW',
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          where: { status: 'APPROVED' }, // 승인된 리뷰만 표시
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ])

  if (!product) {
    notFound()
  }

  const discountedPrice = calculateDiscountedPrice(product.price, product.discount)
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || '',
    image: product.imageUrl || undefined,
    offers: {
      '@type': 'Offer',
      price: discountedPrice,
      priceCurrency: 'KRW',
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    ...(averageRating > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount: product.reviews.length,
      },
    }),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600">
                홈
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-blue-600">
                상품
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/products?category=${product.categoryId}`}
                className="hover:text-blue-600"
              >
                {product.category.name}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">카테고리</h2>

              {/* Category Filter */}
              <div className="mb-6">
                <div className="space-y-2">
                  <Link
                    href="/products"
                    className="block text-sm hover:text-blue-600 transition-colors text-gray-700"
                  >
                    전체
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.id}`}
                      className={`block text-sm hover:text-blue-600 transition-colors ${
                        product.categoryId === category.id
                          ? 'text-blue-600 font-semibold'
                          : 'text-gray-700'
                      }`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-lg shadow-sm p-8">
          {/* Product Images with Lightbox */}
          <ProductImageGallery
            productName={product.name}
            mainImage={product.imageUrl}
            additionalImages={product.images}
            discount={product.discount}
          />

          {/* Product Info */}
          <div>
            {/* Product Name */}
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-2xl ${
                        star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">
                  {averageRating.toFixed(1)} ({product.reviews.length}개 리뷰)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="border-t border-b py-6 mb-6">
              {product.discount > 0 ? (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-blue-600">
                      {formatPrice(discountedPrice)}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <p className="text-red-600 font-semibold">
                    {formatPrice(product.price - discountedPrice)} 할인
                  </p>
                </div>
              ) : (
                <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h2 className="font-semibold mb-2">상품 설명</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-green-600 font-semibold">재고 있음 ({product.stock}개)</p>
              ) : (
                <p className="text-red-600 font-semibold">품절</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <AddToCartButton product={product} />
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="w-24 h-full">
                  <AddToWishlistButton
                    productId={product.id}
                    productName={product.name}
                  />
                </div>
                <div className="w-24 h-full">
                  <ShareButton
                    url={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5635'}/products/${product.id}`}
                    title={product.name}
                    text={`${product.name} - ${product.brand}`}
                  />
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-semibold mb-4">상품 정보</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex">
                  <dt className="w-24 text-gray-600">카테고리</dt>
                  <dd className="text-gray-900">{product.category.name}</dd>
                </div>
                <div className="flex">
                  <dt className="w-24 text-gray-600">상품 ID</dt>
                  <dd className="text-gray-900 text-xs">{product.id}</dd>
                </div>
              </dl>
            </div>
          </div>
            </div>

            {/* Product Details Accordion Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* 상세 설명 */}
          <details className="group border-b" open>
            <summary className="flex items-center justify-between cursor-pointer list-none px-8 py-6 hover:bg-gray-50 transition-colors">
              <h2 className="text-2xl font-bold">상세 설명</h2>
              <ChevronDown className="w-6 h-6 text-gray-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-8 pb-8">
              {/* 상세 내용 (HTML) */}
              {product.detailContent ? (
                <div
                  className="prose prose-sm max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: product.detailContent }}
                />
              ) : (
                <div className="prose prose-sm max-w-none mb-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              {/* 주요 특징 */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="text-blue-600">✦</span>
                  주요 특징
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 mt-1 text-lg">✓</span>
                    <span className="text-gray-700">프리미엄 품질의 소재와 완벽한 마감 처리</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 mt-1 text-lg">✓</span>
                    <span className="text-gray-700">세련된 디자인과 뛰어난 실용성의 조화</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 mt-1 text-lg">✓</span>
                    <span className="text-gray-700">오래 사용할 수 있는 우수한 내구성</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 mt-1 text-lg">✓</span>
                    <span className="text-gray-700">합리적인 가격과 높은 가성비</span>
                  </li>
                </ul>
              </div>

              {/* 사용 방법 */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">사용 방법</h3>
                <ol className="space-y-3 list-decimal list-inside text-gray-700">
                  <li className="pl-2">제품 포장을 주의깊게 개봉하고 내용물을 확인합니다</li>
                  <li className="pl-2">사용 전 제품의 상태와 구성품을 점검합니다</li>
                  <li className="pl-2">제품의 특성과 용도에 맞게 적절히 사용합니다</li>
                  <li className="pl-2">사용 후에는 권장하는 보관 방법을 준수합니다</li>
                </ol>
              </div>
            </div>
          </details>

          {/* 배송 정보 */}
          <details className="group border-b">
            <summary className="flex items-center justify-between cursor-pointer list-none px-8 py-6 hover:bg-gray-50 transition-colors">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Truck className="w-6 h-6 text-blue-600" />
                배송 정보
              </h2>
              <ChevronDown className="w-6 h-6 text-gray-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-8 pb-8">
              <div className="bg-blue-50 rounded-lg p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <Package className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold mb-2">배송비</p>
                    <p className="text-gray-700">
                      기본 배송비 3,000원 | 50,000원 이상 구매 시 <span className="text-blue-600 font-semibold">무료배송</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Truck className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold mb-2">배송 기간</p>
                    <p className="text-gray-700">
                      주문 후 <span className="font-semibold">2-3일</span> (영업일 기준)
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      * 재고 상황 및 택배사 사정에 따라 지연될 수 있습니다
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Package className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold mb-2">배송 지역</p>
                    <p className="text-gray-700">전국 배송 가능</p>
                    <p className="text-sm text-gray-600 mt-1">
                      * 제주도 및 도서산간 지역은 추가 배송비가 발생합니다
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">택배사:</span> CJ대한통운, 우체국택배 등
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium text-gray-800">배송 조회:</span> 마이페이지 &gt; 주문내역에서 확인 가능
                </p>
              </div>
            </div>
          </details>

          {/* 교환/반품 안내 */}
          <details className="group border-b">
            <summary className="flex items-center justify-between cursor-pointer list-none px-8 py-6 hover:bg-gray-50 transition-colors">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <RefreshCw className="w-6 h-6 text-orange-600" />
                교환/반품 안내
              </h2>
              <ChevronDown className="w-6 h-6 text-gray-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-8 pb-8">
              <div className="space-y-6">
                {/* 교환/반품 가능 */}
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 text-green-800">
                    교환/반품 가능한 경우
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>상품 수령 후 <span className="font-semibold">7일 이내</span></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>제품에 하자가 있거나 주문한 상품과 다른 경우</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>배송 중 파손된 경우</span>
                    </li>
                  </ul>
                </div>

                {/* 교환/반품 불가 */}
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 text-red-800">
                    교환/반품이 불가능한 경우
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span>포장을 개봉하여 사용 또는 설치가 완료된 경우</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span>고객의 책임 있는 사유로 상품이 훼손된 경우</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span>시간 경과로 재판매가 곤란할 정도로 상품 가치가 감소한 경우</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span>복제 가능한 상품의 포장을 훼손한 경우</span>
                    </li>
                  </ul>
                </div>

                {/* 비용 안내 */}
                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">배송비 안내</h3>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between items-center">
                      <span>고객 변심으로 인한 교환/반품</span>
                      <span className="font-semibold text-orange-700">왕복 배송비 6,000원</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>상품 하자 또는 오배송</span>
                      <span className="font-semibold text-blue-600">무료</span>
                    </div>
                  </div>
                </div>

                {/* 고객센터 */}
                <div className="bg-gray-100 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-3">문의하기</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-medium text-gray-800">고객센터:</span> 1588-0000
                    </p>
                    <p className="text-gray-600">운영시간: 평일 09:00 - 18:00 (주말/공휴일 휴무)</p>
                    <p className="mt-3">
                      <span className="font-medium text-gray-800">이메일:</span> support@ultra.com
                    </p>
                    <p className="text-gray-600">24시간 접수 가능 (순차적으로 답변 드립니다)</p>
                  </div>
                </div>
              </div>
            </div>
          </details>

          {/* 고객 리뷰 */}
          <details className="group" open>
            <summary className="flex items-center justify-between cursor-pointer list-none px-8 py-6 hover:bg-gray-50 transition-colors">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                고객 리뷰 ({product.reviews.length})
                {averageRating > 0 && (
                  <div className="flex items-center gap-2 text-base font-normal">
                    <StarRating rating={averageRating} readonly size="sm" showValue />
                  </div>
                )}
              </h2>
              <ChevronDown className="w-6 h-6 text-gray-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-8 pb-8 space-y-8">
              {/* 리뷰 작성 폼 */}
              <div>
                <ReviewForm productId={product.id} />
              </div>

              {/* 리뷰 목록 */}
              <div>
                <ReviewList
                  productId={product.id}
                  initialReviews={product.reviews.slice(0, 5)}
                  initialTotal={product.reviews.length}
                  initialHasMore={product.reviews.length > 5}
                />
              </div>
            </div>
          </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
