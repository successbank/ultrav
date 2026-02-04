import Link from 'next/link'
import { User } from 'lucide-react'
import { auth } from '@/lib/auth'
import UserDropdown from '@/components/ui/UserDropdown'
import HeaderClient from '@/components/HeaderClient'

export default async function Header() {
  const session = await auth()

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            ultra V
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/products"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              상품
            </Link>

            <HeaderClient userId={session?.user?.id} />

            {session?.user ? (
              <UserDropdown
                userName={session.user.name || session.user.email || '사용자'}
                userEmail={session.user.email || undefined}
                userRole={session.user.role}
              />
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <User size={20} />
                <span>로그인</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
