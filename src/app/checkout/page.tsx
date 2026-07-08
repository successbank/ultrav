'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import AddressSearch, { type AddressData } from '@/components/AddressSearch'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { Package, Loader2 } from 'lucide-react'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    brand: string
    price: number
    discount: number
    imageUrl: string
    stock: number
    isActive: boolean
  }
}

interface Cart {
  id: string
  items: CartItem[]
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [addressData, setAddressData] = useState<AddressData>({
    zonecode: '',
    address: '',
    detailAddress: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    if (status === 'authenticated') {
      fetchCart()
      // 사용자 정보를 기본값으로 채우기
      if (session?.user?.name) {
        setRecipientName(session.user.name)
      }
    }
  }, [status, session, router])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        if (!data || data.items.length === 0) {
          router.push('/cart')
          return
        }
        setCart(data)
      }
    } catch (error) {
      console.error('장바구니 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    if (!cart) return 0
    return cart.items.reduce((total, item) => {
      const price = calculateDiscountedPrice(item.product.price, item.product.discount)
      return total + price * item.quantity
    }, 0)
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!recipientName.trim()) {
      newErrors.recipientName = '받는 분 이름을 입력해주세요'
    }
    if (!recipientPhone.trim()) {
      newErrors.recipientPhone = '연락처를 입력해주세요'
    } else if (!/^[\d-]{10,13}$/.test(recipientPhone.replace(/\s/g, ''))) {
      newErrors.recipientPhone = '올바른 연락처를 입력해주세요'
    }
    if (!addressData.zonecode || !addressData.address) {
      newErrors.shippingAddr = '주소 검색을 통해 주소를 입력해주세요'
    } else if (!addressData.detailAddress.trim()) {
      newErrors.shippingAddr = '상세주소를 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    if (submitting) return

    setSubmitting(true)

    try {
      const combinedAddr = `(${addressData.zonecode}) ${addressData.address}, ${addressData.detailAddress.trim()}`

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: recipientName.trim(),
          recipientPhone: recipientPhone.trim(),
          shippingAddr: combinedAddr,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push(
          `/checkout/complete?orderNumber=${data.order.orderNumber}&orderId=${data.order.id}`
        )
      } else {
        alert(data.error || '주문에 실패했습니다')
      }
    } catch (error) {
      console.error('주문 실패:', error)
      alert('주문 처리 중 오류가 발생했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">주문하기</h1>
          <div className="animate-pulse space-y-4">
            <Card className="p-6"><div className="h-48 bg-gray-200 rounded" /></Card>
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return null // 빈 장바구니일 경우 /cart로 리다이렉트 됨
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">주문하기</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 배송 정보 */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">배송 정보</h2>

              <div className="space-y-4">
                <Input
                  label="받는 분"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  error={errors.recipientName}
                  placeholder="받는 분 이름을 입력해주세요"
                />

                <Input
                  label="연락처"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  error={errors.recipientPhone}
                  placeholder="010-1234-5678"
                />

                <AddressSearch
                  value={addressData}
                  onChange={setAddressData}
                  error={errors.shippingAddr}
                />
              </div>
            </Card>
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">주문 요약</h2>

              <div className="space-y-3 mb-6">
                {cart.items.map((item) => {
                  const unitPrice = calculateDiscountedPrice(
                    item.product.price,
                    item.product.discount
                  )
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={16} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatPrice(unitPrice)} x {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(unitPrice * item.quantity)}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>총 금액</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    주문 처리중...
                  </>
                ) : (
                  `${formatPrice(calculateTotal())} 주문하기`
                )}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
