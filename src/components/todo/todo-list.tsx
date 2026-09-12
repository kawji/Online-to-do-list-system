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
  console.log("todosssssssss --> ",todos)

  if (todos.length === 0) {
    return (
      <p className="mt-6 sm:mt-8 w-full text-center text-sm sm:text-base text-zinc-950/45 border border-dashed border-zinc-950/15 px-4 py-6 sm:py-8 dark:text-zinc-50/45 dark:border-zinc-50/15">
        No to-dos yet. Add one above.
      </p>
    )
  }

  const active = todos.filter((todo) => !todo.completed)
  const done = todos.filter((todo) => todo.completed)

  return (
    <div className="mt-6 sm:mt-8 w-full flex flex-col gap-5 sm:gap-6">
      <section className="w-full">
        <h2 className="mb-2 text-xs sm:text-sm tracking-wide text-zinc-950/55 uppercase dark:text-zinc-50/55">
          Active ({active.length})
        </h2>
        {active.length === 0 ? (
          <p className="text-zinc-950/40 text-sm dark:text-zinc-50/40">
            All caught up.
          </p>
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
          <h2 className="mb-2 text-xs sm:text-sm tracking-wide text-zinc-950/55 uppercase dark:text-zinc-50/55">
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
