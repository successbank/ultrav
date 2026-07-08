import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import EnProductImageGallery from "@/components/en/EnProductImageGallery";
import EnAddToCartButton from "@/components/en/EnAddToCartButton";
import EnAddToWishlistButton from "@/components/en/EnAddToWishlistButton";
import EnShareButton from "@/components/en/EnShareButton";
import { Star } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      name: true,
      nameEn: true,
      descriptionEn: true,
      description: true,
      imageUrl: true,
    },
  });

  if (!product) return { title: "Product Not Found" };

  const displayName = product.nameEn ?? product.name;

  return {
    title: displayName,
    description:
      product.descriptionEn ??
      product.description ??
      `${displayName} - ULTRAVMALL`,
    openGraph: {
      title: displayName,
      description: product.descriptionEn ?? product.description ?? displayName,
      ...(product.imageUrl && { images: [{ url: product.imageUrl }] }),
    },
  };
}

export default async function EnProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        where: { status: "APPROVED" },
        select: { rating: true },
      },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const displayName = product.nameEn ?? product.name;
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <Link href="/en" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/en/products" className="hover:text-blue-600">
                Product
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{displayName}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-lg shadow-sm p-8 mb-8">
          <EnProductImageGallery
            productName={displayName}
            mainImage={product.imageUrl}
            additionalImages={product.images}
            discount={0}
          />

          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              {displayName}
            </h1>
            <p className="text-gray-500 mb-4">{product.brand}</p>

            {averageRating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={
                        star <= Math.round(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">
                  {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>
            )}

            {product.moq && (
              <p className="text-sm font-medium text-gray-700 mb-4">
                MOQ: <span className="font-semibold">{product.moq}</span>
              </p>
            )}

            {(product.descriptionEn ?? product.description) && (
              <div className="mb-6 border-t border-b py-6">
                <h2 className="font-semibold mb-2 text-gray-900">
                  Product Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.descriptionEn ?? product.description}
                </p>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-green-600 font-semibold">
                  In Stock ({product.stock})
                </p>
              ) : (
                <p className="text-red-600 font-semibold">Out of Stock</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <EnAddToCartButton product={product} />
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="w-24 h-full">
                  <EnAddToWishlistButton
                    productId={product.id}
                    productName={displayName}
                  />
                </div>
                <div className="w-24 h-full">
                  <EnShareButton
                    url={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5635"}/en/products/${product.id}`}
                    title={displayName}
                    text={`${displayName} - ${product.brand}`}
                  />
                </div>
              </div>
            </div>

            <Link
              href={`/en/inquiry?product=${encodeURIComponent(displayName)}`}
              className="inline-flex items-center justify-center w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold text-lg py-4 rounded-lg transition-colors"
            >
              Request Quotation
            </Link>

            <div className="mt-8 pt-8 border-t">
              <h3 className="font-semibold mb-4 text-gray-900">
                Product Information
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex">
                  <dt className="w-32 text-gray-600">Category</dt>
                  <dd className="text-gray-900">
                    {product.category.nameEn ?? product.category.name}
                  </dd>
                </div>
                <div className="flex">
                  <dt className="w-32 text-gray-600">Product ID</dt>
                  <dd className="text-gray-900 text-xs">{product.id}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {(product.detailContentEn ?? product.detailContent) && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Product Details
            </h2>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: product.detailContentEn ?? product.detailContent ?? "",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
