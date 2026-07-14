import type { ReactNode } from "react"

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher"


export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-sm md:max-w-md">{children}</div>
    </div>
  )
}
