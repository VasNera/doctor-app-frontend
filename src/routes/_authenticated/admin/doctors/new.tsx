import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { SPECIALTIES } from "@/api/types"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { SelectField, TextField } from "@/components/form/fields"
import {
  doctorInsertSchema,
  type DoctorInsertValues,
} from "@/features/doctors/schemas"
import { useCreateDoctor } from "@/features/doctors/hooks"
import { handleFormApiError } from "@/lib/api-error"

export const Route = createFileRoute("/_authenticated/admin/doctors/new")({
  component: CreateDoctorPage,
})

function CreateDoctorPage() {
  const { t } = useTranslation()
  const createDoctor = useCreateDoctor()

  const form = useForm<DoctorInsertValues>({
    resolver: zodResolver(doctorInsertSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phoneNumber: "",
      licenceNumber: "",
      specialty: undefined,
    },
  })

  const onSubmit = (values: DoctorInsertValues) => {
    createDoctor.mutate(values, {
      onError: (error) => handleFormApiError(error, form.setError, t),
    })
  }

  return (
    <>
      <PageHeader
        title={t("doctors.createTitle")}
        description={t("doctors.createSubtitle")}
      />
      <Card className="max-w-xl">
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <div className="grid gap-7 sm:grid-cols-2 sm:gap-4">
                <TextField
                  control={form.control}
                  name="firstname"
                  label="form.firstname"
                />
                <TextField
                  control={form.control}
                  name="lastname"
                  label="form.lastname"
                />
              </div>
              <TextField
                control={form.control}
                name="email"
                label="form.email"
                type="email"
              />
              <div className="grid gap-7 sm:grid-cols-2 sm:gap-4">
                <TextField
                  control={form.control}
                  name="phoneNumber"
                  label="form.phoneNumber"
                  type="tel"
                />
                <TextField
                  control={form.control}
                  name="licenceNumber"
                  label="form.licenceNumber"
                  description="form.licenceNumberHint"
                  placeholder="DOC-1234-56789"
                />
              </div>
              <SelectField
                control={form.control}
                name="specialty"
                label="form.specialty"
                placeholder="form.selectSpecialty"
                options={SPECIALTIES.map((value) => ({
                  value,
                  label: t(`specialty.${value}`),
                }))}
              />
              <Button
                type="submit"
                disabled={createDoctor.isPending}
                className="w-fit"
              >
                {t("doctors.create")}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
