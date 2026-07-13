import { format, parseISO } from "date-fns"
import { el as elLocale, enUS } from "date-fns/locale"

import i18n from "@/i18n"


export function formatDate(isoDate: string): string {
  const locale = i18n.language === "el" ? elLocale : enUS
  return format(parseISO(isoDate), "EEE dd MMM yyyy", { locale })
}

export function formatTime(time: string): string {
  return time.slice(0, 5) 
}

export function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)} – ${formatTime(end)}`
}

export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd")
}
