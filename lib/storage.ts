import { storage } from "wxt/storage";
import { Rule } from "./rule";
import { Stash, StashItem } from "./stash";
import { DefaultSettings, Settings } from "./settings";
import { DefaultFlags, Flag } from "./tab";

export const STORAGE_KEY_ENABLED = 'local:enabled'
export const STORAGE_KEY_RULES = 'local:rules'
export const STORAGE_KEY_STASH = 'local:stash'
export const STORAGE_KEY_SETTINGS = 'local:settings'
export const STORAGE_KEY_FLAGS = 'local:flags'


export async function GetRules(): Promise<Rule[]> {
  const rules: Rule[] = await storage.getItem<Rule[]>(STORAGE_KEY_RULES) ?? []
  return rules
}

export async function SetRules(rules: Rule[]) {
  await storage.setItem(STORAGE_KEY_RULES, rules)
}

export async function GetStash(): Promise<Stash> {
  const stash: Stash = await storage.getItem<Stash>(STORAGE_KEY_STASH) ?? { update_at: 0, items: [] }
  return stash
}

export async function SetStash(stash: Stash, check: boolean = true) {
  if (check) {
    const oldStash = await GetStash()
    if (oldStash.update_at > stash.update_at) {
      throw Error('data has changed')
    }
  }

  console.log('set stash', stash)
  await storage.setItem(STORAGE_KEY_STASH, stash)
}

export async function AddToStash(item: StashItem) {
  const stash = await GetStash()
  console.log(stash)

  const existingItemIndex = stash.items.findIndex((it) => it.url === item.url)
  if (existingItemIndex >= 0) {
    // found
    item.count = stash.items[existingItemIndex].count + 1
    item.last_ts = new Date().getTime()
    stash.items[existingItemIndex] = item
  } else {
    // not found
    stash.items.push(item)
  }
  stash.update_at = new Date().getTime()

  await SetStash(stash, false)
}


export async function GetSettings(): Promise<Settings> {
  const options = await storage.getItem<Settings>(STORAGE_KEY_SETTINGS) ?? DefaultSettings
  return options
}

export async function SetSettings(settings: Settings) {
  await storage.setItem(STORAGE_KEY_SETTINGS, settings)
}


export async function GetFlags(): Promise<Flag[]> {
  const flags = await storage.getItem<Flag[]>(STORAGE_KEY_FLAGS) ?? DefaultFlags;
  return flags
}

export async function SetFlags(flags: Flag[]) {
  await storage.setItem(STORAGE_KEY_FLAGS, flags)
}
