import { useTranslation } from "react-i18next"

import type { AppointmentStatus } from "@/api/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  PENDING:
    "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  CONFIRMED:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  CANCELLED: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200",
  COMPLETED: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200",
}

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const { t } = useTranslation()
  return (
    <Badge variant="secondary" className={cn(STATUS_STYLES[status])}>
      {t(`appointmentStatus.${status}`)}
    </Badge>
  )
}
