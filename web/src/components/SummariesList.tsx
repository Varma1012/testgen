import React from 'react'
import axios from 'axios'
import { useStore } from '../lib/store'

export default function SummariesList() {
  const { summaries, owner, repo, setGenerated, selected } = useStore()
  const [busy, setBusy] = React.useState(false)

  const generate = async (summary: any) => {
    setBusy(true)
    try {
      const paths = Array.from(selected)
      const contents = await axios.post(import.meta.env.VITE_API_BASE_URL + 'api/github/contents', {
        owner, repo, files: paths 
      }, { withCredentials: true })
      const resp = await axios.post(import.meta.env.VITE_API_BASE_URL + 'api/ai/generate', {
        framework: 'jest',
        summary,
        files: contents.data
      }, { withCredentials: true })
      setGenerated(resp.data)
    } finally {
      setBusy(false)
    }
  }

  if (!summaries.length) return <div className="text-gray-500">No summaries yet. Select files and click “Generate Test Summaries”.</div>

  return (
    <div className="space-y-2">
      {summaries.map((s: any) => (
        <div key={s.id} className="border rounded p-3">
          <div className="font-medium">{s.title}</div>
          <div className="text-xs text-gray-600">{s.rationale}</div>
          <button disabled={busy} onClick={() => generate(s)} className="mt-2 px-3 py-1 rounded bg-black text-white">
            {busy ? 'Generating…' : 'Generate Code'}
          </button>
        </div>
      ))}
    </div>
  )
}
