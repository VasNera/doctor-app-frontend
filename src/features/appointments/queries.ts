import { keepPreviousData, queryOptions } from "@tanstack/react-query"

import type { AppointmentStatus } from "@/api/types"
import { appointmentsApi } from "./api"

export interface AppointmentSearch {
  page: number
  status?: AppointmentStatus
}

export const appointmentKeys = {
  all: ["appointments"] as const,
  patient: (search: AppointmentSearch) =>
    [...appointmentKeys.all, "patient", search] as const,
  doctor: (search: AppointmentSearch) =>
    [...appointmentKeys.all, "doctor", search] as const,
}

const toParams = ({ page, status }: AppointmentSearch) => ({
  page,
  size: 10,
  sort: ["timeSlot.date,desc", "timeSlot.startTime,asc"],
  appointmentStatus: status,
})

export const patientAppointmentsOptions = (search: AppointmentSearch) =>
  queryOptions({
    queryKey: appointmentKeys.patient(search),
    queryFn: () => appointmentsApi.getForPatient(toParams(search)),
    placeholderData: keepPreviousData,
  })

export const doctorAppointmentsOptions = (search: AppointmentSearch) =>
  queryOptions({
    queryKey: appointmentKeys.doctor(search),
    queryFn: () => appointmentsApi.getForDoctor(toParams(search)),
    placeholderData: keepPreviousData,
  })
