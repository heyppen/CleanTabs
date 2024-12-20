
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
  close: {
    action: 'close',
    display: 'Close',
  },
  discard: {
    action: 'discard',
    display: 'Discard',
  }
}



export interface Rule {
  regex: string;
  inactive_minutes: number;
  action: Action;
  to_inbox?: boolean;
  disabled?: boolean;

  // in-memory only
  dirty?: boolean;
}


export function Rule2Text(r: Rule): string {
  return `${r.regex}, ${r.inactive_minutes}, ${r.action}, ${bool2text(r.to_inbox)}, ${bool2text(r.disabled)}`
}


function bool2text(b?: boolean): string {
  if (b === undefined) return ''
  return b ? 'true' : 'false'
}


export const RulesDemoData: Rule[] = [
  // { regex: '*', inactive_seconds: 300, action: 'discard', disabled: false },
  { regex: '*://*.google.com/*', inactive_minutes: 1, action: 'close', disabled: false },
  { regex: '*://gmail.com/*', inactive_minutes: 3, action: 'discard', disabled: false },
  { regex: '*://*.youdao.com/*', inactive_minutes: 3, action: 'close', disabled: true },
  { regex: '*://gmail.com/*', inactive_minutes: 3, action: 'discard', disabled: false },
]


