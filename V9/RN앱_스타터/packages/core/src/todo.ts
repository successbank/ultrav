import { z } from "zod";

/** 공유 도메인 모델 — iOS·Android·web이 동일하게 사용 (UI 비의존). */
export const TodoSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  done: z.boolean(),
  createdAt: z.number().int(),
});

export type Todo = z.infer<typeof TodoSchema>;

/** 입력을 검증해 Todo 생성 (잘못된 입력은 throw). */
export function createTodo(input: { title: string; id?: string; now?: number }): Todo {
  const todo: Todo = {
    id: input.id ?? cryptoRandomId(),
    title: input.title.trim(),
    done: false,
    createdAt: input.now ?? Date.now(),
  };
  return TodoSchema.parse(todo);
}

/** 완료 토글 (불변). */
export function toggleTodo(todo: Todo): Todo {
  return { ...todo, done: !todo.done };
}

/** 미완료 개수. */
export function activeCount(todos: readonly Todo[]): number {
  return todos.filter((t) => !t.done).length;
}

function cryptoRandomId(): string {
  // RN/Web/Node 모두에서 동작하는 단순 ID (운영에선 uuid 권장).
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
