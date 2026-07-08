import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">이용약관</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제1조 (목적)</h2>
            <p>
              이 약관은 Ultra 쇼핑몰(이하 &quot;회사&quot;)이 운영하는 인터넷 쇼핑몰에서 제공하는 서비스(이하 &quot;서비스&quot;)를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제2조 (정의)</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>&quot;쇼핑몰&quot;이라 함은 회사가 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 또는 용역을 거래할 수 있도록 설정한 가상의 영업장을 말합니다.</li>
              <li>&quot;이용자&quot;라 함은 쇼핑몰에 접속하여 이 약관에 따라 쇼핑몰이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
              <li>&quot;회원&quot;이라 함은 쇼핑몰에 회원등록을 한 자로서, 계속적으로 쇼핑몰이 제공하는 서비스를 이용할 수 있는 자를 말합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제3조 (약관의 명시와 개정)</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</li>
              <li>회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</li>
              <li>회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제4조 (서비스의 제공 및 변경)</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>회사는 다음과 같은 업무를 수행합니다: 재화 또는 용역에 대한 정보 제공 및 구매계약의 체결, 구매계약이 체결된 재화 또는 용역의 배송, 기타 회사가 정하는 업무.</li>
              <li>회사는 재화 또는 용역의 품절 또는 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 제공할 재화 또는 용역의 내용을 변경할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제5조 (서비스의 중단)</h2>
            <p>
              회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제6조 (회원가입)</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</li>
              <li>회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제7조 (회원 탈퇴 및 자격 상실)</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>회원은 회사에 언제든지 탈퇴를 요청할 수 있으며, 회사는 즉시 회원탈퇴를 처리합니다.</li>
              <li>회원이 허위 정보를 기재한 경우, 다른 사람의 서비스 이용을 방해하거나 정보를 도용하는 경우 등에는 회원 자격이 상실될 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제8조 (구매신청)</h2>
            <p>
              이용자는 쇼핑몰에서 다음 또는 이와 유사한 방법에 의하여 구매를 신청하며, 회사는 이용자가 구매신청을 함에 있어서 다음의 각 내용을 알기 쉽게 제공하여야 합니다: 재화 등의 검색 및 선택, 받는 사람의 성명/주소/전화번호/이메일 주소 입력, 약관내용/환불 조건 등에 대한 확인, 결제방법의 선택.
            </p>
          </section>

          <div className="pt-6 border-t text-sm text-gray-500">
            <p>시행일: 2024년 1월 1일</p>
          </div>
        </div>
      </div>
    </div>
  )
}
