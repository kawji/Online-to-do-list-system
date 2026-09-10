export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) {
    throw new Error(
      "Missing SUPABASE_URL (or ANON_KEY)"
    )
  }
  if (!key) {
    throw new Error(
      "Missing SUPABASE_KEY (or ANON_KEY)"
    )
  }

  return { url, key }
}
