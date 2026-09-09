"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { createClient } from "@/lib/supabase/client"

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName) {
      setLoading(false)
      setError("Name is required.")
      return
    }

    const supabase = createClient()
    const emailRedirectTo = `${window.location.origin}/auth/callback`

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: { name: trimmedName },
        emailRedirectTo,
      },
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    // Email confirmation enabled → no session until user verifies.
    if (!data.session) {
      setInfo(
        "Check your email to confirm your account, then sign in."
      )
      return
    }

    router.replace("/")
    router.refresh()
  }

  return (
    <form className="flex w-full flex-col gap-3" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-1.5 text-sm text-zinc-50/70">
        Name
        <input
          type="text"
          name="name"
          required
          maxLength={80}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent border border-white/12 px-5 py-2.5 text-zinc-50 hover:border-zinc-100/40 focus:border-zinc-100/40 outline-none transition-colors duration-300"
          placeholder="Your name"
        />
      </label>

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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border border-white/12 px-5 py-2.5 text-zinc-50 hover:border-zinc-100/40 focus:border-zinc-100/40 outline-none transition-colors duration-300"
          placeholder="At least 6 characters"
        />
      </label>

      {error && (
        <p className="border border-red-400/30 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {info && (
        <p className="border border-emerald-400/30 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-300">
          {info}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-zinc-900/75 border border-zinc-50/8 px-3 py-2.5 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="mt-2 text-center text-sm text-zinc-50/55">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-zinc-50 underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
