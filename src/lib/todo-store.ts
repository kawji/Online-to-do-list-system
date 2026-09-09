import type { CreateTodoInput, Todo, UpdateTodoInput } from "@/types/todo"

const STORAGE_KEY = "my-todo:todos"
const listeners = new Set<() => void>()
const cacheByUser = new Map<string, Todo[]>()

function emit() {
  cacheByUser.clear()
  listeners.forEach((listener) => listener())
}

function readAll(): Todo[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Todo[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(todos: Todo[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  emit()
}

function sortTodos(todos: Todo[]) {
  return [...todos].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

/** Local store shaped like a future API (filter by userId for login). */
export const todoStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  listByUser(userId: string): Todo[] {
    const cached = cacheByUser.get(userId)
    if (cached) return cached

    const list = sortTodos(
      readAll().filter((todo) => todo.userId === userId)
    )
    cacheByUser.set(userId, list)
    return list
  },

  create(input: CreateTodoInput): Todo {
    const now = new Date().toISOString()
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      completed: false,
      userId: input.userId,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    }
    writeAll([todo, ...readAll()])
    return todo
  },

  update(id: string, userId: string, input: UpdateTodoInput): Todo | null {
    const todos = readAll()
    const index = todos.findIndex(
      (todo) => todo.id === id && todo.userId === userId
    )
    if (index === -1) return null

    const current = todos[index]
    const now = new Date().toISOString()
    const completed =
      input.completed === undefined ? current.completed : input.completed

    const next: Todo = {
      ...current,
      title: input.title?.trim() ?? current.title,
      completed,
      updatedAt: now,
      completedAt: completed ? (current.completedAt ?? now) : null,
    }

    todos[index] = next
    writeAll(todos)
    return next
  },

  remove(id: string, userId: string): boolean {
    const todos = readAll()
    const next = todos.filter(
      (todo) => !(todo.id === id && todo.userId === userId)
    )
    if (next.length === todos.length) return false
    writeAll(next)
    return true
  },
}
