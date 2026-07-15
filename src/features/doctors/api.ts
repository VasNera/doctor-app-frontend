import { api } from "@/api/axios"
import type { DoctorReadOnlyDTO, Page, PageParams } from "@/api/types"
import type { DoctorInsertValues } from "./schemas"

export const doctorsApi = {
  getDoctors: async (params: PageParams) => {
    const { data } = await api.get<Page<DoctorReadOnlyDTO>>("/doctors", {
      params,
    })
    return data
  },

  createDoctor: async (values: DoctorInsertValues) => {
    const { data } = await api.post<DoctorReadOnlyDTO>("/doctors", values)
    return data
  },
}
