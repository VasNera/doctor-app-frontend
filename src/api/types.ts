
export const SPECIALTIES = [
  "CARDIOLOGY",
  "DERMATOLOGY",
  "ORTHOPEDICS",
  "NEUROLOGY",
  "PEDIATRICS",
  "GYNECOLOGY",
  "UROLOGY",
  "GASTROENTEROLOGY",
  "PSYCHIATRY",
] as const
export type Specialty = (typeof SPECIALTIES)[number]

export const APPOINTMENT_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
] as const
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number]

export const TIME_SLOT_STATUSES = ["AVAILABLE", "BOOKED", "BLOCKED"] as const
export type TimeSlotStatus = (typeof TIME_SLOT_STATUSES)[number]

export const ROLES = ["ADMIN", "DOCTOR", "PATIENT"] as const
export type Role = (typeof ROLES)[number]


export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface PageParams {
  page?: number
  size?: number
  sort?: string | string[]
}

export interface AuthenticationResponseDTO {
  token: string
}

export interface PatientReadOnlyDTO {
  uuid: string
  firstname: string
  lastname: string
  email: string
  phoneNumber: string
}

export interface DoctorReadOnlyDTO {
  uuid: string
  firstname: string
  lastname: string
  email: string
  specialty: Specialty
}

export interface TimeSlotReadOnlyDTO {
  id: number
  date: string
  startTime: string
  endTime: string
  status: TimeSlotStatus
}

export interface AppointmentReadOnlyDTO {
  uuid: string
  reason: string | null
  date: string
  startTime: string
  endTime: string
  status: AppointmentStatus
  doctorFirstname: string
  doctorLastname: string
  specialty: Specialty
}

export interface ErrorResponseDTO {
  code: string
  message: string
}

export interface ValidationErrorResponseDTO extends ErrorResponseDTO {
  errors: Record<string, string>
}
