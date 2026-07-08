import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. 개인정보의 처리 목적</h2>
            <p>Ultra 쇼핑몰(이하 &quot;회사&quot;)은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5">
              <li>회원 가입 및 관리: 회원 가입의사 확인, 본인 식별, 회원자격 유지/관리</li>
              <li>재화 또는 서비스 제공: 물품배송, 서비스 제공, 구매 및 요금 결제, 콘텐츠 제공</li>
              <li>고충처리: 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락/통지, 처리결과 통보</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. 수집하는 개인정보 항목</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-4 py-2 text-left font-semibold">구분</th>
                    <th className="border px-4 py-2 text-left font-semibold">수집 항목</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">필수</td>
                    <td className="border px-4 py-2">이름, 이메일, 비밀번호, 연락처</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">선택</td>
                    <td className="border px-4 py-2">배송 주소, 병원명(병원 고객)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">자동 수집</td>
                    <td className="border px-4 py-2">IP 주소, 접속 로그, 서비스 이용 기록</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. 개인정보의 보유 및 이용기간</h2>
            <p>
              회사는 법령에 따른 개인정보 보유/이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유/이용기간 내에서 개인정보를 처리/보유합니다.
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1.5">
              <li>회원 정보: 회원 탈퇴 시까지 (단, 관계 법령에 따라 일정 기간 보관)</li>
              <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
              <li>접속에 관한 로그 기록: 3개월 (통신비밀보호법)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. 개인정보의 제3자 제공</h2>
            <p>
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 이용자가 사전에 동의한 경우, 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우에는 예외로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. 개인정보의 파기</h2>
            <p>
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다. 전자적 파일 형태의 정보는 복구 및 재생되지 않도록 안전하게 삭제하고, 종이에 기록된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. 정보주체의 권리/의무</h2>
            <p>이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리 정지 요구</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. 개인정보 보호책임자</h2>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p><span className="font-semibold">성명:</span> 홍길동</p>
              <p><span className="font-semibold">직책:</span> 개인정보 보호책임자</p>
              <p><span className="font-semibold">이메일:</span> privacy@ultra.com</p>
              <p><span className="font-semibold">전화:</span> 1588-0000</p>
            </div>
          </section>

          <div className="pt-6 border-t text-sm text-gray-500">
            <p>시행일: 2024년 1월 1일</p>
          </div>
        </div>
      </div>
    </div>
  )
}
