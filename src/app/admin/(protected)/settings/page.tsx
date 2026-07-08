import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Settings as SettingsIcon, Save, Image, ChevronRight, Layers } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">시스템 설정</h1>
        <p className="text-gray-600 mt-2">쇼핑몰 시스템 설정 관리</p>
      </div>

      {/* 사이트 기본 정보 */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5" />
          사이트 기본 정보
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사이트 이름
            </label>
            <Input defaultValue="Ultra 쇼핑몰" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사이트 설명
            </label>
            <Input defaultValue="최고의 온라인 쇼핑 경험을 제공하는 Ultra 쇼핑몰" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연락처 이메일
            </label>
            <Input type="email" defaultValue="contact@ultra.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전화번호
            </label>
            <Input defaultValue="1588-0000" />
          </div>

          <Button>
            <Save className="w-4 h-4 mr-2" />
            저장
          </Button>
        </div>
      </Card>

      {/* 메인페이지 캐러셀 관리 */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Image className="w-5 h-5" />
          메인페이지 캐러셀 관리
        </h2>
        <p className="text-gray-600 mb-4">
          홈페이지 메인 슬라이드 배너를 관리합니다. 이미지, 제목, 링크를 설정할 수 있습니다.
        </p>
        <Link href="/admin/settings/carousels">
          <Button variant="outline" className="w-full justify-between">
            캐러셀 관리하기
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </Card>

      {/* 레이어 팝업 관리 */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          레이어 팝업 관리
        </h2>
        <p className="text-gray-600 mb-4">
          홈페이지 방문 시 표시되는 레이어 팝업을 관리합니다. 이미지, 노출 기간, 크기를 설정할 수 있습니다.
        </p>
        <Link href="/admin/settings/popups">
          <Button variant="outline" className="w-full justify-between">
            팝업 관리하기
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </Card>

      {/* 배송 설정 */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">배송 설정</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기본 배송비 (원)
            </label>
            <Input type="number" defaultValue="3000" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              무료 배송 최소 금액 (원)
            </label>
            <Input type="number" defaultValue="50000" />
          </div>

          <Button>
            <Save className="w-4 h-4 mr-2" />
            저장
          </Button>
        </div>
      </Card>

      {/* 추가 설정 안내 */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <p className="text-blue-800">
          추가적인 시스템 설정 기능 (SMTP, 알림, 정책 관리 등)은 향후 개발 예정입니다.
        </p>
      </Card>
    </div>
  )
}
