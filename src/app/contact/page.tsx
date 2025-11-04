'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'PRODUCT',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          type: 'PRODUCT',
          subject: '',
          message: '',
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Submit error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">문의하기</h1>
            <p className="text-xl">
              궁금한 점이 있으신가요? 언제든지 문의해 주세요.<br />
              빠르고 정확하게 답변해 드리겠습니다.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">연락처 정보</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">전화</h3>
                    <p className="text-gray-600">1588-0000</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">이메일</h3>
                    <p className="text-gray-600">contact@ultra.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">주소</h3>
                    <p className="text-gray-600">
                      서울특별시 강남구<br />
                      테헤란로 123
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">영업시간</h3>
                    <p className="text-gray-600">
                      평일: 09:00 - 18:00<br />
                      주말: 휴무
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t">
                <p className="text-sm text-gray-600 mb-4">
                  자주 묻는 질문을 먼저 확인해보세요!
                </p>
                <Link href="/faq">
                  <Button variant="outline" size="sm" className="w-full">
                    FAQ 보기
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">문의 작성</h2>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-semibold">문의가 성공적으로 접수되었습니다!</p>
                  <p className="text-green-700 text-sm mt-1">
                    빠른 시일 내에 답변 드리겠습니다.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-semibold">문의 접수에 실패했습니다.</p>
                  <p className="text-red-700 text-sm mt-1">
                    다시 시도해주세요.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="이름 *"
                    type="text"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />

                  <Input
                    label="이메일 *"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="전화번호"
                    type="tel"
                    placeholder="010-0000-0000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />

                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      문의 유형 *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="PRODUCT">상품 문의</option>
                      <option value="SHIPPING">배송 문의</option>
                      <option value="RETURN">반품/교환</option>
                      <option value="OTHER">기타</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="제목 *"
                  type="text"
                  placeholder="문의 제목을 입력해주세요"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                />

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    문의 내용 *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="문의 내용을 상세히 작성해주세요 (최소 10자)"
                    required
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    {isSubmitting ? '접수 중...' : '문의 접수'}
                  </Button>
                </div>

                <p className="text-sm text-gray-500">
                  * 표시는 필수 입력 항목입니다.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
