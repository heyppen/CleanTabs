import { useContext, useEffect, useMemo, useState } from "react"
import {
  Column,
  Table,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
  createColumnHelper,
  ColumnFiltersState,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table"
import { onMessage } from 'webext-bridge/popup'


import {
  Table as TableDiv,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AppStateContext } from "./providers"
import { cn } from "@/lib/utils"
import { StashItem } from "@/lib/stash"
import { SmallCheckbox } from "@/components/ui/checkbox"
import { browser } from "wxt/browser"
import { Button } from "./ui/button"
import { DebouncedInput } from "./ui/input"
import { ArrowDown10, ArrowUp01 } from "lucide-react"
import { GetStash } from "@/lib/storage"
import { getRelativeTime } from "@/lib/date"

export function Stash() {

  const { stash, setStash } = useContext(AppStateContext)

  async function deleteItems(...indices: number[]) {
    const remaining = stash.items.filter((_, i) => !indices.includes(i))

    await setStash(
      {
        update_at: new Date().getTime(),
        items: remaining,
      },
      {
        toStorage: true
      }
    )
  }

  async function refresh() {
    const stash = await GetStash()
    await setStash(stash, { toStorage: false })
  }

  useEffect(() => {
    refresh();

    onMessage('cron:done', () => {
      console.log('cron:done')
      refresh()
    })
  }, [])


  const columns = useMemo(() => {
    const columns: ColumnDef<StashItem>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <SmallCheckbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="rounded-[5px]"
          />
        ),
        cell: ({ row }) => (
          <SmallCheckbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="rounded-[5px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "index",
        header: "No.",
        cell: ({ row }) => {
          return row.index + 1
        },
        enableSorting: false,
      },
      {
        accessorKey: "url",
        header: "URL",
        cell: (({ row }) => {
          const item = row.original
          const url = new URL(item.url)

          return <div
            className="min-w-80 flex items-center gap-2 cursor-pointer"
            onClick={() => {
              browser.tabs.create({ url: item.url })
            }}
            title={item.title}
          >
            <img src={item.favicon_url} className="w-5 h-5" />
            <span className="max-w-64 overflow-hidden text-nowrap text-ellipsis">{item.title}</span>
            <span className="text-sm text-gray-600">{url.host}</span>
          </div>
        }),
        filterFn: (row, columnId, filterValue) => { // defined inline here
          const val = (filterValue as string).toLowerCase()
          const title = row.original.title.toLowerCase()
          const url = row.original.url.toLowerCase()
          return title.indexOf(val) >= 0 || url.indexOf(val) >= 0
        },
        enableSorting: false,
      },
      {
        accessorKey: "count",
        header: "#Close",
        enableSorting: true,
      },
      {
        accessorKey: "last_ts",
        header: "Last close",
        enableSorting: true,
        cell: (({ row }) => {
          const item = row.original
          const d = new Date(item.last_ts);
          return <span className="" title={d.toLocaleString()}>{getRelativeTime(d)}</span>
        }),
      }
    ]
    return columns

  }, [stash])

  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([{ id: 'last_ts', desc: true }])

  const table = useReactTable({
    data: stash.items,
    columns,
    filterFns: {},
    state: {
      rowSelection,
      columnFilters,
      sorting,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const anyRowsSelected = (
    table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()
  )

  const urlColumn = table.getColumn("url")

  return <div className=''>
    <div className="flex items-center justify-between gap-2 w-full mb-2">
      <DebouncedInput
        placeholder="Search Stash"
        className="h-8 w-64 rounded-[0px] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-mono"
        value={(urlColumn?.getFilterValue() as string) ?? ""}
        onChange={(value) => {
          urlColumn?.setFilterValue(value)
        }}
      />
      {anyRowsSelected &&
        <Button
          variant="destructive"
          size="sm"
          className="h-8"
          title="Save Ruels"
          onClick={() => deleteItems(
            ...table.getSelectedRowModel().flatRows.map((r) => r.index)
          )}
        >
          Delete
        </Button>
      }
    </div>
    <div className="relative overflow-auto border h-[302px] max-h-[302px]">
      <TableDiv className="">
        <TableHeader className="sticky top-0 bg-secondary z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "h-10 pr-0 mr-0 w-2",
                      header.column.getCanSort() ? 'cursor-pointer' : '',
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {
                      header.column.getCanSort() ?
                        <div className="min-w-20 flex items-center gap-1">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          {
                            {
                              asc: <ArrowUp01 className="h-4 w-4" />,
                              desc: <ArrowDown10 className="h-4 w-4" />,
                            }[header.column.getIsSorted() as string] ?? null
                          }
                        </div> :
                        header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                    }
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "py-2 pr-0 mr-0",
                    )}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                Empty Stash
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableDiv>
    </div>
  </div>
}
