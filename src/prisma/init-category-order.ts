/**
 * 기존 카테고리에 sortOrder 초기값 부여 (1회 실행)
 * 실행: docker exec -it ultra_app npx tsx prisma/init-category-order.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // parentId별로 그룹핑하여 이름순 정렬 후 sortOrder 할당
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // parentId별로 그룹핑
  const groups = new Map<string, typeof categories>();
  for (const cat of categories) {
    const key = cat.parentId ?? "__root__";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(cat);
  }

  const updates: { id: string; sortOrder: number }[] = [];

  groups.forEach((cats) => {
    cats.forEach((cat, index) => {
      updates.push({ id: cat.id, sortOrder: index });
    });
  });

  // 트랜잭션으로 일괄 업데이트
  await prisma.$transaction(
    updates.map((u) =>
      prisma.category.update({
        where: { id: u.id },
        data: { sortOrder: u.sortOrder },
      }),
    ),
  );

  console.log(`${updates.length}개 카테고리의 sortOrder가 초기화되었습니다.`);

  // 결과 확인
  const result = await prisma.category.findMany({
    select: { name: true, level: true, sortOrder: true, parentId: true },
    orderBy: [{ level: "asc" }, { sortOrder: "asc" }],
  });
  console.table(result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
