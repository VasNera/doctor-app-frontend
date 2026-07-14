import { createFileRoute, redirect } from "@tanstack/react-router"

import { roleHome } from "@/lib/auth"

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    const user = context.auth.getUser()
    throw redirect({ to: user ? roleHome(user.role) : "/login" })
  },
})
