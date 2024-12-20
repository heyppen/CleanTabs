import { Rule } from "./types";
import { MatchPattern } from 'wxt/sandbox';


export interface ValidationResult {
  ok: boolean;
  reason?: string;
}

export function ValidateRule(r: Rule): ValidationResult {
  const regexRes = v_rule_regex(r.regex)
  if (!regexRes.ok) {
    return {
      ok: false,
      reason: `bad regex: ${regexRes.reason}`
    }
  }

  const inactiveRes = v_rule_inactive_minutes(r.inactive_minutes)
  if (!inactiveRes.ok) {
    return {
      ok: false,
      reason: `bad inactive_minutes: ${inactiveRes.reason}`
    }
  }

  return { ok: true }
}


export function v_rule_regex(r: string): ValidationResult {
  try {
    new MatchPattern(r)
    return { ok: true }
  } catch (error) {
    console.log(error)
    return { ok: false }
  }
}

function v_rule_inactive_minutes(m: number): ValidationResult {
  if (isNaN(m)) {
    return {
      ok: false,
      reason: 'NaN'
    }
  }

  // (1m, 7d)
  if (m < 1 || m > 7 * 24 * 60) {
    return {
      ok: false,
      reason: 'between 1 minute and 7 days'
    }
  }

  return { ok: true }
}
