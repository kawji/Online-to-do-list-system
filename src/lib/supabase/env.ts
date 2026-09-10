export function getSupabaseEnv() {
  const url = process.env.SUPABASE_URL
  const key =
    process.env.SUPABASE_KEY ??
    process.env.SUPABASE_KEY

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or ANON_KEY)"
    )
  }

  return { url, key }
}
