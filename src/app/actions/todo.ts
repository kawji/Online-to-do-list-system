'use server'

import { createClient } from "@/lib/supabase/server"
import { MAX_TODO_CHARS } from "@/lib/todo-limits";
import { revalidatePath } from "next/cache";


export async function CreateTodo(title:string ) {
    const supabase = await createClient();

    const { data:{ user } } = await supabase.auth.getUser()
    const textClean = title.trim().slice(0 , MAX_TODO_CHARS)

    const { data: instruments, error } = await supabase
    .from("todos")
    .insert({
        user_id:user?.id ,
        title:textClean,
        completed:false
    })
    .select()
    .single()

    if(error) throw new Error("Error of create todo -->",error)
    revalidatePath('/');
    return instruments
}


export async function UpdateTodo(id:string ,title:string) {
    const supabase = await createClient();
    const {data:{ user }} = await supabase.auth.getUser()
    const { data ,error } = await supabase
    .from('todos')
    .update({ 
        id: id,
        title:title
    })
    .eq('user_id',user?.id)
    .eq('id',id)
    .select()
    .single()
    
    if(error) throw new Error("Error of UpdateTodo --> ",error)
    revalidatePath("/")
    return data
}


export async function DeleteTodo(id:string) {
    const supabase = await createClient();
    const {data:{ user }} = await supabase.auth.getUser();
    const {data ,error } = await supabase
    .from("todos")
    .delete()
    .eq('user_id',user?.id)
    .eq('id',id)
    .select()
    .single()

    if(error) throw new Error("Error of Delete todo --> ",error)
    revalidatePath('/');
    return data
}



export async function CompletedTodo(id:string) {
    const supabase = await createClient();
    const { data:{user} } = await supabase.auth.getUser();
    const { data ,error } = await supabase
    .from('todos')
    .update({
        completed:true
    })
    .eq('user_id',user?.id)
    .eq('id',id)
    .select()
    .single()

    if(error) throw new Error("Error of Completed todo -->",error)
    revalidatePath('/')
    return data
}


export async function ReopenTodo(id:string) {

    const supabase = await createClient();
    const { data:{user} } = await supabase.auth.getUser();
    const { data ,error } = await supabase
    .from('todos')
    .update({
        completed:false
    })
    .eq('user_id',user?.id)
    .eq('id',id)
    .select()
    .single()

    if(error) throw new Error("Error of Reopen todo -->",error)
    revalidatePath('/')
    return data

}
