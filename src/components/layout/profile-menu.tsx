"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ChevronDown,
  ImagePlus,
  LogIn,
  LogOut,
  Trash2,
  UserPlus,
} from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { removeUserAvatar, uploadUserAvatar } from "@/lib/avatar"

function AvatarFace({
  name,
  avatarUrl,
  sizeClass = "h-9 w-9",
  textClass = "text-sm",
}: {
  name: string
  avatarUrl?: string
  sizeClass?: string
  textClass?: string
}) {
  const initial = name.slice(0, 1).toUpperCase() || "G"

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className={`${sizeClass} shrink-0 object-cover border border-zinc-950/20 dark:border-zinc-50/20`}
      />
    )
  }

  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center border border-zinc-950/20 bg-zinc-950 text-zinc-50 ${textClass} font-semibold dark:border-zinc-50/20 dark:bg-zinc-50 dark:text-zinc-950`}
      aria-hidden
    >
      {initial}
    </div>
  )
}

export function ProfileMenu() {
  const { user, signOut, loading: authLoading, refresh } = useAuth()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayName = authLoading ? "..." : user ? user.name : "Guest"

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  async function handleAvatarChange(file: File | undefined) {
    if (!user || !file) return
    setBusy(true)
    setError(null)

    try {
      const supabase = createClient()
      await uploadUserAvatar(supabase, user.id, file)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setBusy(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleAvatarRemove() {
    if (!user) return
    setBusy(true)
    setError(null)

    try {
      const supabase = createClient()
      await removeUserAvatar(supabase, user.id, user.avatarPath)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove photo.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 min-w-0 max-w-full border border-transparent px-1 py-0.5 hover:border-zinc-950/12 dark:hover:border-zinc-50/12 cursor-pointer transition-colors duration-300"
      >
        <AvatarFace name={displayName} avatarUrl={user?.avatarUrl} />
        <div className="flex flex-col min-w-0 leading-tight text-left">
          <span className="text-sm truncate">{displayName}</span>
          <span className="text-[11px] tracking-wide text-zinc-950/40 dark:text-zinc-50/40">
            {user ? "Signed in" : "Local session"}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`shrink-0 text-zinc-950/45 dark:text-zinc-50/45 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-1.5 min-w-52 border border-zinc-950/12 bg-zinc-50 py-1 shadow-sm dark:border-zinc-50/12 dark:bg-zinc-950"
        >
          {user ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  void handleAvatarChange(e.target.files?.[0])
                }}
              />
              <button
                type="button"
                role="menuitem"
                disabled={busy}
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-950/85 hover:bg-zinc-950 hover:text-zinc-50 dark:text-zinc-50/85 dark:hover:bg-zinc-50 dark:hover:text-zinc-950 cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none"
              >
                <ImagePlus size={14} />
                {busy ? "Uploading..." : "Change photo"}
              </button>
              {user.avatarUrl && (
                <button
                  type="button"
                  role="menuitem"
                  disabled={busy}
                  onClick={() => void handleAvatarRemove()}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-500 hover:text-zinc-50 dark:text-red-300/90 dark:hover:bg-red-400 dark:hover:text-zinc-950 cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Trash2 size={14} />
                  Remove photo
                </button>
              )}
              {error && (
                <p className="px-3 py-2 text-xs text-red-600 dark:text-red-300">
                  {error}
                </p>
              )}
              <div className="my-1 border-t border-zinc-950/10 dark:border-zinc-50/10" />
              <button
                type="button"
                role="menuitem"
                disabled={busy}
                onClick={() => {
                  setOpen(false)
                  void signOut()
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-950/85 hover:bg-zinc-950 hover:text-zinc-50 dark:text-zinc-50/85 dark:hover:bg-zinc-50 dark:hover:text-zinc-950 cursor-pointer transition-colors duration-200"
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-950/85 hover:bg-zinc-950 hover:text-zinc-50 dark:text-zinc-50/85 dark:hover:bg-zinc-50 dark:hover:text-zinc-950 transition-colors duration-200"
              >
                <LogIn size={14} />
                Login
              </Link>
              <Link
                href="/register"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-950/85 hover:bg-zinc-950 hover:text-zinc-50 dark:text-zinc-50/85 dark:hover:bg-zinc-50 dark:hover:text-zinc-950 transition-colors duration-200"
              >
                <UserPlus size={14} />
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
