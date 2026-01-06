import { User, ThemeType } from '../types'
import { supabase } from '../lib/supabase'

const GLOBAL_THEME_KEY = 'iplanner_global_theme'
const SESSION_KEY = 'iplanner_current_session'

async function getAuthUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('Not authenticated')
  return data.user
}

export const db = {
  /* =========================
     AUTH
  ========================= */

  signUp: async (email: string, pass: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { full_name: name }
      }
    })
    if (error) throw error
    return data.user
  },

  signIn: async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    })
    if (error) throw error
    return data.user
  },

  signOut: async () => {
    await supabase.auth.signOut()
    localStorage.removeItem(SESSION_KEY)
  },

  /* =========================
     PROFILE
  ========================= */

  saveUser: async (user: User) => {
    const authUser = await getAuthUser()

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: authUser.id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        focus_goal: user.focusGoal,
        theme: user.theme,
        categories: user.categories,
        daily_energy: user.dailyEnergy,
        avatar: user.avatar
      })

    if (error) console.error('Erro ao salvar perfil:', error)

    db.setGlobalTheme(user.theme)
  },

  loadProfile: async (): Promise<User | null> => {
    const authUser = await getAuthUser()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .single()

    if (error || !data) return null

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      xp: data.xp,
      level: data.level,
      focusGoal: data.focus_goal,
      theme: data.theme as ThemeType,
      categories: data.categories || [],
      dailyEnergy: data.daily_energy || {},
      avatar: data.avatar,
      joinedAt: data.created_at
    }
  },

  /* =========================
     GENERIC USER DATA (RLS SAFE)
  ========================= */

  saveData: async (type: string, payload: any) => {
    const authUser = await getAuthUser()

    const { error } = await supabase
      .from('user_data')
      .upsert(
        {
          user_id: authUser.id,
          data_type: type,
          payload
        },
        { onConflict: 'user_id, data_type' }
      )

    if (error) console.error(`Erro ao salvar ${type}:`, error)
  },

  loadData: async (type: string, defaultValue: any) => {
    const { data, error } = await supabase
      .from('user_data')
      .select('payload')
      .eq('data_type', type)
      .single()

    if (error || !data) return defaultValue
    return data.payload
  },

  /* =========================
     LOCAL SESSION (UX CACHE)
  ========================= */

  setSession: (user: User | null) => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user))
      db.setGlobalTheme(user.theme)
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  },

  getSession: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY)
    try {
      return session ? JSON.parse(session) : null
    } catch {
      return null
    }
  },

  /* =========================
     THEME (GLOBAL)
  ========================= */

  setGlobalTheme: (theme: ThemeType) => {
    localStorage.setItem(GLOBAL_THEME_KEY, theme)
  },

  getGlobalTheme: (): ThemeType => {
    return (localStorage.getItem(GLOBAL_THEME_KEY) as ThemeType) || 'light'
  },

  getStorageUsage: () => 'Nuvem (Supabase)'
}
