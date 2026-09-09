"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { ProfileMenu } from "@/components/layout/profile-menu"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { TodoList } from "@/components/todo/todo-list"
import { useAuth } from "@/components/auth/auth-provider"
import { useTodos } from "@/hooks/use-todos"
import { MAX_TODO_CHARS } from "@/lib/todo-limits"

export default function HomePage() {
  const [text, setText] = useState("")
  const { user } = useAuth()
  const {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    completeTodo,
    reopenTodo,
  } = useTodos()

  const totalCharacters = text.length
  const remaining = MAX_TODO_CHARS - totalCharacters

  function handleChange(value: string) {
    setText(value.slice(0, MAX_TODO_CHARS))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const created = addTodo(text)
    if (!created) return
    setText("")
  }

  return (
    <div className="flex flex-col items-center max-w-130 w-full pb-16">
      <nav className="flex items-center justify-between gap-4 w-full py-3.5 border-b border-zinc-950/12 dark:border-zinc-50/12">
        <ProfileMenu />
        <ThemeToggle />
      </nav>

      <div className="mt-10 px-3.5 py-2 font-extrabold text-6xl border border-zinc-950/12 hover:bg-zinc-950 hover:text-zinc-50 dark:border-zinc-50/12 dark:hover:bg-zinc-50 dark:hover:text-zinc-950 transition-colors duration-300">
        My To-do List
      </div>

      <form
        className="flex items-stretch w-full mt-10 gap-2"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="todo"
          value={text}
          maxLength={MAX_TODO_CHARS}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="what your to do"
          className="w-full bg-transparent border border-zinc-950/12 px-5 py-2 hover:border-zinc-950/40 hover:bg-amber-950/4 focus:border-zinc-950/40 dark:border-white/12 dark:hover:border-zinc-100/40 dark:hover:bg-amber-50/4 dark:focus:border-zinc-100/40 dark:hover:text-white/88 outline-none transition-colors duration-300"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-zinc-200/80 hover:scale-105 border border-zinc-950/10 whitespace-nowrap hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-900/75 dark:border-zinc-50/8 dark:hover:bg-zinc-100 dark:hover:text-zinc-950 px-3 w-auto cursor-pointer transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none disabled:hover:scale-100"
        >
          Next
        </button>
      </form>

      <div className="mt-2.5 flex items-center justify-between w-full">
        <div className="bg-zinc-100 text-zinc-950/85 border border-zinc-950/12 px-3 py-2 dark:bg-zinc-950 dark:text-zinc-50/85 dark:border-zinc-50/12">
          Total Characters: {totalCharacters}
        </div>

        <div
          className={`bg-zinc-100 border border-zinc-950/12 px-3 py-2 dark:bg-zinc-950 dark:border-zinc-50/12 ${
            remaining === 0
              ? "text-red-500 dark:text-red-400"
              : "text-zinc-950/85 dark:text-zinc-50/85"
          }`}
        >
          Remaining: {remaining}
        </div>
      </div>

      {!user && (
        <p className="mt-3 w-full text-xs text-zinc-950/45 dark:text-zinc-50/45">
          Using as Guest —{" "}
          <Link
            href="/login"
            className="underline underline-offset-2 hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            login
          </Link>{" "}
          to keep todos under your account.
        </p>
      )}

      <TodoList
        todos={todos}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
        onComplete={completeTodo}
        onReopen={reopenTodo}
      />
    </div>
  )
}
