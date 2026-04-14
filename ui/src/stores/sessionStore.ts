import { create } from 'zustand'
import type { UserRead } from '@/data/contract'

export type SessionUser = Pick<
  UserRead,
  'id' | 'email' | 'username' | 'first_name' | 'last_name' | 'name'
>

export type SessionState = {
  user: SessionUser | null
  setUser: (user: SessionUser | null) => void
  signIn: (user: UserRead) => void
  signOut: () => void
  isGuest: () => boolean
}

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  signIn: (user) =>
    set({
      user: {
        id: user.id,
        email: user.email,
        username: user.username ?? undefined,
        first_name: user.first_name ?? undefined,
        last_name: user.last_name ?? undefined,
        name: user.name ?? undefined,
      },
    }),
  signOut: () => set({ user: null }),
  isGuest: () => get().user === null,
}))
