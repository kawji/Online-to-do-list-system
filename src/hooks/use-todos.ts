"use client"

import { useSyncExternalStore } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { successLogStore } from "@/lib/success-log"
import { MAX_TODO_CHARS } from "@/lib/todo-limits"
import { todoStore } from "@/lib/todo-store"

function normalizeTitle(title: string) {
  return title.trim().slice(0, MAX_TODO_CHARS)
}

export function useTodos() {
  const { user, userId } = useAuth()

  const todos = useSyncExternalStore(
    todoStore.subscribe,
    () => todoStore.listByUser(userId),
    () => emptyTodos
  )

  function addTodo(title: string) {
    const value = normalizeTitle(title)
    if (!value) return null
    return todoStore.create({ title: value, userId })
  }

  function updateTodo(id: string, title: string) {
    const value = normalizeTitle(title)
    if (!value) return null
    return todoStore.update(id, userId, { title: value })
  }

  function deleteTodo(id: string) {
    return todoStore.remove(id, userId)
  }

  function completeTodo(id: string) {
    const current = todos.find((todo) => todo.id === id)
    if (!current || current.completed) return null

    const todo = todoStore.update(id, userId, { completed: true })
    if (todo) {
      successLogStore.record({
        todoId: todo.id,
        todoTitle: todo.title,
        userId,
      })
    }
    return todo
  }

  function reopenTodo(id: string) {
    return todoStore.update(id, userId, { completed: false })
  }

  return {
    todos,
    userId,
    user,
    addTodo,
    updateTodo,
    deleteTodo,
    completeTodo,
    reopenTodo,
  }
}

const emptyTodos: never[] = []
