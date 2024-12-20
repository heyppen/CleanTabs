
import { useState, useEffect, useMemo, useCallback } from "react"

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

import logo from "/logo.png"
import { Input } from "@/components/ui/input"
import { Action, Actions, Rule, RulesDemoData } from "@/lib/types"
import { Checkbox, SmallCheckbox } from "@/components/ui/checkbox"
import {
  CircleX,
  X,
  SquareX,
  CopyPlus,
  Copy,
  Plus,
  Eclipse,
  Ellipsis,
  Save,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import { storage } from "wxt/storage"
import { STORAGE_KEY_RULES } from "@/lib/storage"
import { v_rule_regex, ValidateRule, ValidationResult } from "@/lib/validation"


const DRAFT_RULE: Rule = {
  regex: "*://*.google.com/*",
  inactive_minutes: 3,
  action: "discard",
  dirty: true,
}

//
// TODO:
// - fields validation ✅
// - duplicate ✅
// - batch operations ✅
// - inactive, action edit ✅
// - new column: add_to_inbox ✅
// - adjust ordering ✅
export default function RulesTable() {
  const [data, _setData] = useState<Rule[]>([])
  const [dataDirty, setDataDirty] = useState(false)

  useEffect(() => {
    ; (async () => {
      const rules = await storage.getItem<Rule[]>(STORAGE_KEY_RULES)
      console.log(rules)
      _setData(rules ?? [])
    })()
  }, [])

  function newRule() {
    _setData([DRAFT_RULE, ...data])
    setDataDirty(true)
    setRowSelection({})
  }

  function updateData(rowIndex: number, updates: Partial<Rule>) {
    console.log(rowIndex, updates)
    console.log("data:", data)
    const newData = data.map((val, index) => {
      if (index === rowIndex) {
        return { ...data[rowIndex], ...updates, dirty: true }
      } else {
        return val
      }
    })
    console.log("newData:", newData)
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
  }

  function moveDown(index: number) {
    if (index >= data.length - 1) return
    const copy: Rule[] = [...data]
      ;[copy[index + 1], copy[index]] = [copy[index], copy[index + 1]]
    _setData(copy)
  }

  function saveData() {
    const newData = data.map((val) => {
      return { ...val, dirty: undefined }
    })
    storage.setItem(STORAGE_KEY_RULES, newData)
    _setData(newData)
    setDataDirty(false)
  }

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
        header: "#",
        cell: ({ row }) => {
          return row.index + 1
        },
      },
      {
        accessorKey: "regex",
        header: "URL Regex",
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

            const res = v_rule_regex(value)
            if (!res.ok) {
              setValid(false)
              return
            }

            setValid(true)
          }, [value])

          return (
            <div className="w-48 font-mono text-xs">
              <Input
                value={value}
                className={cn(
                  "h-7 text-sm rounded-[4px] py-0 px-2 border-none focus-visible:ring-offset-2 focus-visible:ring-1 focus-visible:ring-zinc-300",
                  valid ? "" : "focus-visible:ring-red-500"
                )}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => {
                  if (value !== initialValue) {
                    updateData(row.index, { regex: value })
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
                className="h-7 w-[74px] justify-start relative -left-2 px-2 border-none focus:ring-0 focus:ring-offset-0 rounded-[4px]"
                noIcon={true}
              >
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent className="rounded-[6px]">
                {Object.values(Actions).map((action) => {
                  const className = {
                    nop: "bg-gray-100 text-gray-700",
                    discard: "bg-yellow-100 text-yellow-700",
                    close: "bg-red-100 text-red-700",
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
        accessorKey: "to_inbox",
        header: "→Inbox",
        cell: ({ getValue, row: { index }, column: { id }, table }) => {
          const initialValue: boolean = getValue() ? true : false
          const [value, setValue] = useState<boolean>(initialValue)
          useEffect(() => {
            setValue(initialValue)
          }, [initialValue])

          function onChange(value: boolean) {
            setValue(value)
            updateData(index, { to_inbox: value })
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
        header: "Enable",
        cell: ({ getValue, row: { index }, column: { id }, table }) => {
          const initialValue: boolean = !(getValue() as boolean)
          const [value, setValue] = useState(initialValue)
          useEffect(() => {
            setValue(initialValue)
          }, [initialValue])

          function onChange(value: boolean) {
            setValue(value)
            // table.options.meta?.updateData(index, id, value)
            updateData(index, { disabled: !value })
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
              {/* <Button */}
              {/*   variant="ghost" */}
              {/*   className="h-7 w-7 p-2 rounded-[8px] hover:bg-zinc-200" */}
              {/*   onClick={() => duplicateRule(row.index)} */}
              {/*   title="Duplicate" */}
              {/* > */}
              {/*   <Copy /> */}
              {/* </Button> */}
              {/* <Button */}
              {/*   variant="ghost" */}
              {/*   className="h-7 w-7 p-2 rounded-[8px] text-red-500 hover:text-red-500 hover:bg-red-100" */}
              {/*   onClick={() => deleteRules(row.index)} */}
              {/*   title="Delete" */}
              {/* > */}
              {/*   <CircleX /> */}
              {/* </Button> */}
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
                      setRowSelection({})
                    }}
                  >
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      deleteRules(row.index)
                      setRowSelection({})
                    }}
                    className="focus:text-destructive focus:bg-red-100"
                  >
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={row.index < 1}
                    onClick={() => {
                      moveUp(row.index)
                      setRowSelection({})
                    }}
                  >
                    Move up
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={row.index >= data.length - 1}
                    onClick={() => {
                      moveDown(row.index)
                      setRowSelection({})
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

  const regexColumn = table.getColumn("regex")

  return (
    <div className="w-full gap-2 min-h-64">
      <div className="flex items-center justify-between w-full mb-2">
        <DebouncedInput
          placeholder="Search Rules"
          className="h-8 w-72 rounded-[0px] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-mono"
          value={(regexColumn?.getFilterValue() as string) ?? ""}
          onChange={(value) => {
            regexColumn?.setFilterValue(value)
          }}
        />
        <div className="flex items-center gap-2">
          {dataDirty && (
            <div className="flex items-end gap-2">
              <span className="pb-0 text-red-500">{"Rules changed"}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-[6px] mr-4"
                title="Save Ruels"
                onClick={saveData}
              >
                <Save />
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-[6px]"
            title="New Rule"
            onClick={newRule}
          >
            <Plus />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-[6px]"
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
                className="focus:text-destructive focus:bg-red-100"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="relative overflow-auto border max-h-72">
        <TableDiv className="">
          <TableHeader className="sticky top-0 bg-secondary ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "h-10 pr-0",
                        ["to_inbox", "disabled"].includes(header.column.id)
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
                    row.original.dirty ? "bg-yellow-50 hover:bg-yellow-50" : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "py-2 pr-0",
                        ["to_inbox", "disabled"].includes(cell.column.id)
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
      <div></div>
    </div>
  )
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 200,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
