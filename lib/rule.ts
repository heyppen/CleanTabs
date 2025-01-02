
import { MatchPattern } from './match-pattern';

export interface Rule {
  url_pattern: string;
  inactive_minutes: number;
  action: Action;
  to_stash?: boolean;
  disabled?: boolean;

  // in-memory only
  dirty?: boolean;
  index?: number;
}

export const DefaultRules: Rule[] = [
  { url_pattern: '*://gmail.com/*', inactive_minutes: 1, action: 'nop' },
  { url_pattern: '*://*.google.com/*', inactive_minutes: 2, action: 'discard' },
  { url_pattern: 'chrome://newtab/', inactive_minutes: 1, action: 'close' },
  { url_pattern: 'about:blank', inactive_minutes: 1, action: 'close' },
  { url_pattern: '*://*/*', inactive_minutes: 10, action: 'discard' },
]

export type Action = 'nop' | 'close' | 'discard';

export interface ActionAttr {
  action: Action;
  display: string;
}

export const Actions: Record<Action, ActionAttr> = {
  nop: {
    action: 'nop',
    display: 'NOP',
  },
  discard: {
    action: 'discard',
    display: 'Discard',
  },
  close: {
    action: 'close',
    display: 'Close',
  },
}

export function FindMatchedRule(rules: Rule[], url: string): Rule | null {
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];

    if (rule.disabled) {
      continue
    }

    const p = new MatchPattern(rule.url_pattern)
    if (p.includes(url)) {
      return { ...rule, index: i }
    }
  }
  return null
}



export function Rule2Text(r: Rule): string {
  return `${r.url_pattern}, ${r.inactive_minutes}, ${r.action}, ${bool2text(r.to_stash)}, ${bool2text(r.disabled)}`
}


function bool2text(b?: boolean): string {
  if (b === undefined) return ''
  return b ? 'true' : 'false'
}


export interface ValidationResult {
  ok: boolean;
  reason?: string;
}


export function ValidateRules(rules: Rule[]): ValidationResult {
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i]
    const res = ValidateRule(rule)
    if (!res.ok) {
      return {
        ok: false,
        reason: `Rule ${i + 1}: ${res.reason}`
      }
    }
  }
  return { ok: true }
}

export function ValidateRule(r: Rule): ValidationResult {
  const regexRes = v_rule_pattern(r.url_pattern)
  if (!regexRes.ok) {
    return {
      ok: false,
      reason: regexRes.reason,
    }
  }

  const inactiveRes = v_rule_inactive_minutes(r.inactive_minutes)
  if (!inactiveRes.ok) {
    return {
      ok: false,
      reason: inactiveRes.reason
    }
  }

  return { ok: true }
}


export function v_rule_pattern(r: string): ValidationResult {
  r = r.trim()
  if (r === '') {
    return {
      ok: false,
      reason: 'empty pattern'
    }
  }
  try {
    new MatchPattern(r)
    return { ok: true }
  } catch (error) {
    console.log(error)
    return { ok: false, reason: 'invalid pattern' }
  }
}

function v_rule_inactive_minutes(m: number): ValidationResult {
  if (isNaN(m)) {
    return {
      ok: false,
      reason: 'not a number'
    }
  }

  // (1m, 7d)
  if (m < 0 || m > 30 * 24 * 60) {
    return {
      ok: false,
      reason: 'must be [0, 30*24*60]'
    }
  }

  return { ok: true }
}

export function ParseRulesText(text: string): Rule[] {
  const rules: Rule[] = [];

  const lines = text.split('\n')

  let i = 0;
  try {
    for (i = 0; i < lines.length; i++) {
      const line = lines[i]
      const rule = ParseRuleLine(line)
      if (rule) rules.push(rule)
    }
  } catch (error) {
    throw Error(`Line ${i + 1}: ${error}`)
  }

  return rules
}

function ParseRuleLine(line: string): Rule | null {
  if (line.trim() === '' || line.startsWith('//')) {
    return null
  }
  const tokens = line.split(',').map(s => s.trim())

  // 1. url pattern
  const pattern = (tokens.at(0) ?? '')
  const patternRes = v_rule_pattern(pattern)
  if (!patternRes.ok) {
    throw Error('bad regex')
  }


  // 2. inactive_minutes
  const min = parseInt((tokens.at(1) ?? ''))
  const minRes = v_rule_inactive_minutes(min)
  if (!minRes.ok) {
    throw Error('bad inactive_minutes, should be a number')
  }


  // 3. action
  const action = (tokens.at(2) ?? '').toLowerCase()
  if (!['nop', 'discard', 'close'].includes(action)) {
    throw Error(`bad action, should be nop, discard, close`)
  }

  // 4. to_stash
  const to_stash_str = (tokens.at(3) ?? '').toLowerCase()
  if (!['', 'true', 'false'].includes(to_stash_str)) {
    throw Error(`should be true, false`)
  }


  // 5. disabled
  const disabled_str = (tokens.at(4) ?? '').toLowerCase()
  if (!['', 'true', 'false'].includes(disabled_str)) {
    throw Error(`should be true, false`)
  }

  return {
    url_pattern: pattern,
    inactive_minutes: min,
    action: action as Action,
    to_stash: parseBool(to_stash_str),
    disabled: parseBool(disabled_str),
  }
}

function parseBool(s: string): boolean | undefined {
  if (s === 'true') {
    return true
  }
  if (s === 'false') {
    return false
  }
  return undefined
}
