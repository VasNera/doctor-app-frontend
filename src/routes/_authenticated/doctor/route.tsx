import { createFileRoute, redirect } from "@tanstack/react-router"

import { roleHome } from "@/lib/auth"

export const Route = createFileRoute("/_authenticated/doctor")({
  beforeLoad: ({ context }) => {
    if (context.user.role !== "DOCTOR") {
      throw redirect({ to: roleHome(context.user.role) })
    }
  },
})
