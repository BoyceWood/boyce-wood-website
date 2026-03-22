'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type SupabaseClient = ReturnType<typeof createClient>

const TABS = [
  { id: 'contenu',     label: '✏️ Contenu' },
  { id: 'medias',      label: '🖼️ Médias' },
  { id: 'temoignages', label: '💬 Témoignages' },
  { id: 'references',  label: '🤝 Références' },
]

export default function AdminPage() {
  const [tab, setTab] = useState('contenu')
  const supabase = createClient()
  const router = useRouter()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1e1510', color: '#f5ede3' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
              style={{ backgroundColor: '#2a1f1a', borderColor: '#3d2e26' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border flex items-center justify-center"
               style={{ borderColor: '#956d4d' }}>
            <span className="text-xs font-bold" style={{ color: '#e1a265' }}>BW</span>
          </div>
          <span className="font-semibold text-sm" style={{ color: '#c4a882' }}>Admin · Boyce Wood</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank"
             className="text-xs px-4 py-2 rounded-lg transition-all"
             style={{ backgroundColor: '#3d2e26', color: '#c4a882' }}>
            Voir le site →
          </a>
          <button onClick={logout}
                  className="text-xs px-4 py-2 rounded-lg transition-all"
                  style={{ backgroundColor: '#3d2e26', color: '#956d4d' }}>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 px-6 pt-6 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
                  style={tab === t.id
                    ? { backgroundColor: '#e1a265', color: '#2a1f1a' }
                    : { backgroundColor: '#2a1f1a', color: '#956d4d' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="p-6">
        {tab === 'contenu'     && <TabContenu     supabase={supabase} />}
        {tab === 'medias'      && <TabMedias      supabase={supabase} />}
        {tab === 'temoignages' && <TabTemoignages supabase={supabase} />}
        {tab === 'references'  && <TabReferences  supabase={supabase} />}
      </main>
    </div>
  )
}

/* ── TAB CONTENU ── */
function TabContenu({ supabase }: { supabase: SupabaseClient }) {
  const [rows, setRows] = useState<{ cle: string; valeur: string; description: string }[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('contenu').select('*').order('cle').then(({ data }) => {
      setRows(data || [])
      const init: Record<string, string> = {}
      data?.forEach(r => { init[r.cle] = r.valeur })
      setValues(init)
    })
  }, [])

  async function save(cle: string) {
    setSaving(cle)
    await supabase.from('contenu').update({ valeur: values[cle] }).eq('cle', cle)
    setSaving(null)
    setSaved(cle)
    setTimeout(() => setSaved(null), 2000)
  }

  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="text-lg font-semibold mb-6" style={{ color: '#e1a265' }}>Textes du site</h2>
      {rows.map(row => (
        <div key={row.cle} className="rounded-2xl p-5"
             style={{ backgroundColor: '#2a1f1a', border: '1px solid #3d2e26' }}>
          <label className="block text-xs mb-1 font-mono" style={{ color: '#956d4d' }}>{row.cle}</label>
          {row.description && <p className="text-xs mb-2" style={{ color: '#7a6355' }}>{row.description}</p>}
          <div className="flex gap-3">
            <textarea
              value={values[row.cle] ?? ''}
              rows={(values[row.cle] ?? '').length > 80 ? 3 : 1}
              onChange={e => setValues(v => ({ ...v, [row.cle]: e.target.value }))}
              className="flex-1 px-3 py-2 rounded-lg text-sm resize-none outline-none"
              style={{ backgroundColor: '#1e1510', border: '1px solid #3d2e26', color: '#f5ede3' }}
            />
            <button onClick={() => save(row.cle)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold self-start transition-all"
                    style={{ backgroundColor: saved === row.cle ? '#4a7c59' : '#e1a265', color: '#2a1f1a' }}>
              {saving === row.cle ? '…' : saved === row.cle ? '✓ Sauvé' : 'Sauver'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── TAB MÉDIAS ── */
function TabMedias({ supabase }: { supabase: SupabaseClient }) {
  const [medias, setMedias] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [legende, setLegende] = useState('')
  const [addingVideo, setAddingVideo] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const { data } = await supabase.from('medias').select('*').order('ordre')
    setMedias(data || [])
  }
  useEffect(() => { load() }, [])

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `medias/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('boyce-wood').upload(path, file)
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('boyce-wood').getPublicUrl(path)
      await supabase.from('medias').insert({ type: 'photo', url: publicUrl, ordre: medias.length, actif: true })
      await load()
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function addVideo() {
    if (!youtubeUrl.trim()) return
    setAddingVideo(true)
    const match = youtubeUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    const id = match ? match[1] : youtubeUrl.trim()
    await supabase.from('medias').insert({ type: 'video', youtube_id: id, legende, ordre: medias.length, actif: true })
    setYoutubeUrl('')
    setLegende('')
    await load()
    setAddingVideo(false)
  }

  async function deleteMedia(id: string, url?: string) {
    if (url) {
      const path = url.split('/boyce-wood/')[1]
      if (path) await supabase.storage.from('boyce-wood').remove([path])
    }
    await supabase.from('medias').delete().eq('id', id)
    await load()
  }

  async function toggleActif(id: string, actif: boolean) {
    await supabase.from('medias').update({ actif: !actif }).eq('id', id)
    await load()
  }

  return (
    <div className="max-w-4xl space-y-8">
      <h2 className="text-lg font-semibold" style={{ color: '#e1a265' }}>Médias</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload photo */}
        <div className="rounded-2xl p-6 space-y-4"
             style={{ backgroundColor: '#2a1f1a', border: '1px solid #3d2e26' }}>
          <h3 className="font-medium text-sm" style={{ color: '#c4a882' }}>📷 Ajouter une photo</h3>
          <label className="flex items-center justify-center py-8 rounded-xl cursor-pointer border-2 border-dashed transition-all hover:border-[#956d4d]"
                 style={{ borderColor: '#3d2e26' }}>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
            <span className="text-sm" style={{ color: '#956d4d' }}>
              {uploading ? '⏳ Upload en cours…' : '+ Choisir une photo'}
            </span>
          </label>
        </div>

        {/* Vidéo YouTube */}
        <div className="rounded-2xl p-6 space-y-4"
             style={{ backgroundColor: '#2a1f1a', border: '1px solid #3d2e26' }}>
          <h3 className="font-medium text-sm" style={{ color: '#c4a882' }}>🎬 Ajouter une vidéo YouTube</h3>
          <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
                 placeholder="https://youtu.be/xxxxx"
                 className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                 style={{ backgroundColor: '#1e1510', border: '1px solid #3d2e26', color: '#f5ede3' }} />
          <input value={legende} onChange={e => setLegende(e.target.value)}
                 placeholder="Légende (optionnel)"
                 className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                 style={{ backgroundColor: '#1e1510', border: '1px solid #3d2e26', color: '#f5ede3' }} />
          <button onClick={addVideo} disabled={addingVideo || !youtubeUrl.trim()}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                  style={{ backgroundColor: '#e1a265', color: '#2a1f1a' }}>
            {addingVideo ? 'Ajout…' : 'Ajouter la vidéo'}
          </button>
        </div>
      </div>

      {/* Grille médias */}
      {medias.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {medias.map(m => (
            <div key={m.id} className="relative group rounded-xl overflow-hidden"
                 style={{ backgroundColor: '#2a1f1a', border: '1px solid #3d2e26', opacity: m.actif ? 1 : 0.5 }}>
              <img
                src={m.type === 'photo' ? m.url : `https://img.youtube.com/vi/${m.youtube_id}/mqdefault.jpg`}
                alt={m.legende || ''}
                className="w-full aspect-square object-cover"
              />
              {m.type === 'video' && (
                <div className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold"
                     style={{ backgroundColor: '#e1a265', color: '#2a1f1a' }}>YT</div>
              )}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 p-2">
                <button onClick={() => toggleActif(m.id, m.actif)}
                        className="w-full py-1.5 rounded-lg text-xs font-semibold"
                        style={{ backgroundColor: '#3d2e26', color: '#c4a882' }}>
                  {m.actif ? 'Masquer' : 'Afficher'}
                </button>
                <button onClick={() => deleteMedia(m.id, m.url)}
                        className="w-full py-1.5 rounded-lg text-xs font-semibold"
                        style={{ backgroundColor: '#c0392b', color: 'white' }}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {medias.length === 0 && (
        <div className="text-center py-12 rounded-2xl" style={{ backgroundColor: '#2a1f1a' }}>
          <p className="text-4xl mb-3">🖼️</p>
          <p style={{ color: '#956d4d' }}>Aucun média pour l'instant</p>
        </div>
      )}
    </div>
  )
}

/* ── TAB TÉMOIGNAGES ── */
function TabTemoignages({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState({ texte: '', auteur: '', type_event: '' })
  const [adding, setAdding] = useState(false)

  async function load() {
    const { data } = await supabase.from('temoignages').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  async function add() {
    if (!form.texte || !form.auteur) return
    setAdding(true)
    await supabase.from('temoignages').insert({ ...form, actif: true })
    setForm({ texte: '', auteur: '', type_event: '' })
    await load()
    setAdding(false)
  }

  async function toggle(id: string, actif: boolean) {
    await supabase.from('temoignages').update({ actif: !actif }).eq('id', id)
    await load()
  }

  async function del(id: string) {
    if (!confirm('Supprimer ce témoignage ?')) return
    await supabase.from('temoignages').delete().eq('id', id)
    await load()
  }

  return (
    <div className="max-w-3xl space-y-8">
      <h2 className="text-lg font-semibold" style={{ color: '#e1a265' }}>Témoignages</h2>

      <div className="rounded-2xl p-6 space-y-4"
           style={{ backgroundColor: '#2a1f1a', border: '1px solid #3d2e26' }}>
        <h3 className="font-medium text-sm" style={{ color: '#c4a882' }}>Ajouter un témoignage</h3>
        <textarea value={form.texte} onChange={e => setForm({ ...form, texte: e.target.value })}
                  placeholder="Texte du témoignage…" rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ backgroundColor: '#1e1510', border: '1px solid #3d2e26', color: '#f5ede3' }} />
        <div className="grid grid-cols-2 gap-3">
          <input value={form.auteur} onChange={e => setForm({ ...form, auteur: e.target.value })}
                 placeholder="Auteur *"
                 className="px-4 py-3 rounded-xl text-sm outline-none"
                 style={{ backgroundColor: '#1e1510', border: '1px solid #3d2e26', color: '#f5ede3' }} />
          <input value={form.type_event} onChange={e => setForm({ ...form, type_event: e.target.value })}
                 placeholder="Type d'événement"
                 className="px-4 py-3 rounded-xl text-sm outline-none"
                 style={{ backgroundColor: '#1e1510', border: '1px solid #3d2e26', color: '#f5ede3' }} />
        </div>
        <button onClick={add} disabled={adding || !form.texte || !form.auteur}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: '#e1a265', color: '#2a1f1a' }}>
          {adding ? 'Ajout…' : 'Ajouter'}
        </button>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="rounded-2xl p-5 flex gap-4 items-start transition-all"
               style={{ backgroundColor: '#2a1f1a', border: '1px solid #3d2e26', opacity: item.actif ? 1 : 0.5 }}>
            <div className="flex-1">
              <p className="text-sm mb-1 italic" style={{ color: '#f5ede3' }}>"{item.texte}"</p>
              <p className="text-xs" style={{ color: '#956d4d' }}>
                — {item.auteur}{item.type_event && ` · ${item.type_event}`}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggle(item.id, item.actif)}
                      className="px-3 py-1.5 rounded-lg text-xs"
                      style={{ backgroundColor: '#3d2e26', color: '#c4a882' }}>
                {item.actif ? 'Masquer' : 'Afficher'}
              </button>
              <button onClick={() => del(item.id)}
                      className="px-3 py-1.5 rounded-lg text-xs"
                      style={{ backgroundColor: '#3d2e26', color: '#c0392b' }}>
                Suppr.
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-10 rounded-2xl" style={{ backgroundColor: '#2a1f1a' }}>
            <p style={{ color: '#956d4d' }}>Aucun témoignage pour l'instant</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── TAB RÉFÉRENCES ── */
function TabReferences({ supabase }: { supabase: SupabaseClient }) {
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState({ nom: '', event: '' })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [adding, setAdding] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const { data } = await supabase.from('references').select('*').order('ordre')
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  async function add() {
    if (!form.nom) return
    setAdding(true)
    let logo_url = ''
    if (logoFile) {
      const ext = logoFile.name.split('.').pop()
      const path = `refs/${Date.now()}.${ext}`
      await supabase.storage.from('boyce-wood').upload(path, logoFile)
      const { data: { publicUrl } } = supabase.storage.from('boyce-wood').getPublicUrl(path)
      logo_url = publicUrl
    }
    await supabase.from('references').insert({ ...form, logo_url, ordre: items.length, actif: true })
    setForm({ nom: '', event: '' })
    setLogoFile(null)
    if (fileRef.current) fileRef.current.value = ''
    await load()
    setAdding(false)
  }

  async function del(id: string, logo_url?: string) {
    if (!confirm('Supprimer cette référence ?')) return
    if (logo_url) {
      const path = logo_url.split('/boyce-wood/')[1]
      if (path) await supabase.storage.from('boyce-wood').remove([path])
    }
    await supabase.from('references').delete().eq('id', id)
    await load()
  }

  return (
    <div className="max-w-3xl space-y-8">
      <h2 className="text-lg font-semibold" style={{ color: '#e1a265' }}>Références</h2>

      <div className="rounded-2xl p-6 space-y-4"
           style={{ backgroundColor: '#2a1f1a', border: '1px solid #3d2e26' }}>
        <h3 className="font-medium text-sm" style={{ color: '#c4a882' }}>Ajouter une référence</h3>
        <div className="grid grid-cols-2 gap-3">
          <input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
                 placeholder="Nom du partenaire *"
                 className="px-4 py-3 rounded-xl text-sm outline-none"
                 style={{ backgroundColor: '#1e1510', border: '1px solid #3d2e26', color: '#f5ede3' }} />
          <input value={form.event} onChange={e => setForm({ ...form, event: e.target.value })}
                 placeholder="Événement (ex: Hesbaye en fête)"
                 className="px-4 py-3 rounded-xl text-sm outline-none"
                 style={{ backgroundColor: '#1e1510', border: '1px solid #3d2e26', color: '#f5ede3' }} />
        </div>
        <label className="flex items-center gap-3 py-4 px-4 rounded-xl cursor-pointer border-2 border-dashed transition-all hover:border-[#956d4d]"
               style={{ borderColor: '#3d2e26' }}>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
                 onChange={e => setLogoFile(e.target.files?.[0] || null)} />
          <span className="text-sm" style={{ color: '#956d4d' }}>
            {logoFile ? `✓ ${logoFile.name}` : '+ Logo (optionnel)'}
          </span>
        </label>
        <button onClick={add} disabled={adding || !form.nom}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: '#e1a265', color: '#2a1f1a' }}>
          {adding ? 'Ajout…' : 'Ajouter la référence'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.id} className="rounded-2xl p-4 flex items-center gap-4"
               style={{ backgroundColor: '#2a1f1a', border: '1px solid #3d2e26' }}>
            {item.logo_url ? (
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden p-1 shrink-0">
                <img src={item.logo_url} alt={item.nom} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg"
                   style={{ backgroundColor: '#3d2e26', color: '#e1a265' }}>
                {item.nom.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: '#f5ede3' }}>{item.nom}</p>
              {item.event && <p className="text-xs truncate" style={{ color: '#956d4d' }}>{item.event}</p>}
            </div>
            <button onClick={() => del(item.id, item.logo_url)}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: '#3d2e26', color: '#c0392b' }}>
              Suppr.
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-2 text-center py-10 rounded-2xl" style={{ backgroundColor: '#2a1f1a' }}>
            <p style={{ color: '#956d4d' }}>Aucune référence pour l'instant</p>
          </div>
        )}
      </div>
    </div>
  )
}
