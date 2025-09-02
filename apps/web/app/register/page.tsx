'use client'
import { useState } from 'react'
export default function RegisterPage() {
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [name,setName]=useState('')
  const [msg,setMsg]=useState<string|undefined>()
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  async function onSubmit(e:React.FormEvent){
    e.preventDefault()
    setMsg(undefined)
    const res = await fetch(`${api}/auth/register`,{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password,name}) })
    const data = await res.json().catch(()=>({}))
    setMsg(res.ok ? 'Registered! Now login.' : (data?.message || 'Failed'))
  }
  return (<main><h1>Register Page</h1><form onSubmit={onSubmit}><input placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} /><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><button type="submit">Create account</button></form>{msg && <p>{msg}</p>}</main>)
}