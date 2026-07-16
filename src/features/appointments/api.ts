import { api } from "@/api/axios"
import type {
  AppointmentReadOnlyDTO,
  AppointmentStatus,
  Page,
  PageParams,
} from "@/api/types"


export interface AppointmentInsertDTO {
  reason?: string
  timeSlotId: number
}

export interface AppointmentListParams extends PageParams {
  appointmentStatus?: AppointmentStatus
}

export const appointmentsApi = {
  book: async (payload: AppointmentInsertDTO) => {
    const { data } = await api.post<AppointmentReadOnlyDTO>(
      "/appointments",
      payload
    )
    return data
  },

  getForPatient: async (params: AppointmentListParams) => {
    const { data } = await api.get<Page<AppointmentReadOnlyDTO>>(
      "/appointments/patient",
      { params }
    )
    return data
  },

  getForDoctor: async (params: AppointmentListParams) => {
    const { data } = await api.get<Page<AppointmentReadOnlyDTO>>(
      "/appointments/doctor",
      { params }
    )
    return data
  },

  cancel: async (uuid: string) => {
    const { data } = await api.patch<AppointmentReadOnlyDTO>(
      `/appointments/${uuid}/cancel`
    )
    return data
  },
}
