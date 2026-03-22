'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2a1f1a' }}>
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-10">
          <div className="inline-flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
                 style={{ borderColor: '#956d4d' }}>
              <span className="font-bold text-lg tracking-widest" style={{ color: '#e1a265' }}>BW</span>
            </div>
            <p className="text-sm tracking-widest uppercase" style={{ color: '#956d4d' }}>Administration</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="rounded-2xl p-8 space-y-5"
              style={{ backgroundColor: '#3d2e26', border: '1px solid #4a3828' }}>
          <div>
            <label className="block text-sm mb-2" style={{ color: '#c4a882' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: '#2a1f1a', border: '1px solid #4a3828', color: '#f5ede3' }}
              placeholder="ton@email.com" />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: '#c4a882' }}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: '#2a1f1a', border: '1px solid #4a3828', color: '#f5ede3' }}
              placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
            style={{ backgroundColor: '#e1a265', color: '#2a1f1a' }}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
