import type { User } from "@supabase/supabase-js"
import { resolveAvatarUrl } from "@/lib/avatar"

export type AuthUser = {
  id: string
  name: string
  email?: string
  avatarUrl?: string
  avatarPath?: string
}

export function mapSupabaseUser(user: User | null | undefined): AuthUser | null {
  if (!user) return null

  const meta = user.user_metadata
  const metaName =
    typeof meta?.name === "string" ? meta.name.trim() : ""
  const avatarPath =
    typeof meta?.avatar_path === "string" && meta.avatar_path.trim()
      ? meta.avatar_path.trim()
      : undefined

  return {
    id: user.id,
    name: metaName || user.email?.split("@")[0] || "User",
    email: user.email,
    avatarUrl: resolveAvatarUrl(meta),
    avatarPath,
  }
}

export function getActorId(user: AuthUser | null): string {
  return user?.id ?? "guest"
}
