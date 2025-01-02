import { useContext, useState } from "react"
import { RefreshCw, SettingsIcon } from "lucide-react"

import { sendMessage } from 'webext-bridge/popup'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Stash } from "@/components/stash"
import Rules from "@/components/rules"
import { Switch } from "@/components/ui/switch"
import { AppStateContext } from "@/components/providers"

import logo from "/logo.png"
import { Settings } from "@/components/settings"
import { Tabs as TabsComp } from '@/components/tabs'
import { Button } from "@/components/ui/button"

const TabNames = ["Tabs", "Rules", "Stash"]

function App() {
  const { enabled, setEnabled } = useContext(AppStateContext)

  const [running, setRunning] = useState(false);

  return (
    <div className="min-w-[800px] min-h-[400px] w-full h-full flex ">
      {/* <img src={logo} /> */}
      <Tabs defaultValue={TabNames[0]} className="w-full h-full">
        <TabsList className="w-full flex justify-between border-b border-neutral-300 dark:border-neutral-700 shadow-sm">
          <div className="flex gap-4 items-center px-3 text-foreground">
            <div className="h-10 font-mono flex items-center gap-2">
              <img src={logo} className="w-5 h-5 relative bottom-[1px]" />
              <span className="">CleanTabs v1.0</span>
            </div>
            <Switch
              className="w-8 h-4 data-[state=checked]:bg-green-500  dark:data-[state=checked]:bg-green-600 data-[state=unchecked]:dark:bg-zinc-600"
              checked={enabled}
              onCheckedChange={setEnabled}
              title={"Global Switch: " + (enabled ? 'ON' : "OFF")}
            />
            <Button
              variant="ghost"
              size="icon"
              className="w-4 h-4"
              title="Run rules immediately"
              onClick={
                async () => {
                  if (running) return;

                  setRunning(true)
                  const res = await sendMessage('run-cron', {}, 'background')
                  console.log(res)
                  setTimeout(() => setRunning(false), 1000)
                }
              }
            >
              <RefreshCw className={running ? "animate-spin" : ""} />
            </Button>

          </div>

          <div className="rounded-none shadow-none px-2 flex items-center">
            {TabNames.map((t) => (
              <TabsTrigger key={t} value={t} className="h-7 px-4 py-0 rounded-full data-[state=active]:shadow">
                {t}
              </TabsTrigger>
            ))}
            <TabsTrigger value="Options" className="h-7 ml-12 px-2 py-0 rounded-full data-[state=active]:shadow-none data-[state=active]:bg-transparent">
              <SettingsIcon className="w-4 h-4" />
            </TabsTrigger>
          </div>


        </TabsList>
        <TabsContent value="Tabs" className="p-2 pt-0">
          <TabsComp />
        </TabsContent>
        <TabsContent value="Rules" className="p-2 pt-0">
          <Rules />
        </TabsContent>
        <TabsContent value="Stash" className="p-2 pt-0">
          <Stash />
        </TabsContent>
        <TabsContent value="Options" className="p-2 pt-0">
          <Settings />
        </TabsContent>
      </Tabs>
    </div>
  )
}


export default App
