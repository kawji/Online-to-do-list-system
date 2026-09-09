"use client"

import { useState, type FormEvent } from "react"
import { Check, Pencil, RotateCcw, Trash2, X } from "lucide-react"
import type { Todo } from "@/types/todo"
import { MAX_TODO_CHARS } from "@/lib/todo-limits"

type TodoItemProps = {
  todo: Todo
  onUpdate: (id: string, title: string) => void
  onDelete: (id: string) => void
  onComplete: (id: string) => void
  onReopen: (id: string) => void
}

export function TodoItem({
  todo,
  onUpdate,
  onDelete,
  onComplete,
  onReopen,
}: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.title)

  function startEdit() {
    setDraft(todo.title)
    setEditing(true)
  }

  function cancelEdit() {
    setDraft(todo.title)
    setEditing(false)
  }

  function saveEdit(e?: FormEvent) {
    e?.preventDefault()
    const value = draft.trim()
    if (!value || value === todo.title) {
      cancelEdit()
      return
    }
    onUpdate(todo.id, value)
    setEditing(false)
  }

  return (
    <li
      className={`flex items-start gap-2 w-full border border-zinc-50/12 px-3 py-2.5 transition-colors duration-300 ${
        todo.completed
          ? "bg-zinc-900/40 text-zinc-50/45"
          : "bg-zinc-950 text-zinc-50/90 hover:border-zinc-100/30"
      }`}
    >
      {editing ? (
        <form
          className="flex flex-1 flex-col gap-2 min-w-0"
          onSubmit={saveEdit}
        >
          <div className="flex items-stretch gap-2 min-w-0">
            <input
              autoFocus
              value={draft}
              maxLength={MAX_TODO_CHARS}
              onChange={(e) =>
                setDraft(e.target.value.slice(0, MAX_TODO_CHARS))
              }
              className="w-full min-w-0 bg-transparent border border-white/20 px-3 py-1.5 outline-none focus:border-zinc-100/50"
            />
            <button
              type="submit"
              className="border border-zinc-50/15 px-2 py-1.5 hover:bg-zinc-50 hover:text-zinc-950 cursor-pointer transition-colors"
              aria-label="Save"
            >
              <Check size={15} />
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="border border-zinc-50/15 px-2 py-1.5 hover:bg-zinc-50 hover:text-zinc-950 cursor-pointer transition-colors"
              aria-label="Cancel"
            >
              <X size={15} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 text-xs text-zinc-50/55">
            <span>Total Characters: {draft.length}</span>
            <span className={draft.length >= MAX_TODO_CHARS ? "text-red-400" : ""}>
              Remaining: {MAX_TODO_CHARS - draft.length}
            </span>
          </div>
        </form>
      ) : (
        <>
          <p
            className={`flex-1 min-w-0 break-words pt-0.5 ${
              todo.completed ? "line-through" : ""
            }`}
          >
            {todo.title}
          </p>

          <div className="flex items-center gap-1 shrink-0">
            {todo.completed ? (
              <button
                type="button"
                onClick={() => onReopen(todo.id)}
                className="border border-zinc-50/15 px-2 py-1.5 hover:bg-zinc-50 hover:text-zinc-950 cursor-pointer transition-colors"
                aria-label="Reopen"
                title="Reopen"
              >
                <RotateCcw size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onComplete(todo.id)}
                className="border border-emerald-400/30 text-emerald-300/90 px-2 py-1.5 hover:bg-emerald-300 hover:text-zinc-950 cursor-pointer transition-colors"
                aria-label="Mark complete"
                title="Complete"
              >
                <Check size={15} />
              </button>
            )}

            {!todo.completed && (
              <button
                type="button"
                onClick={startEdit}
                className="border border-zinc-50/15 px-2 py-1.5 hover:bg-zinc-50 hover:text-zinc-950 cursor-pointer transition-colors"
                aria-label="Edit"
                title="Edit"
              >
                <Pencil size={15} />
              </button>
            )}

            <button
              type="button"
              onClick={() => onDelete(todo.id)}
              className="border border-red-400/25 text-red-300/90 px-2 py-1.5 hover:bg-red-400 hover:text-zinc-950 cursor-pointer transition-colors"
              aria-label="Delete"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </>
      )}
    </li>
  )
}
