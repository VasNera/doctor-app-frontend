import { differenceInCalendarDays, parseISO } from "date-fns"
import { z } from "zod"

import { todayISO } from "@/lib/format"

const MAX_RANGE_DAYS = 60


export const generateTimeSlotsSchema = z
  .object({
    fromDate: z.string().min(1, "validation.fromDate.notNull"),
    toDate: z.string().min(1, "validation.toDate.notNull"),
  })
  .refine((v) => !v.fromDate || v.fromDate >= todayISO(), {
    error: "validation.fromDate.futureOrPresent",
    path: ["fromDate"],
  })
  .refine((v) => !v.fromDate || !v.toDate || v.toDate >= v.fromDate, {
    error: "validation.toDate.beforeFrom",
    path: ["toDate"],
  })
  .refine(
    (v) =>
      !v.fromDate ||
      !v.toDate ||
      differenceInCalendarDays(parseISO(v.toDate), parseISO(v.fromDate)) <=
        MAX_RANGE_DAYS,
    { error: "validation.dateRange.tooLarge", path: ["toDate"] }
  )
export type GenerateTimeSlotsValues = z.infer<typeof generateTimeSlotsSchema>
