import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import type {
  AppointmentReadOnlyDTO,
  AppointmentStatus,
  Page,
} from "@/api/types"
import { APPOINTMENT_STATUSES } from "@/api/types"
import { PaginatedTable, type Column } from "@/components/data/PaginatedTable"
import { StatusBadge } from "@/components/data/StatusBadge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDate, formatTimeRange } from "@/lib/format"

const ALL = "ALL"

interface AppointmentsViewProps {
  page: Page<AppointmentReadOnlyDTO>
  isFetching: boolean
  status: AppointmentStatus | undefined
  onStatusChange: (status: AppointmentStatus | undefined) => void
  onPageChange: (page: number) => void
  
  showDoctor: boolean
  actions?: (row: AppointmentReadOnlyDTO) => ReactNode
}


export function AppointmentsView({
  page,
  isFetching,
  status,
  onStatusChange,
  onPageChange,
  showDoctor,
  actions,
}: AppointmentsViewProps) {
  const { t } = useTranslation()

  const columns: Column<AppointmentReadOnlyDTO>[] = [
    {
      key: "date",
      header: t("appointments.date"),
      cell: (row) => formatDate(row.date),
    },
    {
      key: "time",
      header: t("appointments.time"),
      cell: (row) => formatTimeRange(row.startTime, row.endTime),
    },
    ...(showDoctor
      ? [
          {
            key: "doctor",
            header: t("appointments.doctor"),
            cell: (row) =>
              `${row.doctorLastname} ${row.doctorFirstname} — ${t(
                `specialty.${row.specialty}`
              )}`,
          } satisfies Column<AppointmentReadOnlyDTO>,
        ]
      : []),
    {
      key: "reason",
      header: t("appointments.reason"),
      cell: (row) => (
        <span className="text-muted-foreground">{row.reason || "—"}</span>
      ),
      className: "max-w-48 truncate",
    },
    {
      key: "status",
      header: t("appointments.status"),
      cell: (row) => <StatusBadge status={row.status} />,
    },
    ...(actions
      ? [
          {
            key: "actions",
            header: "",
            cell: actions,
            className: "text-right",
          } satisfies Column<AppointmentReadOnlyDTO>,
        ]
      : []),
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Select
          value={status ?? ALL}
          
          items={[
            { value: ALL, label: t("appointments.allStatuses") },
            ...APPOINTMENT_STATUSES.map((value) => ({
              value,
              label: t(`appointmentStatus.${value}`),
            })),
          ]}
          onValueChange={(value) =>
            onStatusChange(
              value === ALL ? undefined : (value as AppointmentStatus)
            )
          }
        >
          <SelectTrigger
            className="w-52"
            aria-label={t("appointments.filterByStatus")}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("appointments.allStatuses")}</SelectItem>
            {APPOINTMENT_STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {t(`appointmentStatus.${value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <PaginatedTable
        columns={columns}
        page={page}
        rowKey={(row) => row.uuid}
        onPageChange={onPageChange}
        emptyMessage={t("appointments.empty")}
        isFetching={isFetching}
      />
    </div>
  )
}
