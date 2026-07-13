import { jwtDecode } from "jwt-decode"

import type { Role } from "@/api/types"

const TOKEN_KEY = "doctor-app.token"

export interface AuthUser {
  username: string
  role: Role
  exp: number
}

interface JwtClaims {
  sub: string
  role: Role
  exp: number
}

export const auth = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clearToken: (): void => localStorage.removeItem(TOKEN_KEY),


  getUser(): AuthUser | null {
    const token = auth.getToken()
    if (!token) return null
    try {
      const { sub, role, exp } = jwtDecode<JwtClaims>(token)
      if (exp * 1000 <= Date.now()) return null
      return { username: sub, role, exp }
    } catch {
      return null
    }
  },
}

export type AuthStore = typeof auth

const ROLE_HOMES = {
  ADMIN: "/admin/doctors",
  DOCTOR: "/doctor/appointments",
  PATIENT: "/patient/appointments",
} as const satisfies Record<Role, string>

export function roleHome(role: Role) {
  return ROLE_HOMES[role]
}
