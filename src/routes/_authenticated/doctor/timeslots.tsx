import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute } from "@tanstack/react-router"
import { eachDayOfInterval, isWeekend, parseISO } from "date-fns"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FieldDescription, FieldGroup } from "@/components/ui/field"
import { DateField } from "@/components/form/fields"
import {
  generateTimeSlotsSchema,
  type GenerateTimeSlotsValues,
} from "@/features/timeslots/schemas"
import { useGenerateTimeSlots } from "@/features/timeslots/hooks"
import { handleFormApiError } from "@/lib/api-error"
import { todayISO } from "@/lib/format"

export const Route = createFileRoute("/_authenticated/doctor/timeslots")({
  component: GenerateTimeSlotsPage,
})

const SLOTS_PER_DAY = 16 

function GenerateTimeSlotsPage() {
  const { t } = useTranslation()
  const generate = useGenerateTimeSlots()

  const form = useForm<GenerateTimeSlotsValues>({
    resolver: zodResolver(generateTimeSlotsSchema),
   
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { fromDate: "", toDate: "" },
  })

  
  const fromDate = form.watch("fromDate")
  const toDate = form.watch("toDate")

  
  useEffect(() => {
    if (toDate && form.formState.touchedFields.toDate) {
      void form.trigger("toDate")
    }
  }, [fromDate, toDate, form])

  
  const workingDays =
    fromDate && toDate && toDate >= fromDate
      ? eachDayOfInterval({
          start: parseISO(fromDate),
          end: parseISO(toDate),
        }).filter((day) => !isWeekend(day)).length
      : 0

  const onSubmit = (values: GenerateTimeSlotsValues) => {
    generate.mutate(values, {
      onSuccess: () => form.reset(),
      onError: (error) => handleFormApiError(error, form.setError, t),
    })
  }

  return (
    <>
      <PageHeader
        title={t("timeslots.title")}
        description={t("timeslots.subtitle")}
      />
      <Card className="max-w-xl">
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <div className="grid gap-7 sm:grid-cols-2 sm:gap-4">
                <DateField
                  control={form.control}
                  name="fromDate"
                  label="form.fromDate"
                  min={todayISO()}
                />
                <DateField
                  control={form.control}
                  name="toDate"
                  label="form.toDate"
                  // the earliest valid end date follows the chosen start date
                  min={fromDate || todayISO()}
                />
              </div>
              {workingDays > 0 && (
                <FieldDescription>
                  {t("timeslots.preview", {
                    count: workingDays * SLOTS_PER_DAY,
                    days: workingDays,
                  })}
                </FieldDescription>
              )}
              <Button
                type="submit"
                disabled={generate.isPending}
                className="w-fit"
              >
                {t("timeslots.generate")}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
