import { api } from "@/api/axios"
import type { Page, PageParams, TimeSlotReadOnlyDTO } from "@/api/types"
import type { GenerateTimeSlotsValues } from "./schemas"

export const timeSlotsApi = {
 
  generate: async (values: GenerateTimeSlotsValues) => {
    const { data } = await api.post<TimeSlotReadOnlyDTO[]>(
      "/timeslots/generate",
      values
    )
    return data
  },

  getAvailable: async (
    doctorUuid: string,
    date: string | undefined,
    params: PageParams
  ) => {
    const { data } = await api.get<Page<TimeSlotReadOnlyDTO>>(
      "/timeslots/available",
      { params: { doctorUuid, date, ...params } }
    )
    return data
  },
}
