import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabaseClient } from '../lib/supabase/client'
import { isSupabaseConfigured } from '../lib/supabase/config'

type AuthState = {
  session: Session | null
  user: User | null
  isAdmin: boolean
  loading: boolean
  configured: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  refreshAdmin: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

async function checkAdminMembership(userId: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false
  const { data, error } = await supabase
    .from('cms_admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) {
    console.warn('[auth] admin check failed', error.message)
    return false
  }
  return Boolean(data)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured()
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(configured)

  const refreshAdmin = useCallback(async () => {
    if (!session?.user?.id) {
      setIsAdmin(false)
      return
    }
    setIsAdmin(await checkAdminMembership(session.user.id))
  }, [session?.user?.id])

  useEffect(() => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session?.user) {
      setIsAdmin(false)
      return
    }
    void refreshAdmin()
  }, [session, refreshAdmin])

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return { error: 'Supabase is not configured.' }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const signOut = useCallback(async () => {
    const supabase = getSupabaseClient()
    if (supabase) await supabase.auth.signOut()
    setIsAdmin(false)
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    const supabase = getSupabaseClient()
    if (!supabase) return { error: 'Supabase is not configured.' }
    const redirectTo = `${window.location.origin}/admin/login`
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })
    return { error: error?.message ?? null }
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      isAdmin,
      loading,
      configured,
      signIn,
      signOut,
      resetPassword,
      refreshAdmin,
    }),
    [
      session,
      isAdmin,
      loading,
      configured,
      signIn,
      signOut,
      resetPassword,
      refreshAdmin,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
