'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, HelpCircle } from 'lucide-react'
import Accordion from '@/components/ui/Accordion'
import Button from '@/components/ui/Button'

const faqCategories = [
  {
    id: 'order',
    name: '주문',
    icon: '🛒',
    faqs: [
      {
        id: 'order-1',
        question: '주문은 어떻게 하나요?',
        answer:
          '원하시는 상품을 선택하신 후 장바구니에 담아주세요. 장바구니에서 수량을 확인하신 후 "결제하기" 버튼을 클릭하시면 주문이 완료됩니다. 로그인이 필요하며, 배송 정보와 결제 수단을 입력하셔야 합니다.',
      },
      {
        id: 'order-2',
        question: '주문 취소는 어떻게 하나요?',
        answer:
          '주문 후 배송 준비 단계 이전까지는 마이페이지에서 직접 취소하실 수 있습니다. 배송 준비 중이거나 배송이 시작된 경우에는 고객센터(1588-0000)로 문의해주세요.',
      },
      {
        id: 'order-3',
        question: '주문 내역은 어디서 확인하나요?',
        answer:
          '로그인 후 마이페이지 > 주문내역에서 확인하실 수 있습니다. 주문번호, 주문일자, 배송상태 등을 확인하실 수 있으며, 주문 상세 정보도 볼 수 있습니다.',
      },
    ],
  },
  {
    id: 'shipping',
    name: '배송',
    icon: '🚚',
    faqs: [
      {
        id: 'shipping-1',
        question: '배송 기간은 얼마나 걸리나요?',
        answer:
          '결제 완료 후 평균 2-3일 이내에 배송됩니다. 영업일 기준으로 산정되며, 주말 및 공휴일은 제외됩니다. 일부 지역은 추가 배송 시간이 소요될 수 있습니다.',
      },
      {
        id: 'shipping-2',
        question: '배송비는 얼마인가요?',
        answer:
          '현재 모든 주문에 대해 무료 배송을 제공하고 있습니다. 단, 도서산간 지역의 경우 추가 배송비가 발생할 수 있으며, 이 경우 주문 시 안내 메시지가 표시됩니다.',
      },
      {
        id: 'shipping-3',
        question: '배송 추적은 어떻게 하나요?',
        answer:
          '마이페이지 > 주문내역에서 주문번호를 클릭하시면 배송 추적 정보를 확인하실 수 있습니다. 배송이 시작되면 택배사와 송장번호가 표시되며, 실시간 배송 상태를 확인하실 수 있습니다.',
      },
      {
        id: 'shipping-4',
        question: '배송지 변경은 가능한가요?',
        answer:
          '배송 준비 단계 이전까지는 마이페이지에서 배송지를 변경하실 수 있습니다. 배송이 시작된 이후에는 변경이 불가능하니, 가능한 빨리 고객센터로 연락해주세요.',
      },
    ],
  },
  {
    id: 'return',
    name: '반품/교환',
    icon: '↩️',
    faqs: [
      {
        id: 'return-1',
        question: '반품 절차는 어떻게 되나요?',
        answer:
          '마이페이지 > 주문내역에서 반품을 원하시는 상품의 "반품 신청" 버튼을 클릭해주세요. 반품 사유를 선택하시면 반품 접수가 완료되며, 수거 일정을 안내받으실 수 있습니다. 상품 수거 후 검수를 거쳐 환불이 진행됩니다.',
      },
      {
        id: 'return-2',
        question: '교환은 어떻게 하나요?',
        answer:
          '사이즈나 색상 교환을 원하시는 경우, 마이페이지에서 교환 신청을 해주세요. 교환 상품이 재고가 있는 경우 교환이 가능하며, 재고가 없는 경우 반품 후 재주문을 권장드립니다.',
      },
      {
        id: 'return-3',
        question: '환불은 언제 되나요?',
        answer:
          '반품 상품 수거 후 검수 완료 시점부터 영업일 기준 3-5일 이내에 환불이 진행됩니다. 결제하신 수단에 따라 환불 처리 기간이 다를 수 있으며, 신용카드의 경우 카드사 승인 취소 일정에 따라 달라질 수 있습니다.',
      },
      {
        id: 'return-4',
        question: '반품이 불가능한 경우가 있나요?',
        answer:
          '고객님의 단순 변심으로 인한 반품의 경우 상품 수령 후 7일 이내에만 가능합니다. 상품 택 제거, 착용 흔적, 세탁, 수선 등으로 재판매가 불가능한 경우 반품이 제한될 수 있습니다.',
      },
    ],
  },
  {
    id: 'payment',
    name: '결제',
    icon: '💳',
    faqs: [
      {
        id: 'payment-1',
        question: '어떤 결제 수단을 사용할 수 있나요?',
        answer:
          '신용카드, 체크카드, 계좌이체, 무통장입금, 카카오페이, 네이버페이 등 다양한 결제 수단을 지원합니다. 결제 단계에서 원하시는 결제 방법을 선택하실 수 있습니다.',
      },
      {
        id: 'payment-2',
        question: '결제 실패는 왜 발생하나요?',
        answer:
          '카드 한도 초과, 잔액 부족, 카드사 시스템 점검 등 다양한 이유로 결제가 실패할 수 있습니다. 결제 실패 시 다른 결제 수단을 이용하시거나, 카드사에 문의하여 결제 가능 여부를 확인해주세요.',
      },
      {
        id: 'payment-3',
        question: '영수증 발행은 어떻게 하나요?',
        answer:
          '마이페이지 > 주문내역에서 해당 주문의 영수증을 출력하실 수 있습니다. 현금영수증이나 세금계산서가 필요하신 경우 고객센터로 문의해주시면 발급해드리겠습니다.',
      },
    ],
  },
  {
    id: 'member',
    name: '회원',
    icon: '👤',
    faqs: [
      {
        id: 'member-1',
        question: '회원가입은 필수인가요?',
        answer:
          '상품 조회는 비회원도 가능하지만, 주문 및 결제를 위해서는 회원가입이 필요합니다. 회원가입 시 다양한 혜택과 포인트를 받으실 수 있습니다.',
      },
      {
        id: 'member-2',
        question: '로그인이 안 돼요.',
        answer:
          '이메일 주소와 비밀번호를 정확히 입력했는지 확인해주세요. 비밀번호를 잊으신 경우 로그인 페이지의 "비밀번호 찾기"를 통해 재설정하실 수 있습니다.',
      },
      {
        id: 'member-3',
        question: '비밀번호를 잊어버렸어요.',
        answer:
          '로그인 페이지에서 "비밀번호 찾기"를 클릭하신 후, 가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크가 발송됩니다. 링크를 통해 새로운 비밀번호를 설정하실 수 있습니다.',
      },
      {
        id: 'member-4',
        question: '회원 탈퇴는 어떻게 하나요?',
        answer:
          '마이페이지 > 회원정보 수정에서 회원 탈퇴를 하실 수 있습니다. 탈퇴 시 보유하고 계신 포인트는 소멸되며, 주문 내역은 일정 기간 보관 후 삭제됩니다.',
      },
    ],
  },
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = selectedCategory
    ? faqCategories.filter((cat) => cat.id === selectedCategory)
    : faqCategories

  const searchedFaqs = searchQuery
    ? filteredFaqs.map((category) => ({
        ...category,
        faqs: category.faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((category) => category.faqs.length > 0)
    : filteredFaqs

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <HelpCircle size={64} />
            </div>
            <h1 className="text-4xl font-bold mb-4">자주 묻는 질문</h1>
            <p className="text-xl mb-8">
              고객님들이 자주 문의하시는 내용을 모았습니다.<br />
              궁금하신 내용을 빠르게 찾아보세요!
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="질문을 검색하세요..."
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              전체
            </button>
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          {searchedFaqs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">
                검색 결과가 없습니다.
              </p>
              <p className="text-gray-400">
                다른 검색어로 시도해보시거나, 고객센터로 문의해주세요.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {searchedFaqs.map((category) => (
                <div key={category.id}>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.name}
                  </h2>
                  <Accordion items={category.faqs} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            문제가 해결되지 않았나요?
          </h2>
          <p className="text-lg mb-6">
            고객센터를 통해 문의해 주시면 빠르게 도와드리겠습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                문의하기
              </Button>
            </Link>
            <a href="tel:1588-0000">
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
              >
                전화 상담: 1588-0000
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
