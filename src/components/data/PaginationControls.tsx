import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

import type { Page } from "@/api/types"
import { Button } from "@/components/ui/button"

interface PaginationControlsProps {
  page: Page<unknown>
  onPageChange: (page: number) => void
}

export function PaginationControls({
  page,
  onPageChange,
}: PaginationControlsProps) {
  const { t } = useTranslation()
  if (page.totalPages <= 1) return null

  return (
    <div className="flex items-center justify-end gap-4">
      <span className="text-sm text-muted-foreground">
        {t("actions.pageOf", {
          page: page.number + 1,
          total: page.totalPages,
        })}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page.first}
          aria-label={t("actions.previous")}
          onClick={() => onPageChange(page.number - 1)}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page.last}
          aria-label={t("actions.next")}
          onClick={() => onPageChange(page.number + 1)}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  )
}
