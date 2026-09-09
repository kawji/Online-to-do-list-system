"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import type { Session, User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { getActorId, mapSupabaseUser, type AuthUser } from "@/lib/auth"

type AuthState = {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  userId: string
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

type Snapshot = {
  session: Session | null
  user: User | null
  ready: boolean
}

let snapshot: Snapshot = {
  session: null,
  user: null,
  ready: false,
}

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function setSnapshot(next: Partial<Snapshot>) {
  snapshot = { ...snapshot, ...next }
  emit()
}

let subscribed = false

function ensureAuthSubscription() {
  if (subscribed || typeof window === "undefined") return
  subscribed = true

  const supabase = createClient()

  void supabase.auth.getSession().then(({ data }) => {
    setSnapshot({
      session: data.session,
      user: data.session?.user ?? null,
      ready: true,
    })
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    setSnapshot({
      session,
      user: session?.user ?? null,
      ready: true,
    })
  })
}

function subscribe(listener: () => void) {
  ensureAuthSubscription()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return snapshot
}

const serverSnapshot: Snapshot = {
  session: null,
  user: null,
  ready: false,
}

function getServerSnapshot() {
  return serverSnapshot
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const refresh = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()
    setSnapshot({
      session: data.session,
      user: data.session?.user ?? null,
      ready: true,
    })
  }, [])

  const signOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setSnapshot({ session: null, user: null, ready: true })
  }, [])

  const value = useMemo<AuthState>(() => {
    const user = mapSupabaseUser(state.user)
    return {
      user,
      session: state.session,
      loading: !state.ready,
      userId: getActorId(user),
      signOut,
      refresh,
    }
  }, [state, signOut, refresh])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}
