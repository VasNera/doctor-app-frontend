import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute, Link } from "@tanstack/react-router"
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
import { FieldDescription, FieldGroup } from "@/components/ui/field"
import { PasswordField, TextField } from "@/components/form/fields"
import { PublicShell } from "@/components/layout/PublicShell"
import {
  activateDoctorSchema,
  type ActivateDoctorValues,
} from "@/features/auth/schemas"
import { useActivateDoctor } from "@/features/auth/hooks"
import { handleFormApiError } from "@/lib/api-error"

const activateSearchSchema = z.object({
  token: z.string().catch(""),
})

export const Route = createFileRoute("/activate")({
  validateSearch: activateSearchSchema,
  component: ActivatePage,
})

function ActivatePage() {
  const { t } = useTranslation()
  const { token } = Route.useSearch()
  const activate = useActivateDoctor()

  const form = useForm<ActivateDoctorValues>({
    resolver: zodResolver(activateDoctorSchema),
    defaultValues: { userInsertDTO: { username: "", password: "" } },
  })

  const onSubmit = (values: ActivateDoctorValues) => {
    activate.mutate(
      { token, ...values },
      { onError: (error) => handleFormApiError(error, form.setError, t) }
    )
  }

  return (
    <PublicShell>
      <Card>
        <CardHeader>
          <CardTitle>{t("auth.activateTitle")}</CardTitle>
          <CardDescription>
            {token ? t("auth.activateSubtitle") : t("auth.missingToken")}
          </CardDescription>
        </CardHeader>
        {token && (
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <FieldGroup>
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
                <Button type="submit" disabled={activate.isPending}>
                  {t("auth.activate")}
                </Button>
                <FieldDescription className="text-center">
                  <Link to="/login">{t("auth.login")}</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </CardContent>
        )}
      </Card>
    </PublicShell>
  )
}
