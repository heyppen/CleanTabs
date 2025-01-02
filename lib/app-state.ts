import { DefaultStash, Stash } from "./stash";
import { DefaultSettings, Settings } from "./settings";
import { Rule } from "./rule";
import { DefaultFlags, Flag } from "./tab";

export interface IAppState {
  enabled: boolean;
  setEnabled: (_: boolean) => Promise<void>;

  settings: Settings;
  setSettings: (_: Settings, options?: AppStateSetOptions) => Promise<void>;

  rules: Rule[];
  setRules: (_: Rule[], options?: AppStateSetOptions) => Promise<void>

  stash: Stash;
  setStash: (_: Stash, options?: AppStateSetOptions) => Promise<void>

  flags: Flag[];
  setFlags: (_: Flag[], options?: AppStateSetOptions) => Promise<void>
}

export const DefaultAppState: IAppState = {
  enabled: true,
  setEnabled: async () => { },

  settings: DefaultSettings,
  setSettings: async () => { },

  rules: [] as Rule[],
  setRules: async () => { },

  stash: DefaultStash,
  setStash: async () => { },

  flags: DefaultFlags,
  setFlags: async () => { },
}


export interface AppStateSetOptions {
  toStorage?: boolean;
}

