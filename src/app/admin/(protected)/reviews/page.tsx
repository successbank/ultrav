import prisma from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Star, Trash2 } from "lucide-react"
import Link from "next/link"

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      user: true,
      product: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">리뷰 관리</h1>
        <p className="text-gray-600 mt-2">총 {reviews.length}개의 리뷰</p>
      </div>

      <Card>
        <div className="divide-y divide-gray-200">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      href={`/products/${review.product.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {review.product.name}
                    </Link>
                    <span className="text-sm text-gray-500">·</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{review.user.name}</span>
                    <span>·</span>
                    <span>{new Date(review.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">등록된 리뷰가 없습니다.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
