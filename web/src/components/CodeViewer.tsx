import React from 'react'
import { useStore } from '../lib/store'
import Editor from '@monaco-editor/react'

export default function CodeViewer() {
  const { generated } = useStore()
  if (!generated) return <div className="text-gray-500">Generated test code will appear here.</div>
  return (
    <div className="h-96 border rounded">
      <Editor height="100%" language="typescript" value={generated.code} options={{ readOnly: false, wordWrap: 'on' }} />
    </div>
  )
}
