import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { isAxiosError } from "axios"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldDescription, FieldError, FieldGroup } from "@/components/ui/field"
import { PasswordField, TextField } from "@/components/form/fields"
import { PublicShell } from "@/components/layout/PublicShell"
import { loginSchema, type LoginValues } from "@/features/auth/schemas"
import { useLogin } from "@/features/auth/hooks"
import { toastApiError } from "@/lib/api-error"
import { roleHome } from "@/lib/auth"

const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
})

export const Route = createFileRoute("/login")({
  validateSearch: loginSearchSchema,
  beforeLoad: ({ context }) => {
    const user = context.auth.getUser()
    if (user) throw redirect({ to: roleHome(user.role) })
  },
  component: LoginPage,
})

function LoginPage() {
  const { t } = useTranslation()
  const { redirect: redirectTo } = Route.useSearch()
  const login = useLogin(redirectTo)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  })

  const onSubmit = (values: LoginValues) => {
    login.mutate(values, {
      onError: (error) => {
        if (isAxiosError(error) && error.response?.status === 401) {
          form.setError("root", { message: "auth.invalidCredentials" })
        } else {
          toastApiError(error, t)
        }
      },
    })
  }

  return (
    <PublicShell>
      <Card>
        <CardHeader>
          <CardTitle>{t("auth.loginTitle")}</CardTitle>
          <CardDescription>{t("auth.loginSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <TextField
                control={form.control}
                name="username"
                label="form.username"
                autoComplete="username"
              />
              <PasswordField
                control={form.control}
                name="password"
                label="form.password"
              />
              {form.formState.errors.root?.message && (
                <FieldError>
                  {t(form.formState.errors.root.message)}
                </FieldError>
              )}
              <Button type="submit" disabled={login.isPending}>
                {t("auth.login")}
              </Button>
              <FieldDescription className="text-center">
                {t("auth.noAccount")}{" "}
                <Link to="/register">{t("auth.register")}</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </PublicShell>
  )
}
