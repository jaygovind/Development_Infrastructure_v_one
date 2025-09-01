'use client'
import { useState } from 'react'
export default function UploadPage(){
  const [file,setFile]=useState<File|null>(null)
  const [result,setResult]=useState<any>(null)
  const [msg,setMsg]=useState<string|undefined>()
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  async function onSubmit(e:React.FormEvent){
    e.preventDefault(); setMsg(undefined); setResult(null)
    if(!file){ setMsg('Choose a file'); return; }
    const token = typeof window!=='undefined' ? localStorage.getItem('token') : null
    if(!token){ setMsg('Login required'); return; }
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch(`${api}/upload`, { method:'POST', headers:{ 'Authorization': `Bearer ${token}` }, body: fd })
    const data = await res.json().catch(()=>({}))
    if(res.ok){ setResult(data); setMsg('Uploaded!') } else { setMsg(data?.message || 'Upload failed') }
  }
  return (<main><h1>Protected Upload</h1><form onSubmit={onSubmit}><input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} /><button type="submit">Upload</button></form>{msg && <p>{msg}</p>}{result && <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(result,null,2)}</pre>}</main>)
}