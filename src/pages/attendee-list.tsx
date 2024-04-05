import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Search,
} from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react'
import { IconButton } from '../components/icon-button'
import { Table } from '../components/table/table'
import { TableCell } from '../components/table/table-cell'
import { TableHeader } from '../components/table/table-header'
import { TableRow } from '../components/table/table-row'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee {
  id: string
  name: string
  email: string
  createdAt: string
  checkedInAt: string | null
}

export function AttendeeList() {
  const [attendees, setAttendees] = useState<Attendee[]>([])

  const [totalAttendees, setTotalAttendees] = useState(0)

  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? ''
    }

    return ''
  })

  const [perPage, setPerPage] = useState(10)

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  })

  const [totalPages, setTotalPages] = useState(
    Math.ceil(totalAttendees / perPage),
  )

  useEffect(() => {
    const url = new URL(
      `${import.meta.env.VITE_API_URL}/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees`,
    )

    url.searchParams.set('pageIndex', String(page - 1))
    url.searchParams.set('perPage', String(perPage))

    if (search.length > 0) {
      url.searchParams.set('search', search)
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setAttendees(data.attendees)
        setTotalAttendees(data.total)
        setTotalPages(Math.ceil(totalAttendees / perPage))
      })
  }, [page, perPage, totalAttendees, search])

  function setCurrentPerPage(perPage: number) {
    const url = new URL(window.location.toString())

    url.searchParams.set('perPage', String(perPage))

    window.history.pushState({}, '', url)

    setPerPage(perPage)
  }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())

    url.searchParams.set('page', String(page))

    window.history.pushState({}, '', url)

    setPage(page)
  }

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString())

    url.searchParams.set('search', search)

    window.history.pushState({}, '', url)

    setSearch(search)
  }

  function onSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(event.target.value)
    setCurrentPage(1)
  }

  function onPerPageInputChange(event: ChangeEvent<HTMLSelectElement>) {
    setCurrentPerPage(Number(event.target.value))
    setCurrentPage(1)
  }

  function gotoFirstPage() {
    setCurrentPage(1)
  }

  function goToLastPage() {
    setCurrentPage(totalPages)
  }

  function goToPreviousPage() {
    setCurrentPage(page - 1)
  }

  function goToNextPage() {
    setCurrentPage(page + 1)
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div className="flex items-center gap-3 w-72 px-3 py-1.5 border border-white/10 rounded-lg">
          <Search className="size-4 text-emerald-300" />
          <input
            onChange={onSearchInputChange}
            value={search}
            className="flex-1 bg-transparent outline-none h-auto border-0 p-0 text-sm focus:ring-0"
            placeholder="Buscar participantes..."
          />
        </div>
      </header>

      <Table>
        <thead>
          <TableRow>
            <TableHeader style={{ width: 48 }}>
              <input
                type="checkbox"
                className="size-4 bg-black/20 rounded border border-white/10"
              />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participante</TableHeader>
            <TableHeader>Data de inscrição</TableHeader>
            <TableHeader>Data de check-in</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {attendees.map((attendee) => {
            return (
              <TableRow key={attendee.id} className="hover:bg-white/5">
                <TableCell>
                  <input
                    type="checkbox"
                    className="size-4 bg-black/20 rounded border border-white/10"
                  />
                </TableCell>
                <TableCell>{attendee.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">
                      {attendee.name}
                    </span>
                    <span>{attendee.email}</span>
                  </div>
                </TableCell>
                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                <TableCell>
                  {attendee.checkedInAt === null ? (
                    <span className="text-zinc-400">Não fez check-in</span>
                  ) : (
                    dayjs().to(attendee.checkedInAt)
                  )}
                </TableCell>
                <TableCell>
                  <IconButton transparent>
                    <MoreHorizontal className="size-4" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              <div className="inline-flex items-center gap-8">
                <span>
                  Mostrando {attendees.length} de {totalAttendees} itens
                </span>
                <select
                  value={perPage}
                  onChange={onPerPageInputChange}
                  className="bg-black/20 rounded border border-white/10"
                >
                  <option value="10" className="text-zinc-900">
                    10
                  </option>
                  <option value="20" className="text-zinc-900">
                    20
                  </option>
                  <option value="50" className="text-zinc-900">
                    50
                  </option>
                  <option value="80" className="text-zinc-900">
                    80
                  </option>
                  <option value="100" className="text-zinc-900">
                    100
                  </option>
                </select>
              </div>
            </TableCell>
            <TableCell colSpan={3} className="text-right">
              <div className="inline-flex items-center gap-8">
                <span>
                  Página {page} de {totalPages}
                </span>

                <div className="flex items-center gap-1.5">
                  <IconButton onClick={gotoFirstPage} disabled={page === 1}>
                    <ChevronsLeft className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                    <ChevronLeft className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={goToNextPage}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={goToLastPage}
                    disabled={page === totalPages}
                  >
                    <ChevronsRight className="size-4" />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </tr>
        </tfoot>
      </Table>
    </div>
  )
}
