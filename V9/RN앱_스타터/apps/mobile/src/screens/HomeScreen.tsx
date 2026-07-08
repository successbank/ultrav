import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  activeCount,
  createTodo,
  toggleTodo,
  type Todo,
} from "@app/core";

// 공유 코어(@app/core)의 도메인 로직을 그대로 사용 — iOS·Android 동일 동작.
export function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>(() => [
    createTodo({ title: "V9 시작 가이드 읽기", id: "seed-1", now: 1 }),
    createTodo({ title: "EAS 로그인", id: "seed-2", now: 2 }),
  ]);
  const [title, setTitle] = useState("");

  const remaining = useMemo(() => activeCount(todos), [todos]);

  function add() {
    const t = title.trim();
    if (!t) return;
    setTodos((prev) => [createTodo({ title: t }), ...prev]);
    setTitle("");
  }

  function toggle(id: string) {
    setTodos((prev) => prev.map((t) => (t.id === id ? toggleTodo(t) : t)));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>할 일</Text>
      <Text style={styles.sub}>남은 항목 {remaining}개</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="새 할 일 입력"
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={add}
          returnKeyType="done"
        />
        <Pressable style={styles.addBtn} onPress={add} accessibilityRole="button">
          <Text style={styles.addBtnText}>추가</Text>
        </Pressable>
      </View>

      {todos.length === 0 ? (
        <Text style={styles.empty}>할 일이 없습니다. 위에서 추가하세요.</Text>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.item}
              onPress={() => toggle(item.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.done }}
            >
              <Text style={[styles.itemText, item.done && styles.done]}>
                {item.done ? "✓ " : "○ "}
                {item.title}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12, gap: 8 },
  h1: { fontSize: 28, fontWeight: "700" },
  sub: { fontSize: 14, color: "#666", marginBottom: 8 },
  row: { flexDirection: "row", gap: 8, marginBottom: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: "#1f6feb",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  addBtnText: { color: "white", fontWeight: "600" },
  item: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#eee" },
  itemText: { fontSize: 17 },
  done: { textDecorationLine: "line-through", color: "#999" },
  empty: { color: "#888", marginTop: 24, textAlign: "center" },
});
