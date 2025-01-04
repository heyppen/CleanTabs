import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CircleHelp, CodeXml, Table } from "lucide-react"
import { useState } from "react"
import RulesTable from "./rules-table"
import RulesEditor from "./rules-editor"


export default function Rules() {

  const [tab, setTab] = useState<string>('table')

  return <div>
    <Tabs
      value={tab}
      onValueChange={setTab}
      className="w-full justify-end">
      <div className="w-full flex justify-start items-center">
        <TabsList className="h-8 border z-10">
          <TabsTrigger value="table" className="h-full py-0 px-4"><Table className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="editor" className="h-full py-0 px-4"><CodeXml className="w-4 h-4" /></TabsTrigger>
        </TabsList>
        <Popover>
          <PopoverTrigger className="z-10"><CircleHelp className="ml-4 w-4 h-4" /></PopoverTrigger>
          <PopoverContent side="right" align="start" className="w-[400px]">
            {
              tab === 'table' ? <div className="text-sm leading-7 tracking-wide">
                <h1 className="font-bold text-base mb-2">Rule</h1>
                <ul className="list-disc list-inside">
                  <li>URL Pattern: <a className="text-blue-500 underline" href="https://github.com/heyppen/CleanTabs?tab=readme-ov-file#url-pattern" target="_blank">reference</a></li>
                  <li>Inactive: after leaving [0, 30*24*60] (minutes)</li>
                  <li>Action: discard from memory (still visible)</li>
                  <li>→Inbox: works only if action is close</li>
                </ul>
              </div> : <div className="text-sm leading-7 tracking-wide">
                <h1 className="font-bold text-base mb-2">Rule</h1>
                <ul className="list-disc list-inside">
                  <li>URL Pattern: <a className="text-blue-500 underline" href="https://github.com/heyppen/CleanTabs?tab=readme-ov-file#url-pattern" target="_blank">reference</a></li>
                  <li>Inactive: after leaving [0, 30*24*60] (minutes)</li>
                  <li>Action: discard from memory (still visible)</li>
                  <li>→Inbox, Disabed can be omitted</li>
                </ul>
              </div>
            }
          </PopoverContent>
        </Popover>
      </div>
      <TabsContent value="table" className="h-[300px] relative -top-10">
        <RulesTable />
      </TabsContent>
      <TabsContent value="editor" className="h-[300px] relative -top-10">
        <RulesEditor />
      </TabsContent>
    </Tabs>
  </div>
}
