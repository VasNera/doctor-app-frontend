import { createRouter } from "@tanstack/react-router"
import type { QueryClient } from "@tanstack/react-query"

import { ErrorState } from "@/components/layout/ErrorState"
import { auth, type AuthStore } from "@/lib/auth"
import { queryClient } from "@/lib/query-client"
import { routeTree } from "./routeTree.gen"


export interface RouterContext {
  queryClient: QueryClient
  auth: AuthStore
}

export const router = createRouter({
  routeTree,
  context: { queryClient, auth },
  defaultPreload: "intent",
  // Shown whenever a route's loader/component throws (e.g. a query fails).
  defaultErrorComponent: ErrorState,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
