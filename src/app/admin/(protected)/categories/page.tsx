import prisma from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true,
          children: true
        }
      },
      parent: true
    },
    orderBy: [
      { level: 'asc' },
      { name: 'asc' }
    ]
  })

  const topLevelCategories = categories.filter(c => c.level === 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">카테고리 관리</h1>
          <p className="text-gray-600 mt-2">총 {categories.length}개의 카테고리</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          카테고리 추가
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <div className="space-y-4">
            {topLevelCategories.map((category) => {
              const subCategories = categories.filter(c => c.parentId === category.id)

              return (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                      <span className="text-sm text-gray-500">
                        ({category._count.products}개 상품)
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {subCategories.length > 0 && (
                    <div className="ml-6 space-y-2">
                      {subCategories.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900">{sub.name}</span>
                            <span className="text-xs text-gray-500">
                              ({sub._count.products}개 상품)
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}
