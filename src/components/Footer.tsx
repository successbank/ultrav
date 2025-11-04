import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Ultra 쇼핑몰</h3>
            <p className="text-gray-400">
              최고의 쇼핑 경험을 제공합니다
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">고객 서비스</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white">
                  회사 소개
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  자주 묻는 질문
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">연락처</h4>
            <ul className="space-y-2 text-gray-400">
              <li>이메일: contact@ultra.com</li>
              <li>전화: 1588-0000</li>
              <li>주소: 서울특별시 강남구 테헤란로 123</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Ultra Shopping Mall. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
