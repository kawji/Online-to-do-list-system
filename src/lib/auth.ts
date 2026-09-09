import type { User } from "@supabase/supabase-js"

export type AuthUser = {
  id: string
  name: string
  email?: string
}

export function mapSupabaseUser(user: User | null | undefined): AuthUser | null {
  if (!user) return null

  const metaName =
    typeof user.user_metadata?.name === "string"
      ? user.user_metadata.name.trim()
      : ""

  return {
    id: user.id,
    name: metaName || user.email?.split("@")[0] || "User",
    email: user.email,
  }
}

export function getActorId(user: AuthUser | null): string {
  return user?.id ?? "guest"
}
