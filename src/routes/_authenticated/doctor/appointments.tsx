import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { APPOINTMENT_STATUSES } from "@/api/types"
import { PageHeader } from "@/components/layout/PageHeader"
import { AppointmentsView } from "@/features/appointments/AppointmentsView"
import { doctorAppointmentsOptions } from "@/features/appointments/queries"

const searchSchema = z.object({
  page: z.number().int().min(0).catch(0),
  status: z.enum(APPOINTMENT_STATUSES).optional().catch(undefined),
})

export const Route = createFileRoute("/_authenticated/doctor/appointments")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.ensureQueryData(doctorAppointmentsOptions(deps)),
  component: DoctorAppointmentsPage,
})

function DoctorAppointmentsPage() {
  const { t } = useTranslation()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const { data, isFetching } = useSuspenseQuery(
    doctorAppointmentsOptions(search)
  )

  return (
    <>
      <PageHeader title={t("appointments.doctorTitle")} />
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
        showDoctor={false}
      />
    </>
  )
}
