

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, CodeXml, Table } from "lucide-react"
import { useState } from "react"
import RulesTable from "./RulesTable"
import RulesEditor from "./RulesEditor"



export default function Rules() {

  const [tab, setTab] = useState<string>('table')


  return <div>
    <Tabs
      value={tab}
      onValueChange={setTab}
      className="w-full justify-end">
      <div className="w-full flex justify-end">
        <TabsList className="border h-8 justify-end">
          <TabsTrigger value="table" className=""><Table className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="editor" className=" "><CodeXml className="w-4 h-4" /></TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="table">
        <RulesTable />
      </TabsContent>
      <TabsContent value="editor">
        <RulesEditor />
      </TabsContent>
    </Tabs>
  </div>

}
