import { isAxiosError } from "axios"
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        
        if (
          isAxiosError(error) &&
          error.response &&
          error.response.status < 500
        ) {
          return false
        }
        return failureCount < 2
      },
    },
  },
})
