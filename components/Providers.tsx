import { AppStateSetOptions, DefaultAppState, IAppState } from "@/lib/app-state";
import { GetStash, GetSettings, GetRules, SetStash, SetSettings, SetRules, STORAGE_KEY_ENABLED, GetFlags, SetFlags } from "@/lib/storage";
import { Rule } from "@/lib/rule";
import { createContext, useState, ReactNode, useEffect } from "react";
import { storage } from "wxt/storage";
import { DefaultStash, Stash } from "@/lib/stash";
import { DefaultSettings, Settings } from "@/lib/settings";
import { ThemeProvider } from "./theme-provider";
import { DefaultFlags, Flag } from "@/lib/tab";

export const AppStateContext = createContext<IAppState>(DefaultAppState);


export function Provider({ children }: { children: ReactNode }) {
  const [enabled, _setEnabled] = useState<boolean>(true);
  const [settings, _setSettings] = useState<Settings>(DefaultSettings);
  const [rules, _setRules] = useState<Rule[]>([]);
  const [stash, _setStash] = useState<Stash>(DefaultStash);
  const [flags, _setFlags] = useState<Flag[]>(DefaultFlags);

  async function setEnabled(b: boolean) {
    _setEnabled(b)
    await storage.setItem(STORAGE_KEY_ENABLED, b)
  }

  async function setSettings(settings: Settings, options?: AppStateSetOptions) {
    _setSettings(settings)
    if (options?.toStorage) {
      await SetSettings(settings)
    }
  }

  async function setRules(rules: Rule[], options?: AppStateSetOptions) {
    _setRules(rules)
    if (options?.toStorage) {
      await SetRules(rules)
    }
  }

  async function setStash(stash: Stash, options?: AppStateSetOptions) {
    _setStash(stash)
    if (options?.toStorage) {
      await SetStash(stash)
    }
  }

  async function setFlags(flags: Flag[], options?: AppStateSetOptions) {
    _setFlags(flags)
    if (options?.toStorage) {
      await SetFlags(flags)
    }
  }


  useEffect(() => {
    // init states
    (async () => {

      const enabled = await storage.getItem<boolean>(STORAGE_KEY_ENABLED)
      if (enabled !== null) {
        _setEnabled(enabled)
      }

      const settings = await GetSettings()
      _setSettings(settings)

      const rules = await GetRules()
      _setRules(rules)

      const stash = await GetStash()
      console.log(stash)
      _setStash(stash)

      const flags = await GetFlags()
      console.log(flags)
      _setFlags(flags)
    })()
  }, [])

  return <AppStateContext.Provider value={{
    enabled,
    setEnabled,
    settings,
    setSettings,
    rules,
    setRules,
    stash,
    setStash,
    flags,
    setFlags,
  }}>
    <ThemeProvider defaultTheme="system">
      {children}
    </ThemeProvider>
  </AppStateContext.Provider>
}
