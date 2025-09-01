'use client'
import { useState, useEffect } from 'react'
export default function LoginPage(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [msg,setMsg]=useState<string|undefined>()
  useEffect(()=>{ if (typeof window!=='undefined'){ const t=localStorage.getItem('token'); if(t) setMsg('Already logged in (token present).') }},[])
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  async function onSubmit(e:React.FormEvent){
    e.preventDefault()
    setMsg(undefined)
    const res = await fetch(`${api}/auth/login`,{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password}) })
    const data = await res.json().catch(()=>({}))
    if(res.ok && data?.access_token){ localStorage.setItem('token', data.access_token); setMsg('Logged in! Token saved.') } else { setMsg(data?.message || 'Login failed') }
  }
  return (<main><h1>Login</h1><form onSubmit={onSubmit}><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><button type="submit">Login</button></form>{msg && <p>{msg}</p>}</main>)
}