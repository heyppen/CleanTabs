import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { browser, Tabs as TTabs, Windows } from "wxt/browser";
import { onMessage } from 'webext-bridge/popup'

import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";

// import useMeasure, { RectReadOnly } from 'react-use-measure'
import * as PopoverPrimitive from "@radix-ui/react-popover"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getRelativeTime } from "@/lib/date";

import { ChromeBookmarkIcon, ChromeExtensionIcon, ChromeIcon, ChromeSettingsIcon } from "./icons";
import { AppStateContext } from "./providers";
import { FindMatchedRule, Rule } from "@/lib/rule";
import { ShortURL, Flag } from "@/lib/tab";
import { Button } from "./ui/button";
import { PinIcon } from "lucide-react";


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

  const [hoverTabId, setHoverTabId] = useState<number | undefined>(undefined);
  const [windows, setWindows] = useState<IWindow[]>([])
  // const tabsBounds = useRef(new Map<number, RectReadOnly>());
  const { flags, setFlags } = useContext(AppStateContext)

  async function refresh() {
    const wins = await getAllWindows()
    console.log(wins)
    setWindows(wins)
  }

  async function upsertFlag(flag: Flag) {
    const i = flags.findIndex((f) => f.id === flag.id)
    if (i < 0) {
      await setFlags([...flags, flag], { toStorage: true })
    } else {
      await setFlags(
        flags.map((f, j) => j === i ? { ...f, ...flag } : f),
        { toStorage: true }
      )
    }
  }

  // function setTabBounds(id: number, rect: RectReadOnly) {
  //   tabsBounds.current.set(id, rect)
  // }

  useEffect(() => {
    refresh()
    onMessage('cron:done', () => {
      console.log('cron:done')
      refresh()
    })
  }, [])

  return <div>
    <div>

    </div>
    <div className="flex flex-col p-2">
      {
        windows.map((w, i) => {
          return <div key={w.window.id}>
            {i !== 0 && <div className="border-t mt-3 mb-2"></div>}
            <div className="flex flex-wrap gap-1">
              {
                w.tabs.map(t => {
                  let flag = flags.find((f) => f.id === t.id)
                  return (
                    <TabItem
                      key={t.id}
                      tab={t}
                      hoverTabId={hoverTabId}
                      setHoverTabId={setHoverTabId}
                      flag={flag}
                      upsertFlag={upsertFlag}
                    />
                  )
                })
              }
            </div>
          </div>
        })
      }
    </div>
  </div>
}


function TabItem({
  tab,
  // setTabBounds,
  hoverTabId,
  setHoverTabId,
  flag,
  upsertFlag,
}: {
  tab: TTabs.Tab,
  // setTabBounds?: (id: number, rect: RectReadOnly) => void,
  hoverTabId?: number,
  setHoverTabId: (id?: number) => void,
  flag?: Flag,
  upsertFlag: (_: Flag) => Promise<void>,
}) {
  let color = 'bg-green-500';
  if (tab.discarded) {
    color = 'bg-neutral-400'
  }

  let lastAccess = null;
  if (tab.lastAccessed) {
    lastAccess = getRelativeTime(new Date(tab.lastAccessed))
  }

  const [hovering, setHovering] = useState(false);
  const [contentHovering, setContentHovering] = useState(false);
  // const [ref, bounds] = useMeasure()
  const { rules } = useContext(AppStateContext)

  const popoverOpen = tab.id === hoverTabId && (hovering || contentHovering)

  // useEffect(() => {
  //   if (tab.id && bounds) {
  //     setTabBounds(tab.id, bounds)
  //   }
  // }, [bounds])

  const matchedRule: Rule | null = useMemo(() => {
    if (tab.url) {
      return FindMatchedRule(rules, tab.url)
    }
    return null
  }, [rules, tab])


  return <div>
    <Popover open={popoverOpen}>
      <PopoverTrigger
        onMouseEnter={() => {
          setHovering(true)
          setHoverTabId(tab.id)
        }}
        onMouseLeave={() => setTimeout(() => { if (!contentHovering) setHovering(false) }, 300)}
        className="outline-none data-[state=open]:outline-none"
      >
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-1 cursor-pointer px-1 py-1 border border-transparent rounded-[6px]",
            tab.active ? 'bg-primary/20' : '',
            flag?.always_keep ? 'border-primary/80' : '',
          )}
          onClick={() => {
            browser.tabs.update(tab.id!, { active: true })
            browser.windows.update(tab.windowId!, { focused: true })
          }}
        >
          <Favicon tab={tab} className="h-6 w-6 hover:scale-[110%] duration-200" />
          <TabStatusIndicator discarded={tab.discarded} />
        </div >
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={4}
        arrowPadding={0}
        className="w-96 px-3 py-2"
        onMouseEnter={() => setContentHovering(true)}
        onMouseLeave={() => setTimeout(() => { if (!hovering) setContentHovering(false) }, 300)}
      >
        <PopoverPrimitive.Arrow className="fill-neutral-400" />
        <p className="font-semibold text-[13px] leading-relaxed">{tab.title}</p>
        <p className="leading-relaxed text-neutral-600">{ShortURL(tab.url)}</p>
        <div className="border-t my-2"></div>
        <div className="font-mono flex justify-between">
          <div className="flex items-center gap-1">
            <span>
              status: {tab.discarded ? 'discarded' : 'normal'}
            </span>
            <TabStatusIndicator discarded={tab.discarded} />
          </div>
          <span>last access: {lastAccess}</span>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <Button
            title="Always keep this tab"
            onClick={async () => {
              if (tab.id) {
                const keep = !!!flag?.always_keep
                await upsertFlag({ ...flag, id: tab.id, always_keep: keep })
              }
            }}
            size="icon"
            variant="ghost"
            className="rounded-[6px] w-8 h-8 outline-none focus-visible:ring-offset-0 focus-visible:ring-0 bg-accent"
          >
            <PinIcon strokeWidth={flag?.always_keep ? 2 : 1} className={flag?.always_keep ? 'text-primary' : ''} />
          </Button>
          {
            matchedRule && <div className="flex justify-end font-mono">
              <span>No.{matchedRule.index}: inactive {matchedRule.inactive_minutes} minutes to {matchedRule.action}</span>
            </div>
          }
        </div>
      </PopoverContent>
    </Popover>
  </div>
}

const ChromeDefaultBlue = '#3871e0';

function Favicon({ tab, className }: { tab: TTabs.Tab, className?: ClassValue }) {
  if (tab.url?.startsWith('chrome://settings/')) {
    return <ChromeSettingsIcon fill={ChromeDefaultBlue} className={cn(className)} />
  }

  if (tab.url === 'chrome://extensions/') {
    return <ChromeExtensionIcon fill={ChromeDefaultBlue} className={cn(className)} />
  }

  if (tab.url === 'chrome://bookmarks/') {
    return <ChromeBookmarkIcon fill={ChromeDefaultBlue} className={cn(className)} />
  }


  const [fallback, setFallback] = useState(tab.favIconUrl === undefined || tab.url?.startsWith("chrome://"))

  if (fallback) {
    return <div className={cn(className, 'flex items-center justify-center')}>
      <ChromeIcon fill={ChromeDefaultBlue} className="w-5 h-5" />
    </div>
  }

  return <img
    src={tab.favIconUrl}
    className={cn(className)}
    onError={() => { setFallback(true) }}
  />
}

function TabStatusIndicator({ discarded }: { discarded?: boolean }) {
  let color = 'bg-green-500';
  if (discarded) {
    color = 'bg-neutral-400'
  }
  return <span className={`w-[5px] h-[5px] ${color} rounded-full`}></span>
}
