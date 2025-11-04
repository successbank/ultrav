import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  User as UserIcon,
  ShoppingBag,
  Star,
  Clock
} from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params

  // 사용자 정보 조회
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          product: true
        }
      },
      _count: {
        select: {
          orders: true,
          reviews: true
        }
      }
    }
  })

  if (!user) {
    notFound()
  }

  // 총 주문 금액 계산
  const totalOrderAmount = await prisma.order.aggregate({
    where: {
      userId: id,
      status: { in: ['PAID', 'PREPARING', 'SHIPPED', 'DELIVERED'] }
    },
    _sum: {
      totalAmount: true
    }
  })

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">사용자 상세</h1>
            <p className="text-gray-600 mt-1">회원 정보 및 활동 내역</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 기본 정보 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 프로필 카드 */}
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.name || '이름 없음'}</h2>
              <p className="text-gray-500 mt-1">{user.email}</p>

              <div className="mt-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${
                  user.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role === 'ADMIN' && <Shield className="w-4 h-4" />}
                  {user.role === 'ADMIN' ? '관리자' : '일반 사용자'}
                </span>
              </div>
            </div>
          </Card>

          {/* 연락처 정보 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">연락처 정보</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">이메일</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">전화번호</p>
                  <p className="text-gray-900">{user.phone || '-'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">주소</p>
                  <p className="text-gray-900">{user.address || '-'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">가입일</p>
                  <p className="text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">마지막 수정</p>
                  <p className="text-gray-900">
                    {new Date(user.updatedAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 오른쪽: 활동 내역 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 활동 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">총 주문</p>
                  <p className="text-2xl font-bold text-gray-900">{user._count.orders}건</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">₩</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">총 주문 금액</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(totalOrderAmount._sum.totalAmount || 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">작성 리뷰</p>
                  <p className="text-2xl font-bold text-gray-900">{user._count.reviews}개</p>
                </div>
              </div>
            </Card>
          </div>

          {/* 최근 주문 내역 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">최근 주문 내역</h3>
              {user._count.orders > 5 && (
                <Link href={`/admin/orders?userId=${user.id}`}>
                  <Button variant="ghost" size="sm">
                    전체 보기
                  </Button>
                </Link>
              )}
            </div>

            {user.orders.length > 0 ? (
              <div className="space-y-4">
                {user.orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">주문번호: {order.orderNumber}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'PREPARING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'PAID' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'PENDING' ? '결제 대기' :
                           order.status === 'PAID' ? '결제 완료' :
                           order.status === 'PREPARING' ? '배송 준비' :
                           order.status === 'SHIPPED' ? '배송중' :
                           order.status === 'DELIVERED' ? '배송 완료' :
                           order.status === 'CANCELLED' ? '취소' : '환불'}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <span key={item.id}>
                          {item.product.name} x {item.quantity}
                          {idx < Math.min(order.items.length, 2) - 1 && ', '}
                        </span>
                      ))}
                      {order.items.length > 2 && ` 외 ${order.items.length - 2}개`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                주문 내역이 없습니다.
              </div>
            )}
          </Card>

          {/* 최근 리뷰 내역 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">최근 리뷰</h3>
              {user._count.reviews > 5 && (
                <Link href={`/admin/reviews?userId=${user.id}`}>
                  <Button variant="ghost" size="sm">
                    전체 보기
                  </Button>
                </Link>
              )}
            </div>

            {user.reviews.length > 0 ? (
              <div className="space-y-4">
                {user.reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{review.product.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">{review.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                작성한 리뷰가 없습니다.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
