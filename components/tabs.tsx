import { useEffect, useState } from "react";
import { browser, Tabs as TTabs, Windows } from "wxt/browser";

import { Chrome, Earth } from "lucide-react";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";

import * as PopoverPrimitive from "@radix-ui/react-popover"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getRelativeTime } from "@/lib/date";

import ChromeIcon from "./chrome-icon";


interface IWindow {
  window: Windows.Window;
  tabs: TTabs.Tab[];
}


// the first is current window
async function getAllWindows(): Promise<IWindow[]> {
  let windows: IWindow[] = [];

  const current = await browser.windows.getCurrent()

  let wins = await browser.windows.getAll()
  wins = wins.filter(w => w.id !== current.id)
  wins.unshift(current)
  windows.push(
    ...wins.
      filter(w => w.id).
      map(w => { return { window: w, tabs: [] } })
  )

  // window.id => index
  const windowsIndex = new Map<number, number>(
    windows.map((w, i) => [w.window.id!, i])
  )

  const tabs = await browser.tabs.query({})
  tabs.forEach((t) => {
    if (!t.windowId) return;

    const i = windowsIndex.get(t.windowId)
    if (i === undefined) return;

    windows.at(i)?.tabs.push(t)
  })

  return windows;
}

export function Tabs() {

  const [windows, setWindows] = useState<IWindow[]>([])

  async function refresh() {
    const wins = await getAllWindows()
    console.log(wins)
    setWindows(wins)
  }

  useEffect(() => {
    refresh()
  }, [])


  return <div>
    <div>

    </div>
    <div className="flex flex-col p-2">
      {
        windows.map((w, i) => {
          return <div key={w.window.id}>
            {i !== 0 && <div className="border-t mt-3 mb-2"></div>}
            <div className="flex flex-wrap gap-2">
              {
                w.tabs.map(t => {
                  console.log(t.id)
                  return <TabItem key={t.id} tab={t}></TabItem>
                })
              }
            </div>
          </div>
        })
      }

    </div>
  </div>
}


function TabItem({ tab }: { tab: TTabs.Tab }) {
  let color = 'bg-green-500';
  if (tab.discarded) {
    color = 'bg-neutral-400'
  }

  let origin = tab.url;
  if (tab.url) {
    origin = URL.parse(tab.url)?.origin
  }

  let lastAccess = null;
  if (tab.lastAccessed) {
    lastAccess = getRelativeTime(new Date(tab.lastAccessed))
  }

  const [hovering, setHovering] = useState(false);

  return <div className="">
    <Popover open={hovering}>
      <PopoverTrigger
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="outline-none data-[state=open]:outline-none"
      >
        <div
          className="flex flex-col items-center justify-center gap-1 cursor-pointer"
          onClick={() => { browser.tabs.update(tab.id!, { active: true }) }}
        >
          <Favicon tab={tab} className=" h-6 w-6 hover:scale-[115%] duration-200" />
          <span className={`w-[5px] h-[5px] ${color} rounded-full`}></span>
        </div >
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={4}
        arrowPadding={0}
        className="w-96 px-3 py-2"
      >
        <PopoverPrimitive.Arrow className="fill-neutral-400" />
        <p className="font-semibold text-[13px] leading-relaxed">{tab.title}</p>
        <p className="leading-relaxed text-neutral-600">{origin}</p>
        <div className="border-t my-2"></div>
        <div className="font-mono flex justify-between">
          <span>status: {tab.discarded ? 'discarded' : 'normal'}</span>
          <span>last access: {lastAccess}</span>
        </div>
      </PopoverContent>
    </Popover>
  </div>
}


function Favicon({ tab, className }: { tab: TTabs.Tab, className?: ClassValue }) {
  const [fallback, setFallback] = useState(tab.favIconUrl === undefined || tab.url?.startsWith("chrome://"))

  if (fallback) {
    return <ChromeIcon className={cn("fill-neutral-400", className)} />
  }

  return <img
    src={tab.favIconUrl}
    className={cn(className)}
    onError={() => { setFallback(true) }}
  />
}

