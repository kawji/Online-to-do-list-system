import type { CreateTodoInput, Todo, UpdateTodoInput } from "@/types/todo"
import { createClient } from "./supabase/client"


let currentUserId: null|string = null
let listeners = new Set<() => void>()
let todoStorage:Todo[] = []
const emptyArray: Todo[] = []

function emit() {
  listeners.forEach((listener) => listener())
}




/** Local store shaped like a future API (filter by userId for login). */
export const todoStore = {
  subscribe(userId:string ,listener: () => void) {
    if( !userId || userId === 'guest' ) return () => {}
    listeners.add(listener)
    currentUserId = userId;
    const supabase = createClient();

    void supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) {
          todoStorage = data as unknown as Todo[]
          emit() 
        }
      })

      const formatTodo = (raw: any): Todo => ({
        id: raw.id,
        title: raw.title,
        completed: raw.completed,
        userId: raw.user_id, 
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
        completedAt: raw.completed_at
      })

  const changes = supabase
    .channel(`public:todos:${userId}`)
    // 🟢 ท่อที่ 1: ดักฟังเฉพาะ INSERT และ UPDATE ของ User คนนี้ (คัดกรองจากหลังบ้านได้ดี)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'todos',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        todoStorage = [formatTodo(payload.new), ...todoStorage]
        emit()
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'todos',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const updated = formatTodo(payload.new)
        todoStorage = todoStorage.map((t) => t.id === updated.id ? updated : t)
        emit()
      }
    )
    // 🟢 ท่อที่ 2: ดักฟังเหตุการณ์ DELETE ทั้งหมดในตาราง todos 
    // (ระบบ RLS ของ Supabase จะล็อกสเปคให้ User คนนี้มองเห็นเฉพาะสตรีมลบข้อมูลของตัวเองอยู่แล้ว ปลอดภัย 100%)
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'todos'
        // ⚠️ ห้ามใส่ filter user_id ตรงนี้เด็ดขาด ปล่อยให้ RLS จัดการเบื้องหลัง
      },
      (payload) => {
        // ทำการกรองไอดีตัวที่โดนลบออกจากหน่วยความจำฝั่ง Client ทันที
        todoStorage = todoStorage.filter((t) => t.id !== payload.old.id)
        emit()
      }
    )
    .subscribe()


    return () => {
      listeners.delete(listener)
      void supabase.removeChannel(changes)
    }
  },




  listByUser(userId:string):Todo[] {
    if(!userId || userId === 'guest' || userId !== currentUserId) {
      return emptyArray
    }
    return todoStorage
  }



}
