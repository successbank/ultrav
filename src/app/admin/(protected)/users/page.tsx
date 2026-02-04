import prisma from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Eye, Shield, User as UserIcon, Building2, Briefcase } from "lucide-react"
import Link from "next/link"
import { UserRole } from "@prisma/client"

// 사용자 역할별 표시 정보
const getRoleInfo = (role: UserRole) => {
  switch (role) {
    case 'ADMIN':
      return {
        label: '최고관리자',
        color: 'bg-purple-100 text-purple-800',
        icon: Shield
      }
    case 'HOSPITAL':
      return {
        label: '병원',
        color: 'bg-blue-100 text-blue-800',
        icon: Building2
      }
    case 'SALES_MANAGER':
      return {
        label: '영업매니저',
        color: 'bg-green-100 text-green-800',
        icon: Briefcase
      }
    default: // USER
      return {
        label: '일반회원',
        color: 'bg-gray-100 text-gray-800',
        icon: UserIcon
      }
  }
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          orders: true,
          reviews: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
        <p className="text-gray-600 mt-2">총 {users.length}명의 사용자</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">사용자</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">연락처</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">역할</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">주문 수</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">가입일</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name || '이름 없음'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                  <td className="px-6 py-4">
                    {(() => {
                      const roleInfo = getRoleInfo(user.role)
                      const RoleIcon = roleInfo.icon
                      return (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${roleInfo.color}`}>
                          <RoleIcon className="w-3 h-3" />
                          {roleInfo.label}
                        </span>
                      )
                    })()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user._count.orders}건</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/users/${user.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
