import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { auth, roleHome } from "@/lib/auth"
import { authApi } from "./api"

export function useLogin(redirectTo?: string) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.authenticate,
    onSuccess: ({ token }) => {
      auth.setToken(token)
      queryClient.clear()
      const user = auth.getUser()
      if (!user) return 
      void navigate({ to: redirectTo ?? roleHome(user.role) })
    },
  })
}

export function useRegisterPatient() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: authApi.registerPatient,
    onSuccess: () => {
      toast.success(t("auth.registerSuccess"))
      void navigate({ to: "/login" })
    },
  })
}

export function useActivateDoctor() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: authApi.activateDoctor,
    onSuccess: () => {
      toast.success(t("auth.activateSuccess"))
      void navigate({ to: "/login" })
    },
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return () => {
    auth.clearToken()
    queryClient.clear()
    void navigate({ to: "/login" })
  }
}
