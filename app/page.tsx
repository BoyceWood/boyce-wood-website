import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createClient()

  const { data: concerts } = await supabase.from('concerts').select('*').eq('public', true).order('date', { ascending: true })
  const { data: temoignages } = await supabase.from('temoignages').select('*').eq('actif', true)
  const { data: medias } = await supabase.from('medias').select('*').eq('actif', true).order('ordre', { ascending: true })

  const photos = medias?.filter(m => m.type === 'photo') ?? []
  const videos = medias?.filter(m => m.type === 'video') ?? []

  return (
    <main className="font-sans bg-[#f7f4f0] text-[#2b241f]">

      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-[#956d4d]/15 backdrop-blur-md bg-[#f7f4f0]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#e1a265] bg-[#605048] flex items-center justify-center text-white font-bold text-sm">BW</div>
            <div>
              <div className="font-bold text-lg text-[#605048] leading-none" >Boyce Wood</div>
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
<section
  id="top"
  className="relative overflow-hidden min-h-[420px]"
  style={{
    paddingTop:'64px',
    backgroundImage:"url('https://picsum.photos/seed/boycewood-stage/1600/900')",
    backgroundSize:'cover',
    backgroundPosition:'center'
  }}
>
  {/* Overlay brun chaud */}
  <div className="absolute inset-0" style={{background:'rgba(149,109,77,0.72)'}} />

  <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-8 grid lg:grid-cols-2 gap-8 items-end">
    <div>
      <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/15 text-white/90 text-xs border border-white/30 mb-6 tracking-widest uppercase">
        Basé à Nivelles · Festivals · Mariages · ASBL
      </div>

      <h1 className="text-white leading-[.95] mb-5" style={{
        fontFamily:'"Roboto Condensed", sans-serif',
        fontSize:'clamp(2rem,4vw,3.2rem)',
        fontWeight:600
      }}>
        Boyce Wood -le live <br/> électro-acoustique qui s&apos;adapte à votre événement
      </h1>

      <p className="text-white/85 text-base mb-7 max-w-md leading-relaxed">
        Deux formules, une même signature : un set dynamique pour les scènes extérieures et un set lounge pour les moments élégants.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <a href="#contact" className="px-6 py-3.5 rounded-full font-bold text-center text-sm transition-all"
          style={{background:'rgba(225,162,101,0.85)', color:'white', border:'2px solid rgba(255,255,255,0.3)'}}>
          Je programme un festival /<br/>évènement public
        </a>
        <a href="#contact" className="px-6 py-3.5 rounded-full font-bold text-center text-sm border-2 border-white/50 text-white hover:bg-white/10 transition-all">
          Je prépare un mariage /<br/>évènement privé
        </a>
      </div>
      <p className="text-white/65 text-xs">Réponse sous 24h · Devis gratuit · Setup adaptable</p>
    </div>

    {/* Bloc références */}
    <div className="hidden lg:block self-end pb-2">
      <div className="rounded-2xl bg-white/10 border border-white/20 p-5 text-white backdrop-blur-sm">
        <p className="text-xs uppercase tracking-[.2em] text-white/55 mb-4">Ils nous ont fait confiance</p>
        <div className="grid grid-cols-3 gap-3">
          {[['GAL Culturalité','Hesbaye en fête'],['Relais pour la Vie','Nivelles'],['Waux Hall','Tarte al\'djote']].map(([name, sub]) => (
            <div key={name} className="rounded-xl bg-white/10 border border-white/15 p-3">
              <p className="font-semibold text-sm leading-tight">{name}</p>
              <p className="text-white/55 text-xs mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>



      {/* À PROPOS */}
<section id="groupe" className="py-20 lg:py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-12 items-center">

      {/* Colonne gauche — texte */}
      <div>
        <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-3">Le groupe</p>
        <h2 className="font-bold text-[#605048] mb-6" style={{ fontSize: 'clamp(1.8rem,3vw,3rem)' }}>
          4 musiciens, une énergie scénique souple et chaleureuse
        </h2>
        <p className="text-[#605048]/80 text-lg leading-relaxed mb-4">
          Boyce Wood, c'est Lore au chant lead, Grégory aux chœurs et à la guitare, Matthieu à la seconde guitare et Alan aux percussions. Une équipe stable, conviviale et pensée pour s'adapter au lieu comme au public.
        </p>
        <p className="text-[#605048]/70 leading-relaxed mb-8">
          Basé à Nivelles, le groupe adapte son format et son énergie à chaque événement — qu&apos;il s&apos;agisse d&apos;un festival en plein air, d&apos;un mariage ou d&apos;une soirée de gala.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            '100 % live, sans surjouer',
            'Répertoire adaptable selon l\'événement',
            'Ambiance pro, simple à gérer',
            'Signature électro-acoustique chaleureuse',
          ].map(tag => (
            <span key={tag} className="px-4 py-3 rounded-2xl text-[#605048]/80 text-sm border border-[#605048]/15 bg-[#efe6de]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Colonne droite — deux photos côte à côte */}
      <div className="flex gap-4 items-end">
        <div className="flex-1 rounded-3xl overflow-hidden bg-[#efe6de]" style={{ height: '340px' }}>
          <img
            src="https://picsum.photos/seed/boycewood-concert/400/680"
            alt="Boyce Wood en concert"
            className="w-full h-full object-cover"
            width={400} height={680} loading="lazy"
          />
        </div>
        <div className="flex-1 rounded-3xl overflow-hidden bg-[#efe6de]" style={{ height: '440px' }}>
          <img
            src="https://picsum.photos/seed/boycewood-chant/400/880"
            alt="Boyce Wood chant"
            className="w-full h-full object-cover"
            width={400} height={880} loading="lazy"
          />
        </div>
      </div>

    </div>
  </div>
</section>




      {/* CIBLES */}
      <section id="cibles" className="py-20 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-3">Pour quels événements ?</p>
            <h2 className="font-bold text-[#605048]" style={{ fontSize: 'clamp(1.8rem,3vw,3rem)' }}>Une offre claire pour chaque organisateur</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎪', title: 'Festivals & publics', desc: 'Fêtes de village, petits festivals, événements citoyens et scènes extérieures.', items: ['Énergie scénique immédiate', 'Répertoire fédérateur', 'Son adaptable selon le lieu'] },
              { icon: '💍', title: 'Mariages & privés', desc: 'Vins d\'honneur, cocktails, dîners et moments élégants où l\'ambiance compte.', items: ['Volume maîtrisé', 'Atmosphère chaleureuse', 'Répertoire intergénérationnel'] },
              { icon: '🤝', title: 'ASBL & galas', desc: 'Événements caritatifs, remises de prix, soirées de soutien et événements associatifs.', items: ['Image pro et rassurante', 'Gestion simple du contrat', 'Set adaptable au timing'] },
            ].map((c) => (
              <article key={c.title} className="bg-white rounded-3xl p-7 shadow-sm border border-[#956d4d]/10 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
                <div className="text-4xl mb-5">{c.icon}</div>
                <h3 className="font-bold text-[#605048] text-xl mb-3" >{c.title}</h3>
                <p className="text-[#605048]/75 mb-5 text-sm leading-relaxed">{c.desc}</p>
                <ul className="space-y-2">
                  {c.items.map(i => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#605048]/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e1a265] shrink-0" />
                      {i}
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
            <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-3">Nos deux formules live</p>
            <h2 className="font-bold text-[#605048]" style={{ fontSize: 'clamp(1.8rem,3vw,3rem)' }}>Le bon format pour la bonne ambiance</h2>
          </div>
       <div className="grid lg:grid-cols-2 gap-8">
  {[
    { num: '01', title: 'Set Dynamique', badge: 'Scène & plein air', desc: 'Pensé pour capter l\'attention, faire monter l\'énergie et créer un vrai moment collectif.', pour: ['Petits festivals', 'Fêtes de village', 'Événements publics', 'Relais / caritatif / ASBL'], pratique: ['2 x 45 min adaptable', 'Setup rapide', 'Sonorisation possible', 'Interaction public'], cta: 'Demander un devis dynamique' },
    { num: '02', title: 'Set Lounge', badge: 'Cocktail & réception', desc: 'Une présence élégante qui habille l\'espace sans jamais l\'écraser.', pour: ['Vins d\'honneur', 'Restaurants & piano bar', 'Mariages & réceptions', 'Événements privés'], pratique: ['Volume maîtrisé', '2 x 45 min adaptable', 'Ambiance chic et douce', 'Répertoire raffiné'], cta: 'Demander un devis lounge' },
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
            Pas sûr de votre formule ? <a href="#contact" className="text-[#956d4d] underline underline-offset-2">Expliquez-nous votre événement, on vous conseille.</a>
          </p>
        </div>
      </section>

      {/* VIDEOS */}
      <section id="extraits" className="py-20 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-3">À quoi ressemble un set ?</p>
            <h2 className="font-bold text-[#605048]" style={{ fontSize: 'clamp(1.8rem,3vw,3rem)' }}>Extraits vidéo</h2>
          </div>
          {videos.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {videos.map((v) => (
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
              <p className="text-[#605048]/60">Les extraits vidéo seront disponibles bientôt.<br />Suivez-nous sur YouTube !</p>
            </div>
          )}
        </div>
      </section>

      {/* GALERIE */}
      {photos.length > 0 && (
        <section id="galerie" className="py-20 lg:py-16 bg-[#efe6de]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-3">En images</p>
              <h2 className="font-bold text-[#605048]" style={{ fontSize: 'clamp(1.8rem,3vw,3rem)' }}>Galerie</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((p) => (
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
              <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-3">Agenda</p>
              <h2 className="font-bold text-[#605048]" style={{ fontSize: 'clamp(1.8rem,3vw,3rem)' }}>Prochains concerts</h2>
            </div>
            <div className="max-w-2xl mx-auto space-y-4">
              {concerts.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl p-6 border border-[#956d4d]/10 shadow-sm flex items-center justify-between gap-4 hover:-translate-y-0.5 transition-all">
                  <div>
                    <p className="font-bold text-[#605048] text-lg">{new Date(c.date).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="text-[#605048]/70">{c.lieu}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <span className="px-3 py-1 rounded-full bg-[#e1a265]/20 text-[#956d4d] text-xs font-medium">{c.formule}</span>
                    <span className="px-3 py-1 rounded-full bg-[#605048]/10 text-[#605048] text-xs">{c.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TEMOIGNAGES */}
{/* RÉFÉRENCES */}
<section id="references" className="py-20 lg:py-16 bg-[#605048]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl mx-auto text-center mb-14">
      <p className="text-sm uppercase tracking-[.22em] text-[#e1a265] mb-3">Preuves & confiance</p>
      <h2 className="font-bold text-white" style={{ fontSize: 'clamp(1.8rem,3vw,3rem)' }}>
        Ils nous ont fait confiance
      </h2>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

      {/* GAL Culturalité */}
      <div className="bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-2xl p-5 border border-white/15 flex flex-col items-center text-center gap-3">
        <div className="h-16 flex items-center justify-center">
          <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden p-1.5">
            <img src="/refs/gal-culturalite.jpg" alt="GAL Culturalité" className="w-full h-full object-contain" loading="lazy" width={64} height={64} />
          </div>
        </div>
        <div>
          <p className="font-semibold text-white text-sm leading-tight">GAL Culturalité</p>
          <p className="text-white/55 text-xs mt-1">Hesbaye en fête</p>
        </div>
      </div>

      {/* Relais pour la Vie */}
      <div className="bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-2xl p-5 border border-white/15 flex flex-col items-center text-center gap-3">
        <div className="h-16 flex items-center justify-center">
          <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden p-1.5">
            <img src="/refs/relais-vie.png" alt="Relais pour la Vie" className="w-full h-full object-contain" loading="lazy" width={64} height={64} />
          </div>
        </div>
        <div>
          <p className="font-semibold text-white text-sm leading-tight">Relais pour la Vie</p>
          <p className="text-white/55 text-xs mt-1">Nivelles</p>
        </div>
      </div>

      {/* Waux Hall — deux logos */}
      <div className="bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-2xl p-5 border border-white/15 flex flex-col items-center text-center gap-3">
        <div className="h-16 flex items-center justify-center gap-2">
          <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden p-1.5">
            <img src="/refs/confrerie-tarte.jpg" alt="Confrérie Tarte al'Djote" className="w-full h-full object-contain" loading="lazy" width={46} height={46} />
          </div>
          <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden p-1.5">
            <img src="/refs/ccn.png" alt="Centre Culturel Nivelles" className="w-full h-full object-contain" loading="lazy" width={46} height={46} />
          </div>
        </div>
        <div>
          <p className="font-semibold text-white text-sm leading-tight">Waux Hall</p>
          <p className="text-white/55 text-xs mt-1">Remise tarte al'djote</p>
        </div>
      </div>

      {/* Carte vide */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/10 border-dashed flex flex-col items-center text-center gap-3 justify-center">
        <div className="h-16 flex items-center justify-center">
          <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-white/30 text-2xl">+</div>
        </div>
        <p className="text-white/30 text-xs">Bientôt vous…</p>
      </div>

    </div>

    {/* Témoignages */}
    {temoignages && temoignages.length > 0 && (
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {temoignages.map((t) => (
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
            <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-3">FAQ & logistique</p>
            <h2 className="font-bold text-[#605048]" style={{ fontSize: 'clamp(1.8rem,3vw,3rem)' }}>Les réponses aux questions fréquentes</h2>
          </div>
          <div className="space-y-3">
            {[
              ['Quelle est votre zone de déplacement ?', 'Base Nivelles. Déplacements en Wallonie et au-delà selon le projet.'],
              ['Fournissez-vous la sonorisation ?', 'Oui, selon le format et les besoins techniques de l\'événement.'],
              ['Combien de temps faut-il pour l\'installation ?', 'Setup rapide et fluide, pensé pour ne pas compliquer la vie de l\'organisateur.'],
              ['Comment se passe la réservation ?', 'Message ou formulaire → réponse sous 24h → devis → confirmation → préparation du set.'],
              ['Proposez-vous un répertoire sur mesure ?', 'Oui, le répertoire évolue et peut s\'adapter selon votre public et l\'ambiance souhaitée.'],
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
        <p className="text-sm uppercase tracking-[.22em] text-[#e1a265] mb-2">Réservation</p>
        <h2 className="font-bold text-3xl mb-2">Demandez votre devis en 2 minutes</h2>
        <p className="text-white/70 mb-8">Réponse garantie sous 24h. Devis gratuit et sans engagement.</p>
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
          {/* Champ invisible — piège à bots */}
          <input type="text" name="_gotcha" style={{ display: 'none' }} />
          <button type="submit" className="w-full py-4 rounded-full bg-gradient-to-r from-[#e1a265] to-[#956d4d] text-white font-semibold hover:opacity-90 transition-all shadow-lg text-lg">
            Envoyer ma demande de réservation →
          </button>
        </form>
      </div>
      <div className="space-y-5 lg:sticky lg:top-24">
        <div className="bg-white rounded-[28px] p-8 border border-[#956d4d]/10 shadow-sm">
          <p className="text-sm uppercase tracking-[.22em] text-[#956d4d] mb-5">Processus en 3 étapes</p>
          <ol className="space-y-5">
            {[['1', 'Tu remplis le formulaire', 'Quelques infos clés suffisent pour cadrer le besoin.'], ['2', 'On te répond sous 24h', 'Avec le bon format, les disponibilités et un devis.'], ['3', 'On confirme et on prépare', 'Simple, rassurant et fluide pour l\'organisateur.']].map(([n, t, d]) => (
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
    <p>
      📧 <strong>Email :</strong>{' '}
      <a href="mailto:boycewoodnivelles@gmail.com" className="underline underline-offset-2 hover:text-[#956d4d] transition-colors">
        boycewoodnivelles@gmail.com
      </a>
    </p>
    <p>
      📘 <strong>Facebook :</strong>{' '}
      <a href="https://www.facebook.com/boycewoodnivelles" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#956d4d] transition-colors">
        Boyce Wood Nivelles
      </a>
    </p>
    <p>📍 <strong>Base :</strong> Nivelles, Wallonie</p>
  </div>
</div>

      </div>
    </div>
  </div>
</section>


      {/* FOOTER */}
      <footer className="bg-[#2b241f] text-white/50 py-8 text-center text-sm">
        <p>© 2026 Boyce Wood · Groupe électro-acoustique · Nivelles, Belgique</p>
        <p className="mt-2"><a href="/admin" className="hover:text-white/80 transition-colors">Administration</a></p>
      </footer>

      {/* CTA MOBILE STICKY */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 p-3 bg-white/95 backdrop-blur border-t border-[#956d4d]/15 shadow-lg">
        <a href="#contact" className="block text-center py-4 rounded-full bg-gradient-to-r from-[#e1a265] to-[#956d4d] text-white font-semibold">
          Demander un devis →
        </a>
      </div>

    </main>
  )
}
