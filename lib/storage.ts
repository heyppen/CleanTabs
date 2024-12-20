import { storage } from "wxt/storage";
import { Rule } from "./types";

export const STORAGE_KEY_RULES = 'local:rules'


export async function GetRules(): Promise<Rule[]> {
  const rules: Rule[] = await storage.getItem<Rule[]>(STORAGE_KEY_RULES) ?? []
  return rules
}

export async function SetRules(rules: Rule[]) {
  await storage.setItem(STORAGE_KEY_RULES, rules)
}
