import { useEffect, useRef, useState } from 'react'

/* ── Scroll progress bar ─────────────────────────────────────────────────── */
function ScanLine() {
  const barRef = useRef(null)
  useEffect(() => {
    const onScroll = () => {
      const el = barRef.current
      if (!el) return
      const total = document.documentElement.scrollHeight - window.innerHeight
      el.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : '0%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[1000]" style={{ background: '#e5e4de' }}>
      <div ref={barRef} className="h-full bg-forest relative transition-none" style={{ width: '0%' }}>
        <div className="scan-ping" />
      </div>
    </div>
  )
}

function BgGrid() {
  return <div className="bg-grid" aria-hidden="true" />
}

function Grain() {
  return (
    <div className="grain-overlay" aria-hidden="true">
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  )
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.08 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

function WordReveal({ children, className = '' }) {
  const ref = useRef(null)
  const words = String(children).split(' ')
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const spans = el.querySelectorAll('span')
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          spans.forEach((s, i) => setTimeout(() => s.classList.add('lit'), i * 55))
          obs.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <p ref={ref} className={`word-reveal ${className}`}>
      {words.map((w, i) => <span key={i}>{w}{i < words.length - 1 ? ' ' : ''}</span>)}
    </p>
  )
}

/* ── Navbar ──────────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <nav className={`fixed top-[2px] left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-paper border-b border-rule' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
        <span className="font-serif font-bold tracking-tight text-ink text-lg">tropicalcook.</span>
        <div className="hidden md:flex items-center gap-8">
          {[['recipes','#recipes'],['about','#about'],['reviews','#reviews'],['pricing','#pricing']].map(([l,h]) => (
            <a key={l} href={h} className="label-mono text-muted hover:text-forest transition-colors ed-underline">{l}</a>
          ))}
        </div>
      </div>
    </nav>
  )
}

/* ── Promo Banner ────────────────────────────────────────────────────────── */
function PromoBanner() {
  return (
    <div className="relative z-10 bg-ink text-paper text-center py-2.5 px-4">
      <span className="label-mono text-xs">
        special st. patrick's day sale · use <span className="text-green-400 font-bold">Tropicook22</span> for 20% OFF — today only
      </span>
    </div>
  )
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative z-10 flex flex-col pt-16 pb-16 px-6 md:px-10 max-w-6xl mx-auto">
      <div className="reveal">
        <p className="label-mono text-forest mb-6">recipe collection · special edition</p>
      </div>
      <h1 className="font-serif font-light leading-none tracking-tight text-ink mb-6 reveal" style={{ fontSize: 'clamp(2.6rem,8vw,7.5rem)' }}>
        <span className="block">A New Way</span>
        <span className="block italic text-forest">to Enjoy the</span>
        <span className="block">Foods You Love</span>
      </h1>
      <div className="reveal w-full mb-8" style={{ maxWidth: '100%' }}>
        <img
          src="/hero-baking.png"
          alt="Gluten-free baked goods — cookies, brownies, donuts, artisan breads"
          className="w-full object-cover border border-rule"
          style={{ maxHeight: '480px', objectPosition: 'center' }}
        />
      </div>
      <div className="reveal max-w-2xl mb-6">
        <p className="font-body text-xl text-ink/70 leading-relaxed">
          Imagine Baking Warm, Irresistible Breads and Sweets — all Made with <span className="italic">"Better than the Real Thing"</span> Recipes Reconstructed by Master Chefs…
        </p>
      </div>
      <div className="reveal max-w-xl mb-12 border-l-2 border-forest pl-6">
        <p className="font-serif italic text-2xl text-ink">"It tastes too good to be gluten-free!!!"</p>
      </div>
      <div className="reveal flex flex-wrap gap-4 items-center">
        <a href="#pricing" className="cta-btn bg-forest text-paper font-body font-semibold px-8 py-4 border border-ink text-sm">
          get the cookbook — $17
        </a>
        <a href="#about" className="label-mono text-muted ed-underline text-xs">read alex's story ↓</a>
      </div>
      <div className="reveal mt-10 grid grid-cols-3 gap-px border border-rule max-w-lg">
        {[['100k+','happy customers'],['5','recipe collections'],['60 days','money-back guarantee']].map(([n,l]) => (
          <div key={l} className="p-5 bg-paper">
            <p className="font-serif text-2xl font-bold text-ink">{n}</p>
            <p className="label-mono text-muted mt-1 text-[10px]">{l}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Imagine Section ─────────────────────────────────────────────────────── */
function ImagineSection() {
  return (
    <section className="relative z-10 py-14 md:py-20 px-6 md:px-10 border-t border-rule">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <div>
          <p className="label-mono text-forest mb-6 reveal">now you can eat your way to better health</p>
          <h2 className="font-serif font-light text-ink mb-6 reveal" style={{ fontSize: 'clamp(2rem,5vw,3.8rem)', lineHeight: 1.05 }}>
            And it's<br /><span className="italic text-forest">delicious.</span>
          </h2>
          <WordReveal className="text-ink/70 text-lg leading-relaxed max-w-sm">
            From around the world — I've teamed up with doctors, nutritionists, food scientists, and master bakers. Using their expertise in the art-and-science of baking, we tore apart traditional recipes and re-invented each one for you.
          </WordReveal>
        </div>
        <div className="space-y-0 border border-rule reveal">
          <div className="p-6 border-b border-rule">
            <p className="label-mono text-forest text-[10px] mb-3">imagine…</p>
            <p className="font-serif italic text-ink text-lg leading-snug">Biting into a crackly-crusted, cloud-soft sandwich slice that your family devours before it even cools.</p>
          </div>
          <div className="p-6 border-b border-rule">
            <p className="label-mono text-forest text-[10px] mb-3">imagine…</p>
            <p className="font-serif italic text-ink text-lg leading-snug">Stirring together dough in 10 minutes flat — no obscure flours, no kneading, zero guess-work.</p>
          </div>
          <div className="p-6">
            <p className="label-mono text-green-600 text-[10px] mb-3">and here's the best part…</p>
            <p className="font-serif italic text-ink text-lg leading-snug">No one will know this is gluten-free — and it tastes much much better than your average "healthy cake."</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Pricing CTA (top) ───────────────────────────────────────────────────── */
function PricingCTA() {
  return (
    <section id="pricing-top" className="relative z-10 py-14 md:py-20 px-6 md:px-10 border-t border-rule bg-ink">
      <div className="max-w-2xl mx-auto text-center">
        <p className="label-mono text-muted mb-4 reveal">now available in both hardcover and instant download</p>
        <div className="mb-8 reveal">
          <p className="label-mono text-muted text-[10px] mb-4">only a few days left</p>
          <img src="/book-cover.png" alt="Tropicalcook cookbook" className="w-full object-cover mb-6 border border-ink/20" style={{ maxHeight: '340px', objectPosition: 'center' }} />
          <div className="flex items-baseline justify-center gap-4">
            <span className="font-serif text-muted line-through text-3xl">$147.00</span>
            <span className="font-serif text-paper font-bold" style={{ fontSize: 'clamp(3rem,8vw,6rem)' }}>$17.00</span>
          </div>
          <p className="label-mono text-green-400 text-sm mt-1">save $120.00 today</p>
        </div>
        <p className="font-serif italic text-paper/80 text-xl mb-10 reveal">Download The Cookbook for <span className="line-through text-muted">$147</span> Just $17.00!</p>
        <div className="border border-ink/40 p-8 text-left bg-paper reveal">
          <p className="label-mono text-forest text-[10px] mb-6">delivered instantly · hardcover now available</p>
          <a href="#step2" className="cta-btn block text-center bg-forest text-paper font-body font-bold px-8 py-4 border border-ink text-sm mb-4">
            GO TO STEP 2 →
          </a>
          <p className="label-mono text-muted text-[10px] text-center">100% secure 256-bit encrypted checkout</p>
        </div>
        <div className="mt-8 border border-forest/30 p-6 reveal">
          <p className="label-mono text-green-400 text-[10px] mb-2">fully backed by our</p>
          <p className="font-serif text-paper text-xl font-bold">100% Risk Free · 60-Days Money-Back Guarantee</p>
        </div>
      </div>
    </section>
  )
}

/* ── Free Gifts Teaser ───────────────────────────────────────────────────── */
function FreeGiftsTeaser() {
  const gifts = [
    { name: 'Passion For Pasta', value: 'Normally $14.95' },
    { name: 'Gluten Freedom — The Secrets of Creating Flour Blends', value: 'Normally $29.95' },
    { name: 'Lifetime Membership to my "Real, Gluten-Free" Community!', value: 'Normally $59.95' },
  ]
  return (
    <section className="relative z-10 py-20 px-6 md:px-10 border-t border-rule" style={{ background: '#f0ede6' }}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="label-mono text-forest mb-4 reveal">100,000+ happy customers have been cooking with tropicalcook</p>
        <img src="/book-cover.png" alt="Tropicalcook cookbook" className="w-full object-cover mb-8 reveal border border-rule" style={{ maxHeight: '320px', objectPosition: 'center' }} />
        <h2 className="font-serif font-light text-ink mb-12 reveal" style={{ fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1.1 }}>
          Plus You'll Get Up to<br /><span className="text-forest">3 Free Gifts</span>
        </h2>
        <div className="space-y-0 border border-rule mb-10 reveal">
          {gifts.map(({ name, value }, i) => (
            <div key={i} className="flex items-center justify-between p-5 border-b border-rule last:border-b-0 bg-paper text-left gap-4">
              <div className="flex items-center gap-3">
                <span className="text-forest">✓</span>
                <span className="font-body text-ink">{name}</span>
              </div>
              <span className="label-mono text-muted text-[10px] whitespace-nowrap">{value} — <span className="text-green-600 font-bold">Free today</span></span>
            </div>
          ))}
        </div>
        <a href="#pricing" className="cta-btn inline-block bg-forest text-paper font-body font-bold px-10 py-4 border border-ink text-sm reveal">
          BUY NOW FOR $17 ONLY!
        </a>
        <p className="label-mono text-muted text-[10px] mt-4 mb-6 reveal">life is too precious to miss this tasty opportunity!</p>
        <img src="/img3.png" alt="" className="w-full object-cover reveal border border-rule/30" style={{ maxHeight: '360px', objectPosition: 'center' }} />
      </div>
    </section>
  )
}

/* ── Symptoms Section ────────────────────────────────────────────────────── */
function SymptomsSection() {
  const symptoms = ['brain fog','joint pain','weight gain','chronic fatigue','depression','anxiety','painful digestion problems']
  return (
    <section className="relative z-10 py-14 md:py-20 px-6 md:px-10 border-t border-rule bg-ink">
      <div className="max-w-6xl mx-auto">
        <p className="label-mono text-green-400 mb-4 reveal">this is guaranteed to save you time, money — and maybe your health</p>
        <h2 className="font-serif font-light text-paper mb-8 reveal" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', lineHeight: 1.1 }}>
          You're probably already familiar with the symptoms…
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px mb-16 reveal">
          {symptoms.map((s, i) => (
            <div key={i} className="p-5 border border-ink/30">
              <p className="font-body text-paper/80 text-sm">{s}</p>
            </div>
          ))}
        </div>
        <div className="max-w-2xl reveal">
          <p className="font-serif italic text-paper/70 text-xl mb-6">
            "Just Imagine, how the opposite of those symptoms would feel…"
          </p>
          <p className="font-body text-paper/60 leading-relaxed mb-4">
            Imagine how it would feel to have <strong className="text-paper">MORE ENERGY than ever before</strong>… and the freedom of a <strong className="text-paper">FULLY COMFORTABLE BODY</strong>.
          </p>
          <p className="font-body text-paper/60 leading-relaxed">
            How incredible it would be to enjoy <strong className="text-paper">CRYSTAL-CLEAR MENTAL CLARITY</strong> and the sharp memory that comes with it. What if other lingering health niggles that bother you were to suddenly clear up?
          </p>
          <p className="font-serif text-green-400 text-2xl font-bold mt-6">POOF — GONE!!!</p>
        </div>
      </div>
    </section>
  )
}

/* ── Citations ───────────────────────────────────────────────────────────── */
function Citations() {
  const refs = [
    { quote: '"New Insights into Gluten Sensitivity: Gluten-Free Diets Proven Beneficial for Celiac and Non-Celiac Individuals"', source: 'Volta and De Giorgio (2012)' },
    { quote: '"Beyond Digestion: Gluten-Free Diet May Sharpen Memory and Clear Brain Fog in Gluten-Sensitive Patients"', source: 'Biesiekierski et al. (2011) and Yelland (2011)' },
    { quote: '"Gluten-Free Living: The Key to Managing Digestive Disorders Symptoms and Enhancing Overall Well-Being"', source: 'Zanini et al. (2015)' },
  ]
  return (
    <section className="relative z-10 py-14 md:py-20 px-6 md:px-10 border-t border-rule">
      <div className="max-w-6xl mx-auto">
        <p className="label-mono text-muted mb-4 reveal">the proof is in the pudding (or bread)…</p>
        <p className="font-body text-ink/60 mb-12 reveal">And I'm not just saying that…</p>
        <div className="grid md:grid-cols-3 gap-8">
          {refs.map(({ quote, source }, i) => (
            <div key={i} className="border-t-2 border-forest pt-6 reveal">
              <p className="font-serif italic text-ink text-lg leading-snug mb-4">{quote}</p>
              <p className="label-mono text-forest text-[10px]">— {source}</p>
            </div>
          ))}
        </div>
        <img src="/img4.png" alt="" className="w-full object-cover mt-12 reveal border border-rule" style={{ maxHeight: '400px', objectPosition: 'center' }} />
      </div>
    </section>
  )
}

/* ── Alex Story ──────────────────────────────────────────────────────────── */
function AlexStory() {
  return (
    <section id="about" className="relative z-10 py-14 md:py-20 px-6 md:px-10 border-t border-rule" style={{ background: '#f0ede6' }}>
      <div className="max-w-4xl mx-auto">
        <p className="label-mono text-forest mb-6 reveal">hi, i'm alex</p>
        <img src="/img5.webp" alt="Alex" className="w-full object-cover mb-8 reveal border border-rule" style={{ maxHeight: '400px', objectPosition: 'top' }} />
        <div className="space-y-6">
          <h2 className="font-serif font-light text-ink reveal" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 1.1 }}>
            I've always been a foodie. And I love to share food with friends…
          </h2>
          <WordReveal className="text-ink/70 text-lg leading-relaxed">
            Enjoying home made meals or getting together in cafes, bakeries and restaurants. I feel like sharing food is the best way to bring people together.
          </WordReveal>
          <p className="font-body text-ink/70 leading-relaxed reveal">
            Which is why what happened was so heartbreaking… You see, I was always in perfect health. For me, food is medicine. And health is wealth. I eat mostly plant based with the occasional pizza or some butter with my bread.
          </p>
          <p className="font-body text-ink/70 leading-relaxed reveal">
            But with time, I started noticing a pattern. Whenever me and my husband would go out to eat at my favourite Italian restaurant — I would quickly become very tired, and experience discomfort in my stomach. At first I thought it was "just this time." So I switched to "safe" comfort foods — my beloved breads and pasta. But that only made matters worse…
          </p>
          <p className="font-body text-ink/70 leading-relaxed reveal">
            Reluctantly, I took my doctor's advice. I tried going gluten-free for a couple of weeks.
          </p>
          <div className="border-l-4 border-forest pl-6 py-2 reveal">
            <p className="font-serif italic text-ink text-xl leading-snug">
              "The results were astonishing… It was like winding back the clock — I felt 10 years younger!!!"
            </p>
          </div>
          <p className="font-body text-ink/70 leading-relaxed reveal">
            I had vibrant energy beyond my imagination. A crystal-clear mind. And my skin was clear and radiant. Physically I felt great… But emotionally I was upset and confused. I desperately needed my gluten fix.
          </p>
          <div className="flex items-center gap-4 pt-4 reveal">
            <div className="w-12 h-12 rounded-full bg-forest flex items-center justify-center shrink-0">
              <span className="text-paper text-lg font-bold font-serif">A</span>
            </div>
            <div>
              <p className="font-body font-semibold text-ink">Alex</p>
              <p className="label-mono text-muted text-[10px]">author · functional nutritionist</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Store GF Problems ───────────────────────────────────────────────────── */
function StoreGFProblems() {
  const problems = [
    { label: 'store-bought bread', verdict: 'bland, lifeless — crumbles to pieces or feels like a sponge' },
    { label: 'gf pasta dishes', verdict: 'completely devoid of flavor — worse than soggy sea-weed' },
    { label: 'gf cookies', verdict: 'heartbreaking — like eating sugar baked with mud' },
    { label: 'the ingredients list', verdict: 'xanthan gum, guar gum, soy lecithin — hyper-processed additives' },
    { label: 'the price tag', verdict: '20%–180% more for almost the same disappointing product' },
  ]
  return (
    <section className="relative z-10 py-14 md:py-20 px-6 md:px-10 border-t border-rule bg-ink">
      <div className="max-w-6xl mx-auto">
        <p className="label-mono text-green-400 mb-4 reveal">at first, I hoped the local grocery-stores would save me</p>
        <h2 className="font-serif font-light text-paper mb-6 reveal" style={{ fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1.1 }}>
          But that glimmer of hope<br />died quickly.
        </h2>
        <p className="font-body text-paper/60 mb-12 max-w-xl reveal">
          Store-bought gluten-free food only gets worse when you read the list of ingredients. In order to make up for what is lost in the process of removing gluten… lots of other ingredients are added.
        </p>
        <div className="space-y-0 border border-ink/30 reveal">
          {problems.map(({ label, verdict }, i) => (
            <div key={i} className="grid md:grid-cols-3 border-b border-ink/20 last:border-b-0">
              <div className="p-5 border-r border-ink/20">
                <p className="label-mono text-muted text-[10px]">{label}</p>
              </div>
              <div className="md:col-span-2 p-5 flex items-center gap-3">
                <span className="text-red-400 shrink-0">✕</span>
                <p className="font-body text-paper/70 text-sm">{verdict}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="font-serif italic text-paper/60 text-xl mt-10 reveal">No thanks!!</p>
      </div>
    </section>
  )
}

/* ── Where GF Goes Wrong ─────────────────────────────────────────────────── */
function WhereGFGoesWrong() {
  return (
    <section className="relative z-10 py-14 md:py-20 px-6 md:px-10 border-t border-rule">
      <div className="max-w-6xl mx-auto">
        <p className="label-mono text-forest mb-4 reveal">a master baker from paris</p>
        <h2 className="font-serif font-light text-ink mb-12 reveal" style={{ fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1.1 }}>
          Where Gluten Free<br />Baking Goes Wrong
        </h2>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <div className="border-l-4 border-forest pl-6 reveal">
              <p className="font-serif italic text-ink text-xl leading-snug">
                "The problem isn't with 'real' gluten free recipes… The problem is when we 'ruin' traditional gluten recipes."
              </p>
              <p className="label-mono text-muted text-[10px] mt-4">— Paris master baker, gluten & dairy free for years</p>
            </div>
            <p className="font-body text-ink/70 leading-relaxed reveal">
              You can't "swap" the gluten out — but keep the rest of a traditional recipe the same. Baking doesn't work that way. <strong className="text-ink">You need an entirely different recipe.</strong>
            </p>
            <p className="font-body text-ink/70 leading-relaxed reveal">
              Gluten just "does a job" — but other ingredients do that job better. Gluten's job is to create texture and rise — but non-gluten ingredients have a much wider range of flavors and textures.
            </p>
          </div>
          <div className="space-y-0 border border-rule reveal">
            {[
              { wrong: 'Swap gluten out, keep recipe the same', right: 'Re-invent the recipe entirely from scratch' },
              { wrong: 'Complicated techniques, hard-to-find ingredients', right: 'Simple steps, supermarket-only ingredients' },
              { wrong: 'Recipes that look good on a blog, fail at home', right: 'Made in a real kitchen, photographed as-is' },
              { wrong: 'Store-bought flour mixes with additives', right: 'Custom flour blends — our secret weapon' },
            ].map(({ wrong, right }, i) => (
              <div key={i} className="grid grid-cols-2 border-b border-rule last:border-b-0">
                <div className="p-5 border-r border-rule">
                  <p className="label-mono text-muted text-[10px] mb-2">wrong way</p>
                  <p className="font-body text-ink/50 line-through text-sm">{wrong}</p>
                </div>
                <div className="p-5">
                  <p className="label-mono text-forest text-[10px] mb-2">tropicalcook way</p>
                  <p className="font-body text-ink text-sm">{right}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Recipe Collections ──────────────────────────────────────────────────── */
function RecipeCollections() {
  const [active, setActive] = useState(0)
  const collections = [
    {
      name: 'Easy Bake',
      label: 'the easy bake collection',
      desc: 'This is the collection I share with friends who are new in the kitchen. These "classics" are quick and easy to bake. You will master them instantly.',
      highlight: "Imagine surprising your family this weekend… casually asking if they'd prefer \"Perfect Waffles… Pancakes… Or something exotic? Like Thai Coconut Crepes or The Real French Toast from Paris.\"",
      recipes: ['Perfect Waffles', 'Fluffy Pancakes', 'Thai Coconut Crepes', '"The Real" French Toast from Paris', 'Quick Breakfast Muffins', 'Overnight Oat Cookies'],
    },
    {
      name: 'Nibbles & Snacks',
      label: 'nibbles, savoury snacks, and light lunches',
      desc: 'Whether you want to whip up a savoury "grab and go"… make healthy nibbles for TV time… or even just a light lunch — these are the recipes you need.',
      highlight: '"Cheez It" Crackers and Mozzarella Sticks — "Oooohh, they\'re so good!" — plus Argentine Empanadas, Chinese Dumplings, and French Quiche.',
      recipes: ['"Cheez It" Crackers', 'Mozzarella Sticks', 'Argentine Empanadas', 'Chinese Dumplings', 'French Quiche', 'Savoury Granola Bars'],
    },
    {
      name: 'Essential Breads',
      label: 'the essential bread collection',
      desc: 'It\'s magical — how the smell of baking bread deeply relaxes your home. Imagine waking your family with the sweet aromas of English breakfast muffins.',
      highlight: 'Breakfast bagels, sandwich breads, and BBQ buns — so light and fluffy they make hotdogs and burgers the best you\'ve ever had.',
      recipes: ['English Breakfast Muffins', 'Chewy Breakfast Bagels', 'Classic Sandwich Bread', 'BBQ Buns', 'Dinner Rolls', 'Focaccia with Herbs'],
    },
    {
      name: 'Artisan Breads',
      label: 'artisan breads',
      desc: 'The best gluten-free food is BREAD. Specifically — this collection of real artisan breads. Think about it: artisan breads are always more delicious, and more expensive than any other bread.',
      highlight: 'These premium breads truly are gifts — wildly superior in nutrients, aromas, textures, and taste. When you taste the truth, you\'ll lose all desire for mediocre store-bought bread.',
      recipes: ['Sourdough-Style Loaf', 'Rustic Country Bread', 'Seeded Rye-Style', 'Olive & Rosemary Batard', 'Multigrain Boule', 'Gluten-Free Baguette'],
    },
    {
      name: 'Cookies, Cakes & Pies',
      label: 'cookies, cakes, muffins and pies',
      desc: 'Provar e não acreditar que é sem glúten — this is the goal. Brownie, cheesecake, pecan pie. The best baked goods of your life.',
      highlight: '"Indulge in a big slice of healthy pecan pie — with the sweet shortbread crust melting in your mouth, together with a delightful pecan crunch."',
      recipes: ['Pecan Pie with Shortbread Crust', 'Ooey-Gooey Chocolate Cookies', 'Classic Blueberry Muffins', 'Cheesecake with Berry Topping', 'Banana Bread Loaf', 'Lemon Drizzle Cake'],
    },
  ]
  return (
    <section id="recipes" className="relative z-10 py-14 md:py-20 px-6 md:px-10 border-t border-rule">
      <div className="max-w-6xl mx-auto">
        <p className="label-mono text-forest mb-4 reveal">the "real, gluten-free" recipe collections</p>
        <h2 className="font-serif font-light text-ink mb-4 reveal" style={{ fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1.1 }}>
          These are the best of my best.
        </h2>
        <p className="font-body text-ink/60 max-w-xl mb-12 reveal">
          Tried and tested. Collected and created with a team of food-scientists, nutritionists and expert chefs from around the world.
        </p>
        <div className="flex gap-0 border border-rule overflow-x-auto hscroll">
          {collections.map((c, i) => (
            <button key={i} onClick={() => setActive(i)} className={`label-mono text-[10px] px-5 py-3 border-r border-rule whitespace-nowrap transition-colors ${active===i?'bg-forest text-paper':'bg-paper text-muted hover:text-ink'}`}>
              {c.name}
            </button>
          ))}
        </div>
        <div className="border border-t-0 border-rule">
          <div className="grid md:grid-cols-2 border-b border-rule">
            <div className="p-8 border-r border-rule">
              <p className="label-mono text-forest text-[10px] mb-4">{collections[active].label}</p>
              <h3 className="font-serif text-2xl text-ink mb-4">{collections[active].name}</h3>
              <p className="font-body text-ink/70 leading-relaxed mb-6">{collections[active].desc}</p>
              <div className="border-l-2 border-forest pl-4">
                <p className="font-serif italic text-ink/80 text-sm leading-relaxed">{collections[active].highlight}</p>
              </div>
            </div>
            <div className="p-8">
              <p className="label-mono text-muted text-[10px] mb-4">sample recipes</p>
              {collections[active].recipes.map((r, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-rule last:border-b-0">
                  <span className="text-forest text-sm">→</span>
                  <span className="font-body text-ink text-sm">{r}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 flex items-center justify-between flex-wrap gap-4">
            <p className="label-mono text-muted text-[10px]">all recipes include: step-by-step instructions · calories & macros · full ingredient list · photo of finished dish</p>
            <a href="#pricing" className="cta-btn label-mono bg-forest text-paper px-6 py-3 border border-ink text-[10px]">get all 5 collections — $17</a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Free Gifts Detail ───────────────────────────────────────────────────── */
function FreeGiftsDetail() {
  return (
    <section className="relative z-10 py-14 md:py-20 px-6 md:px-10 border-t border-rule bg-ink">
      <div className="max-w-6xl mx-auto">
        <p className="label-mono text-green-400 mb-4 reveal">but wait — there's more!!</p>
        <h2 className="font-serif font-light text-paper mb-16 reveal" style={{ fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1.1 }}>
          Because I also want to give you<br />some very special free gifts…
        </h2>
        <div className="grid md:grid-cols-3 gap-px">
          {/* Gift 1 */}
          <div className="border border-ink/30 p-8 reveal">
            <p className="label-mono text-green-400 text-[10px] mb-2">free gift 01</p>
            <p className="label-mono text-muted line-through text-[10px] mb-4">normally $14.95</p>
            <h3 className="font-serif text-paper text-2xl mb-4">Passion<br />For Pasta</h3>
            <p className="font-body text-paper/60 text-sm leading-relaxed mb-6">
              My best 8 "real, gluten-free" pasta recipes — my pride and joy! You'll love how easy it is to cook Lasagna, Gnocchi, Spaghetti, Ravioli, Fettuccine, Cavatelli, Noodles and Tagliatelle.
            </p>
            <p className="font-serif italic text-green-400 text-sm">Pasta has to take priority!!! Mama Mia!!!!</p>
          </div>
          {/* Gift 2 */}
          <div className="border border-ink/30 p-8 reveal">
            <p className="label-mono text-green-400 text-[10px] mb-2">free gift 02</p>
            <p className="label-mono text-muted line-through text-[10px] mb-4">normally $29.95</p>
            <h3 className="font-serif text-paper text-2xl mb-4">Gluten<br />Freedom</h3>
            <p className="font-body text-paper/60 text-sm leading-relaxed mb-6">
              The Secrets of Creating Flour Blends. These secrets give you the power to make your own "real, gluten-free" recipes. When you learn how to use flour blends the right way, you'll be able to bake anything you want.
            </p>
            <p className="font-serif italic text-green-400 text-sm">My friends think I'm crazy for giving this away!!</p>
          </div>
          {/* Gift 3 */}
          <div className="border border-ink/30 p-8 reveal">
            <p className="label-mono text-green-400 text-[10px] mb-2">free gift 03</p>
            <p className="label-mono text-muted line-through text-[10px] mb-4">normally $59.95</p>
            <h3 className="font-serif text-paper text-2xl mb-4">Lifetime<br />Community</h3>
            <p className="font-body text-paper/60 text-sm leading-relaxed mb-4">
              Lifetime membership to my "Real, Gluten-Free" Community — where we support each other in baking, share tips and tricks, discuss diet, hold competitions, and request new recipes too.
            </p>
            <div className="space-y-1">
              {['Support each other in baking','Share our own new recipes','Improve our baking skills','Fun competitions & free giveaways'].map((i) => (
                <p key={i} className="font-body text-paper/50 text-xs flex gap-2"><span className="text-green-400">·</span>{i}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Access Summary / Pricing ────────────────────────────────────────────── */
function AccessSummary() {
  const items = [
    'The Easy Bake — Recipe Collection',
    'The Cookies, Cakes, Muffins and Pies — Recipe Collection',
    'The Nibbles, Savoury Snacks and Light Lunches — Recipe Collection',
    'The Essential Breads — Recipe Collection',
    'The Artisan Breads — Recipe Collection',
    'Free Gift: The Passion For Pasta Recipe Collection',
    'Free Gift: Gluten Freedom — GF flour mix guide',
    'Free Gift: Lifetime Membership to my "Real, Gluten Free" Community',
  ]
  return (
    <section id="pricing" className="relative z-10 py-14 md:py-20 px-6 md:px-10 border-t border-rule">
      <div className="max-w-6xl mx-auto">
        <p className="label-mono text-forest mb-4 reveal">access everything today</p>
        <h2 className="font-serif font-light text-ink mb-16 reveal" style={{ fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1.1 }}>
          Here's What You're About To Get
        </h2>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="space-y-0 border border-rule reveal">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 border-b border-rule last:border-b-0">
                  <span className="text-forest mt-0.5 shrink-0">✓</span>
                  <span className="font-body text-ink text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-5 border border-rule reveal">
              <div className="flex items-baseline gap-4 mb-1">
                <span className="label-mono text-muted text-[10px]">usually would cost</span>
                <span className="font-mono text-ink/40 line-through">$139.84</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="label-mono text-forest text-[10px]">today only</span>
                <span className="font-serif text-4xl font-bold text-forest">$17.00</span>
              </div>
              <p className="label-mono text-green-600 text-[10px] mt-1">that's a total of $122.84 in savings</p>
            </div>
          </div>
          <div className="border border-rule bg-paper reveal">
            <div className="p-8 pb-0">
            <p className="label-mono text-muted mb-4 text-[10px]">instant access · from any device · anywhere in the world</p>
            </div>
            <img src="/book-cover.png" alt="Tropicalcook cookbook" className="w-full object-cover" style={{ maxHeight: '300px', objectPosition: 'center' }} />
            <div className="p-8">
            <p className="font-serif text-5xl text-ink font-bold mb-1 mt-4">$17</p>
            <p className="font-body text-ink/60 text-sm mb-8">one-time payment — no subscriptions</p>
            <a href="#step2" className="cta-btn block text-center bg-forest text-paper font-body font-bold px-8 py-4 border border-ink text-sm mb-3">
              BUY NOW FOR $17 ONLY!
            </a>
            <a href="#step2" className="block text-center label-mono text-forest text-[10px] mb-6 ed-underline">Click Here To Get Started</a>
            <p className="label-mono text-muted text-[10px] text-center mb-4">100% secure 256-bit encrypted checkout</p>
            <div className="pt-6 border-t border-rule text-center">
              <p className="label-mono text-forest text-[10px] mb-1">fully backed by our</p>
              <p className="font-body font-bold text-ink">100% Risk Free · 60-Days Money-Back Guarantee</p>
            </div>
            </div>{/* end padding wrapper */}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Reviews ─────────────────────────────────────────────────────────────── */
function Reviews() {
  const reviews = [
    { name:'Sarah M.', role:'celiac diagnosed 2019', text:'"It tastes too good to be gluten-free!!!" — I said it out loud after the first bite of the artisan bread. My husband immediately demanded I make another loaf.' },
    { name:'James K.', role:'gluten sensitivity', text:'I was sceptical. But the pasta recipes alone are worth 10x the price. We made the Gnocchi last Sunday and the whole family went completely nuts.' },
    { name:'Dr. Rachel P.', role:'nutritionist & celiac', text:'I recommend this to all my patients. The flour blend guide (Gluten Freedom) is especially valuable — it gives them real independence in the kitchen.' },
    { name:'Lisa & Rob T.', role:'family of 5', text:"Our kids don't even know. They just think \"mum's bread is the best in the world.\" This cookbook changed our home completely — thank you Alex." },
  ]
  return (
    <section id="reviews" className="relative z-10 py-14 md:py-20 px-6 md:px-10 border-t border-rule" style={{ background: '#f0ede6' }}>
      <div className="max-w-6xl mx-auto">
        <p className="label-mono text-forest mb-4 reveal">100,000+ happy customers</p>
        <h2 className="font-serif font-light text-ink mb-16 reveal" style={{ fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1.1 }}>
          Start Baking TODAY!
        </h2>
        <div className="grid md:grid-cols-2 gap-px border border-rule">
          {reviews.map(({ name, role, text }, i) => (
            <div key={i} className="p-8 bg-paper border-r border-b border-rule reveal">
              <p className="font-serif italic text-ink text-lg leading-snug mb-6">{text}</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center shrink-0">
                  <span className="text-paper text-xs font-bold">{name[0]}</span>
                </div>
                <div>
                  <p className="font-body font-medium text-ink text-sm">{name}</p>
                  <p className="label-mono text-muted text-[10px]">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Alex Letter ─────────────────────────────────────────────────────────── */
function AlexLetter() {
  return (
    <section className="relative z-10 py-14 md:py-20 px-6 md:px-10 border-t border-rule">
      <div className="max-w-3xl mx-auto">
        <p className="label-mono text-forest mb-8 reveal">a personal note from alex</p>
        <div className="space-y-5 reveal" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300, fontSize: '1.12rem', lineHeight: 1.85, color: '#1c1c1c' }}>
          <p>I know, this might seem too good to be true.</p>
          <p>If you're like me, and you're sceptical of buying things on the internet, then I want you to know — there is <strong>NO CATCH</strong> to this offer. There won't be any hidden charges or monthly billings. No strings attached. What you see is what you get.</p>
          <p>Imagine the excitement just a few minutes from now, when you first access all of your stunning new recipes. Browsing through them all… your mouth watering… and all the excitement of choosing what you're going to bake first.</p>
          <p>Why? Because life is too short to not enjoy your favourite foods — every single day. You deserve to enjoy all of this — safe and with peace of mind, that what you're eating is actually good for you.</p>
          <p>So go ahead and order now. Your best baking is waiting for you.</p>
          <p className="italic">Yours in food and friendship,<br /><strong>— Alex</strong><br /><span style={{ fontSize: '0.85rem', color: '#b4b4b4', fontFamily: '"Space Grotesk", sans-serif' }}>Written with love from our kitchen table.</span></p>
        </div>
        <div className="mt-10 space-y-4 reveal">
          <div className="border-l-2 border-forest pl-5">
            <p className="font-body text-ink/60 text-sm leading-relaxed"><strong className="text-ink">P.S.</strong> Remember — You have my full unconditional money-back guarantee. You and your family will fall in love with each and every single one of these recipes. If you feel at all otherwise, I will cheerfully refund your full purchase price any time within 60-days of purchase.</p>
          </div>
          <div className="border-l-2 border-rule pl-5">
            <p className="font-body text-ink/60 text-sm leading-relaxed"><strong className="text-ink">P.P.S.</strong> Please remember to share your testimonials with us — we love to hear how much of an impact these recipes have made for you and your family!!!</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Final CTA ───────────────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="relative z-10 py-14 md:py-20 px-6 md:px-10 border-t border-rule bg-forest">
      <div className="max-w-3xl mx-auto text-center">
        <p className="label-mono text-paper/60 mb-4 reveal">instant access · from any device · anywhere in the world</p>
        <h2 className="font-serif font-light text-paper mb-6 reveal" style={{ fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1.1 }}>
          You can access all of this<br />for just $17.
        </h2>
        <p className="font-body text-paper/80 text-lg leading-relaxed mb-10 reveal">
          The "Real, Gluten Free" Recipe Collections plus your 3 Free Gifts.
        </p>
        <a href="#pricing" className="cta-btn inline-block bg-paper text-ink font-body font-bold px-10 py-5 border border-paper text-sm mb-4 reveal">
          BUY NOW FOR $17 ONLY!
        </a>
        <p className="label-mono text-paper/50 text-[10px] reveal">Click Here To Get Started</p>
      </div>
    </section>
  )
}

/* ── FAQ ─────────────────────────────────────────────────────────────────── */
function FAQ() {
  const [open, setOpen] = useState(null)
  const faqs = [
    { q:'Is this a physical book or digital download?', a:'Both! You receive instant digital access (PDF) immediately after purchase, and hardcover is now also available. The digital version works on any device — phone, tablet, or computer.' },
    { q:'Does this work for celiac disease and gluten intolerance?', a:'Yes. All recipes are 100% gluten-free, designed by Alex who has been diagnosed with celiac disease herself. She understands the risks and tolerances.' },
    { q:'What if I don\'t like it?', a:'You have a full 60-day money-back guarantee — no questions asked, no burocracia. Simply email info@tropicalcookhealthy.co and we\'ll cheerfully refund every cent.' },
    { q:'Are the ingredients easy to find?', a:'Yes. Every recipe was developed using only ingredients available at regular supermarkets. No specialty stores, no imports, no obscure online orders.' },
    { q:'What exactly are the 3 free gifts?', a:'Passion For Pasta (8 real GF pasta recipes, normally $14.95), Gluten Freedom — The Secrets of Creating Flour Blends (normally $29.95), and Lifetime Membership to the Real Gluten-Free Community (normally $59.95). All free with your purchase today.' },
    { q:'Is there a catch?', a:'No catch. No hidden monthly billing. No strings attached. One payment of $17 and you have lifetime access to everything listed.' },
  ]
  return (
    <section className="relative z-10 py-14 md:py-20 px-6 md:px-10 border-t border-rule">
      <div className="max-w-3xl mx-auto">
        <p className="label-mono text-forest mb-4 reveal">frequently asked questions</p>
        <h2 className="font-serif font-light text-ink mb-12 reveal" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 1.1 }}>
          Just in case you have any questions.
        </h2>
        <div className="border border-rule">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="border-b border-rule last:border-b-0 reveal">
              <button onClick={() => setOpen(open===i?null:i)} className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-warm transition-colors">
                <span className="font-body font-medium text-ink">{q}</span>
                <span className="font-mono text-forest shrink-0 text-lg">{open===i?'−':'+'}</span>
              </button>
              <div className={`faq-body ${open===i?'open':''}`}>
                <p className="px-6 pb-6 font-body text-ink/70 leading-relaxed">{a}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="font-body text-ink/60 text-sm mt-8 reveal">
          You can always email me and my customer support team at <span className="text-forest font-medium">info@tropicalcookhealthy.co</span> — we will be happy to help you.
        </p>
      </div>
    </section>
  )
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="relative z-10 border-t border-rule py-12 px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        <div>
          <p className="font-serif text-2xl text-ink font-bold mb-2">tropicalcook.</p>
          <p className="label-mono text-muted text-[10px]">real, gluten-free cooking · by alex</p>
        </div>
        <div className="flex flex-wrap gap-8">
          {[['Contact','info@tropicalcookhealthy.co'],['Support','info@tropicalcookhealthy.co'],['Community','@tropicalcookglutenfreee']].map(([l,v]) => (
            <div key={l}>
              <p className="label-mono text-muted text-[10px] mb-1">{l}</p>
              <p className="font-body text-ink text-sm">{v}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-rule flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="label-mono text-muted text-[10px]">©2026 Tropicalcook Cooking. All rights reserved.</p>
        <div className="flex gap-6">
          {['Terms of Use','Privacy Policy'].map(l => (
            <a key={l} href="#" className="label-mono text-muted text-[10px] ed-underline hover:text-ink">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

/* ── App ─────────────────────────────────────────────────────────────────── */
export default function App() {
  useReveal()
  return (
    <div className="relative min-h-screen bg-paper">
      <BgGrid />
      <Grain />
      <ScanLine />
      <PromoBanner />
      <Navbar />
      <main>
        <Hero />
        <ImagineSection />
        <PricingCTA />
        <FreeGiftsTeaser />
        <SymptomsSection />
        <Citations />
        <AlexStory />
        <StoreGFProblems />
        <WhereGFGoesWrong />
        <RecipeCollections />
        <FreeGiftsDetail />
        <AccessSummary />
        <Reviews />
        <AlexLetter />
        <FinalCTA />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
