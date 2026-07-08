import type { Metadata } from 'next'
import { Package, Truck, RefreshCw, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: '배송/반품 안내',
}

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">배송/반품/환불 안내</h1>

        <div className="space-y-6">
          {/* 배송 안내 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Truck className="w-6 h-6 text-blue-600" />
              배송 안내
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    배송비
                  </h3>
                  <p>기본 배송비: <span className="font-semibold">3,000원</span></p>
                  <p>50,000원 이상 구매 시 <span className="text-blue-600 font-semibold">무료배송</span></p>
                  <p className="text-sm text-gray-500 mt-1">제주도/도서산간 지역: 추가 3,000원</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    배송 기간
                  </h3>
                  <p>결제 완료 후 <span className="font-semibold">2~3일</span> (영업일 기준)</p>
                  <p className="text-sm text-gray-500 mt-1">재고 상황 및 택배사 사정에 따라 지연 가능</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <p><span className="font-semibold">택배사:</span> CJ대한통운, 우체국택배 등</p>
                <p className="mt-1"><span className="font-semibold">배송 조회:</span> 마이페이지 &gt; 주문내역에서 운송장 번호 확인 가능</p>
              </div>
            </div>
          </div>

          {/* 교환/반품 안내 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-orange-600" />
              교환/반품 안내
            </h2>
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-5">
                <h3 className="font-semibold text-green-800 mb-3">교환/반품 가능한 경우</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
                    <span>상품 수령 후 <span className="font-semibold">7일 이내</span> 신청</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
                    <span>제품에 하자가 있거나 주문한 상품과 다른 경우</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
                    <span>배송 중 파손된 경우 (수령 후 사진 촬영 권장)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-5">
                <h3 className="font-semibold text-red-800 mb-3">교환/반품 불가능한 경우</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5 shrink-0">&#10007;</span>
                    <span>포장 개봉 후 사용 또는 설치가 완료된 경우</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5 shrink-0">&#10007;</span>
                    <span>고객의 책임 있는 사유로 상품이 훼손된 경우</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5 shrink-0">&#10007;</span>
                    <span>시간 경과로 재판매가 곤란한 경우</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5 shrink-0">&#10007;</span>
                    <span>의료기기의 경우 멸균 포장이 개봉된 경우</span>
                  </li>
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-5">
                <h3 className="font-semibold mb-3">교환/반품 배송비</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between items-center">
                    <span>고객 변심으로 인한 교환/반품</span>
                    <span className="font-semibold text-orange-700">왕복 배송비 6,000원</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>상품 하자 또는 오배송</span>
                    <span className="font-semibold text-blue-600">무료 (판매자 부담)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 환불 안내 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">환불 안내</h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-gray-50 rounded-lg p-5">
                <h3 className="font-semibold mb-3">환불 처리 기간</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>신용카드 결제</span>
                    <span className="font-semibold">취소 후 3~5 영업일</span>
                  </li>
                  <li className="flex justify-between">
                    <span>무통장 입금</span>
                    <span className="font-semibold">반품 확인 후 3 영업일 이내</span>
                  </li>
                  <li className="flex justify-between">
                    <span>간편결제 (카카오페이/네이버페이)</span>
                    <span className="font-semibold">취소 후 즉시~3 영업일</span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-gray-500">
                * 환불은 원 결제수단으로 처리됩니다. 카드사 사정에 따라 처리 기간이 다를 수 있습니다.
              </p>
            </div>
          </div>

          {/* 고객센터 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-4">문의하기</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-base mb-2">고객센터</p>
                <p className="text-xl font-bold text-blue-600">1588-0000</p>
                <p className="text-gray-500 mt-1">평일 09:00 - 18:00 (주말/공휴일 휴무)</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-base mb-2">이메일 문의</p>
                <p className="text-xl font-bold text-blue-600">support@ultra.com</p>
                <p className="text-gray-500 mt-1">24시간 접수 가능 (순차 답변)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
