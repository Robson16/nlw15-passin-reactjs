import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { attendees } from '../data/attendees'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableCell } from './table/table-cell'
import { TableHeader } from './table/table-header'
import { TableRow } from './table/table-row'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

export function AttendeeList() {
  const [search, setSearch] = useState('')
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(Math.ceil(attendees.length / perPage))

  function onSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value)
  }

  function gotoFirstPage() {
    setPage(1)
  }

  function goToLastPage() {
    setPage(totalPages)
  }

  function goToPreviousPage() {
    setPage(page - 1)
  }

  function goToNextPage() {
    setPage(page + 1)
  }

  return (
    <div className='flex flex-col gap-4'>
      <header className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div
          className="flex items-center gap-3 w-72 px-3 py-1.5 border border-white/10 rounded-lg"
        >
          <Search className='size-4 text-emerald-300' />
          <input
            onChange={onSearchInputChange}
            className="flex-1 bg-transparent outline-none h-auto border-0 p-0 text-sm"
            placeholder="Buscar participantes..."
          />
        </div>
      </header>

      <Table>
        <thead>
          <TableRow>
            <TableHeader style={{ width: 48 }}>
              <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10' />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participante</TableHeader>
            <TableHeader>Data de inscrição</TableHeader>
            <TableHeader>Data de check-in</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {attendees.slice((page - 1) * perPage, page * perPage).map((attendee) => {
            return (
              <TableRow key={attendee.id} className='hover:bg-white/5'>
                <TableCell>
                  <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10' />
                </TableCell>
                <TableCell>
                  {attendee.id.substring(0, 8)}
                </TableCell>
                <TableCell>
                  <div className='flex flex-col gap-1'>
                    <span className='font-semibold text-white'>{attendee.name}</span>
                    <span>{attendee.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {dayjs().to(attendee.createAt)}
                </TableCell>
                <TableCell>
                  {dayjs().to(attendee.checkedInAt)}
                </TableCell>
                <TableCell>
                  <IconButton transparent>
                    <MoreHorizontal className='size-4' />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              Mostrando 10 de {attendees.length} itens
            </TableCell>
            <TableCell colSpan={3} className='text-right' >
              <div className='inline-flex items-center gap-8'>
                <span>Página {page} de {totalPages}</span>

                <div className='flex items-center gap-1.5'>
                  <IconButton
                    onClick={gotoFirstPage}
                    disabled={page === 1}
                  >
                    <ChevronsLeft className='size-4' />
                  </IconButton>
                  <IconButton
                    onClick={goToPreviousPage}
                    disabled={page === 1}
                  >
                    <ChevronLeft className='size-4' />
                  </IconButton>
                  <IconButton
                    onClick={goToNextPage}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className='size-4' />
                  </IconButton>
                  <IconButton
                    onClick={goToLastPage}
                    disabled={page === totalPages}
                  >
                    <ChevronsRight className='size-4' />
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