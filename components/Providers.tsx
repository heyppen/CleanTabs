import { DefaultAppState, IAppState } from "@/lib/AppState";
import { GetRules, SetRules } from "@/lib/storage";
import { Rule } from "@/lib/types";
import { createContext, useState, ReactNode, useEffect } from "react";

export const AppStateContext = createContext<IAppState>(DefaultAppState);


export function Provider({ children }: { children: ReactNode }) {
  const [rules, _setRules] = useState<Rule[]>([]);

  async function setRules(rules: Rule[], toStorage?: boolean) {
    _setRules(rules)
    if (toStorage) {
      await SetRules(rules)
    }
  }

  useEffect(() => {
    (async () => {
      const rules = await GetRules()
      setRules(rules)
    })()
  }, [])

  return <AppStateContext.Provider value={{
    rules,
    setRules,
  }}>
    {children}
  </AppStateContext.Provider>
}
