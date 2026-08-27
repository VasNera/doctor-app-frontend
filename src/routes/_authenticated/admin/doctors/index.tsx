import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { UserPlusIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import type { DoctorReadOnlyDTO, PageParams } from "@/api/types"
import { PaginatedTable, type Column } from "@/components/data/PaginatedTable"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { doctorsListOptions } from "@/features/doctors/queries"

const searchSchema = z.object({
  page: z.number().int().min(0).catch(0).default(0),
})


const toParams = (search: { page: number }): PageParams => ({
  page: search.page,
  size: 10,
  sort: "lastname,asc",
})

export const Route = createFileRoute("/_authenticated/admin/doctors/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.ensureQueryData(doctorsListOptions(toParams(deps))),
  component: DoctorsListPage,
})

function DoctorsListPage() {
  const { t } = useTranslation()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const { data, isFetching } = useSuspenseQuery(
    doctorsListOptions(toParams(search))
  )

  const columns: Column<DoctorReadOnlyDTO>[] = [
    {
      key: "name",
      header: t("appointments.doctor"),
      cell: (row) => `${row.lastname} ${row.firstname}`,
    },
    {
      key: "specialty",
      header: t("form.specialty"),
      cell: (row) => t(`specialty.${row.specialty}`),
    },
    {
      key: "email",
      header: t("form.email"),
      cell: (row) => <span className="text-muted-foreground">{row.email}</span>,
    },
  ]

  return (
    <>
      <PageHeader title={t("doctors.title")}>
        <Button render={<Link to="/admin/doctors/new" />}>
          <UserPlusIcon />
          {t("doctors.newDoctor")}
        </Button>
      </PageHeader>
      <PaginatedTable
        columns={columns}
        page={data}
        rowKey={(row) => row.uuid}
        onPageChange={(page) => void navigate({ search: { page } })}
        emptyMessage={t("doctors.empty")}
        isFetching={isFetching}
      />
    </>
  )
}
