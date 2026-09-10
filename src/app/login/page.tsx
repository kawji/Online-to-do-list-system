import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-start font-sans px-4 sm:px-6">
      <div className="flex flex-col items-center max-w-130 w-full pb-12 sm:pb-16">
        <nav className="flex items-center justify-between gap-3 sm:gap-4 w-full py-3 sm:py-3.5 border-b border-zinc-950/12 dark:border-zinc-50/12">
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm text-zinc-950/60 hover:text-zinc-950 dark:text-zinc-50/60 dark:hover:text-zinc-50 transition-colors duration-300"
          >
            <span className="flex h-8 w-8 items-center justify-center border border-zinc-950/15 text-zinc-950/70 group-hover:border-zinc-950/40 group-hover:bg-zinc-950 group-hover:text-zinc-50 dark:border-zinc-50/15 dark:text-zinc-50/70 dark:group-hover:border-zinc-100/40 dark:group-hover:bg-zinc-50 dark:group-hover:text-zinc-950 transition-colors duration-300">
              ←
            </span>
            <span className="hidden min-[380px]:inline">Back to list</span>
          </Link>
          <ThemeToggle />
        </nav>

        <div className="mt-8 sm:mt-10 px-3 sm:px-3.5 py-1.5 sm:py-2 font-extrabold text-3xl sm:text-4xl md:text-5xl text-center max-w-full border border-zinc-950/12 hover:bg-zinc-950 hover:text-zinc-50 dark:border-zinc-50/12 dark:hover:bg-zinc-50 dark:hover:text-zinc-950 transition-colors duration-300">
          Login
        </div>

        <p className="mt-4 text-sm text-zinc-950/55 dark:text-zinc-50/55 text-center px-1">
          Sign in with email and password
        </p>

        <div className="mt-8 sm:mt-10 w-full">
          <Suspense
            fallback={
              <p className="text-sm text-zinc-950/50 dark:text-zinc-50/50 text-center">
                Loading...
              </p>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
