
import { browser, Tabs } from 'wxt/browser'
import { storage } from 'wxt/storage';
import { defineBackground, MatchPattern } from 'wxt/sandbox';

import { Rule, RulesDemoData } from '@/lib/types';
import { STORAGE_KEY_RULES } from '@/lib/storage';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  const STORAGE_KEY = "local:alarm-enabled";
  const defaultAlarmName = "default-alarm"

  async function createAlarm() {
    await browser.alarms.clearAll()
    const alarm = await browser.alarms.get(defaultAlarmName);
    if (!alarm) {
      browser.alarms.create(defaultAlarmName, { periodInMinutes: 1 });
    }
  }

  async function getRules(): Promise<Rule[]> {
    const rules = await storage.getItem<Rule[]>(STORAGE_KEY_RULES)
    return rules ?? []
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
        pattern: new MatchPattern(r.regex),
      })
    }
    return patterns;
  }


  function discardTab(tab: Tabs.Tab) {
    if (tab.discarded) {
      return
    }

    if (tab.id) {
      console.log('try to discard tab:', tab)
      browser.tabs.discard(tab.id)
    }
  }

  function closeTab(tab: Tabs.Tab) {
    if (tab.id) {
      console.log('try to close tab:', tab)
      browser.tabs.remove(tab.id)
    }
  }

  function executeRule(rule: Rule, tab: Tabs.Tab) {
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
      closeTab(tab)
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
  async function cron() {
    // - get rules
    // - loop over tabs
    //   - find matching rule
    //   - run action

    const rules = await getRules();
    console.log('rules:', rules)
    const patterns = rulesToPatterns(rules)

    const tabs = await browser.tabs.query({})
    for (const tab of tabs) {
      if (!(tab.id) || !(tab.url)) {
        console.log('tab has no id or url')
        continue
      }
      console.log(tab)

      const url = tab.url;
      const p = findPattern(patterns, url)
      if (!p) {
        console.log('no matching rule')
        continue
      }
      console.log('matching rule:', p)

      // execute matching rule
      executeRule(p.rule, tab)
    }
  }




  async function init() {
    await storage.setItem(STORAGE_KEY_RULES, RulesDemoData)

    createAlarm();
    cron();
  }

  browser.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason !== 'install') {
      return;
    }
    await init()
  })

  browser.alarms.onAlarm.addListener((alarm) => {
    console.log('alarm fired:', alarm)
    cron();
  });

  // init();
  // storage.removeItems([STORAGE_KEY_RULES])
});
