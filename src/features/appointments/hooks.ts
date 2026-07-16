import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { timeSlotKeys } from "@/features/timeslots/queries"
import { toastApiError } from "@/lib/api-error"
import { appointmentsApi } from "./api"
import { appointmentKeys } from "./queries"

export function useBookAppointment() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: appointmentsApi.book,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
      void queryClient.invalidateQueries({ queryKey: timeSlotKeys.all })
      toast.success(t("booking.bookSuccess"))
      void navigate({ to: "/patient/appointments" })
    },
  })
}

export function useCancelAppointment() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: appointmentsApi.cancel,
    onSuccess: () => {
      // Cancelling frees the slot (back to AVAILABLE) — refresh both.
      void queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
      void queryClient.invalidateQueries({ queryKey: timeSlotKeys.all })
      toast.success(t("appointments.cancelSuccess"))
    },
    onError: (error) => toastApiError(error, t),
  })
}
