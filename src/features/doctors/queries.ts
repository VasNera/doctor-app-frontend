import { keepPreviousData, queryOptions } from "@tanstack/react-query"

import type { PageParams } from "@/api/types"
import { doctorsApi } from "./api"


export const doctorKeys = {
  all: ["doctors"] as const,
  lists: () => [...doctorKeys.all, "list"] as const,
  list: (params: PageParams) => [...doctorKeys.lists(), params] as const,
  dropdown: () => [...doctorKeys.all, "dropdown"] as const,
}


export const doctorsListOptions = (params: PageParams) =>
  queryOptions({
    queryKey: doctorKeys.list(params),
    queryFn: () => doctorsApi.getDoctors(params),
    placeholderData: keepPreviousData, // no flash while paging
  })


export const doctorsDropdownOptions = () =>
  queryOptions({
    queryKey: doctorKeys.dropdown(),
    queryFn: () =>
      doctorsApi.getDoctors({ page: 0, size: 1000, sort: "lastname,asc" }),
    select: (page) => page.content, 
    staleTime: Infinity,
    gcTime: Infinity,
  })
