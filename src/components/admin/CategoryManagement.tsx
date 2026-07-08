"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  ArrowRight,
  GripVertical,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Category = {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  description: string | null;
  level: number;
  sortOrder: number;
  parentId: string | null;
  parent?: { id: string; name: string } | null;
  _count: {
    products: number;
    children: number;
  };
};

type CategoryFormData = {
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  level: number;
  parentId: string;
};

type ProductInCategory = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
};

type DeleteModalState = {
  isOpen: boolean;
  category: Category | null;
  products: ProductInCategory[];
  targetCategoryId: string;
};

// --- 드래그 가능한 대분류 행 ---
function SortableTopCategory({
  category,
  children,
  onEdit,
  onDelete,
  loading,
  enMode = false,
}: {
  category: Category;
  children: React.ReactNode;
  onEdit: (cat: Category) => void;
  onDelete: (id: string, name: string) => void;
  loading: boolean;
  enMode?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none"
            tabIndex={0}
          >
            <GripVertical className="w-5 h-5" />
          </button>
          {enMode ? (
            <>
              {category.nameEn ? (
                <h3 className="text-lg font-bold text-gray-900">
                  {category.nameEn}
                </h3>
              ) : (
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                  영문명 미입력
                </span>
              )}
              <span className="text-sm text-gray-400">{category.name}</span>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-gray-900">
                {category.name}
              </h3>
              {category.nameEn && (
                <span className="text-sm text-gray-400">{category.nameEn}</span>
              )}
            </>
          )}
          <span className="text-sm text-gray-500">
            ({category._count.products}개 상품)
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(category)}
            disabled={loading}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600"
            onClick={() => onDelete(category.id, category.name)}
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}

// --- 드래그 가능한 중분류 행 ---
function SortableSubCategory({
  category,
  onEdit,
  onDelete,
  loading,
  enMode = false,
}: {
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (id: string, name: string) => void;
  loading: boolean;
  enMode?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
    >
      <div className="flex items-center gap-2">
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none"
          tabIndex={0}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        {enMode ? (
          <>
            {category.nameEn ? (
              <span className="text-gray-900">{category.nameEn}</span>
            ) : (
              <span className="inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                영문명 미입력
              </span>
            )}
            <span className="text-xs text-gray-400">{category.name}</span>
          </>
        ) : (
          <>
            <span className="text-gray-900">{category.name}</span>
            {category.nameEn && (
              <span className="text-xs text-gray-400">{category.nameEn}</span>
            )}
          </>
        )}
        <span className="text-xs text-gray-500">
          ({category._count.products}개 상품)
        </span>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(category)}
          disabled={loading}
        >
          <Edit className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600"
          onClick={() => onDelete(category.id, category.name)}
          disabled={loading}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

export default function CategoryManagement({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [langTab, setLangTab] = useState<"ko" | "en">("ko");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    nameEn: "",
    slug: "",
    description: "",
    level: 1,
    parentId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    category: null,
    products: [],
    targetCategoryId: "",
  });

  // DnD 센서: 8px 이동 후 드래그 시작 (클릭과 구분)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const topLevelCategories = categories
    .filter((c) => c.level === 1)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

  // --- reorder API 호출 ---
  const saveReorder = useCallback(
    async (items: { id: string; sortOrder: number }[]) => {
      try {
        const response = await fetch("/api/admin/categories/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        if (!response.ok) {
          throw new Error("순서 저장 실패");
        }
      } catch (err) {
        console.error("순서 저장 오류:", err);
        // 실패 시 서버에서 다시 불러오기
        refreshCategories();
      }
    },
    [],
  );

  // --- 대분류 드래그 종료 ---
  const handleTopDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setCategories((prev) => {
        const topCats = prev
          .filter((c) => c.level === 1)
          .sort(
            (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
          );

        const oldIndex = topCats.findIndex((c) => c.id === active.id);
        const newIndex = topCats.findIndex((c) => c.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;

        const reordered = arrayMove(topCats, oldIndex, newIndex);
        const updates = reordered.map((cat, i) => ({
          id: cat.id,
          sortOrder: i,
        }));

        // Optimistic: 업데이트된 sortOrder를 전체 categories에 반영
        const updateMap = new Map(updates.map((u) => [u.id, u.sortOrder]));
        const next = prev.map((c) =>
          updateMap.has(c.id) ? { ...c, sortOrder: updateMap.get(c.id)! } : c,
        );

        saveReorder(updates);
        return next;
      });
    },
    [saveReorder],
  );

  // --- 중분류 드래그 종료 (특정 parentId 그룹 내) ---
  const handleSubDragEnd = useCallback(
    (parentId: string) => (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setCategories((prev) => {
        const subCats = prev
          .filter((c) => c.parentId === parentId)
          .sort(
            (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
          );

        const oldIndex = subCats.findIndex((c) => c.id === active.id);
        const newIndex = subCats.findIndex((c) => c.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;

        const reordered = arrayMove(subCats, oldIndex, newIndex);
        const updates = reordered.map((cat, i) => ({
          id: cat.id,
          sortOrder: i,
        }));

        const updateMap = new Map(updates.map((u) => [u.id, u.sortOrder]));
        const next = prev.map((c) =>
          updateMap.has(c.id) ? { ...c, sortOrder: updateMap.get(c.id)! } : c,
        );

        saveReorder(updates);
        return next;
      });
    },
    [saveReorder],
  );

  // 카테고리 목록 새로고침
  const refreshCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("카테고리 목록 새로고침 실패:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      slug: "",
      description: "",
      level: 1,
      parentId: "",
    });
    setEditingCategory(null);
    setIsFormOpen(false);
    setError("");
  };

  const handleOpenAddForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameEn: category.nameEn || "",
      slug: category.slug,
      description: category.description || "",
      level: category.level,
      parentId: category.parentId || "",
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          nameEn: formData.nameEn || null,
          slug: formData.slug,
          description: formData.description || null,
          level: formData.level,
          parentId: formData.parentId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "요청에 실패했습니다.");
      }

      // 성공 시 카테고리 목록 새로고침
      await refreshCategories();
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    setLoading(true);
    setError("");

    try {
      // 먼저 카테고리 정보와 연결된 상품 조회
      const categoryResponse = await fetch(`/api/admin/categories/${id}`);
      const categoryData = await categoryResponse.json();

      if (!categoryResponse.ok) {
        throw new Error(
          categoryData.error || "카테고리 정보를 불러올 수 없습니다.",
        );
      }

      // 하위 카테고리가 있는 경우
      if (categoryData._count.children > 0) {
        alert(
          "하위 카테고리가 있어 삭제할 수 없습니다. 하위 카테고리를 먼저 삭제해주세요.",
        );
        return;
      }

      // 연결된 상품이 있는 경우 모달 표시
      if (categoryData._count.products > 0) {
        setDeleteModal({
          isOpen: true,
          category: { ...categoryData, _count: categoryData._count },
          products: categoryData.products,
          targetCategoryId: "",
        });
        return;
      }

      // 연결된 상품이 없는 경우 바로 삭제 확인
      if (!confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) {
        return;
      }

      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "삭제에 실패했습니다.");
      }

      // 성공 시 카테고리 목록 새로고침
      await refreshCategories();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveProductsAndDelete = async () => {
    if (!deleteModal.category || !deleteModal.targetCategoryId) {
      alert("이동할 카테고리를 선택해주세요.");
      return;
    }

    setLoading(true);

    try {
      // 상품 이동
      const moveResponse = await fetch(
        `/api/admin/categories/${deleteModal.category.id}/move-products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetCategoryId: deleteModal.targetCategoryId,
          }),
        },
      );

      const moveData = await moveResponse.json();

      if (!moveResponse.ok) {
        throw new Error(moveData.error || "상품 이동에 실패했습니다.");
      }

      // 카테고리 삭제
      const deleteResponse = await fetch(
        `/api/admin/categories/${deleteModal.category.id}`,
        {
          method: "DELETE",
        },
      );

      const deleteData = await deleteResponse.json();

      if (!deleteResponse.ok) {
        throw new Error(deleteData.error || "카테고리 삭제에 실패했습니다.");
      }

      // 성공 - 모달 닫고 카테고리 목록 새로고침
      setDeleteModal({
        isOpen: false,
        category: null,
        products: [],
        targetCategoryId: "",
      });
      await refreshCategories();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      category: null,
      products: [],
      targetCategoryId: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">카테고리 관리</h1>
          <p className="text-gray-600 mt-2">
            총 {categories.length}개의 카테고리 · 드래그하여 순서 변경
          </p>
        </div>
        <Button onClick={handleOpenAddForm} disabled={loading}>
          <Plus className="w-4 h-4 mr-2" />
          카테고리 추가
        </Button>
      </div>

      {/* 한국어 / 영어 탭 */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        <button
          onClick={() => setLangTab("ko")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            langTab === "ko"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          한국어
        </button>
        <button
          onClick={() => setLangTab("en")}
          className={`flex items-center gap-1.5 px-6 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            langTab === "en"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Globe className="w-4 h-4" />
          영어 (English)
        </button>
        {langTab === "en" && (
          <span className="ml-auto text-sm text-gray-500 pb-2">
            영문명 입력{" "}
            <span className="font-semibold text-green-600">
              {categories.filter((c) => c.nameEn).length}
            </span>
            {" / "}미입력{" "}
            <span className="font-semibold text-red-600">
              {categories.filter((c) => !c.nameEn).length}
            </span>
          </span>
        )}
      </div>

      {/* 카테고리 폼 */}
      {isFormOpen && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingCategory ? "카테고리 수정" : "새 카테고리 추가"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  카테고리 이름 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  영문명
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) =>
                    setFormData({ ...formData, nameEn: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={loading}
                  placeholder="영문 사이트에 노출될 카테고리명 (미입력 시 국문명 사용)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  슬러그 (URL용) *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  required
                  disabled={loading}
                  placeholder="예: ultra-call-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    레벨 *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        level: Number(e.target.value),
                        parentId: "",
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    required
                    disabled={loading}
                  >
                    <option value={1}>1 (대분류)</option>
                    <option value={2}>2 (중분류)</option>
                    <option value={3}>3 (소분류)</option>
                  </select>
                </div>

                {formData.level > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      상위 카테고리
                    </label>
                    <select
                      value={formData.parentId}
                      onChange={(e) =>
                        setFormData({ ...formData, parentId: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                      disabled={loading}
                    >
                      <option value="">선택하세요</option>
                      {categories
                        .filter((c) => c.level === formData.level - 1)
                        .map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={loading}
                >
                  취소
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "처리중..." : editingCategory ? "수정" : "추가"}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* 카테고리 목록 - DnD 적용 */}
      <Card>
        <div className="p-6">
          <DndContext
            id="top-categories"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleTopDragEnd}
          >
            <SortableContext
              items={topLevelCategories.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {topLevelCategories.map((category) => {
                  const subCategories = categories
                    .filter((c) => c.parentId === category.id)
                    .sort(
                      (a, b) =>
                        a.sortOrder - b.sortOrder ||
                        a.name.localeCompare(b.name),
                    );

                  return (
                    <SortableTopCategory
                      key={category.id}
                      category={category}
                      onEdit={handleOpenEditForm}
                      onDelete={handleDelete}
                      loading={loading}
                      enMode={langTab === "en"}
                    >
                      {subCategories.length > 0 && (
                        <DndContext
                          id={`sub-${category.id}`}
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleSubDragEnd(category.id)}
                        >
                          <SortableContext
                            items={subCategories.map((c) => c.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="ml-6 space-y-2">
                              {subCategories.map((sub) => (
                                <SortableSubCategory
                                  key={sub.id}
                                  category={sub}
                                  onEdit={handleOpenEditForm}
                                  onDelete={handleDelete}
                                  loading={loading}
                                  enMode={langTab === "en"}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      )}
                    </SortableTopCategory>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </Card>

      {/* 상품 이동 모달 */}
      {deleteModal.isOpen && deleteModal.category && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    카테고리 삭제 불가
                  </h2>
                  <p className="text-sm text-gray-600">
                    &quot;{deleteModal.category.name}&quot; 카테고리에{" "}
                    {deleteModal.products.length}개의 상품이 있습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <h3 className="font-medium text-gray-900 mb-3">
                연결된 상품 목록
              </h3>
              <div className="space-y-2 mb-6">
                {deleteModal.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.price.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  상품을 다른 카테고리로 이동 후 삭제
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                      <p className="font-medium text-red-700">
                        {deleteModal.category.name}
                      </p>
                      <p className="text-xs text-red-500">삭제 예정</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <select
                      value={deleteModal.targetCategoryId}
                      onChange={(e) =>
                        setDeleteModal({
                          ...deleteModal,
                          targetCategoryId: e.target.value,
                        })
                      }
                      className="w-full px-3 py-3 border rounded-lg"
                      disabled={loading}
                    >
                      <option value="">이동할 카테고리 선택</option>
                      {categories
                        .filter((c) => c.id !== deleteModal.category?.id)
                        .map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.level > 1 ? "└ " : ""}
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={closeDeleteModal}
                disabled={loading}
              >
                취소
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleMoveProductsAndDelete}
                disabled={loading || !deleteModal.targetCategoryId}
              >
                {loading ? "처리 중..." : "상품 이동 후 카테고리 삭제"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
