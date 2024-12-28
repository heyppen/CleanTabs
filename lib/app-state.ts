import { DefaultStash, Stash } from "./stash";
import { DefaultSettings, Settings } from "./settings";
import { Rule } from "./rule";

export interface IAppState {
  enabled: boolean;
  setEnabled: (_: boolean) => void;

  settings: Settings;
  setSettings: (_: Settings, options?: AppStateSetOptions) => void;

  rules: Rule[];
  setRules: (_: Rule[], options?: AppStateSetOptions) => Promise<void>

  stash: Stash;
  setStash: (_: Stash, options?: AppStateSetOptions) => Promise<void>
}

export const DefaultAppState: IAppState = {
  enabled: true,
  setEnabled: () => { },

  settings: DefaultSettings,
  setSettings: () => { },

  rules: [] as Rule[],
  setRules: async () => { },

  stash: DefaultStash,
  setStash: async () => { },
}


export interface AppStateSetOptions {
  toStorage?: boolean;
}

