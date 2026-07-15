import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { timeSlotsApi } from "./api"
import { timeSlotKeys } from "./queries"

export function useGenerateTimeSlots() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: timeSlotsApi.generate,
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: timeSlotKeys.all })
      toast.success(t("timeslots.generateSuccess", { count: created.length }))
    },
  })
}
