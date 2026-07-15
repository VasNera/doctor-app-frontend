import { z } from "zod"

import { SPECIALTIES } from "@/api/types"

export const LICENCE_REGEX = /^DOC-\d{4}-\d{5}$/

export const doctorInsertSchema = z.object({
  firstname: z
    .string()
    .min(1, "validation.firstname.notBlank")
    .min(2, "validation.firstname.size")
    .max(30, "validation.firstname.size"),
  lastname: z
    .string()
    .min(1, "validation.lastname.notBlank")
    .min(2, "validation.lastname.size")
    .max(30, "validation.lastname.size"),
  email: z
    .string()
    .min(1, "validation.email.notBlank")
    .pipe(z.email("validation.email.invalid")),
  phoneNumber: z.string().min(1, "validation.phoneNumber.notNull"),
  licenceNumber: z
    .string()
    .min(1, "validation.licence.notBlank")
    .regex(LICENCE_REGEX, "validation.licence.pattern"),
  specialty: z.enum(SPECIALTIES, "validation.specialty.notNull"),
})
export type DoctorInsertValues = z.infer<typeof doctorInsertSchema>
