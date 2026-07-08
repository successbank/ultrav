import { describe, it, expect } from "vitest";
import { createTodo, toggleTodo, activeCount, TodoSchema } from "./index";

describe("todo domain", () => {
  it("createTodo는 유효한 Todo를 만든다", () => {
    const t = createTodo({ title: "  우유 사기  ", id: "a", now: 1 });
    expect(t).toEqual({ id: "a", title: "우유 사기", done: false, createdAt: 1 });
    expect(() => TodoSchema.parse(t)).not.toThrow();
  });

  it("빈 제목은 거부한다", () => {
    expect(() => createTodo({ title: "   " })).toThrow();
  });

  it("toggleTodo는 done을 뒤집고 원본을 바꾸지 않는다", () => {
    const a = createTodo({ title: "x", id: "1", now: 1 });
    const b = toggleTodo(a);
    expect(b.done).toBe(true);
    expect(a.done).toBe(false);
  });

  it("activeCount는 미완료 개수를 센다", () => {
    const list = [
      createTodo({ title: "a", id: "1", now: 1 }),
      toggleTodo(createTodo({ title: "b", id: "2", now: 2 })),
      createTodo({ title: "c", id: "3", now: 3 }),
    ];
    expect(activeCount(list)).toBe(2);
  });
});
