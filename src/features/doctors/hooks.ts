import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { doctorsApi } from "./api"
import { doctorKeys } from "./queries"

export function useCreateDoctor() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: doctorsApi.createDoctor,
    onSuccess: () => {
      
      void queryClient.invalidateQueries({ queryKey: doctorKeys.all })
      toast.success(t("doctors.createSuccess"))
      void navigate({ to: "/admin/doctors" })
    },
  })
}
