"use client"

import type { Todo } from "@/types/todo"
import { TodoItem } from "@/components/todo/todo-item"

type TodoListProps = {
  todos: Todo[]
  onUpdate: (id: string, title: string) => void
  onDelete: (id: string) => void
  onComplete: (id: string) => void
  onReopen: (id: string) => void
}

export function TodoList({
  todos,
  onUpdate,
  onDelete,
  onComplete,
  onReopen,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="mt-8 w-full text-center text-zinc-50/45 border border-dashed border-zinc-50/15 px-4 py-8">
        No to-dos yet. Add one above.
      </p>
    )
  }

  const active = todos.filter((todo) => !todo.completed)
  const done = todos.filter((todo) => todo.completed)

  return (
    <div className="mt-8 w-full flex flex-col gap-6">
      <section className="w-full">
        <h2 className="mb-2 text-sm tracking-wide text-zinc-50/55 uppercase">
          Active ({active.length})
        </h2>
        {active.length === 0 ? (
          <p className="text-zinc-50/40 text-sm">All caught up.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {active.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onComplete={onComplete}
                onReopen={onReopen}
              />
            ))}
          </ul>
        )}
      </section>

      {done.length > 0 && (
        <section className="w-full">
          <h2 className="mb-2 text-sm tracking-wide text-zinc-50/55 uppercase">
            Completed ({done.length})
          </h2>
          <ul className="flex flex-col gap-2">
            {done.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onComplete={onComplete}
                onReopen={onReopen}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
