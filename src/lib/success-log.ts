import type { SuccessLog } from "@/types/todo"

const STORAGE_KEY = "my-todo:success-logs"

function readAll(): SuccessLog[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SuccessLog[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(logs: SuccessLog[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
}

/** Records completions — ready to swap for a server success API later. */
export const successLogStore = {
  listByUser(userId: string): SuccessLog[] {
    return readAll()
      .filter((log) => log.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )
  },

  record(input: {
    todoId: string
    todoTitle: string
    userId: string
  }): SuccessLog {
    const entry: SuccessLog = {
      id: crypto.randomUUID(),
      todoId: input.todoId,
      todoTitle: input.todoTitle,
      userId: input.userId,
      completedAt: new Date().toISOString(),
    }
    writeAll([entry, ...readAll()])
    return entry
  },
}
