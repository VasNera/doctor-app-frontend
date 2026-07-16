import { useState } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { APPOINTMENT_STATUSES, type AppointmentReadOnlyDTO } from "@/api/types"
import { PageHeader } from "@/components/layout/PageHeader"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { AppointmentsView } from "@/features/appointments/AppointmentsView"
import { useCancelAppointment } from "@/features/appointments/hooks"
import { patientAppointmentsOptions } from "@/features/appointments/queries"
import { formatDate, formatTimeRange } from "@/lib/format"


const searchSchema = z.object({
  page: z.number().int().min(0).catch(0),
  status: z.enum(APPOINTMENT_STATUSES).optional().catch(undefined),
})

export const Route = createFileRoute("/_authenticated/patient/appointments")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.ensureQueryData(patientAppointmentsOptions(deps)),
  component: PatientAppointmentsPage,
})

const CANCELLABLE = ["PENDING", "CONFIRMED"]

function PatientAppointmentsPage() {
  const { t } = useTranslation()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const { data, isFetching } = useSuspenseQuery(
    patientAppointmentsOptions(search)
  )
  const cancelAppointment = useCancelAppointment()
  const [toCancel, setToCancel] = useState<AppointmentReadOnlyDTO | null>(null)

  return (
    <>
      <PageHeader title={t("appointments.title")} />
      <AppointmentsView
        page={data}
        isFetching={isFetching}
        status={search.status}
        onStatusChange={(status) =>
          void navigate({ search: { status, page: 0 } })
        }
        onPageChange={(page) =>
          void navigate({ search: (prev) => ({ ...prev, page }) })
        }
        showDoctor
        actions={(row) =>
          CANCELLABLE.includes(row.status) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setToCancel(row)}
            >
              {t("appointments.cancel")}
            </Button>
          )
        }
      />

      <AlertDialog
        open={toCancel !== null}
        onOpenChange={(open) => !open && setToCancel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("appointments.cancelTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {toCancel &&
                t("appointments.cancelDescription", {
                  date: formatDate(toCancel.date),
                  time: formatTimeRange(toCancel.startTime, toCancel.endTime),
                })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("actions.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              disabled={cancelAppointment.isPending}
              onClick={() => {
                if (toCancel) cancelAppointment.mutate(toCancel.uuid)
                setToCancel(null)
              }}
            >
              {t("appointments.cancelConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
