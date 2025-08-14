import React from 'react'
import axios from 'axios'
import { useStore } from '../lib/store'

export default function CreatePRDialog() {
  const { owner, repo, branch, generated } = useStore()
  const [title, setTitle] = React.useState('chore: add generated tests')
  const [body, setBody] = React.useState('This PR adds AI-generated tests.')
  const [newBranch, setNewBranch] = React.useState('ai/tests-' + Math.random().toString(36).slice(2, 8))
  const [creating, setCreating] = React.useState(false)
  const [url, setUrl] = React.useState<string | null>(null)

  const createPR = async () => {
    if (!generated) return
    setCreating(true)
    setUrl(null)
    try {
      const resp = await axios.post(import.meta.env.VITE_API_BASE_URL + 'api/pr/create', {
        owner, repo, baseBranch: branch, newBranch,
        files: [{ path: generated.filename, content: generated.code }],
        title, body
      }, { withCredentials: true })
      setUrl(resp.data.html_url)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-700">Create PR</div>
      <input className="w-full border rounded p-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea className="w-full border rounded p-2" placeholder="Body" value={body} onChange={e => setBody(e.target.value)} />
      <input className="w-full border rounded p-2" placeholder="New branch name" value={newBranch} onChange={e => setNewBranch(e.target.value)} />
      <button disabled={creating} onClick={createPR} className="px-3 py-2 rounded bg-black text-white">
        {creating ? 'Creating…' : 'Create PR'}
      </button>
      {url && <div className="text-sm">PR: <a className="text-blue-600 underline" href={url} target="_blank" rel="noreferrer">{url}</a></div>}
    </div>
  )
}
