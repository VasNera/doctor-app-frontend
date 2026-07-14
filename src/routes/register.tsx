import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field"
import { PasswordField, TextField } from "@/components/form/fields"
import { PublicShell } from "@/components/layout/PublicShell"
import {
  patientRegisterSchema,
  type PatientRegisterValues,
} from "@/features/auth/schemas"
import { useRegisterPatient } from "@/features/auth/hooks"
import { handleFormApiError } from "@/lib/api-error"
import { roleHome } from "@/lib/auth"

export const Route = createFileRoute("/register")({
  beforeLoad: ({ context }) => {
    const user = context.auth.getUser()
    if (user) throw redirect({ to: roleHome(user.role) })
  },
  component: RegisterPage,
})

function RegisterPage() {
  const { t } = useTranslation()
  const register = useRegisterPatient()

  const form = useForm<PatientRegisterValues>({
    resolver: zodResolver(patientRegisterSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      amka: "",
      phoneNumber: "",
      userInsertDTO: { username: "", password: "" },
    },
  })

  const onSubmit = (values: PatientRegisterValues) => {
    register.mutate(values, {
      onError: (error) => handleFormApiError(error, form.setError, t),
    })
  }

  return (
    <PublicShell>
      <Card>
        <CardHeader>
          <CardTitle>{t("auth.registerTitle")}</CardTitle>
          <CardDescription>{t("auth.registerSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <div className="grid gap-7 sm:grid-cols-2 sm:gap-4">
                <TextField
                  control={form.control}
                  name="firstname"
                  label="form.firstname"
                  autoComplete="given-name"
                />
                <TextField
                  control={form.control}
                  name="lastname"
                  label="form.lastname"
                  autoComplete="family-name"
                />
              </div>
              <TextField
                control={form.control}
                name="email"
                label="form.email"
                type="email"
                autoComplete="email"
              />
              <div className="grid gap-7 sm:grid-cols-2 sm:gap-4">
                <TextField
                  control={form.control}
                  name="amka"
                  label="form.amka"
                  placeholder="12345678901"
                />
                <TextField
                  control={form.control}
                  name="phoneNumber"
                  label="form.phoneNumber"
                  type="tel"
                  autoComplete="tel"
                />
              </div>
              <FieldSeparator>{t("auth.accountSection")}</FieldSeparator>
              <TextField
                control={form.control}
                name="userInsertDTO.username"
                label="form.username"
                autoComplete="username"
              />
              <PasswordField
                control={form.control}
                name="userInsertDTO.password"
                label="form.password"
                autoComplete="new-password"
              />
              <Button type="submit" disabled={register.isPending}>
                {t("auth.register")}
              </Button>
              <FieldDescription className="text-center">
                {t("auth.haveAccount")} <Link to="/login">{t("auth.login")}</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </PublicShell>
  )
}
