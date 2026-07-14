import { useQueryErrorResetBoundary } from "@tanstack/react-query"
import { useRouter, type ErrorComponentProps } from "@tanstack/react-router"
import { TriangleAlertIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { getApiErrorMessage } from "@/lib/api-error"


export function ErrorState({ error, reset }: ErrorComponentProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  const handleRetry = () => {
    queryErrorResetBoundary.reset() 
    reset() 
    void router.invalidate() 
  }

  return (
    <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <TriangleAlertIcon className="size-10 text-destructive" />
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{t("errors.pageTitle")}</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          {getApiErrorMessage(error, t)}
        </p>
      </div>
      <Button onClick={handleRetry}>{t("errors.retry")}</Button>
    </div>
  )
}
