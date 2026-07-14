import { createFileRoute, redirect } from "@tanstack/react-router"

import { roleHome } from "@/lib/auth"

export const Route = createFileRoute("/_authenticated/patient")({
  beforeLoad: ({ context }) => {
    if (context.user.role !== "PATIENT") {
      throw redirect({ to: roleHome(context.user.role) })
    }
  },
})
