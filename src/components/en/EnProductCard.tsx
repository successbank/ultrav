import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

interface EnProductCardProps {
  id: string;
  name: string;
  nameEn: string | null;
  imageUrl: string | null;
  isNew: boolean;
  moq: string | null;
  averageRating?: number;
  reviewCount?: number;
}

export default function EnProductCard({
  id,
  name,
  nameEn,
  imageUrl,
  isNew,
  moq,
  averageRating = 0,
  reviewCount = 0,
}: EnProductCardProps) {
  const displayName = nameEn ?? name;

  return (
    <div className="group bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
      <Link href={`/en/products/${id}`} className="block">
        {/* Image */}
        <div className="aspect-square bg-gray-200 relative overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={displayName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
              Image coming soon
            </div>
          )}

          {isNew && (
            <div className="absolute top-2 left-2 z-20">
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                NEW
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 pb-0">
          <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {displayName}
          </h3>

          {moq && <p className="text-sm text-gray-500 mb-2">MOQ: {moq}</p>}

          {averageRating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">({reviewCount})</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 pt-2 mt-auto">
        <Link
          href={`/en/inquiry?product=${encodeURIComponent(displayName)}`}
          className="inline-flex items-center justify-center w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          Request Quotation
        </Link>
      </div>
    </div>
  );
}
