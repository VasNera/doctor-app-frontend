import { z } from "zod"

export const PASSWORD_REGEX =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).{8,}$/


export const loginSchema = z.object({
  username: z.string().min(1, "validation.username.notBlank"),
  password: z.string().min(1, "validation.password.notBlank"),
})
export type LoginValues = z.infer<typeof loginSchema>

export const userInsertSchema = z.object({
  username: z
    .string()
    .min(1, "validation.username.notBlank")
    .min(2, "validation.username.size")
    .max(30, "validation.username.size"),
  password: z
    .string()
    .min(1, "validation.password.notBlank")
    .regex(PASSWORD_REGEX, "validation.password.pattern"),
})
export type UserInsertValues = z.infer<typeof userInsertSchema>


export const patientRegisterSchema = z.object({
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
  amka: z.string().regex(/^\d{11}$/, "validation.amka.pattern"),
  phoneNumber: z.string().min(1, "validation.phoneNumber.notNull"),
  userInsertDTO: userInsertSchema,
})
export type PatientRegisterValues = z.infer<typeof patientRegisterSchema>

export const activateDoctorSchema = z.object({
  userInsertDTO: userInsertSchema,
})
export type ActivateDoctorValues = z.infer<typeof activateDoctorSchema>
