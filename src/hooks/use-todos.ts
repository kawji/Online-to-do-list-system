"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { successLogStore } from "@/lib/success-log"
import { MAX_TODO_CHARS } from "@/lib/todo-limits"
import { todoStore } from "@/lib/todo-store"

import { CreateTodo ,UpdateTodo ,DeleteTodo ,CompletedTodo ,ReopenTodo } from "@/app/actions/todo"

function normalizeTitle(title: string) {
  return title.trim().slice(0, MAX_TODO_CHARS)
}

export function useTodos() {
  const { user, userId } = useAuth()

  const subscribeWithUser = useCallback(
    (listener:() => void) => {
      return todoStore.subscribe(userId,listener)
    },[userId]
  )

  const getSnapsShot = useMemo(() => {
    return () => todoStore.listByUser(userId)
  },[userId])

  const emptyTodos: any[] = []
  function getServerSnapshot() {
    return emptyTodos
  }

  const todos = useSyncExternalStore(
    subscribeWithUser,
    getSnapsShot,
    getServerSnapshot
  )

  function addTodo(title: string) {
    const value = normalizeTitle(title)
    if (!value) return null
    return CreateTodo(title);
  }

  function updateTodo(id: string, title: string) {
    const value = normalizeTitle(title)
    if (!value) return null
    return UpdateTodo(id,title);
  }

  function deleteTodo(id: string) {
    return DeleteTodo(id)
  }

  function completeTodo(id: string) {
    const current = todos.find((todo) => todo.id === id)
    if (!current || current.completed) return null
    return CompletedTodo(id);
  }

  function reopenTodo(id: string) {
    return ReopenTodo(id);
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
