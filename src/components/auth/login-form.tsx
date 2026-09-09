"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, type FormEvent } from "react"
import { createClient } from "@/lib/supabase/client"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const confirmError = searchParams.get("error") === "confirm"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(
    confirmError
      ? "Email confirmation failed or expired. Try signing in or register again."
      : null
  )
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    router.replace("/")
    router.refresh()
  }

  return (
    <form className="flex w-full flex-col gap-3" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-1.5 text-sm text-zinc-50/70">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border border-white/12 px-5 py-2.5 text-zinc-50 hover:border-zinc-100/40 focus:border-zinc-100/40 outline-none transition-colors duration-300"
          placeholder="you@example.com"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-zinc-50/70">
        Password
        <input
          type="password"
          name="password"
          required
          minLength={6}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border border-white/12 px-5 py-2.5 text-zinc-50 hover:border-zinc-100/40 focus:border-zinc-100/40 outline-none transition-colors duration-300"
          placeholder="••••••••"
        />
      </label>

      {error && (
        <p className="border border-red-400/30 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-zinc-900/75 border border-zinc-50/8 px-3 py-2.5 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p className="mt-2 text-center text-sm text-zinc-50/55">
        No account?{" "}
        <Link
          href="/register"
          className="text-zinc-50 underline-offset-4 hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  )
}
