import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import ProductEditForm from '@/components/admin/ProductEditForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AdminProductEditPage({ params }: PageProps) {
  const session = await auth()
  const { id } = await params

  // 관리자 권한 확인
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // 상품 정보 가져오기
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  })

  if (!product) {
    notFound()
  }

  // 모든 카테고리 가져오기
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>상품 목록으로 돌아가기</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            상품 수정
          </h1>
          <p className="text-gray-600">상품 정보를 수정합니다</p>
        </div>

        {/* 상품 수정 폼 */}
        <ProductEditForm product={product} categories={categories} />
      </div>
    </div>
  )
}
