"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2 } from "lucide-react";
import ImageUploader from "./ImageUploader";
import RichTextEditor from "./RichTextEditor";

interface Product {
  id: string;
  name: string;
  nameEn?: string | null;
  brand: string;
  description: string | null;
  descriptionEn?: string | null;
  detailContent?: string | null;
  detailContentEn?: string | null;
  moq?: string | null;
  isFeaturedEn?: boolean;
  price: number;
  discount: number;
  categoryId: string;
  imageUrl: string | null;
  images: string[];
  stock: number;
  isActive: boolean;
  isNew: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface ProductEditFormProps {
  product?: Product;
  categories: Category[];
}

export default function ProductEditForm({
  product,
  categories,
}: ProductEditFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(product);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 초기 이미지 배열 (기존 imageUrl + images 배열 합치기)
  const initialImages = product
    ? [product.imageUrl || "", ...product.images].filter(Boolean)
    : [];

  const [formData, setFormData] = useState({
    name: product?.name || "",
    nameEn: product?.nameEn || "",
    brand: product?.brand || "",
    description: product?.description || "",
    descriptionEn: product?.descriptionEn || "",
    detailContent: product?.detailContent || "",
    detailContentEn: product?.detailContentEn || "",
    moq: product?.moq || "",
    isFeaturedEn: product?.isFeaturedEn || false,
    price: product?.price ?? 0,
    discount: product?.discount ?? 0,
    categoryId: product?.categoryId || categories[0]?.id || "",
    stock: product?.stock ?? 0,
    isActive: product?.isActive ?? true,
    isNew: product?.isNew ?? false,
    images: initialImages,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImagesChange = (images: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images,
    }));
  };

  const handleDetailContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      detailContent: content,
    }));
  };

  const handleDetailContentEnChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      detailContentEn: content,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = isEditMode
        ? `/api/admin/products/${product!.id}`
        : "/api/admin/products";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: formData.images[0] || null,
          images: formData.images.slice(1), // 첫 번째 제외 나머지
        }),
      });

      if (response.ok) {
        alert(isEditMode ? "상품이 수정되었습니다" : "상품이 등록되었습니다");
        router.push("/admin/products");
        router.refresh();
      } else {
        const error = await response.json();
        alert(
          error.error ||
            (isEditMode
              ? "상품 수정에 실패했습니다"
              : "상품 등록에 실패했습니다"),
        );
      }
    } catch (error) {
      console.error(isEditMode ? "상품 수정 실패:" : "상품 등록 실패:", error);
      alert(
        isEditMode ? "상품 수정에 실패했습니다" : "상품 등록에 실패했습니다",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    if (
      !confirm(
        "정말로 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("상품이 삭제되었습니다");
        router.push("/admin/products");
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || "상품 삭제에 실패했습니다");
      }
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      alert("상품 삭제에 실패했습니다");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 상품 이미지 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상품 이미지 (최대 5장)
          </label>
          <ImageUploader
            images={formData.images}
            onChange={handleImagesChange}
            maxImages={5}
          />
          <p className="mt-2 text-sm text-gray-500">
            첫 번째 이미지가 메인 이미지로 사용됩니다
          </p>
        </div>

        {/* 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 상품명 */}
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              상품명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 브랜드 */}
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              브랜드 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              카테고리 <span className="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 간단한 설명 */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            간단한 설명
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="상품 목록에 표시될 간단한 설명을 입력하세요"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 상세 내용 (리치 텍스트 에디터) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상세 내용
          </label>
          <RichTextEditor
            value={formData.detailContent}
            onChange={handleDetailContentChange}
            placeholder="상품의 상세 설명, 사용 방법, 특징 등을 입력하세요"
          />
        </div>

        {/* 영문 사이트 정보 */}
        <div className="border border-gray-200 rounded-lg p-6 space-y-6 bg-gray-50">
          <h3 className="text-base font-semibold text-gray-900">
            영문 사이트 정보
          </h3>

          <div>
            <label
              htmlFor="nameEn"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              영문 상품명
            </label>
            <input
              type="text"
              id="nameEn"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              placeholder="영문 사이트에 노출될 상품명 (미입력 시 국문 상품명 사용)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="descriptionEn"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              영문 간단 설명
            </label>
            <textarea
              id="descriptionEn"
              name="descriptionEn"
              value={formData.descriptionEn}
              onChange={handleChange}
              rows={3}
              placeholder="영문 상품 목록에 표시될 간단한 설명을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              영문 상세 내용
            </label>
            <RichTextEditor
              value={formData.detailContentEn}
              onChange={handleDetailContentEnChange}
              placeholder="영문 상품 상세 설명, 사용 방법, 특징 등을 입력하세요"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="moq"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                MOQ (최소 주문 수량)
              </label>
              <input
                type="text"
                id="moq"
                name="moq"
                value={formData.moq}
                onChange={handleChange}
                placeholder="예: 100 Vials"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3 pt-8">
              <input
                type="checkbox"
                id="isFeaturedEn"
                name="isFeaturedEn"
                checked={formData.isFeaturedEn}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="isFeaturedEn"
                className="text-sm font-medium text-gray-700"
              >
                영문 메인 Featured Products에 노출
              </label>
            </div>
          </div>
        </div>

        {/* 가격 및 할인 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              가격 (원) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="discount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              할인율 (%)
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              재고 수량 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 판매 상태 */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="isActive"
            className="text-sm font-medium text-gray-700"
          >
            판매 활성화
          </label>
        </div>

        {/* 신상품 표시 */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isNew"
            name="isNew"
            checked={formData.isNew}
            onChange={handleChange}
            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
          />
          <label htmlFor="isNew" className="text-sm font-medium text-gray-700">
            신상품으로 표시 (홈페이지 노출)
          </label>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            <span>
              {isSaving ? "저장 중..." : isEditMode ? "저장" : "등록"}
            </span>
          </button>

          {isEditMode && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-6 py-3 flex items-center gap-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={20} />
              <span>{isDeleting ? "삭제 중..." : "삭제"}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
