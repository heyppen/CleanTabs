import { Rule } from "./types";

export interface IAppState {
  rules: Rule[];
  setRules: (rules: Rule[], toStorage?: boolean) => Promise<void>
}

export const DefaultAppState: IAppState = {
  rules: [] as Rule[],
  setRules: async (rules: Rule[], toStorage?: boolean) => { },
}
