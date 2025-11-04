import Link from 'next/link'
import { Building2, Users, Target, Heart, MapPin, Clock } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Ultra 쇼핑몰</h1>
            <p className="text-xl">
              최고의 품질과 합리적인 가격으로<br />
              고객의 만족을 최우선으로 하는 쇼핑몰
            </p>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">회사 소개</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Ultra 쇼핑몰은 2020년에 설립된 온라인 패션 전문 쇼핑몰입니다.<br />
                고품질의 상품과 합리적인 가격으로 고객 여러분께 최상의 쇼핑 경험을 제공하기 위해 노력하고 있습니다.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">5+</div>
                <div className="text-gray-600">상품 수</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
                <div className="text-gray-600">카테고리</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
                <div className="text-gray-600">브랜드</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-600">고객 만족</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">핵심 가치</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="text-blue-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">고객 중심</h3>
                  <p className="text-gray-600">
                    고객의 만족을 최우선으로 생각하며, 언제나 고객의 입장에서 생각합니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Heart className="text-blue-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">품질 보증</h3>
                  <p className="text-gray-600">
                    엄격한 품질 관리를 통해 최고 품질의 상품만을 선별하여 제공합니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="text-blue-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">신뢰와 투명성</h3>
                  <p className="text-gray-600">
                    투명한 거래와 정직한 서비스로 고객의 신뢰를 얻기 위해 노력합니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="text-blue-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">지속적인 혁신</h3>
                  <p className="text-gray-600">
                    끊임없는 연구와 개발을 통해 더 나은 서비스를 제공하기 위해 노력합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">연혁</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-24 text-right">
                  <div className="text-2xl font-bold text-blue-600">2025</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-2">온라인 플랫폼 고도화</h3>
                  <p className="text-gray-600">
                    AI 기반 상품 추천 시스템 도입 및 모바일 앱 출시
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-24 text-right">
                  <div className="text-2xl font-bold text-blue-600">2023</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-2">브랜드 확장</h3>
                  <p className="text-gray-600">
                    자체 브랜드 5개 론칭 및 카테고리 다각화
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-24 text-right">
                  <div className="text-2xl font-bold text-blue-600">2021</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-2">서비스 확대</h3>
                  <p className="text-gray-600">
                    당일 배송 서비스 시작 및 무료 반품 정책 도입
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-24 text-right">
                  <div className="text-2xl font-bold text-blue-600">2020</div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-2">Ultra 쇼핑몰 설립</h3>
                  <p className="text-gray-600">
                    온라인 패션 쇼핑몰 Ultra 정식 오픈
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">오시는 길</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">주소</h3>
                    <p className="text-gray-600">
                      서울특별시 강남구 테헤란로 123<br />
                      Ultra 빌딩 5층
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">영업시간</h3>
                    <p className="text-gray-600">
                      평일: 09:00 - 18:00<br />
                      주말 및 공휴일: 휴무
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MapPin size={48} className="mx-auto mb-2" />
                  <p>지도 위치</p>
                  <p className="text-sm">서울특별시 강남구 테헤란로 123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">궁금한 점이 있으신가요?</h2>
          <p className="text-xl mb-8">언제든지 문의해 주세요. 친절하게 답변해 드리겠습니다.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              문의하기
            </Link>
            <Link
              href="/faq"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              자주 묻는 질문
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
