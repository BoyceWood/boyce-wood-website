import { createServerSupabase } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createServerSupabase()

  const { data: contenuRaw } = await supabase.from('contenu').select('*')
  const c: Record<string, string> = Object.fromEntries(
    (contenuRaw ?? []).map(({ cle, valeur }: { cle: string; valeur: string }) => [cle, valeur])
  )

  const { data: temoignages } = await supabase.from('temoignages').select('*').eq('actif', true)
  const { data: medias } = await supabase.from('medias').select('*').eq('actif', true).order('ordre', { ascending: true })
  const { data: references } = await supabase.from('references').select('*').eq('actif', true).order('ordre', { ascending: true })
  const { data: concerts } = await supabase.from('concerts').select('*').eq('public', true).order('date', { ascending: true })

  const photos = medias?.filter((m: { type: string }) => m.type === 'photo') ?? []
  const videos = medias?.filter((m: { type: string }) => m.type === 'video') ?? []

  return (
    <main className="font-sans bg-[#f7f4f0] text-[#2b241f]">

      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-[#956d4d]/15 backdrop-blur-md bg-[#f7f4f0]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#e1a265] bg-[#605048] flex items-center justify-center text-white font-bold text-sm">BW</div>
            <div>
              <div className="font-bold text-lg text-[#605048] leading-none">Boyce Wood</div>
              <div className="text-xs text-[#956d4d]">Live électro-acoustique</div>
            </div>
          </a>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#605048]">
            <a href="#groupe" className="hover:text-[#956d4d] transition-colors">Le groupe</a>
            <a href="#cibles" className="hover:text-[#956d4d] transition-colors">Pour qui ?</a>
            <a href="#formules" className="hover:text-[#956d4d] transition-colors">Formules</a>
            <a href="#extraits" className="hover:text-[#956d4d] transition-colors">Extraits</a>
            <a href="#references" className="hover:text-[#956d4d] transition-colors">Références</a>
            <a href="#contact" className="px-5 py-2 rounded-full bg-gradient-to-r from-[#e1a265] to-[#956d4d] text-white hover:opacity-90 transition-all">Demander un devis</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden min-h-[420px]"
        style={{ paddingTop: '64px', backgroundImage: "url('https://picsum.photos/seed/boycewood-stage/1600/900')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0" style={{ background: 'rgba(149,109,77,0.72)' }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-8 grid lg:grid-cols-2 gap-8 items-end">
          <div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/15 text-white/90 text-xs border border-white/30 mb-6 tracking-widest uppercase">
              {c.hero_badge ?? 'Basé à Nivelles · Festivals · Mariages · ASBL'}
            </div>
            <h1 className="text-white leading-[.95] mb-5" style={{ fontFamily: '"Roboto Condensed", sans-serif', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 600 }}>
              {c.hero_titre ?? "Boyce Wood — le live électro-acoustique qui s'adapte à votre événement"}
            </h1>
            <p className="text-white/85 text-base mb-7 max-w-md leading-relaxed">
              {c.hero_sous_titre ?? 'Deux formules, une même signature.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <a href="#contact" className="px-6 py-3.5 rounded-full font-bold text-center text-sm transition-all"
                style={{ background: 'rgba(225,162,101,0.85)', color: 'white', border: '2px solid rgba(255,255,255,0.3)' }}>
                {c.hero_cta_festival ?? 'Je programme un festival / évènement public'}
              </a>
              <a href="#contact" className="px-6 py-3.5 rounded-full font-bold text-center text-sm border-2 border-white/50 text-white hover:bg-white/10 transition-all">
                {c.hero_cta_mariage ?? 'Je prépare un mariage / évènement privé'}
              </a>
            </div>
            <p className="text-white/65 text-xs">{c.hero_mention ?? 'Réponse sous 24h · Devis gratuit · Setup adaptable'}</p>
          </div>
          {references && references.length > 0 && (
            <div className="hidden lg:block self-end pb-2">
              <div className="rounded-2xl bg-white/10 border border-white/20 p-5 text-white backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[.2em] text-white/55 mb-4">Ils nous ont fait confiance</p>
                <div className="grid grid-cols-3 gap-3">
                  {references.slice(0, 3).map((r: { id: string; nom: string; event?: string }) => (
                    <div key={r.id} className="rounded-xl bg-white/10 border border-white/15 p-3">
                      <p className="font-semibold text-sm leading-tight">{r.nom}</p>
                      {r.event && <p className="text-white/55 text-xs mt-1">{r.event}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* À PROPOS */}
      <section id="groupe" className="py-20 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-3">{c.apropos_label ?? 'Le groupe'}</p>
              <h2 className="font-bold text-[#605048] mb-6" style={{ fontSize: 'clamp(1.8rem,3vw,3rem)' }}>
                {c.apropos_titre ?? '4 musiciens, une énergie scénique souple et chaleureuse'}
              </h2>
              <p className="text-[#605048]/80 text-lg leading-relaxed mb-4">
                {c.apropos_texte1 ?? "Boyce Wood, c'est Lore au chant lead, Grégory aux chœurs et à la guitare, Matthieu à la seconde guitare et Alan aux percussions."}
              </p>
              <p className="text-[#605048]/70 leading-relaxed mb-8">
                {c.apropos_texte2 ?? "Basé à Nivelles, le groupe adapte son format et son énergie à chaque événement."}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[c.apropos_tag1 ?? '100 % live, sans surjouer', c.apropos_tag2 ?? 'Répertoire adaptable', c.apropos_tag3 ?? 'Ambiance pro, simple à gérer', c.apropos_tag4 ?? 'Signature électro-acoustique'].map(tag => (
                  <span key={tag} className="px-4 py-3 rounded-2xl text-[#605048]/80 text-sm border border-[#605048]/15 bg-[#efe6de]">{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-4 items-end">
              <div className="flex-1 rounded-3xl overflow-hidden bg-[#efe6de]" style={{ height: '340px' }}>
                <img src="https://picsum.photos/seed/boycewood-concert/400/680" alt="Boyce Wood en concert" className="w-full h-full object-cover" width={400} height={680} loading="lazy" />
              </div>
              <div className="flex-1 rounded-3xl overflow-hidden bg-[#efe6de]" style={{ height: '440px' }}>
                <img src="https://picsum.photos/seed/boycewood-chant/400/880" alt="Boyce Wood chant" className="w-full h-full object-cover" width={400} height={880} loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CIBLES */}
      <section id="cibles" className="py-20 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-3">{c.cibles_label ?? 'Pour quels événements ?'}</p>
            <h2 className="font-bold text-[#605048]" style={{ fontSize: 'clamp(1.8rem,3vw,3rem)' }}>{c.cibles_titre ?? 'Une offre claire pour chaque organisateur'}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: c.cible1_icon ?? '🎪', title: c.cible1_titre ?? 'Festivals & publics', desc: c.cible1_desc ?? 'Fêtes de village, petits festivals, événements citoyens.', items: [c.cible1_item1 ?? 'Énergie scénique immédiate', c.cible1_item2 ?? 'Répertoire fédérateur', c.cible1_item3 ?? 'Son adaptable selon le lieu'] },
              { icon: c.cible2_icon ?? '💍', title: c.cible2_titre ?? 'Mariages & privés', desc: c.cible2_desc ?? "Vins d'honneur, cocktails, dîners élégants.", items: [c.cible2_item1 ?? 'Volume maîtrisé', c.cible2_item2 ?? 'Atmosphère chaleureuse', c.cible2_item3 ?? 'Répertoire intergénérationnel'] },
              { icon: c.cible3_icon ?? '🤝', title: c.cible3_titre ?? 'ASBL & galas', desc: c.cible3_desc ?? 'Événements caritatifs, remises de prix, soirées de soutien.', items: [c.cible3_item1 ?? 'Image pro et rassurante', c.cible3_item2 ?? 'Gestion simple du contrat', c.cible3_item3 ?? 'Set adaptable au timing'] },
            ].map((cible) => (
              <article key={cible.title} className="bg-white rounded-3xl p-7 shadow-sm border border-[#956d4d]/10 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
                <div className="text-4xl mb-5">{cible.icon}</div>
                <h3 className="font-bold text-[#605048] text-xl mb-3">{cible.title}</h3>
                <p className="text-[#605048]/75 mb-5 text-sm leading-relaxed">{cible.desc}</p>
                <ul className="space-y-2">
                  {cible.items.map(i => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#605048]/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e1a265] shrink-0" />{i}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 h-0.5 w-0 bg-gradient-to-r from-[#e1a265] to-[#956d4d] group-hover:w-full transition-all duration-500 rounded-full" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULES */}
      <section id="formules" className="py-20 lg:py-16 bg-[#efe6de]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-3">{c.formules_label ?? 'Nos deux formules live'}</p>
            <h2 className="font-bold text-[#605048]" style={{ fontSize: 'clamp(1.8rem,3vw,3rem)' }}>{c.formules_titre ?? 'Le bon format pour la bonne ambiance'}</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {[
              { num: '01', title: c.formule1_titre ?? 'Set Dynamique', badge: c.formule1_badge ?? 'Scène & plein air', desc: c.formule1_desc ?? "Pensé pour capter l'attention et créer un vrai moment collectif.", pour: [c.formule1_pour1 ?? 'Petits festivals', c.formule1_pour2 ?? 'Fêtes de village', c.formule1_pour3 ?? 'Événements publics', c.formule1_pour4 ?? 'Relais / caritatif / ASBL'], pratique: [c.formule1_prat1 ?? '2 x 45 min adaptable', c.formule1_prat2 ?? 'Setup rapide', c.formule1_prat3 ?? 'Sonorisation possible', c.formule1_prat4 ?? 'Interaction public'], cta: c.formule1_cta ?? 'Demander un devis dynamique' },
              { num: '02', title: c.formule2_titre ?? 'Set Lounge', badge: c.formule2_badge ?? 'Cocktail & réception', desc: c.formule2_desc ?? "Une présence élégante qui habille l'espace sans jamais l'écraser.", pour: [c.formule2_pour1 ?? "Vins d'honneur", c.formule2_pour2 ?? 'Restaurants & piano bar', c.formule2_pour3 ?? 'Mariages & réceptions', c.formule2_pour4 ?? 'Événements privés'], pratique: [c.formule2_prat1 ?? 'Volume maîtrisé', c.formule2_prat2 ?? '2 x 45 min adaptable', c.formule2_prat3 ?? 'Ambiance chic et douce', c.formule2_prat4 ?? 'Répertoire raffiné'], cta: c.formule2_cta ?? 'Demander un devis lounge' },
            ].map((f) => (
              <article key={f.title} className="bg-white rounded-[28px] p-8 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-5xl font-bold text-[#e1a265]/30">{f.num}</p>
                    <h3 className="font-bold text-[#605048] text-3xl -mt-2">{f.title}</h3>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-[#e1a265]/15 text-[#956d4d] text-sm font-medium shrink-0 mt-2">{f.badge}</span>
                </div>
                <p className="text-[#605048]/80 text-lg mb-8 leading-relaxed">{f.desc}</p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="font-semibold text-[#605048] mb-3 text-sm uppercase tracking-wide">Idéal pour</p>
                    <ul className="space-y-2">{f.pour.map(i => <li key={i} className="flex items-center gap-2 text-sm text-[#605048]/75"><span className="w-1.5 h-1.5 rounded-full bg-[#e1a265] shrink-0" />{i}</li>)}</ul>
                  </div>
                  <div>
                    <p className="font-semibold text-[#605048] mb-3 text-sm uppercase tracking-wide">Repères pratiques</p>
                    <ul className="space-y-2">{f.pratique.map(i => <li key={i} className="flex items-center gap-2 text-sm text-[#605048]/75"><span className="w-1.5 h-1.5 rounded-full bg-[#956d4d] shrink-0" />{i}</li>)}</ul>
                  </div>
                </div>
                <a href="#contact" className="mt-auto self-start inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-[#e1a265] to-[#956d4d] text-white font-semibold hover:opacity-90 transition-all shadow-md">{f.cta} →</a>
              </article>
            ))}
          </div>
          <p className="text-center mt-8 text-[#605048]/65 text-sm">
            {c.formules_mention ?? "Pas sûr de votre formule ?"}{' '}
            <a href="#contact" className="text-[#956d4d] underline underline-offset-2">{c.formules_mention_lien ?? "Expliquez-nous votre événement, on vous conseille."}</a>
          </p>
        </div>
      </section>

      {/* VIDEOS */}
      <section id="extraits" className="py-20 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-3">{c.videos_label ?? 'À quoi ressemble un set ?'}</p>
            <h2 className="font-bold text-[#605048]" style={{ fontSize: 'clamp(1.8rem,3vw,3rem)' }}>{c.videos_titre ?? 'Extraits vidéo'}</h2>
          </div>
          {videos.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {videos.map((v: { id: string; youtube_id: string; legende?: string }) => (
                <div key={v.id} className="bg-white rounded-[28px] overflow-hidden shadow-lg border border-[#956d4d]/10">
                  <div className="relative aspect-video">
                    <iframe src={`https://www.youtube.com/embed/${v.youtube_id}`} title={v.legende ?? 'Boyce Wood live'} className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                  {v.legende && <div className="p-5"><p className="font-semibold text-[#605048]">{v.legende}</p></div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-xl mx-auto text-center py-16 px-8 rounded-3xl bg-white border border-[#956d4d]/10">
              <p className="text-4xl mb-4">🎬</p>
              <p className="text-[#605048]/60">{c.videos_vide ?? 'Les extraits vidéo seront disponibles bientôt.'}</p>
            </div>
          )}
        </div>
      </section>

      {/* GALERIE */}
      {photos.length > 0 && (
        <section id="galerie" className="py-20 lg:py-16 bg-[#efe6de]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-3">{c.galerie_label ?? 'En images'}</p>
              <h2 className="font-bold text-[#605048]" style={{ fontSize: 'clamp(1.8rem,3vw,3rem)' }}>{c.galerie_titre ?? 'Galerie'}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((p: { id: string; url: string; legende?: string }) => (
                <div key={p.id} className="overflow-hidden rounded-2xl aspect-square group cursor-pointer">
                  <img src={p.url} alt={p.legende ?? 'Boyce Wood'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" width={600} height={600} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AGENDA */}
      {concerts && concerts.length > 0 && (
        <section id="concerts" className="py-20 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-3">{c.agenda_label ?? 'Agenda'}</p>
              <h2 className="font-bold text-[#605048]" style={{ fontSize: 'clamp(1.8rem,3vw,3rem)' }}>{c.agenda_titre ?? 'Prochains concerts'}</h2>
            </div>
            <div className="max-w-2xl mx-auto space-y-4">
              {concerts.map((concert: { id: string; date: string; lieu: string; formule?: string; type?: string }) => (
                <div key={concert.id} className="bg-white rounded-2xl p-6 border border-[#956d4d]/10 shadow-sm flex items-center justify-between gap-4 hover:-translate-y-0.5 transition-all">
                  <div>
                    <p className="font-bold text-[#605048] text-lg">{new Date(concert.date).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="text-[#605048]/70">{concert.lieu}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {concert.formule && <span className="px-3 py-1 rounded-full bg-[#e1a265]/20 text-[#956d4d] text-xs font-medium">{concert.formule}</span>}
                    {concert.type && <span className="px-3 py-1 rounded-full bg-[#605048]/10 text-[#605048] text-xs">{concert.type}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RÉFÉRENCES */}
      <section id="references" className="py-20 lg:py-16 bg-[#605048]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-sm uppercase tracking-[.22em] text-[#e1a265] mb-3">{c.refs_label ?? 'Preuves & confiance'}</p>
            <h2 className="font-bold text-white" style={{ fontSize: 'clamp(1.8rem,3vw,3rem)' }}>{c.refs_titre ?? 'Ils nous ont fait confiance'}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {references && references.map((r: { id: string; nom: string; event?: string; logo_url?: string }) => (
              <div key={r.id} className="bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-2xl p-5 border border-white/15 flex flex-col items-center text-center gap-3">
                <div className="h-16 flex items-center justify-center">
                  {r.logo_url ? (
                    <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden p-1.5">
                      <img src={r.logo_url} alt={r.nom} className="w-full h-full object-contain" loading="lazy" width={64} height={64} />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                      {r.nom.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm leading-tight">{r.nom}</p>
                  {r.event && <p className="text-white/55 text-xs mt-1">{r.event}</p>}
                </div>
              </div>
            ))}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 border-dashed flex flex-col items-center text-center gap-3 justify-center">
              <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-white/30 text-2xl">+</div>
              <p className="text-white/30 text-xs">{c.refs_vide ?? 'Bientôt vous…'}</p>
            </div>
          </div>
          {temoignages && temoignages.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {temoignages.map((t: { id: string; texte: string; auteur: string; type_event?: string }) => (
                <blockquote key={t.id} className="bg-white/10 rounded-3xl p-8 border border-white/15">
                  <p className="text-white text-lg leading-relaxed">&ldquo;{t.texte}&rdquo;</p>
                  <footer className="mt-4 text-[#e1a265] text-sm font-medium">
                    {t.auteur}{t.type_event && ` · ${t.type_event}`}
                  </footer>
                </blockquote>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 lg:py-16 bg-[#efe6de]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-3">{c.faq_label ?? 'FAQ & logistique'}</p>
            <h2 className="font-bold text-[#605048]" style={{ fontSize: 'clamp(1.8rem,3vw,3rem)' }}>{c.faq_titre ?? 'Les réponses aux questions fréquentes'}</h2>
          </div>
          <div className="space-y-3">
            {[
              ['Quelle est votre zone de déplacement ?', c.faq_zone ?? 'Base Nivelles. Déplacements en Wallonie et au-delà.'],
              ['Fournissez-vous la sonorisation ?', c.faq_sono ?? "Oui, selon le format et les besoins techniques de l'événement."],
              ["Combien de temps faut-il pour l'installation ?", c.faq_install ?? "Setup rapide et fluide, pensé pour ne pas compliquer la vie de l'organisateur."],
              ['Comment se passe la réservation ?', c.faq_resa ?? 'Message ou formulaire → réponse sous 24h → devis → confirmation.'],
              ['Proposez-vous un répertoire sur mesure ?', c.faq_repertoire ?? "Oui, le répertoire évolue et peut s'adapter selon votre public."],
            ].map(([q, a]) => (
              <details key={q} className="bg-white rounded-2xl p-6 border border-[#956d4d]/10 shadow-sm group">
                <summary className="cursor-pointer font-semibold text-[#605048] list-none flex items-center justify-between gap-4">
                  {q}
                  <span className="text-[#956d4d] shrink-0 group-open:rotate-45 transition-transform duration-200 text-xl">+</span>
                </summary>
                <p className="mt-4 text-[#605048]/75 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-8 items-start">
            <div className="bg-[#605048] text-white rounded-[32px] p-8 lg:p-10 shadow-2xl">
              <p className="text-sm uppercase tracking-[.22em] text-[#e1a265] mb-2">{c.contact_label ?? 'Réservation'}</p>
              <h2 className="font-bold text-3xl mb-2">{c.contact_titre ?? 'Demandez votre devis en 2 minutes'}</h2>
              <p className="text-white/70 mb-8">{c.contact_sous_titre ?? 'Réponse garantie sous 24h. Devis gratuit et sans engagement.'}</p>
              <form action="https://formspree.io/f/xgonbavg" method="POST" className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input name="nom" className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 placeholder:text-white/40 text-white focus:outline-none focus:border-[#e1a265]/60" placeholder="Nom complet" />
                  <input name="email" type="email" className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 placeholder:text-white/40 text-white focus:outline-none focus:border-[#e1a265]/60" placeholder="Email" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <select name="type_evenement" className="w-full rounded-2xl border border-white/15 bg-[#705058] px-4 py-3 text-white focus:outline-none focus:border-[#e1a265]/60">
                    <option>Type d&apos;événement</option>
                    <option>Festival</option><option>Mariage</option><option>ASBL</option><option>Autre</option>
                  </select>
                  <select name="formule" className="w-full rounded-2xl border border-white/15 bg-[#705058] px-4 py-3 text-white focus:outline-none focus:border-[#e1a265]/60">
                    <option>Formule souhaitée</option>
                    <option>Dynamique</option><option>Lounge</option><option>À définir ensemble</option>
                  </select>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input name="date" className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 placeholder:text-white/40 text-white focus:outline-none focus:border-[#e1a265]/60" placeholder="Date de l'événement" />
                  <input name="lieu" className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 placeholder:text-white/40 text-white focus:outline-none focus:border-[#e1a265]/60" placeholder="Lieu" />
                </div>
                <input name="budget" className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 placeholder:text-white/40 text-white focus:outline-none focus:border-[#e1a265]/60" placeholder="Budget indicatif (optionnel)" />
                <textarea name="message" rows={4} className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 placeholder:text-white/40 text-white focus:outline-none focus:border-[#e1a265]/60 resize-none" placeholder="Décris ton événement, l'ambiance souhaitée et les infos utiles…" />
                <input type="text" name="_gotcha" style={{ display: 'none' }} />
                <button type="submit" className="w-full py-4 rounded-full bg-gradient-to-r from-[#e1a265] to-[#956d4d] text-white font-semibold hover:opacity-90 transition-all shadow-lg text-lg">
                  {c.contact_btn ?? 'Envoyer ma demande de réservation →'}
                </button>
              </form>
            </div>
            <div className="space-y-5 lg:sticky lg:top-24">
              <div className="bg-white rounded-[28px] p-8 border border-[#956d4d]/10 shadow-sm">
                <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-5">Processus en 3 étapes</p>
                <ol className="space-y-5">
                  {[
                    ['1', c.etape1_titre ?? 'Tu remplis le formulaire', c.etape1_desc ?? 'Quelques infos clés suffisent pour cadrer le besoin.'],
                    ['2', c.etape2_titre ?? 'On te répond sous 24h', c.etape2_desc ?? 'Avec le bon format, les disponibilités et un devis.'],
                    ['3', c.etape3_titre ?? 'On confirme et on prépare', c.etape3_desc ?? "Simple, rassurant et fluide pour l'organisateur."],
                  ].map(([n, t, d]) => (
                    <li key={n} className="flex gap-4">
                      <span className="w-9 h-9 rounded-full bg-[#e1a265]/20 text-[#956d4d] flex items-center justify-center font-bold shrink-0">{n}</span>
                      <div><p className="font-semibold text-[#605048]">{t}</p><p className="text-sm text-[#605048]/65 mt-0.5">{d}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="bg-[#efe6de] rounded-[28px] p-8 border border-[#956d4d]/10">
                <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-4">Contact direct</p>
                <div className="space-y-3 text-[#605048]">
                  <p>📧 <strong>Email :</strong>{' '}<a href="mailto:boycewoodnivelles@gmail.com" className="underline underline-offset-2 hover:text-[#956d4d] transition-colors">{c.contact_email ?? 'boycewoodnivelles@gmail.com'}</a></p>
                  <p>📘 <strong>Facebook :</strong>{' '}<a href="https://www.facebook.com/boycewoodnivelles" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#956d4d] transition-colors">{c.contact_fb ?? 'Boyce Wood Nivelles'}</a></p>
                  <p>📍 <strong>Base :</strong> {c.contact_base ?? 'Nivelles, Wallonie'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#2b241f] text-white/50 py-8 text-center text-sm">
        <p>{c.footer_texte ?? '© 2026 Boyce Wood · Groupe électro-acoustique · Nivelles, Belgique'}</p>
        <p className="mt-2"><a href="/admin" className="hover:text-white/80 transition-colors">Administration</a></p>
      </footer>

      {/* CTA MOBILE STICKY */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 p-3 bg-white/95 backdrop-blur border-t border-[#956d4d]/15 shadow-lg">
        <a href="#contact" className="block text-center py-4 rounded-full bg-gradient-to-r from-[#e1a265] to-[#956d4d] text-white font-semibold">
          {c.mobile_cta ?? 'Demander un devis →'}
        </a>
      </div>

    </main>
  )
}
