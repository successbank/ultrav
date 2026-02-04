import prisma from "@/lib/prisma"
import CategoryManagement from "@/components/admin/CategoryManagement"

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

  return <CategoryManagement initialCategories={categories} />
}
