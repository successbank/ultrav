import Link from 'next/link'
import { ShoppingCart, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Ultra 쇼핑몰
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/products"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              상품
            </Link>

            <Link
              href="/cart"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart size={20} />
              <span>장바구니</span>
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <User size={20} />
              <span>로그인</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
