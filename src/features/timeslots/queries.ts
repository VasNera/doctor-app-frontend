import { keepPreviousData, queryOptions } from "@tanstack/react-query"

import { timeSlotsApi } from "./api"

export const timeSlotKeys = {
  all: ["timeslots"] as const,
  available: (doctorUuid: string, date: string | undefined, page: number) =>
    [...timeSlotKeys.all, "available", { doctorUuid, date, page }] as const,
}

export const availableSlotsOptions = (
  doctorUuid: string,
  date: string | undefined,
  page: number
) =>
  queryOptions({
    queryKey: timeSlotKeys.available(doctorUuid, date, page),
    queryFn: () =>
      timeSlotsApi.getAvailable(doctorUuid, date, {
        page,
        size: 16,
        sort: ["date,asc", "startTime,asc"],
      }),
    placeholderData: keepPreviousData,
  })
