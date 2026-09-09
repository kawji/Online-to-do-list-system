export type Todo = {
  id: string
  title: string
  completed: boolean
  /** Owner id — "guest" for now; replace with real user id after login */
  userId: string
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

export type SuccessLog = {
  id: string
  todoId: string
  todoTitle: string
  userId: string
  completedAt: string
}

export type CreateTodoInput = {
  title: string
  userId: string
}

export type UpdateTodoInput = {
  title?: string
  completed?: boolean
}
