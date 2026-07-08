import Link from "next/link";

// 영문 B2B 사이트 푸터
export default function EnFooter() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">Ultra V Co., Ltd.</h3>
            <p className="text-gray-400 text-sm mb-4">
              Global manufacturer of PDO threads &amp; collagen stimulators.
            </p>
            <dl className="text-gray-400 text-sm space-y-1.5">
              <div className="flex gap-2">
                <dt className="shrink-0">Main Tel.</dt>
                <dd>+82-2-539-3450</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0">Fax</dt>
                <dd>+82-2-517-3438</dd>
              </div>
            </dl>
          </div>

          {/* 링크 */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-gray-400 text-sm">
              <li>
                <Link
                  href="/en/products"
                  className="hover:text-white transition-colors"
                >
                  Product
                </Link>
              </li>
              <li>
                <Link
                  href="/en/inquiry"
                  className="hover:text-white transition-colors"
                >
                  Inquiry
                </Link>
              </li>
              <li>
                <Link
                  href="/en/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/en/notice"
                  className="hover:text-white transition-colors"
                >
                  Notice
                </Link>
              </li>
            </ul>
          </div>

          {/* 멤버십 안내 */}
          <div>
            <h4 className="font-semibold mb-4">Membership</h4>
            <ul className="space-y-2.5 text-gray-400 text-sm">
              <li>
                <Link
                  href="/en/register"
                  className="hover:text-white transition-colors"
                >
                  Membership Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 구분선 + 저작권 */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Ultra V Co., Ltd. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
