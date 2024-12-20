import { useState, useEffect, useMemo, useCallback } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import "./App.css"

import logo from "/logo.png"
import { Inbox } from "./Inbox"
import Rules from "@/components/Rules"
const TabNames = ["This Tab", "Rules", "Inbox"]

function App() {
  return (
    <div className="min-w-[700px] min-h-[400px] w-full h-full">
      {/* <img src={logo} /> */}
      <Tabs defaultValue={TabNames[0]} className="w-full h-full p-2 ">
        <TabsList className="border rounded-none shadow-none">
          {TabNames.map((t) => (
            <TabsTrigger key={t} value={t} className="px-4 rounded-none">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="This Tab">
        </TabsContent>
        <TabsContent value="Rules">
          <Rules />
        </TabsContent>
        <TabsContent value="Inbox">
          <Inbox />
        </TabsContent>
      </Tabs>
    </div>
  )
}


export default App
