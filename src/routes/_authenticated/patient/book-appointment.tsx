import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { XIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import type { TimeSlotReadOnlyDTO } from "@/api/types"
import { PaginationControls } from "@/components/data/PaginationControls"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ComboboxField, TextareaField } from "@/components/form/fields"
import {
  bookAppointmentSchema,
  type BookAppointmentValues,
} from "@/features/appointments/schemas"
import { useBookAppointment } from "@/features/appointments/hooks"
import { doctorsDropdownOptions } from "@/features/doctors/queries"
import { availableSlotsOptions } from "@/features/timeslots/queries"
import { handleFormApiError } from "@/lib/api-error"
import { formatDate, formatTime, formatTimeRange, todayISO } from "@/lib/format"

export const Route = createFileRoute("/_authenticated/patient/book-appointment")(
  {
   
    loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(doctorsDropdownOptions()),
    component: BookAppointmentPage,
  }
)

function BookAppointmentPage() {
  const { t } = useTranslation()
  const { data: doctors } = useSuspenseQuery(doctorsDropdownOptions())
  const bookAppointment = useBookAppointment()

  const form = useForm<BookAppointmentValues>({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: {
      doctorUuid: "",
      date: "",
      reason: "",
      timeSlotId: undefined as unknown as number,
    },
  })

  // What the user picked drives the dependent slot search (dependent query
  // pattern: the route can't know these, only interaction can).
  const doctorUuid = form.watch("doctorUuid")
  const date = form.watch("date")

  const [slotsPage, setSlotsPage] = useState(0)
  const slotsQuery = useQuery({
    ...availableSlotsOptions(doctorUuid, date || undefined, slotsPage),
    enabled: doctorUuid !== "",
  })

  useEffect(() => {
    setSlotsPage(0)
    form.resetField("timeSlotId")
  }, [doctorUuid, date, form])

  const [selectedSlot, setSelectedSlot] = useState<TimeSlotReadOnlyDTO | null>(
    null
  )

  const pickSlot = (slot: TimeSlotReadOnlyDTO) => {
    form.setValue("timeSlotId", slot.id, { shouldValidate: true })
    setSelectedSlot(slot)
  }

  const closeDialog = () => {
    setSelectedSlot(null)
    form.resetField("timeSlotId")
    form.resetField("reason")
  }

  const onSubmit = (values: BookAppointmentValues) => {
    bookAppointment.mutate(
      { timeSlotId: values.timeSlotId, reason: values.reason || undefined },
      { onError: (error) => handleFormApiError(error, form.setError, t) }
    )
  }

  const selectedDoctor = doctors.find((doctor) => doctor.uuid === doctorUuid)

  const slotsByDate = (slotsQuery.data?.content ?? []).reduce<
    Map<string, TimeSlotReadOnlyDTO[]>
  >((groups, slot) => {
    const slots = groups.get(slot.date) ?? []
    groups.set(slot.date, [...slots, slot])
    return groups
  }, new Map())

  return (
    <>
      <PageHeader
        title={t("booking.title")}
        description={t("booking.subtitle")}
      />
      <Card className="max-w-3xl">
        <CardContent>
          <FieldGroup>
            <div className="grid gap-7 sm:grid-cols-2 sm:gap-4">
              <ComboboxField
                control={form.control}
                name="doctorUuid"
                label="booking.selectDoctor"
                items={doctors}
                getValue={(doctor) => doctor.uuid}
                getLabel={(doctor) =>
                  `${doctor.lastname} ${doctor.firstname} — ${t(
                    `specialty.${doctor.specialty}`
                  )}`
                }
                placeholder="booking.selectDoctor"
                searchPlaceholder="booking.searchDoctor"
                emptyText="booking.noDoctors"
              />
              <Field>
                <FieldLabel htmlFor="date-filter">
                  {t("booking.filterByDate")}
                </FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id="date-filter"
                    type="date"
                    min={todayISO()}
                    value={date ?? ""}
                    onChange={(e) => form.setValue("date", e.target.value)}
                  />
                  {date && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t("booking.clearDate")}
                      onClick={() => form.setValue("date", "")}
                    >
                      <XIcon />
                    </Button>
                  )}
                </div>
              </Field>
            </div>

            <Field>
              <FieldLabel>{t("booking.availableSlots")}</FieldLabel>
              {doctorUuid === "" ? (
                <p className="text-sm text-muted-foreground">
                  {t("booking.pickDoctorFirst")}
                </p>
              ) : slotsQuery.isPending ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {Array.from({ length: 8 }, (_, i) => (
                    <Skeleton key={i} className="h-9" />
                  ))}
                </div>
              ) : slotsQuery.data && !slotsQuery.data.empty ? (
                <div className="flex flex-col gap-4">
                  {[...slotsByDate.entries()].map(([day, slots]) => (
                    <div key={day} className="flex flex-col gap-2">
                      <span className="text-sm font-medium">
                        {formatDate(day)}
                      </span>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {slots.map((slot) => (
                          <Button
                            key={slot.id}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => pickSlot(slot)}
                          >
                            {formatTime(slot.startTime)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <PaginationControls
                    page={slotsQuery.data}
                    onPageChange={setSlotsPage}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("booking.noSlots")}
                </p>
              )}
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Dialog
        open={selectedSlot !== null}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <DialogHeader>
              <DialogTitle>{t("booking.confirmTitle")}</DialogTitle>
              <DialogDescription>
                {selectedSlot &&
                  selectedDoctor &&
                  t("booking.confirmDescription", {
                    doctor: `${selectedDoctor.lastname} ${selectedDoctor.firstname}`,
                    date: formatDate(selectedSlot.date),
                    time: formatTimeRange(
                      selectedSlot.startTime,
                      selectedSlot.endTime
                    ),
                  })}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <TextareaField
                control={form.control}
                name="reason"
                label="form.reason"
                placeholder="form.reasonPlaceholder"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                {t("actions.cancel")}
              </Button>
              <Button type="submit" disabled={bookAppointment.isPending}>
                {t("booking.book")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
