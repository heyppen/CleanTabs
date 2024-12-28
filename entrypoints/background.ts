
import { browser, Tabs } from 'wxt/browser'
import { storage } from 'wxt/storage';
import { defineBackground, MatchPattern } from 'wxt/sandbox';
import { onMessage } from 'webext-bridge/background'

import { Rule, DefaultRules } from '@/lib/rule';
import { AddToStash, GetSettings, GetRules, SetStash, SetSettings, SetRules, STORAGE_KEY_ENABLED, STORAGE_KEY_STASH, STORAGE_KEY_RULES } from '@/lib/storage';
import { DefaultStash, StashItem } from '@/lib/stash';
import { DefaultSettings } from '@/lib/settings';
import { NowHuman } from '@/lib/date';

export default defineBackground(() => {
  console.log('background.js starts...', { id: browser.runtime.id });

  const DefaultAlarmName = "default-alarm"
  checkAlarmState();

  browser.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason !== 'install') {
      return;
    }
    console.log('onInstalled...')
    await onInstall()
  })

  browser.alarms.onAlarm.addListener((alarm) => {
    console.log(NowHuman(), 'alarm fired:', alarm)
    cron();
  });

  onMessage('run-cron', async () => {
    console.log('manual cron...')
    await cron();
    return { ok: true }
  })

  async function onInstall() {
    // init storage
    await storage.setItem(STORAGE_KEY_ENABLED, true)
    await SetSettings(DefaultSettings)
    await SetRules(DefaultRules)
    await SetStash(DefaultStash)

    if (import.meta.env.MODE === 'development') {
      cron();
    }
  }

  async function cron() {
    // - get rules
    // - loop over tabs
    //   - find matching rule
    //   - run action

    const enabled_ = await enabled()
    if (!enabled_) {
      console.log('Extension disabled, abort...')
      return
    }

    const settings = await GetSettings()
    console.log('settings:', settings)

    const rules = await GetRules();
    console.log('rules:', rules)

    const patterns = rulesToPatterns(rules)

    const tabs = await browser.tabs.query({})
    for (const tab of tabs) {
      if (!(tab.id) || !(tab.url)) {
        console.log('tab has no id or url')
        continue
      }

      const url = tab.url;
      console.log('tab url:', url)

      if (tab.active) {
        console.log('tab is active, skip...')
        continue
      }

      if (isNewBlankTab(tab.url)) {
        await tryCloseNewBlankTab(tab)
        continue
      }


      const p = findPattern(patterns, url)
      if (!p) {
        console.log('no matching rule')
        continue
      }
      console.log('matching rule:', p)

      // execute matching rule
      await executeRule(p.rule, tab)
    }
  }

  async function checkAlarmState() {
    console.log('checking alarm state')
    const alarm = await browser.alarms.get(DefaultAlarmName);
    if (!alarm) {
      console.log('creating alarm')
      browser.alarms.create(DefaultAlarmName, { periodInMinutes: 1 });
      return
    }
    console.log('alarm created already')
  }

  interface Pattern {
    index: number;
    rule: Rule;
    pattern: MatchPattern;
  }

  function rulesToPatterns(rules: Rule[]): Pattern[] {
    const patterns: Pattern[] = [];
    for (let i = 0; i < rules.length; i++) {
      const r = rules[i];
      patterns.push({
        index: i,
        rule: r,
        pattern: new MatchPattern(r.url_pattern),
      })
    }
    return patterns;
  }

  function isNewBlankTab(url?: string) {
    return url === 'chrome://newtab/'
  }

  async function tryCloseNewBlankTab(tab: Tabs.Tab) {
    if (!isNewBlankTab(tab.url)) {
      return
    }
    console.log('closing newtab')

    const settings = await GetSettings();
    if (settings.CloseBlankNewTab) {
      await closeTab(tab, { toStash: false })
    }
  }

  async function executeRule(rule: Rule, tab: Tabs.Tab) {
    if (!tab.lastAccessed) {
      console.log('tab.lastAccessed undefined')
      return
    }
    const inactive_minutes = (new Date().getTime() - tab.lastAccessed) / 1000 / 60;
    if (inactive_minutes <= rule.inactive_minutes) {
      console.log(`inactive_minutes: ${inactive_minutes} <= ${rule.inactive_minutes}(rule), skip...`)
      return
    }

    if (rule.action === 'discard') {
      discardTab(tab)
    } else if (rule.action === 'close') {
      await closeTab(tab, { toStash: rule.to_stash })
    } else {
      console.log('action=nop')
    }
  }

  function discardTab(tab: Tabs.Tab) {
    if (tab.discarded) {
      console.log('discarded')
      return
    }

    if (tab.id) {
      console.log('try to discard tab:', tab)
      browser.tabs.discard(tab.id)
    }
  }

  async function closeTab(tab: Tabs.Tab, options?: { toStash?: boolean }) {
    if (tab.id) {
      const settings = await GetSettings();
      if (!settings.CloseTabInGroup && tab.groupId !== -1) {
        console.log(`CloseTabInGroup=false, groupId=${tab.groupId}, skip...`)
        return
      }
      if (!settings.ClosePinTab && tab.pinned) {
        console.log('ClosePinTab=false, skip...')
        return
      }

      if (options?.toStash) {
        await addToInbox(tab)
      }
      console.log('try to close tab:', tab)
      browser.tabs.remove(tab.id)
    }
  }


  function findPattern(patterns: Pattern[], url: string): Pattern | null {
    for (const p of patterns) {
      if (p.rule.disabled) {
        continue
      }
      if (p.pattern.includes(url)) {
        return p
      }
    }
    return null
  }


  async function enabled(): Promise<boolean> {
    const b = await storage.getItem(STORAGE_KEY_ENABLED)
    return b === true
  }

  async function addToInbox(tab: Tabs.Tab) {
    if (!tab.url || !tab.favIconUrl || !tab.title) {
      return
    }
    console.log('add to inbox')
    const item: StashItem = {
      url: tab.url,
      favicon_url: tab.favIconUrl,
      title: tab.title,
      last_ts: new Date().getTime(),
      count: 1,
    }

    await AddToStash(item)
  }



  // init();
  // storage.removeItems([STORAGE_KEY_RULES])
});
