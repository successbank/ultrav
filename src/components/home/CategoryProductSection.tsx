import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

interface Product {
  id: string
  name: string
  price: number
  discount: number
  imageUrl: string | null
  stock: number
  isNew: boolean
  category: { name: string }
  averageRating?: number
  reviewCount?: number
}

interface CategoryProductSectionProps {
  title: string
  categoryId: string
  products: Product[]
}

export default function CategoryProductSection({ title, categoryId, products }: CategoryProductSectionProps) {
  if (products.length === 0) return null

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Link
          href={`/products?category=${categoryId}`}
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          더보기 &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  )
}
