"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { LogOut, UserRound } from "lucide-react"
import { TodoList } from "@/components/todo/todo-list"
import { useAuth } from "@/components/auth/auth-provider"
import { useTodos } from "@/hooks/use-todos"
import { MAX_TODO_CHARS } from "@/lib/todo-limits"

export default function HomePage() {
  const [text, setText] = useState("")
  const { user, signOut, loading: authLoading } = useAuth()
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
      <nav className="flex items-center justify-between w-full max-w-130 max-full py-3 border-b border-b-zinc-50/15">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-full p-2 cursor-pointer hover:bg-zinc-50 hover:text-zinc-950"
            title={user ? user.name : "Guest"}
          >
            <UserRound size={15} />
          </div>
          <span className="text-sm text-zinc-50/60">
            {authLoading ? "..." : user ? user.name : "Guest"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex items-center gap-1.5 border border-zinc-50/12 px-2.5 py-1.5 text-sm hover:bg-zinc-50 hover:text-zinc-950 cursor-pointer transition-colors"
              title="Sign out"
            >
              <LogOut size={14} />
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="border border-zinc-50/12 px-2.5 py-1.5 text-sm hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-zinc-50 text-zinc-950 px-2.5 py-1.5 text-sm hover:bg-zinc-200 transition-colors"
              >
                Register
              </Link>
            </>
          )}
          <div className="min-w-6 h-6 px-2 flex items-center justify-center bg-white text-zinc-950 text-xs rounded-full">
            {user?.name?.slice(0, 1).toUpperCase() ?? "G"}
          </div>
        </div>
      </nav>

      <div className="mt-10 px-3.5 py-2 font-extrabold text-6xl border border-zinc-50/12 hover:bg-zinc-50 hover:text-zinc-950 transition-colors duration-300">
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
          className="w-full bg-transparent border border-white/12 px-5 py-2 hover:border-zinc-100/40 hover:bg-amber-50/4 focus:border-zinc-100/40 hover:text-white/88 outline-none transition-colors duration-300"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-zinc-900/75 hover:scale-105 border border-zinc-50/8 whitespace-nowrap hover:bg-zinc-100 hover:text-zinc-950 px-3 w-auto cursor-pointer transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none disabled:hover:scale-100"
        >
          Next
        </button>
      </form>

      <div className="mt-2.5 flex items-center justify-between w-full">
        <div className="bg-zinc-950 text-zinc-50/85 border border-zinc-50/12 px-3 py-2">
          Total Characters: {totalCharacters}
        </div>

        <div
          className={`bg-zinc-950 border border-zinc-50/12 px-3 py-2 ${
            remaining === 0 ? "text-red-400" : "text-zinc-50/85"
          }`}
        >
          Remaining: {remaining}
        </div>
      </div>

      {!user && (
        <p className="mt-3 w-full text-xs text-zinc-50/45">
          Using as Guest —{" "}
          <Link href="/login" className="underline underline-offset-2 hover:text-zinc-50">
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
