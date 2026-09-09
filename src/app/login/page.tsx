import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-start font-sans text-zinc-50 px-4">
      <div className="flex flex-col items-center max-w-130 w-full pb-16">
        <nav className="flex items-center justify-between w-full py-3 border-b border-b-zinc-50/15">
          <Link
            href="/"
            className="text-sm text-zinc-50/70 hover:text-zinc-50 transition-colors"
          >
            ← Back
          </Link>
          <Link
            href="/register"
            className="text-sm border border-zinc-50/12 px-3 py-1.5 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
          >
            Register
          </Link>
        </nav>

        <div className="mt-10 px-3.5 py-2 font-extrabold text-5xl border border-zinc-50/12 hover:bg-zinc-50 hover:text-zinc-950 transition-colors duration-300">
          Login
        </div>

        <p className="mt-4 text-sm text-zinc-50/55 text-center">
          Sign in with email and password (Supabase JWT)
        </p>

        <div className="mt-10 w-full">
          <Suspense
            fallback={
              <p className="text-sm text-zinc-50/50 text-center">Loading...</p>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
