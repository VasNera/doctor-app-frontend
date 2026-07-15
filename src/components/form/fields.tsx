import { useState } from "react"
import { CheckIcon, ChevronsUpDownIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// Every wrapper collapses the Field/Label/Control/Error boilerplate into a
// single line at the call site. `label`, `description` and zod `message`s are
// i18n KEYS — translated here, at render time, so a language switch instantly
// re-translates both labels and any visible validation errors.

interface BaseFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  description?: string
}

// FieldError content is translated through this tiny helper.
function useFieldError() {
  const { t } = useTranslation()
  return (message?: string) =>
    message ? <FieldError>{t(message, { defaultValue: message })}</FieldError> : null
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  type = "text",
  placeholder,
  autoComplete,
}: BaseFieldProps<T> & {
  type?: string
  placeholder?: string
  autoComplete?: string
}) {
  const { t } = useTranslation()
  const renderError = useFieldError()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{t(label)}</FieldLabel>
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            aria-invalid={fieldState.invalid}
          />
          {description && <FieldDescription>{t(description)}</FieldDescription>}
          {renderError(fieldState.error?.message)}
        </Field>
      )}
    />
  )
}

export function PasswordField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  autoComplete = "current-password",
}: BaseFieldProps<T> & { autoComplete?: string }) {
  const { t } = useTranslation()
  const renderError = useFieldError()
  const [visible, setVisible] = useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{t(label)}</FieldLabel>
          <div className="relative">
            <Input
              {...field}
              id={name}
              type={visible ? "text" : "password"}
              autoComplete={autoComplete}
              aria-invalid={fieldState.invalid}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-1 size-7 -translate-y-1/2 text-muted-foreground"
              aria-label={t(visible ? "form.hidePassword" : "form.showPassword")}
              onClick={() => setVisible((v) => !v)}
            >
              {visible ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>
          {description && <FieldDescription>{t(description)}</FieldDescription>}
          {renderError(fieldState.error?.message)}
        </Field>
      )}
    />
  )
}

export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
}: BaseFieldProps<T> & { placeholder?: string }) {
  const { t } = useTranslation()
  const renderError = useFieldError()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{t(label)}</FieldLabel>
          <Textarea
            {...field}
            id={name}
            placeholder={placeholder ? t(placeholder) : undefined}
            aria-invalid={fieldState.invalid}
          />
          {description && <FieldDescription>{t(description)}</FieldDescription>}
          {renderError(fieldState.error?.message)}
        </Field>
      )}
    />
  )
}

// Native <input type="date"> emits "yyyy-MM-dd" — exactly what the backend's
// LocalDate expects, with zero timezone conversions.
export function DateField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  min,
  max,
}: BaseFieldProps<T> & { min?: string; max?: string }) {
  const { t } = useTranslation()
  const renderError = useFieldError()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{t(label)}</FieldLabel>
          <Input
            {...field}
            id={name}
            type="date"
            min={min}
            max={max}
            aria-invalid={fieldState.invalid}
          />
          {description && <FieldDescription>{t(description)}</FieldDescription>}
          {renderError(fieldState.error?.message)}
        </Field>
      )}
    />
  )
}

export interface SelectOption {
  value: string
  label: string
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  options,
}: BaseFieldProps<T> & { placeholder?: string; options: SelectOption[] }) {
  const { t } = useTranslation()
  const renderError = useFieldError()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{t(label)}</FieldLabel>
          <Select
            value={field.value ?? null}
            // lets SelectValue render the option label instead of the raw value
            items={options}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger
              id={name}
              aria-invalid={fieldState.invalid}
              onBlur={field.onBlur}
            >
              <SelectValue placeholder={placeholder ? t(placeholder) : undefined} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FieldDescription>{t(description)}</FieldDescription>}
          {renderError(fieldState.error?.message)}
        </Field>
      )}
    />
  )
}

// Searchable dropdown over data cached with staleTime: Infinity.
// Client-side filtering (cmdk) is fine because the whole list is in the cache.
export function ComboboxField<T extends FieldValues, TItem>({
  control,
  name,
  label,
  description,
  items,
  getValue,
  getLabel,
  placeholder,
  searchPlaceholder,
  emptyText,
}: BaseFieldProps<T> & {
  items: TItem[]
  getValue: (item: TItem) => string
  getLabel: (item: TItem) => string
  placeholder: string
  searchPlaceholder: string
  emptyText: string
}) {
  const { t } = useTranslation()
  const renderError = useFieldError()
  const [open, setOpen] = useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selected = items.find((item) => getValue(item) === field.value)
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={name}>{t(label)}</FieldLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                render={
                  <Button
                    id={name}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-invalid={fieldState.invalid}
                    className="w-full justify-between font-normal"
                  />
                }
              >
                <span className={cn(!selected && "text-muted-foreground")}>
                  {selected ? getLabel(selected) : t(placeholder)}
                </span>
                <ChevronsUpDownIcon className="text-muted-foreground" />
              </PopoverTrigger>
              <PopoverContent className="w-(--anchor-width) p-0" align="start">
                <Command>
                  <CommandInput placeholder={t(searchPlaceholder)} />
                  <CommandList>
                    <CommandEmpty>{t(emptyText)}</CommandEmpty>
                    <CommandGroup>
                      {items.map((item) => {
                        const value = getValue(item)
                        return (
                          <CommandItem
                            key={value}
                            value={getLabel(item)}
                            onSelect={() => {
                              field.onChange(value)
                              setOpen(false)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {getLabel(item)}
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {description && <FieldDescription>{t(description)}</FieldDescription>}
            {renderError(fieldState.error?.message)}
          </Field>
        )
      }}
    />
  )
}
