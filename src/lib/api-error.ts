import { isAxiosError } from "axios"
import { toast } from "sonner"
import type { TFunction } from "i18next"
import type { FieldValues, Path, UseFormSetError } from "react-hook-form"

import type {
  ErrorResponseDTO,
  ValidationErrorResponseDTO,
} from "@/api/types"

export function getApiError(error: unknown): ErrorResponseDTO | null {
  if (isAxiosError<ErrorResponseDTO>(error) && error.response?.data?.code) {
    return error.response.data
  }
  return null
}

function isValidationError(
  data: ErrorResponseDTO
): data is ValidationErrorResponseDTO {
  return "errors" in data && typeof data.errors === "object"
}


export function getApiErrorMessage(error: unknown, t: TFunction): string {
  const apiError = getApiError(error)
  if (apiError) {
    return t(`errors.${apiError.code}`, { defaultValue: apiError.message })
  }
  return isAxiosError(error) && !error.response
    ? t("errors.network")
    : t("errors.generic")
}

export function toastApiError(error: unknown, t: TFunction): void {
  toast.error(getApiErrorMessage(error, t))
}

export function applyServerFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
): boolean {
  const apiError = getApiError(error)
  if (!apiError || !isValidationError(apiError)) return false

  const entries = Object.entries(apiError.errors)
  if (entries.length === 0) return false

  for (const [field, message] of entries) {
    setError(field as Path<T>, { type: "server", message })
  }
  return true
}

export function handleFormApiError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  t: TFunction
): void {
  if (!applyServerFieldErrors(error, setError)) toastApiError(error, t)
}
