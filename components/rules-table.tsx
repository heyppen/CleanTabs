
import { useState, useEffect, useMemo, useCallback, useContext } from "react"

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnFiltersState,
} from "@tanstack/react-table"


import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

import { DebouncedInput, Input } from "@/components/ui/input"
import { Action, Actions, Rule, DefaultRules, v_rule_pattern, ValidateRule, ValidateRules, ValidationResult } from "@/lib/rule"
import { Checkbox, SmallCheckbox } from "@/components/ui/checkbox"
import {
  Plus,
  Ellipsis,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import { storage } from "wxt/storage"
import { STORAGE_KEY_RULES } from "@/lib/storage"
import { AppStateContext } from "./providers"
import { browser } from "wxt/browser"


interface TabListItem {
  favicon_url: string;
  title: string;
  url: string;
}


function makeDraftRule(url: string): Rule {
  let pattern = '';
  const url_ = URL.parse(url)
  if (url_) {
    pattern = `${url_.origin}/*`
  }

  return {
    url_pattern: pattern,
    inactive_minutes: 3,
    action: "discard",
    to_stash: true,
    disabled: false,
    dirty: true,
  }
}


// TODO:
// - fields validation ✅
// - duplicate ✅
// - batch operations ✅
// - inactive, action edit ✅
// - new column: add_to_stash ✅
// - adjust ordering ✅
export default function RulesTable() {

  const { rules: data, setRules: _setData } = useContext(AppStateContext)
  const [dataDirty, setDataDirty] = useState(false)
  const [vResult, setVResult] = useState<ValidationResult>({ ok: true })

  function newRule(url: string) {
    _setData([makeDraftRule(url), ...data])
    setDataDirty(true)
    setRowSelection({})
  }

  function updateData(rowIndex: number, updates: Partial<Rule>) {
    const newData = data.map((val, index) => {
      if (index === rowIndex) {
        return { ...data[rowIndex], ...updates, dirty: true }
      } else {
        return val
      }
    })
    _setData(newData)
    setDataDirty(true)
  }

  function deleteRules(...indices: number[]) {
    if (indices.length < 1) return
    _setData(data.filter((_, i) => !indices.includes(i)))
    setDataDirty(true)
    setRowSelection({})
  }

  function duplicateRule(index: number) {
    const rule: Rule = { ...data[index], dirty: true }
    _setData([...data.slice(0, index + 1), rule, ...data.slice(index + 1)])
    setDataDirty(true)
    setRowSelection({})
  }

  function moveUp(index: number) {
    if (index < 1) return
    const copy: Rule[] = [...data]
      ;[copy[index - 1], copy[index]] = [copy[index], copy[index - 1]]
    _setData(copy)
    setDataDirty(true)
    setRowSelection({})
  }

  function moveDown(index: number) {
    if (index >= data.length - 1) return
    const copy: Rule[] = [...data]
      ;[copy[index + 1], copy[index]] = [copy[index], copy[index + 1]]
    _setData(copy)
    setDataDirty(true)
    setRowSelection({})
  }

  function saveData() {
    if (!vResult.ok) {
      return
    }

    const newData = data.map((val) => {
      return { ...val, dirty: undefined }
    })
    storage.setItem(STORAGE_KEY_RULES, newData)
    _setData(newData)
    setDataDirty(false)
  }

  useEffect(() => {
    const res = ValidateRules(data)
    setVResult(res)
  }, [data, dataDirty])


  const columns = useMemo(() => {
    const columns: ColumnDef<Rule>[] = [
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
      },
      {
        accessorKey: "url_pattern",
        header: "URL Pattern",
        cell: ({ getValue, row }) => {
          const initialValue: string = getValue() as string
          const [value, setValue] = useState(initialValue)
          const [valid, setValid] = useState(true)

          useEffect(() => {
            setValue(initialValue)
          }, [initialValue])

          useEffect(() => {
            if (value === "") {
              setValid(false)
              return
            }

            const res = v_rule_pattern(value)
            if (!res.ok) {
              setValid(false)
              return
            }

            setValid(true)
          }, [value])

          return (
            <div className="w-60 font-mono text-xs">
              <Input
                value={value}
                className={cn(
                  "h-7 text-sm rounded-[4px] py-0 px-2 border-none focus-visible:ring-offset-2 focus-visible:ring-1 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-600",
                  valid ? "" : "focus-visible:ring-red-500"
                )}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => {
                  if (value !== initialValue) {
                    updateData(row.index, { url_pattern: value })
                  }
                }}
              />
            </div>
          )
        },
      },
      {
        accessorKey: "inactive_minutes",
        header: "Inactive",
        cell: ({ getValue, row }) => {
          const initialValue = (getValue() as number).toString()
          const [value, setValue] = useState(initialValue)
          const [valid, setValid] = useState(true)
          useEffect(() => {
            setValue(initialValue)
          }, [initialValue])

          useEffect(() => {
            if (value === "") {
              setValid(false)
              return
            }

            if (!/^\d+$/.test(value)) {
              setValid(false)
              return
            }
            const n = parseInt(value)
            if (isNaN(n)) {
              setValid(false)
              return
            }

            setValid(true)
          }, [value])

          return (
            <div className="w-12 font-mono text-xs">
              <Input
                value={value}
                className={cn(
                  "h-7 text-sm rounded-[4px] py-0 px-2 border-none focus-visible:ring-offset-2 focus-visible:ring-1 focus-visible:ring-zinc-300",
                  valid ? "" : "focus-visible:ring-red-500"
                )}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => {
                  if (value !== initialValue) {
                    if (valid) {
                      const n = parseInt(value)
                      updateData(row.index, { inactive_minutes: n })
                    } else {
                      setValue(initialValue)
                    }
                  }
                }}
              />
            </div>
          )
        },
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ getValue, row }) => {
          const initialValue = getValue() as Action
          const [value, setValue] = useState<Action>(initialValue)
          useEffect(() => {
            setValue(initialValue)
          }, [initialValue])

          return (
            <Select
              value={value}
              onValueChange={(val) => {
                setValue(val as Action)
                updateData(row.index, { action: val as Action })
              }}
            >
              <SelectTrigger
                className="h-7 w-[74px] justify-start relative -left-2 px-2 border-none focus:ring-0 focus:ring-offset-0 rounded-[4px] bg-transparent"
                noIcon={true}
              >
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent className="rounded-[6px]">
                {Object.values(Actions).map((action) => {
                  const className = {
                    nop: "bg-gray-100 text-gray-700",
                    discard: "bg-green-100 text-green-700",
                    close: "bg-blue-100 text-blue-700",
                  }[action.action]

                  return (
                    <SelectItem
                      key={action.action}
                      value={action.action}
                      className="h-7 pr-0 rounded-[4px]"
                    >
                      <div
                        className={cn(
                          "flex justify-center items-center text-xs py-[2px] px-2 rounded-[3px] font-mono",
                          className
                        )}
                      >
                        <span>{action.display}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        },
      },
      {
        accessorKey: "to_stash",
        header: "→Stash",
        cell: ({ getValue, row: { index }, column: { id }, table }) => {
          const initialValue: boolean = getValue() ? true : false
          const [value, setValue] = useState<boolean>(initialValue)
          useEffect(() => {
            setValue(initialValue)
          }, [initialValue])

          function onChange(value: boolean) {
            setValue(value)
            updateData(index, { to_stash: value })
          }
          return (
            <Switch
              className="w-8 h-4"
              checked={value}
              onCheckedChange={onChange}
            />
          )
        },
      },
      {
        accessorKey: "disabled",
        header: "Disabled",
        cell: ({ getValue, row: { index }, column: { id }, table }) => {
          const initialValue: boolean = getValue() as boolean
          const [value, setValue] = useState(initialValue)
          useEffect(() => {
            setValue(initialValue)
          }, [initialValue])

          function onChange(value: boolean) {
            setValue(value)
            updateData(index, { disabled: value })
          }

          return (
            <Switch
              className="w-8 h-4"
              checked={value}
              onCheckedChange={onChange}
            />
          )
        },
      },
      {
        id: "operations",
        header: "",
        cell: ({ row }) => {
          const rule = row.original
          return (
            <div className="flex gap-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-[6px]"
                    title="Batch Operations"
                  >
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      duplicateRule(row.index)
                    }}
                  >
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      deleteRules(row.index)
                    }}
                    className="focus:text-destructive focus:bg-red-100 dark:focus:bg-red-600 dark:text-white"
                  >
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={row.index < 1}
                    onClick={() => {
                      moveUp(row.index)
                    }}
                  >
                    Move up
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={row.index >= data.length - 1}
                    onClick={() => {
                      moveDown(row.index)
                    }}
                  >
                    Move down
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ]
    return columns
  }, [data])
  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    state: {
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
  })

  const batchOperationsDisabled = !(
    table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()
  )

  const regexColumn = table.getColumn("url_pattern")


  const [tabList, setTabList] = useState<TabListItem[]>([])

  async function refreshTabList() {
    console.log('refreshTabList')
    const tabs = await browser.tabs.query({})
    setTabList(tabs.filter(t => t.url && t.favIconUrl && t.title).map((t): TabListItem => {
      return {
        favicon_url: t.favIconUrl!,
        url: t.url!,
        title: t.title!,
      }
    }))
  }


  return (
    <div className="w-full flex flex-col min-h-64">
      <div className="flex items-center justify-end gap-2 w-full mb-2 relative left-28 pr-28">
        {dataDirty && (
          <div className="flex items-baseline gap-2">
            <span className="pb-0 text-red-500">{vResult.ok ? 'Rules changed' : vResult.reason}</span>
            <Button
              size="sm"
              className="h-8"
              title="Save Ruels"
              onClick={saveData}
            >
              Save
            </Button>
          </div>
        )}
        <DebouncedInput
          placeholder="Search Rules"
          className="h-8 w-56 rounded-[0px] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-mono"
          value={(regexColumn?.getFilterValue() as string) ?? ""}
          onChange={(value) => {
            regexColumn?.setFilterValue(value)
          }}
        />
        <div className="flex items-center gap-2">

          <DropdownMenu
            onOpenChange={(open) => {
              if (open) {
                refreshTabList()
              }
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 "
                title="New Rule"
                onClick={refreshTabList}
              >
                <Plus />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"

            >
              <DropdownMenuItem
                onClick={() => { newRule('') }}
              >
                New blank rule
              </DropdownMenuItem>

              {
                tabList.length > 0 && <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>from tabs</DropdownMenuLabel>
                  <div className="max-h-[200px] overflow-y-scroll">
                    {
                      tabList.map(t => {
                        const url = URL.parse(t.url);
                        return <DropdownMenuItem
                          key={t.url}
                          onClick={() => {
                            newRule(t.url)
                          }}
                        >
                          <img src={t.favicon_url} className="h-4 w-4" />
                          <span className="max-w-48 overflow-hidden text-nowrap text-ellipsis">{t.title}</span>
                          <span className="text-gray-500">{url?.host}</span>
                        </DropdownMenuItem>
                      })
                    }
                  </div>
                </>
              }
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 "
                title="Batch Operations"
              >
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem
                disabled={batchOperationsDisabled}
                onClick={() => {
                  deleteRules(
                    ...table.getSelectedRowModel().flatRows.map((r) => r.index)
                  )
                  setRowSelection({})
                }}
                className="focus:text-destructive focus:bg-red-100 dark:focus:bg-red-600 dark:text-white"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
                        "h-10 pr-0",
                        ["to_stash", "disabled"].includes(header.column.id)
                          ? "text-center px-2"
                          : ""
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                  className={
                    row.original.dirty ? "bg-yellow-50 hover:bg-yellow-50 dark:bg-stone-800 dark:hover:bg-stone-800" : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "py-2 pr-0",
                        ["to_stash", "disabled"].includes(cell.column.id)
                          ? "text-center px-0"
                          : ""
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
                  No rules
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableDiv>
      </div>
      {/* <div className="py-2 font-mono"> */}
      {/*   #Rules: {data.length} */}
      {/* </div> */}
    </div>
  )
}
