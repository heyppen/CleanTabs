
import { browser } from 'wxt/browser'
import Editor from "@monaco-editor/react"

import { loader } from '@monaco-editor/react';
import { useContext, useMemo } from 'react';
import { AppStateContext } from './Providers';
import { Rule2Text } from '@/lib/types';

const root = browser.runtime.getURL('/');
console.log(root);

// you can change the source of the monaco files
loader.config({ paths: { vs: root + '/lib/vs' } });

export default function RulesEditor() {

  const { rules, setRules } = useContext(AppStateContext)

  const rulesText = useMemo(() => {
    return rules.map(r => Rule2Text(r)).join('\n')
  }, [rules])

  return <div>
    <div className=''>
      <Editor
        height="300px"
        defaultLanguage="plaintext"
        defaultValue={rulesText}
        className='border'
      />
    </div>
  </div>
}


