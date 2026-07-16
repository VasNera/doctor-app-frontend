import { z } from "zod"


export const bookAppointmentSchema = z.object({
  doctorUuid: z.string().min(1, "validation.doctor.notNull"),
  date: z.string().optional(),
  timeSlotId: z.number("validation.timeSlot.notNull"),
  reason: z.string().optional(),
})
export type BookAppointmentValues = z.infer<typeof bookAppointmentSchema>
