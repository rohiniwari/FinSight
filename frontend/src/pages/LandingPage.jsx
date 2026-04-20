import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * LandingPage — your original index.html landing page
 * converted into a React component.
 * All styles and scripts are self-contained here.
 * Links to /login and /register are handled by React Router.
 */
export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Inject the landing page stylesheet once
    const styleId = 'landing-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = LANDING_CSS;
      document.head.appendChild(style);
    }

    // Run all landing page JS (animations, charts, feed, health score)
    const runScript = new Function(LANDING_JS);
    runScript();

    // Intercept /login and /register link clicks → React Router
    const handleLinkClick = (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href === '/login' || href === '/register' || href === '/') {
        e.preventDefault();
        navigate(href);
      }
    };
    document.addEventListener('click', handleLinkClick);

    return () => {
      document.removeEventListener('click', handleLinkClick);
      // Clean up style on unmount so it doesn't leak into app pages
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [navigate]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: LANDING_HTML }}
    />
  );
}

// ─────────────────────────────────────────────────────────
// Embedded assets (style + html + js from original index.html)
// ─────────────────────────────────────────────────────────

const LANDING_CSS = String.raw`
/* ─── BASE ───────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
body {
  font-family: 'DM Sans', sans-serif;
  background: #05060f;
  color: #e2e8f0;
  overflow-x: hidden;
}

/* grain */
body::after {
  content: '';
  position: fixed; inset: 0;
  pointer-events: none; z-index: 9999; opacity: .022;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* typography */
.font-display { font-family: 'Syne', sans-serif; }

/* gradient text */
.g-ic  { background: linear-gradient(135deg,#6366f1,#22d3ee); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.g-ge  { background: linear-gradient(135deg,#10b981,#22d3ee); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.g-wa  { background: linear-gradient(135deg,#f59e0b,#f43f5e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

/* glass */
.glass {
  background: rgba(15,18,36,.72);
  backdrop-filter: blur(22px) saturate(1.5);
  -webkit-backdrop-filter: blur(22px) saturate(1.5);
  border: 1px solid rgba(148,163,184,.08);
}
.glass-hover {
  transition: transform .3s cubic-bezier(.22,1,.36,1),
              box-shadow .3s, border-color .3s;
}
.glass-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 24px 64px rgba(0,0,0,.5);
  border-color: rgba(148,163,184,.18) !important;
}

/* glow borders on hover */
.card-glow {
  position: relative;
  isolation: isolate;
}
.card-glow::before {
  content: '';
  position: absolute; inset: -1px;
  border-radius: inherit;
  background: linear-gradient(135deg,#6366f1,#22d3ee,#10b981,#6366f1);
  background-size: 300% 300%;
  animation: gradShift 4s ease infinite;
  opacity: 0;
  transition: opacity .35s;
  z-index: -1;
}
.card-glow:hover::before { opacity: 1; }
@keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

/* orbs */
.orb {
  position: absolute; border-radius: 50%;
  filter: blur(120px); pointer-events: none;
}
.orb-1 { width:700px; height:700px; background:#6366f1; opacity:.22; top:-220px; left:-160px; animation: orb1 14s ease-in-out infinite; }
.orb-2 { width:500px; height:500px; background:#22d3ee; opacity:.16; bottom:-100px; right:-120px; animation: orb2 11s ease-in-out infinite; }
.orb-3 { width:380px; height:380px; background:#8b5cf6; opacity:.13; top:35%; right:20%; animation: orb3 16s ease-in-out infinite 2s; }

@keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.08)} 66%{transform:translate(-20px,18px) scale(.94)} }
@keyframes orb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-28px,22px) scale(1.06)} }
@keyframes orb3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-14px) scale(1.05)} }

/* floaty hero cards */
@keyframes fy1 { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(-2deg)} }
@keyframes fy2 { 0%,100%{transform:translateY(0) rotate(2deg)}  50%{transform:translateY(-10px) rotate(2deg)} }
.fly1 { animation: fy1 7s ease-in-out infinite; }
.fly2 { animation: fy2 9s ease-in-out infinite; }

/* ticker */
@keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
.ticker-inner { animation: ticker 30s linear infinite; display:flex; width:max-content; }

/* ping badge */
@keyframes ping { 75%,100%{transform:scale(2);opacity:0} }
.ping { animation: ping 1.5s cubic-bezier(0,0,.2,1) infinite; }

/* reveal on scroll */
.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1);
}
.reveal.in { opacity:1; transform:translateY(0); }
.d1{transition-delay:.1s} .d2{transition-delay:.2s} .d3{transition-delay:.3s} .d4{transition-delay:.4s}

/* nav scroll */
.nav-scroll {
  background: rgba(5,6,15,.9) !important;
  backdrop-filter: blur(24px) saturate(1.4) !important;
  border-bottom: 1px solid rgba(148,163,184,.07) !important;
}

/* buttons */
.btn-pri {
  background: linear-gradient(135deg,#6366f1,#22d3ee);
  box-shadow: 0 4px 24px rgba(99,102,241,.32);
  transition: transform .2s, box-shadow .2s;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
}
.btn-pri:hover { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(99,102,241,.48); }
.btn-out {
  border: 1.5px solid rgba(148,163,184,.18);
  transition: border-color .2s, background .2s;
  font-family: 'Syne', sans-serif; font-weight: 700;
}
.btn-out:hover { border-color:#6366f1; background:rgba(99,102,241,.08); }

/* section badge */
.s-tag {
  display: inline-block;
  font-family: 'DM Sans', sans-serif;
  font-size: .7rem; font-weight: 700;
  letter-spacing: .14em; text-transform: uppercase;
  color: #22d3ee;
  background: rgba(34,211,238,.07);
  border: 1px solid rgba(34,211,238,.18);
  padding: 6px 18px; border-radius: 100px;
}

/* animated health ring */
#hRing {
  stroke-dasharray: 0 628;
  transition: stroke-dasharray 2s cubic-bezier(.22,1,.36,1);
}

/* bar fills */
.bar-fill  { width:0%; transition: width 1.5s cubic-bezier(.22,1,.36,1); }
.h-bar     { height:0%; transition: height .9s cubic-bezier(.34,1.56,.64,1); }

/* feed card animation */
@keyframes cIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
.feed-card { animation: cIn .45s cubic-bezier(.22,1,.36,1) both; }

/* feed tag colours */
.tag-w { background:rgba(245,158,11,.12); color:#f59e0b; border:1px solid rgba(245,158,11,.22); }
.tag-s { background:rgba(16,185,129,.12); color:#10b981; border:1px solid rgba(16,185,129,.22); }
.tag-i { background:rgba(34,211,238,.10); color:#22d3ee; border:1px solid rgba(34,211,238,.20); }
.tag-d { background:rgba(244,63,94,.12);  color:#f43f5e; border:1px solid rgba(244,63,94,.22); }
.tag-p { background:rgba(139,92,246,.12); color:#8b5cf6; border:1px solid rgba(139,92,246,.22); }

/* icon circles */
.ic-i{background:rgba(99,102,241,.12); color:#6366f1;}
.ic-c{background:rgba(34,211,238,.10); color:#22d3ee;}
.ic-g{background:rgba(16,185,129,.10); color:#10b981;}
.ic-a{background:rgba(245,158,11,.10); color:#f59e0b;}
.ic-r{background:rgba(244,63,94,.10);  color:#f43f5e;}
.ic-v{background:rgba(139,92,246,.12); color:#8b5cf6;}

/* mobile menu */
#mMenu { display:none; }
#mMenu.open { display:flex; }

/* glow pulse */
@keyframes gPulse { 0%,100%{opacity:.08;transform:scale(1)} 50%{opacity:.18;transform:scale(1.04)} }
.glow-pulse { animation: gPulse 4s ease-in-out infinite; }

/* shimmer */
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
.shimmer {
  background: linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);
  background-size:200% 100%;
  animation: shimmer 2.2s linear infinite;
}

/* grid bg */
.grid-bg {
  background-image: linear-gradient(rgba(148,163,184,.1) 1px,transparent 1px),
                    linear-gradient(90deg,rgba(148,163,184,.1) 1px,transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 65% 55% at 50% 35%,black,transparent);
  -webkit-mask-image: radial-gradient(ellipse 65% 55% at 50% 35%,black,transparent);
}

/* scrollbar */
::-webkit-scrollbar { width:5px; }
::-webkit-scrollbar-track { background:#05060f; }
::-webkit-scrollbar-thumb { background:#181b2e; border-radius:3px; }

/* cursor glow */
#cg {
  position:fixed; width:480px; height:480px; border-radius:50%;
  background: radial-gradient(circle,rgba(99,102,241,.06) 0%,transparent 70%);
  pointer-events:none; z-index:1;
  transform:translate(-50%,-50%);
  transition: left .6s ease, top .6s ease;
}

/* metric top border */
.m-green::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#10b981,#22d3ee); border-radius:2px 2px 0 0; }
.m-rose::after  { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#f43f5e,#f59e0b); border-radius:2px 2px 0 0; }
.m-indigo::after{ content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#6366f1,#8b5cf6); border-radius:2px 2px 0 0; }
.m-amber::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#f59e0b,#f43f5e); border-radius:2px 2px 0 0; }

@media(max-width:768px){
  .dash-body{flex-direction:column!important}
  .dash-sb{width:100%!important;flex-direction:row;overflow-x:auto;border-right:none!important;border-bottom:1px solid rgba(148,163,184,.08)}
  .sb-logo{display:none!important}
  .sb-nav{flex-direction:row!important}
  .sb-lbl{display:none}
  .mini-grid{grid-template-columns:repeat(2,1fr)!important}
  .chart-grid{grid-template-columns:1fr!important}
}
`;

const LANDING_HTML = String.raw`
<!-- cursor glow -->
<div id="cg"></div>

<!-- ════════════════════════  NAV  ════════════════════════ -->
<nav id="nav" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style="background:transparent">
  <div class="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between">

    <!-- logo -->
    <a href="/" class="flex items-center gap-2.5 font-display font-bold text-xl text-white">
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <rect width="34" height="34" rx="9" fill="url(#nL)"/>
        <path d="M8 24V15l4.5-4.5V24H8zm6 0V13l4.5-2V24h-4.5zm6 0V11l4.5-2V24H20z" fill="#fff" fill-opacity=".92"/>
        <defs><linearGradient id="nL" x1="0" y1="0" x2="34" y2="34"><stop stop-color="#6366f1"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs>
      </svg>
      Fin<span class="g-ic">Sight</span>
    </a>

    <!-- desktop links -->
    <div class="hidden md:flex items-center gap-8">
      <a href="#features"      class="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
      <a href="#health-score"  class="text-sm font-medium text-slate-400 hover:text-white transition-colors">Health Score</a>
      <a href="#dashboard"     class="text-sm font-medium text-slate-400 hover:text-white transition-colors">Dashboard</a>
      <a href="#feed"          class="text-sm font-medium text-slate-400 hover:text-white transition-colors">Insights</a>
      <a href="#budget"        class="text-sm font-medium text-slate-400 hover:text-white transition-colors">Budget</a>
    </div>

    <div class="hidden md:flex items-center gap-3">
      <a href="/login" class="text-sm font-semibold text-slate-400 hover:text-white transition-colors px-4 py-2">Log In</a>
      <a href="/register" class="btn-pri text-sm px-5 py-2.5 rounded-xl text-white">Get Started →</a>
    </div>

    <!-- burger -->
    <button id="burger" class="md:hidden flex flex-col gap-1.5 z-50" aria-label="Open menu">
      <span id="b1" class="block w-6 h-0.5 bg-white transition-all duration-300 origin-center"></span>
      <span id="b2" class="block w-6 h-0.5 bg-white transition-all duration-300"></span>
      <span id="b3" class="block w-6 h-0.5 bg-white transition-all duration-300 origin-center"></span>
    </button>
  </div>

  <!-- mobile menu -->
  <div id="mMenu" class="fixed inset-0 z-40 flex-col gap-6 p-10 pt-24" style="background:#05060f">
    <a href="#features"     onclick="closeMM()" class="text-2xl font-display font-bold hover:text-cyan-400 transition-colors">Features</a>
    <a href="#health-score" onclick="closeMM()" class="text-2xl font-display font-bold hover:text-cyan-400 transition-colors">Health Score</a>
    <a href="#dashboard"    onclick="closeMM()" class="text-2xl font-display font-bold hover:text-cyan-400 transition-colors">Dashboard</a>
    <a href="#feed"         onclick="closeMM()" class="text-2xl font-display font-bold hover:text-cyan-400 transition-colors">Insights</a>
    <a href="#budget"       onclick="closeMM()" class="text-2xl font-display font-bold hover:text-cyan-400 transition-colors">Budget</a>
    <div class="mt-auto flex flex-col gap-3">
      <a href="/login" onclick="closeMM()" class="btn-out py-3.5 text-center rounded-xl text-white text-lg">Log In</a>
      <a href="/register" onclick="closeMM()" class="btn-pri py-3.5 text-center rounded-xl text-white text-lg">Get Started →</a>
    </div>
  </div>
</nav>

<!-- ════════════════════════  HERO  ════════════════════════ -->
<section class="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-24">
  <!-- bg decoration -->
  <div class="absolute inset-0 pointer-events-none overflow-hidden">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    <div class="grid-bg absolute inset-0 opacity-[.028]"></div>
  </div>

  <!-- floating stat cards -->
  <div class="hidden lg:block absolute top-32 left-10 fly1" style="z-index:2">
    <div class="glass rounded-2xl p-4 flex items-center gap-3 w-56" style="box-shadow:0 8px 32px rgba(0,0,0,.4)">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ic-g">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
      </div>
      <div>
        <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Health Score</div>
        <div class="font-display font-extrabold text-lg g-ge">78 / 100</div>
      </div>
    </div>
  </div>

  <div class="hidden lg:block absolute bottom-36 right-12 fly2" style="z-index:2">
    <div class="glass rounded-2xl p-4 flex items-center gap-3 w-60" style="box-shadow:0 8px 32px rgba(0,0,0,.4)">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ic-i">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
      </div>
      <div>
        <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Month Saved</div>
        <div class="font-display font-extrabold text-lg" style="color:#6366f1">₹ 12,400</div>
      </div>
    </div>
  </div>

  <div class="hidden xl:block absolute top-48 right-16 fly1" style="z-index:2;animation-delay:1.5s">
    <div class="glass rounded-2xl p-4 flex items-center gap-3 w-52" style="box-shadow:0 8px 32px rgba(0,0,0,.4)">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ic-a">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
      </div>
      <div>
        <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Balance</div>
        <div class="font-display font-extrabold text-lg" style="color:#f59e0b">₹ 16,830</div>
      </div>
    </div>
  </div>

  <!-- content -->
  <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
    <div class="reveal inline-flex items-center gap-2.5 rounded-full px-5 py-2 mb-8 text-xs font-bold tracking-widest uppercase"
         style="background:rgba(34,211,238,.07);border:1px solid rgba(34,211,238,.22);color:#22d3ee">
      <span class="relative inline-flex w-2 h-2">
        <span class="ping absolute inline-flex w-full h-full rounded-full bg-cyan-400 opacity-75"></span>
        <span class="relative inline-flex w-2 h-2 rounded-full bg-cyan-400"></span>
      </span>
      Financial Intelligence, Reimagined
    </div>

    <h1 class="font-display font-extrabold leading-[1.04] tracking-tight mb-6 reveal d1"
        style="font-size:clamp(2.8rem,6.5vw,5rem)">
      Master Your Money<br>
      <em class="g-ic not-italic">With Clarity</em>
    </h1>

    <p class="reveal d2 text-slate-400 leading-relaxed mb-10 mx-auto"
       style="font-size:clamp(1rem,1.8vw,1.12rem);max-width:540px">
      Track every rupee, uncover spending patterns, and make smarter decisions —
      with a dashboard built for real financial clarity.
    </p>

    <div class="reveal d3 flex gap-4 justify-center flex-wrap mb-14">
      <a href="/register" class="btn-pri px-8 py-4 rounded-2xl text-white text-base flex items-center gap-2">
        Start Free
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
      <a href="#dashboard" class="btn-out px-8 py-4 rounded-2xl text-white text-base flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        See Dashboard
      </a>
    </div>

    <!-- social proof -->
    <div class="reveal d4 flex items-center justify-center gap-4 flex-wrap">
      <div class="flex">
        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&q=80" class="w-9 h-9 rounded-full object-cover" style="border:2px solid #05060f" alt=""/>
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&q=80" class="w-9 h-9 rounded-full object-cover -ml-2.5" style="border:2px solid #05060f" alt=""/>
        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&q=80" class="w-9 h-9 rounded-full object-cover -ml-2.5" style="border:2px solid #05060f" alt=""/>
        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&q=80" class="w-9 h-9 rounded-full object-cover -ml-2.5" style="border:2px solid #05060f" alt=""/>
        <span class="w-9 h-9 rounded-full -ml-2.5 flex items-center justify-center text-[10px] font-bold text-slate-400"
              style="background:#0f1224;border:2px solid #05060f">2k+</span>
      </div>
      <div>
        <div class="text-amber-400 text-sm tracking-widest">★★★★★</div>
        <div class="text-sm text-slate-500">Trusted by <strong class="text-white">2,000+</strong> users</div>
      </div>
    </div>
  </div>
</section>

<!-- ════════════════════  TICKER  ════════════════════ -->
<div class="py-5 overflow-hidden" style="background:#0a0c1a;border-top:1px solid rgba(148,163,184,.06);border-bottom:1px solid rgba(148,163,184,.06)">
  <div class="ticker-inner">
    <div class="flex items-center shrink-0">
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Transaction Tracking</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Budget Management</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Financial Health Score</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Smart Insights Engine</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Weekly Feed</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Export Reports · CSV &amp; PDF</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Responsive Design</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Dark Mode</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Financial Forecasting</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Secure Authentication</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
    </div>
    <div class="flex items-center shrink-0" aria-hidden="true">
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Transaction Tracking</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Budget Management</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Financial Health Score</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Smart Insights Engine</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Weekly Feed</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Export Reports · CSV &amp; PDF</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Responsive Design</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Dark Mode</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Financial Forecasting</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
      <span class="text-slate-600 text-xs font-bold uppercase tracking-[.14em] px-6">Secure Authentication</span><span class="text-indigo-500 opacity-30 text-xs">✦</span>
    </div>
  </div>
</div>

<!-- ════════════════  METRICS RIBBON  ════════════════ -->
<section class="py-16">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 reveal">
      <div class="glass card-glow glass-hover rounded-2xl p-5 relative overflow-hidden m-green">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center mb-4 ic-g">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        </div>
        <div class="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Total Income</div>
        <div class="text-2xl font-display font-extrabold" data-count="48250" data-prefix="&#8377;" data-comma="1">₹0</div>
        <span class="inline-block mt-2 text-xs font-bold px-2.5 py-0.5 rounded-full" style="background:rgba(16,185,129,.12);color:#10b981">+12.5% ↑</span>
      </div>
      <div class="glass card-glow glass-hover rounded-2xl p-5 relative overflow-hidden m-rose">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center mb-4 ic-r">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
        </div>
        <div class="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Total Expenses</div>
        <div class="text-2xl font-display font-extrabold">₹31,420</div>
        <span class="inline-block mt-2 text-xs font-bold px-2.5 py-0.5 rounded-full" style="background:rgba(244,63,94,.12);color:#f43f5e">-8.3% ↓</span>
      </div>
      <div class="glass card-glow glass-hover rounded-2xl p-5 relative overflow-hidden m-indigo">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center mb-4 ic-i">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
        </div>
        <div class="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Current Balance</div>
        <div class="text-2xl font-display font-extrabold">₹16,830</div>
        <span class="inline-block mt-2 text-xs font-bold px-2.5 py-0.5 rounded-full" style="background:rgba(99,102,241,.12);color:#6366f1">+24.1% ↑</span>
      </div>
      <div class="glass card-glow glass-hover rounded-2xl p-5 relative overflow-hidden m-amber">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center mb-4 ic-a">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5 5 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5 5 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z"/></svg>
        </div>
        <div class="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Monthly Savings</div>
        <div class="text-2xl font-display font-extrabold">₹4,580</div>
        <span class="inline-block mt-2 text-xs font-bold px-2.5 py-0.5 rounded-full" style="background:rgba(245,158,11,.12);color:#f59e0b">+18.7% ↑</span>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════  DASHBOARD PREVIEW  ══════════════════ -->
<section id="dashboard" class="py-20">
  <div class="max-w-7xl mx-auto px-6">
    <div class="text-center mb-14 reveal">
      <span class="s-tag mb-5 block">Dashboard Preview</span>
      <h2 class="font-display font-extrabold text-4xl lg:text-5xl mb-4">Your Finances, <span class="g-ic">At a Glance</span></h2>
      <p class="text-slate-400 text-lg max-w-xl mx-auto">A unified command centre for income, expenses, budgets and trends.</p>
    </div>

    <div class="reveal glass rounded-3xl overflow-hidden" style="box-shadow:0 0 120px rgba(99,102,241,.11)">
      <!-- chrome bar -->
      <div class="flex items-center gap-4 px-5 py-3.5" style="background:rgba(0,0,0,.42);border-bottom:1px solid rgba(148,163,184,.06)">
        <div class="flex gap-2">
          <span class="w-3 h-3 rounded-full" style="background:#f43f5e"></span>
          <span class="w-3 h-3 rounded-full" style="background:#f59e0b"></span>
          <span class="w-3 h-3 rounded-full" style="background:#10b981"></span>
        </div>
        <div class="flex items-center gap-2 text-slate-500 text-xs rounded-full px-4 py-1.5 flex-1 max-w-xs" style="background:rgba(255,255,255,.04)">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity=".5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          app.finsight.io/dashboard
        </div>
      </div>

      <!-- body -->
      <div class="dash-body flex min-h-[540px]">

        <!-- sidebar -->
        <div class="dash-sb w-48 shrink-0 flex flex-col gap-4 p-4" style="background:rgba(0,0,0,.24);border-right:1px solid rgba(148,163,184,.06)">
          <div class="sb-logo flex items-center gap-2 font-display font-bold text-sm text-white pt-1">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="6" fill="url(#sL)"/><path d="M5.5 15V11l3-3V15h-3zm4 0V9.5l3-1.5V15h-3zm4 0V8l3-1.5V15h-3z" fill="#fff" fill-opacity=".9"/><defs><linearGradient id="sL" x1="0" y1="0" x2="22" y2="22"><stop stop-color="#6366f1"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs></svg>
            FinSight
          </div>
          <nav class="sb-nav flex flex-col gap-1">
            <div class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white text-xs font-semibold" style="background:rgba(99,102,241,.16)">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2H3V4zm0 5h14v7a1 1 0 01-1 1H4a1 1 0 01-1-1V9z"/></svg>
              <span class="sb-lbl">Dashboard</span>
            </div>
            <div class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 text-xs font-medium hover:text-slate-300 cursor-pointer transition-colors">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z"/></svg>
              <span class="sb-lbl">Transactions</span>
            </div>
            <div class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 text-xs font-medium hover:text-slate-300 cursor-pointer transition-colors">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clip-rule="evenodd"/></svg>
              <span class="sb-lbl">Analytics</span>
            </div>
            <div class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 text-xs font-medium hover:text-slate-300 cursor-pointer transition-colors">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
              <span class="sb-lbl">Budgets</span>
            </div>
            <div class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 text-xs font-medium hover:text-slate-300 cursor-pointer transition-colors">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              <span class="sb-lbl">Export</span>
            </div>
            <div class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 text-xs font-medium hover:text-slate-300 cursor-pointer transition-colors">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>
              <span class="sb-lbl">Settings</span>
            </div>
          </nav>
        </div>

        <!-- main -->
        <div class="flex-1 p-5 min-w-0 overflow-hidden">
          <div class="flex items-center justify-between mb-5">
            <div>
              <div class="font-display font-bold text-lg">Good morning, Alex 👋</div>
              <div class="text-slate-500 text-xs mt-0.5">Financial overview · June 2025</div>
            </div>
            <div class="w-9 h-9 rounded-full flex items-center justify-center font-display font-extrabold text-sm"
                 style="background:linear-gradient(135deg,#6366f1,#22d3ee)">A</div>
          </div>

          <!-- mini metrics -->
          <div class="mini-grid grid gap-3 mb-5" style="grid-template-columns:repeat(4,1fr)">
            <div class="rounded-xl p-3" style="background:rgba(15,18,36,.75);border:1px solid rgba(148,163,184,.06)">
              <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Income</div>
              <div class="font-display font-extrabold text-base" style="color:#10b981">₹8,420</div>
            </div>
            <div class="rounded-xl p-3" style="background:rgba(15,18,36,.75);border:1px solid rgba(148,163,184,.06)">
              <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Expenses</div>
              <div class="font-display font-extrabold text-base" style="color:#f43f5e">₹5,230</div>
            </div>
            <div class="rounded-xl p-3" style="background:rgba(15,18,36,.75);border:1px solid rgba(148,163,184,.06)">
              <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Savings</div>
              <div class="font-display font-extrabold text-base" style="color:#6366f1">₹3,190</div>
            </div>
            <div class="rounded-xl p-3" style="background:rgba(15,18,36,.75);border:1px solid rgba(148,163,184,.06)">
              <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Budget</div>
              <div class="font-display font-extrabold text-base" style="color:#f59e0b">67%</div>
            </div>
          </div>

          <!-- charts row -->
          <div class="chart-grid grid gap-4 mb-5" style="grid-template-columns:1.6fr 1fr">

            <!-- bar chart -->
            <div class="rounded-xl p-4" style="background:rgba(15,18,36,.75);border:1px solid rgba(148,163,184,.06)">
              <div class="flex justify-between items-center mb-4">
                <span class="text-xs font-bold text-slate-300">Income vs Expenses</span>
                <span class="text-[10px] text-slate-500">Last 6 months</span>
              </div>
              <div class="flex items-end gap-3 h-32" id="dbc"></div>
              <div class="flex items-center gap-4 mt-3">
                <span class="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span class="w-2.5 h-2.5 rounded-sm inline-block" style="background:#6366f1"></span>Income
                </span>
                <span class="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span class="w-2.5 h-2.5 rounded-sm inline-block" style="background:rgba(244,63,94,.65)"></span>Expenses
                </span>
              </div>
            </div>

            <!-- donut -->
            <div class="rounded-xl p-4" style="background:rgba(15,18,36,.75);border:1px solid rgba(148,163,184,.06)">
              <div class="text-xs font-bold text-slate-300 mb-3">Expense Breakdown</div>
              <div class="relative w-28 h-28 mx-auto mb-3">
                <svg viewBox="0 0 120 120" class="w-full h-full" style="transform:rotate(-90deg)">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" stroke-width="18"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#6366f1" stroke-width="18" stroke-dasharray="94 220"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#22d3ee" stroke-width="18" stroke-dasharray="63 251" stroke-dashoffset="-94"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" stroke-width="18" stroke-dasharray="47 267" stroke-dashoffset="-157"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#ec4899" stroke-width="18" stroke-dasharray="31 283" stroke-dashoffset="-204"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" stroke-width="18" stroke-dasharray="78 236" stroke-dashoffset="-235"/>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div class="font-display font-extrabold text-sm">₹5,230</div>
                  <div class="text-[10px] text-slate-500">Total</div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div class="flex items-center gap-1.5 text-[10px] text-slate-400"><span class="w-2 h-2 rounded-full shrink-0" style="background:#6366f1"></span>Housing 30%</div>
                <div class="flex items-center gap-1.5 text-[10px] text-slate-400"><span class="w-2 h-2 rounded-full shrink-0" style="background:#22d3ee"></span>Food 20%</div>
                <div class="flex items-center gap-1.5 text-[10px] text-slate-400"><span class="w-2 h-2 rounded-full shrink-0" style="background:#f59e0b"></span>Transport 15%</div>
                <div class="flex items-center gap-1.5 text-[10px] text-slate-400"><span class="w-2 h-2 rounded-full shrink-0" style="background:#ec4899"></span>Shopping 10%</div>
                <div class="flex items-center gap-1.5 text-[10px] text-slate-400"><span class="w-2 h-2 rounded-full shrink-0" style="background:#10b981"></span>Other 25%</div>
              </div>
            </div>
          </div>

          <!-- transactions -->
          <div class="rounded-xl p-4" style="background:rgba(15,18,36,.75);border:1px solid rgba(148,163,184,.06)">
            <div class="flex justify-between items-center mb-3">
              <span class="text-xs font-bold text-slate-300">Recent Transactions</span>
              <span class="text-[10px] font-semibold cursor-pointer hover:underline" style="color:#22d3ee">View All</span>
            </div>
            <div class="flex flex-col" style="gap:0">
              <div class="flex items-center gap-3 py-2.5" style="border-bottom:1px solid rgba(148,163,184,.05)">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0" style="background:rgba(245,158,11,.1)">🍔</div>
                <div class="flex-1 min-w-0"><div class="text-xs font-bold">Swiggy Order</div><div class="text-[10px] text-slate-500">Food · Today</div></div>
                <span class="text-xs font-extrabold shrink-0" style="color:#f43f5e">-₹284</span>
              </div>
              <div class="flex items-center gap-3 py-2.5" style="border-bottom:1px solid rgba(148,163,184,.05)">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0" style="background:rgba(16,185,129,.1)">💸</div>
                <div class="flex-1 min-w-0"><div class="text-xs font-bold">Salary Credit</div><div class="text-[10px] text-slate-500">Income · Jun 1</div></div>
                <span class="text-xs font-extrabold shrink-0" style="color:#10b981">+₹42,000</span>
              </div>
              <div class="flex items-center gap-3 py-2.5" style="border-bottom:1px solid rgba(148,163,184,.05)">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0" style="background:rgba(99,102,241,.1)">🚗</div>
                <div class="flex-1 min-w-0"><div class="text-xs font-bold">Ola Ride</div><div class="text-[10px] text-slate-500">Transport · May 30</div></div>
                <span class="text-xs font-extrabold shrink-0" style="color:#f43f5e">-₹189</span>
              </div>
              <div class="flex items-center gap-3 py-2.5">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0" style="background:rgba(236,72,153,.1)">🛍️</div>
                <div class="flex-1 min-w-0"><div class="text-xs font-bold">Amazon Purchase</div><div class="text-[10px] text-slate-500">Shopping · May 28</div></div>
                <span class="text-xs font-extrabold shrink-0" style="color:#f43f5e">-₹1,299</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════  FINANCIAL HEALTH SCORE  ══════════════ -->
<section id="health-score" class="py-24 relative overflow-hidden" style="background:#0a0c1a;border-top:1px solid rgba(148,163,184,.06)">
  <div class="absolute inset-0 pointer-events-none">
    <div class="absolute w-[600px] h-[600px] rounded-full top-1/2 left-1/2 blur-[140px] opacity-[.07]"
         style="transform:translate(-50%,-50%);background:radial-gradient(circle,#10b981,#22d3ee)"></div>
  </div>
  <div class="max-w-7xl mx-auto px-6">
    <div class="text-center mb-16 reveal">
      <span class="s-tag mb-5 block">⭐ Killer Feature #1</span>
      <h2 class="font-display font-extrabold text-4xl lg:text-5xl mb-4">Financial <span class="g-ge">Health Score</span></h2>
      <p class="text-slate-400 text-lg max-w-xl mx-auto">One number that summarizes your complete financial behaviour — recalculated live from your transactions.</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-16 items-center">

      <!-- gauge -->
      <div class="reveal flex flex-col items-center gap-8">
        <div class="relative w-72 h-72" style="filter:drop-shadow(0 0 44px rgba(16,185,129,.18))">
          <svg viewBox="0 0 240 240" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#10b981"/>
                <stop offset="100%" stop-color="#22d3ee"/>
              </linearGradient>
              <linearGradient id="zg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stop-color="#f43f5e" stop-opacity=".4"/>
                <stop offset="42%"  stop-color="#f59e0b" stop-opacity=".4"/>
                <stop offset="100%" stop-color="#10b981" stop-opacity=".4"/>
              </linearGradient>
            </defs>
            <!-- zone track -->
            <circle cx="120" cy="120" r="100" fill="none" stroke="url(#zg)" stroke-width="16" transform="rotate(-90 120 120)"/>
            <!-- active ring -->
            <circle id="hRing" cx="120" cy="120" r="100" fill="none" stroke="url(#hg)" stroke-width="16"
                    stroke-linecap="round" transform="rotate(-90 120 120)"/>
            <!-- inner -->
            <circle cx="120" cy="120" r="84" fill="rgba(8,10,22,.92)"/>
            <!-- tick marks -->
            <g opacity=".15">
              <line x1="120" y1="12" x2="120" y2="25" stroke="white" stroke-width="2"    transform="rotate(0   120 120)"/>
              <line x1="120" y1="12" x2="120" y2="20" stroke="white" stroke-width="1.5"  transform="rotate(36  120 120)"/>
              <line x1="120" y1="12" x2="120" y2="20" stroke="white" stroke-width="1.5"  transform="rotate(72  120 120)"/>
              <line x1="120" y1="12" x2="120" y2="25" stroke="white" stroke-width="2"    transform="rotate(108 120 120)"/>
              <line x1="120" y1="12" x2="120" y2="20" stroke="white" stroke-width="1.5"  transform="rotate(144 120 120)"/>
              <line x1="120" y1="12" x2="120" y2="25" stroke="white" stroke-width="2"    transform="rotate(180 120 120)"/>
              <line x1="120" y1="12" x2="120" y2="20" stroke="white" stroke-width="1.5"  transform="rotate(216 120 120)"/>
              <line x1="120" y1="12" x2="120" y2="20" stroke="white" stroke-width="1.5"  transform="rotate(252 120 120)"/>
              <line x1="120" y1="12" x2="120" y2="25" stroke="white" stroke-width="2"    transform="rotate(288 120 120)"/>
              <line x1="120" y1="12" x2="120" y2="20" stroke="white" stroke-width="1.5"  transform="rotate(324 120 120)"/>
            </g>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span class="font-display font-extrabold leading-none g-ge" style="font-size:4.5rem" id="hNum">0</span>
            <span class="text-slate-500 text-sm font-semibold mt-1">out of 100</span>
            <span class="inline-flex items-center gap-1.5 mt-3 text-xs font-bold rounded-full px-3.5 py-1.5"
                  style="background:rgba(16,185,129,.1);color:#10b981;border:1px solid rgba(16,185,129,.22)">
              <span class="relative inline-flex w-1.5 h-1.5">
                <span class="ping absolute inline-flex w-full h-full rounded-full opacity-75" style="background:#10b981"></span>
                <span class="relative inline-flex w-1.5 h-1.5 rounded-full" style="background:#10b981"></span>
              </span>
              Healthy
            </span>
          </div>
        </div>
        <!-- legend -->
        <div class="flex items-center gap-6">
          <span class="flex items-center gap-2 text-xs text-slate-400 font-semibold"><span class="w-2.5 h-2.5 rounded-full" style="background:#f43f5e"></span>0–40 Poor</span>
          <span class="flex items-center gap-2 text-xs text-slate-400 font-semibold"><span class="w-2.5 h-2.5 rounded-full" style="background:#f59e0b"></span>40–70 Moderate</span>
          <span class="flex items-center gap-2 text-xs text-slate-400 font-semibold"><span class="w-2.5 h-2.5 rounded-full" style="background:#10b981"></span>70–100 Healthy</span>
        </div>
      </div>

      <!-- breakdown -->
      <div class="reveal d2">
        <div class="glass card-glow rounded-3xl p-8">
          <h3 class="font-display font-extrabold text-2xl mb-1">Score Breakdown</h3>
          <p class="text-slate-500 text-sm mb-8">How your <strong class="text-white">78-point</strong> score is calculated</p>
          <div class="flex flex-col gap-6 mb-8">

            <div class="hf" data-w="76">
              <div class="flex items-center gap-3 mb-2.5">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ic-g"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>
                <span class="text-sm font-semibold text-slate-300 flex-1">Saving Ratio</span>
                <span class="text-sm font-extrabold" style="color:#10b981">38%</span>
                <span class="text-xs text-slate-500 font-semibold">+23 pts</span>
              </div>
              <div class="h-2 rounded-full overflow-hidden" style="background:rgba(255,255,255,.07)">
                <div class="bar-fill h-full rounded-full" style="background:linear-gradient(90deg,#10b981,#22d3ee)"></div>
              </div>
            </div>

            <div class="hf" data-w="82">
              <div class="flex items-center gap-3 mb-2.5">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ic-c"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9"/><path d="M22 4L12 14.01l-3-3"/></svg></div>
                <span class="text-sm font-semibold text-slate-300 flex-1">Budget Adherence</span>
                <span class="text-sm font-extrabold" style="color:#22d3ee">82%</span>
                <span class="text-xs text-slate-500 font-semibold">+25 pts</span>
              </div>
              <div class="h-2 rounded-full overflow-hidden" style="background:rgba(255,255,255,.07)">
                <div class="bar-fill h-full rounded-full" style="background:linear-gradient(90deg,#22d3ee,#6366f1)"></div>
              </div>
            </div>

            <div class="hf" data-w="65">
              <div class="flex items-center gap-3 mb-2.5">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ic-i"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg></div>
                <span class="text-sm font-semibold text-slate-300 flex-1">Expense Control</span>
                <span class="text-sm font-extrabold" style="color:#6366f1">65%</span>
                <span class="text-xs text-slate-500 font-semibold">+13 pts</span>
              </div>
              <div class="h-2 rounded-full overflow-hidden" style="background:rgba(255,255,255,.07)">
                <div class="bar-fill h-full rounded-full" style="background:linear-gradient(90deg,#6366f1,#8b5cf6)"></div>
              </div>
            </div>

            <div class="hf" data-w="71">
              <div class="flex items-center gap-3 mb-2.5">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ic-a"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
                <span class="text-sm font-semibold text-slate-300 flex-1">Spending Consistency</span>
                <span class="text-sm font-extrabold" style="color:#f59e0b">71%</span>
                <span class="text-xs text-slate-500 font-semibold">+17 pts</span>
              </div>
              <div class="h-2 rounded-full overflow-hidden" style="background:rgba(255,255,255,.07)">
                <div class="bar-fill h-full rounded-full" style="background:linear-gradient(90deg,#f59e0b,#f43f5e)"></div>
              </div>
            </div>
          </div>

          <!-- tip -->
          <div class="flex items-start gap-3 rounded-2xl p-4" style="background:rgba(34,211,238,.06);border:1px solid rgba(34,211,238,.16)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2" class="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p class="text-sm text-slate-400 leading-relaxed"><strong class="text-white">Pro tip:</strong> Reduce food spend by 15% + enable auto-savings → score jumps to <strong style="color:#10b981">85 (Excellent)</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════  FEATURES  ══════════════════ -->
<section id="features" class="py-24">
  <div class="max-w-7xl mx-auto px-6">
    <div class="text-center mb-16 reveal">
      <span class="s-tag mb-5 block">Core Features</span>
      <h2 class="font-display font-extrabold text-4xl lg:text-5xl mb-4">Everything You Need to <span class="g-ic">Take Control</span></h2>
      <p class="text-slate-400 text-lg max-w-xl mx-auto">From tracking to insights — FinSight covers the full financial toolkit.</p>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

      <div class="glass card-glow glass-hover rounded-2xl p-6 reveal">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ic-v">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
        </div>
        <h3 class="font-display font-bold text-lg mb-2">Transaction Tracking</h3>
        <p class="text-slate-400 text-sm leading-relaxed mb-4">Add, edit, delete and categorize every transaction. Full history with date/category/type/amount filters.</p>
        <div class="rounded-xl overflow-hidden h-24 relative">
          <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=200&fit=crop&q=80" class="w-full h-full object-cover" style="opacity:.45" alt=""/>
          <div class="absolute inset-0" style="background:linear-gradient(to top,#05060f,transparent)"></div>
        </div>
      </div>

      <div class="glass card-glow glass-hover rounded-2xl p-6 reveal d1">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ic-c">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02"/><path d="M22 4L12 14.01l-3-3"/></svg>
        </div>
        <h3 class="font-display font-bold text-lg mb-2">Budget Management</h3>
        <p class="text-slate-400 text-sm leading-relaxed mb-4">Set monthly budgets per category. Real-time progress, overspending alerts and warnings at 80% + 100%.</p>
        <div class="flex flex-col gap-2.5">
          <div class="flex items-center gap-3 text-xs text-slate-500 font-semibold"><span class="w-16 text-right">Food</span><div class="flex-1 h-1.5 rounded-full overflow-hidden" style="background:rgba(255,255,255,.06)"><div class="h-full rounded-full" style="width:68%;background:#22d3ee"></div></div><span>68%</span></div>
          <div class="flex items-center gap-3 text-xs text-slate-500 font-semibold"><span class="w-16 text-right">Housing</span><div class="flex-1 h-1.5 rounded-full overflow-hidden" style="background:rgba(255,255,255,.06)"><div class="h-full rounded-full" style="width:85%;background:#f59e0b"></div></div><span style="color:#f59e0b">85%</span></div>
          <div class="flex items-center gap-3 text-xs text-slate-500 font-semibold"><span class="w-16 text-right">Transport</span><div class="flex-1 h-1.5 rounded-full overflow-hidden" style="background:rgba(255,255,255,.06)"><div class="h-full rounded-full" style="width:42%;background:#10b981"></div></div><span>42%</span></div>
        </div>
      </div>

      <div class="glass card-glow glass-hover rounded-2xl p-6 reveal d2">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ic-g">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
        </div>
        <h3 class="font-display font-bold text-lg mb-2">Interactive Charts</h3>
        <p class="text-slate-400 text-sm leading-relaxed mb-4">Monthly bars, donut breakdowns, sparkline trends, and category-wise analytics. All animated.</p>
        <div style="height:60px" id="fsp"></div>
      </div>

      <div class="glass card-glow glass-hover rounded-2xl p-6 reveal">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ic-a">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
        </div>
        <h3 class="font-display font-bold text-lg mb-2">Smart Insights Engine</h3>
        <p class="text-slate-400 text-sm leading-relaxed">Auto-generated insights compare week-over-week, month-over-month, and category-wise spending. No manual analysis needed.</p>
      </div>

      <div class="glass card-glow glass-hover rounded-2xl p-6 reveal d1">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ic-r">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
        </div>
        <h3 class="font-display font-bold text-lg mb-2">Export Reports</h3>
        <p class="text-slate-400 text-sm leading-relaxed">Download your complete financial data as <strong class="text-white">CSV</strong> or <strong class="text-white">PDF</strong>. Perfect for tax filing and financial reviews.</p>
      </div>

      <div class="glass card-glow glass-hover rounded-2xl p-6 reveal d2">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ic-i">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        </div>
        <h3 class="font-display font-bold text-lg mb-2">Bank-Level Security</h3>
        <p class="text-slate-400 text-sm leading-relaxed">Secure login, JWT session management, protected routes, and role-based access control. Your data is yours.</p>
      </div>

    </div>
  </div>
</section>

<!-- ══════════════  BUDGET TRACKING  ══════════════ -->
<section id="budget" class="py-24" style="background:#0a0c1a;border-top:1px solid rgba(148,163,184,.06)">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="reveal">
        <span class="s-tag mb-6 block">Unique Feature</span>
        <h2 class="font-display font-extrabold text-4xl lg:text-5xl mb-6 leading-tight">Budget Tracking<br><span class="g-ic">That Warns You</span></h2>
        <p class="text-slate-400 text-lg leading-relaxed mb-8">Set budgets per category, watch real-time utilization, and get automatic alerts before you overspend — not after.</p>
        <ul class="flex flex-col gap-5">
          <li class="flex items-start gap-4">
            <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style="background:rgba(16,185,129,.12);color:#10b981">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div><strong class="block text-sm font-bold mb-0.5">Category budgets</strong><span class="text-slate-500 text-sm">Food, Housing, Transport, Entertainment — all tracked separately</span></div>
          </li>
          <li class="flex items-start gap-4">
            <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style="background:rgba(16,185,129,.12);color:#10b981">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div><strong class="block text-sm font-bold mb-0.5">Live progress bars</strong><span class="text-slate-500 text-sm">Animated bars update in real-time as you add transactions</span></div>
          </li>
          <li class="flex items-start gap-4">
            <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style="background:rgba(16,185,129,.12);color:#10b981">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div><strong class="block text-sm font-bold mb-0.5">Overspending alerts</strong><span class="text-slate-500 text-sm">Automatic warnings at 80% and 100% budget utilization</span></div>
          </li>
        </ul>
      </div>

      <div class="reveal d2">
        <div class="glass card-glow rounded-3xl p-7">
          <div class="flex items-center justify-between mb-6">
            <h4 class="font-display font-bold text-lg">Monthly Budgets</h4>
            <span class="text-xs text-slate-500 font-semibold">June 2025</span>
          </div>
          <div class="flex flex-col gap-5">
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2.5"><span style="font-size:1.2rem">🍕</span><div><div class="text-sm font-bold">Food</div><div class="text-[11px] text-slate-500">₹3,400 / ₹5,000</div></div></div>
                <span class="text-sm font-bold" style="color:#22d3ee">68%</span>
              </div>
              <div class="h-2.5 rounded-full overflow-hidden" style="background:rgba(255,255,255,.07)"><div class="h-full rounded-full" style="width:68%;background:linear-gradient(90deg,#22d3ee,#6366f1)"></div></div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2.5"><span style="font-size:1.2rem">🏠</span><div><div class="text-sm font-bold">Housing</div><div class="text-[11px] text-slate-500">₹12,750 / ₹15,000</div></div></div>
                <span class="text-sm font-bold" style="color:#f59e0b">85%</span>
              </div>
              <div class="h-2.5 rounded-full overflow-hidden" style="background:rgba(255,255,255,.07)"><div class="h-full rounded-full" style="width:85%;background:linear-gradient(90deg,#f59e0b,#f43f5e)"></div></div>
              <div class="flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold" style="color:#f59e0b">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Approaching limit — ₹2,250 remaining
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2.5"><span style="font-size:1.2rem">🚗</span><div><div class="text-sm font-bold">Transport</div><div class="text-[11px] text-slate-500">₹1,260 / ₹3,000</div></div></div>
                <span class="text-sm font-bold" style="color:#10b981">42%</span>
              </div>
              <div class="h-2.5 rounded-full overflow-hidden" style="background:rgba(255,255,255,.07)"><div class="h-full rounded-full" style="width:42%;background:#10b981"></div></div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2.5"><span style="font-size:1.2rem">🎬</span><div><div class="text-sm font-bold">Entertainment</div><div class="text-[11px] text-slate-500">₹2,200 / ₹2,000</div></div></div>
                <span class="text-sm font-bold" style="color:#f43f5e">110%</span>
              </div>
              <div class="h-2.5 rounded-full overflow-hidden" style="background:rgba(255,255,255,.07)"><div class="h-full rounded-full" style="width:100%;background:#f43f5e"></div></div>
              <div class="flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold" style="color:#f43f5e">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Budget exceeded by ₹200!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════  SMART INSIGHTS FEED  ══════════════ -->
<section id="feed" class="py-24">
  <div class="max-w-7xl mx-auto px-6">
    <div class="text-center mb-14 reveal">
      <span class="s-tag mb-5 block">⭐ Killer Feature #2</span>
      <h2 class="font-display font-extrabold text-4xl lg:text-5xl mb-4">Smart Insights <span class="g-ic">Feed</span></h2>
      <p class="text-slate-400 text-lg max-w-xl mx-auto">Auto-generated cards surface what matters — spending spikes, achievements, budget alerts, forecasts.</p>
    </div>

    <div class="reveal flex items-center justify-between flex-wrap gap-4 mb-8">
      <div class="flex gap-1.5 p-1 rounded-2xl glass">
        <button onclick="switchTab('weekly',this)"  class="feed-tab font-display font-bold text-sm px-5 py-2.5 rounded-xl transition-all text-white" data-tab="weekly"  style="background:linear-gradient(135deg,#6366f1,#22d3ee)">This Week</button>
        <button onclick="switchTab('monthly',this)" class="feed-tab font-display font-bold text-sm px-5 py-2.5 rounded-xl transition-all text-slate-500" data-tab="monthly">This Month</button>
        <button onclick="switchTab('alerts',this)"  class="feed-tab font-display font-bold text-sm px-5 py-2.5 rounded-xl transition-all text-slate-500" data-tab="alerts">🔔 Alerts</button>
      </div>
      <span class="text-sm text-slate-500" id="fcount">Showing <strong style="color:#22d3ee">6</strong> insights</span>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 reveal" id="fgrid"></div>
  </div>
</section>

<!-- ══════════════  TESTIMONIALS  ══════════════ -->
<section class="py-24" style="background:#0a0c1a;border-top:1px solid rgba(148,163,184,.06)">
  <div class="max-w-7xl mx-auto px-6">
    <div class="text-center mb-16 reveal">
      <span class="s-tag mb-5 block">Testimonials</span>
      <h2 class="font-display font-extrabold text-4xl lg:text-5xl mb-4">Loved by <span class="g-ic">Real People</span></h2>
    </div>
    <div class="grid md:grid-cols-3 gap-5">
      <div class="glass card-glow glass-hover rounded-2xl p-7 reveal">
        <div class="text-sm mb-4" style="color:#f59e0b;letter-spacing:.15em">★★★★★</div>
        <p class="text-slate-400 text-sm leading-relaxed italic mb-6">"FinSight completely changed how I manage money. The Health Score is addictive — I compete with myself every month to improve it."</p>
        <div class="flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" class="w-10 h-10 rounded-full object-cover" style="border:2px solid rgba(255,255,255,.1)" alt=""/>
          <div><div class="font-bold text-sm">Sarah K.</div><div class="text-xs text-slate-500">Product Designer</div></div>
        </div>
      </div>
      <div class="card-glow glass-hover rounded-2xl p-7 reveal d1 relative overflow-hidden" style="background:linear-gradient(135deg,rgba(99,102,241,.12),rgba(34,211,238,.07));border:1px solid rgba(99,102,241,.26)">
        <div class="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-25" style="background:#6366f1"></div>
        <div class="text-sm mb-4" style="color:#f59e0b;letter-spacing:.15em">★★★★★</div>
        <p class="text-slate-300 text-sm leading-relaxed italic mb-6">"The Weekly Insights Feed is like having a personal financial advisor. It caught a forgotten subscription and saved me ₹900!"</p>
        <div class="flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" class="w-10 h-10 rounded-full object-cover" style="border:2px solid rgba(99,102,241,.3)" alt=""/>
          <div><div class="font-bold text-sm">Marcus J.</div><div class="text-xs text-slate-500">Software Engineer</div></div>
        </div>
      </div>
      <div class="glass card-glow glass-hover rounded-2xl p-7 reveal d2">
        <div class="text-sm mb-4" style="color:#f59e0b;letter-spacing:.15em">★★★★★</div>
        <p class="text-slate-400 text-sm leading-relaxed italic mb-6">"Score went from 52 to 81 in 3 months. The breakdown shows exactly which area to fix. Genuinely life-changing for finances."</p>
        <div class="flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop" class="w-10 h-10 rounded-full object-cover" style="border:2px solid rgba(255,255,255,.1)" alt=""/>
          <div><div class="font-bold text-sm">Lisa M.</div><div class="text-xs text-slate-500">Marketing Lead</div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════  CTA  ══════════════ -->
<section id="cta" class="py-24">
  <div class="max-w-7xl mx-auto px-6">
    <div class="relative rounded-3xl overflow-hidden p-16 text-center reveal" style="background:linear-gradient(135deg,rgba(99,102,241,.12),rgba(34,211,238,.07));border:1px solid rgba(99,102,241,.22)">
      <div class="glow-pulse absolute rounded-full" style="width:500px;height:500px;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#6366f1,#22d3ee);filter:blur(120px)"></div>
      <div class="relative">
        <h2 class="font-display font-extrabold text-4xl lg:text-5xl mb-5 leading-tight">Ready to Take Control<br>of Your <span class="g-ic">Finances?</span></h2>
        <p class="text-slate-400 text-lg max-w-lg mx-auto mb-10">Join 2,000+ users. See your Health Score in minutes. Free to get started.</p>
        <a href="/register" class="btn-pri px-9 py-4 rounded-2xl text-white text-base inline-flex items-center gap-2">
          Create Free Account
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════  FOOTER  ══════════════ -->
<footer class="py-16" style="background:#0a0c1a;border-top:1px solid rgba(148,163,184,.06)">
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex flex-wrap gap-12 mb-12">
      <div class="flex-1" style="min-width:200px">
        <div class="flex items-center gap-2.5 mb-3">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><rect width="30" height="30" rx="8" fill="url(#fL)"/><path d="M7 21V13l4-4v12H7zm5.5 0V11l4-2v12h-4zm5.5 0V9l4-2v14h-4z" fill="#fff" fill-opacity=".9"/><defs><linearGradient id="fL" x1="0" y1="0" x2="30" y2="30"><stop stop-color="#6366f1"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs></svg>
          <span class="font-display text-xl font-bold">Fin<span class="g-ic">Sight</span></span>
        </div>
        <p class="text-slate-500 text-sm">Financial intelligence, simplified.</p>
      </div>
      <div class="flex gap-14 flex-wrap">
        <div class="flex flex-col gap-3">
          <h5 class="text-xs font-bold uppercase tracking-widest text-slate-300 mb-1">Product</h5>
          <a href="#features"     class="text-sm text-slate-500 hover:text-slate-300 transition-colors">Features</a>
          <a href="#health-score" class="text-sm text-slate-500 hover:text-slate-300 transition-colors">Health Score</a>
          <a href="#dashboard"    class="text-sm text-slate-500 hover:text-slate-300 transition-colors">Dashboard</a>
          <a href="#feed"         class="text-sm text-slate-500 hover:text-slate-300 transition-colors">Insights Feed</a>
        </div>
        <div class="flex flex-col gap-3">
          <h5 class="text-xs font-bold uppercase tracking-widest text-slate-300 mb-1">Company</h5>
          <a href="#" class="text-sm text-slate-500 hover:text-slate-300 transition-colors">About</a>
          <a href="#" class="text-sm text-slate-500 hover:text-slate-300 transition-colors">Careers</a>
          <a href="#" class="text-sm text-slate-500 hover:text-slate-300 transition-colors">Blog</a>
        </div>
        <div class="flex flex-col gap-3">
          <h5 class="text-xs font-bold uppercase tracking-widest text-slate-300 mb-1">Legal</h5>
          <a href="#" class="text-sm text-slate-500 hover:text-slate-300 transition-colors">Privacy</a>
          <a href="#" class="text-sm text-slate-500 hover:text-slate-300 transition-colors">Terms</a>
          <a href="#" class="text-sm text-slate-500 hover:text-slate-300 transition-colors">Security</a>
        </div>
      </div>
    </div>
    <div class="pt-8 flex items-center justify-between flex-wrap gap-4" style="border-top:1px solid rgba(148,163,184,.06)">
      <p class="text-sm text-slate-600">&copy; 2025 FinSight. All rights reserved.</p>
      <p class="text-sm text-slate-600">Built with 💚 for viva &amp; recruiters</p>
    </div>
  </div>
</footer>

<!-- ══════════════════════  SCRIPTS  ══════════════════════ -->
`;

const LANDING_JS = String.raw`
'use strict';
try {
(function(){
'use strict';

/* ── cursor glow ── */
var cg = document.getElementById('cg');
if(cg && matchMedia('(pointer:fine)').matches){
  document.addEventListener('mousemove', function(e){
    cg.style.left = e.clientX + 'px';
    cg.style.top  = e.clientY + 'px';
  });
}

/* ── nav scroll ── */
var nav = document.getElementById('nav');
function onScroll(){ nav.classList.toggle('nav-scroll', window.scrollY > 40); }
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* ── mobile menu ── */
var b1=document.getElementById('b1'), b2=document.getElementById('b2'), b3=document.getElementById('b3');
var mm = document.getElementById('mMenu');
var mo = false;
document.getElementById('burger').addEventListener('click', function(){
  mo = !mo;
  mm.classList.toggle('open', mo);
  document.body.style.overflow = mo ? 'hidden' : '';
  b1.style.transform = mo ? 'translateY(7px) rotate(45deg)' : '';
  b2.style.opacity   = mo ? '0' : '1';
  b3.style.transform = mo ? 'translateY(-7px) rotate(-45deg)' : '';
});
window.closeMM = function(){
  mo = false; mm.classList.remove('open');
  document.body.style.overflow = '';
  b1.style.transform = b3.style.transform = '';
  b2.style.opacity = '1';
};

/* ── smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click', function(e){
    var id = a.getAttribute('href');
    if(id === '#') return;
    var t = document.querySelector(id);
    if(t){ e.preventDefault(); closeMM(); t.scrollIntoView({behavior:'smooth', block:'start'}); }
  });
});

/* ── scroll reveal ── */
function initReveal(){
  var els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('in'); }); return;
  }
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('in'); });
  }, {threshold: 0.08, rootMargin: '0px 0px -50px 0px'});
  els.forEach(function(el){ obs.observe(el); });
}
initReveal();

/* ── counter animation ── */
function countUp(el, target, prefix, comma){
  var dur = 1800, start = performance.now();
  function step(ts){
    var p = Math.min((ts - start) / dur, 1);
    var ease = 1 - Math.pow(1 - p, 3);
    var v = Math.floor(ease * target);
    el.textContent = (prefix||'') + (comma ? v.toLocaleString('en-IN') : v);
    if(p < 1) requestAnimationFrame(step);
    else el.textContent = (prefix||'') + (comma ? target.toLocaleString('en-IN') : target);
  }
  requestAnimationFrame(step);
}
if('IntersectionObserver' in window){
  document.querySelectorAll('[data-count]').forEach(function(el){
    var obs2 = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting && !e.target.dataset.done){
          e.target.dataset.done = '1';
          countUp(e.target, parseInt(e.target.dataset.count, 10),
                  e.target.dataset.prefix || '', e.target.dataset.comma === '1');
          obs2.disconnect();
        }
      });
    }, {threshold: 0.5});
    obs2.observe(el);
  });
}

/* ── dashboard bar chart ── */
var dbc = document.getElementById('dbc');
if(dbc){
  var months = [{l:'Jan',i:72,e:55},{l:'Feb',i:65,e:60},{l:'Mar',i:80,e:50},
                {l:'Apr',i:70,e:65},{l:'May',i:85,e:58},{l:'Jun',i:90,e:62}];
  months.forEach(function(m){
    var g = document.createElement('div');
    g.className = 'flex-1 flex flex-col items-center gap-1.5 h-full justify-end';
    var pair = document.createElement('div');
    pair.className = 'flex items-end gap-1 w-full justify-center flex-1';
    var inc = document.createElement('div');
    inc.className = 'h-bar w-3.5 rounded-t-sm';
    inc.style.cssText = 'height:0%;background:#6366f1';
    var exp = document.createElement('div');
    exp.className = 'h-bar w-3.5 rounded-t-sm';
    exp.style.cssText = 'height:0%;background:rgba(244,63,94,.65)';
    pair.append(inc, exp);
    var lbl = document.createElement('div');
    lbl.className = 'text-[9px] font-bold';
    lbl.style.color = '#475569';
    lbl.textContent = m.l;
    g.append(pair, lbl);
    dbc.appendChild(g);
    setTimeout(function(){ inc.style.height = m.i+'%'; exp.style.height = m.e+'%'; }, 700);
  });
}

/* ── feature sparkline ── */
var fsp = document.getElementById('fsp');
if(fsp){
  var pts = [20,35,28,45,38,55,48,62,54,70,60,75];
  var W=300, H=60, sx=W/(pts.length-1), mx=Math.max.apply(null,pts);
  var line = pts.map(function(v,i){ return (i*sx)+','+(H-(v/mx)*(H-8)); }).join(' ');
  fsp.innerHTML = '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" style="width:100%;height:100%">'
    +'<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">'
    +'<stop offset="0%" stop-color="#10b981" stop-opacity=".25"/>'
    +'<stop offset="100%" stop-color="#10b981" stop-opacity="0"/></linearGradient></defs>'
    +'<polygon points="'+line+' '+W+','+H+' 0,'+H+'" fill="url(#sg)"/>'
    +'<polyline points="'+line+'" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    +'</svg>';
}

/* ── health score animation ── */
var hRing = document.getElementById('hRing');
var hNum  = document.getElementById('hNum');
var CIRC  = 628;

function animateHealth(){
  hRing.style.strokeDasharray = (CIRC * 0.78) + ' ' + CIRC;
  countUp(hNum, 78, '', false);
  document.querySelectorAll('.hf').forEach(function(f, i){
    var fill = f.querySelector('.bar-fill');
    if(fill) setTimeout(function(){ fill.style.width = f.dataset.w + '%'; }, 260 + i * 140);
  });
}
var hSec = document.getElementById('health-score');
if(hSec && 'IntersectionObserver' in window){
  new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting && !e.target.dataset.animated){
        e.target.dataset.animated = '1';
        animateHealth();
      }
    });
  }, {threshold: 0.2}).observe(hSec);
}

/* ── insights feed ── */
var FEED = {
  weekly:[
    {e:'📈',t:'Spending Alert',  c:'w',tx:'You spent <strong>32% more</strong> on food this week vs last week.',ti:'2h ago', a:'View breakdown',im:'-&#8377;1,840',ic:'#f43f5e'},
    {e:'💰',t:'Achievement',    c:'s',tx:'You saved <strong>&#8377;2,000 more</strong> than last week. Keep it up!',ti:'1d ago',a:'See savings',  im:'+&#8377;2,000',ic:'#10b981'},
    {e:'🛍️',t:'Top Category',  c:'i',tx:'Shopping was your <strong>highest expense</strong> this week — &#8377;4,200.',ti:'1d ago',a:'Analyze',  im:'&#8377;4,200',ic:'#94a3b8'},
    {e:'⚠️',t:'Budget Alert',  c:'d',tx:'Entertainment budget exceeded by <strong>&#8377;200</strong>. Immediate action needed.',ti:'2d ago',a:'Adjust', im:'-&#8377;200',ic:'#f43f5e',u:1},
    {e:'💡',t:'Saving Tip',    c:'p',tx:'Reducing dining out by <strong>20%</strong> could save ~<strong>&#8377;1,500/month</strong>.',ti:'3d ago',a:'Apply tip',im:'~&#8377;1.5k/mo',ic:'#10b981'},
    {e:'🔄',t:'Recurring',     c:'i',tx:'Detected <strong>3 active subscriptions</strong> auto-renewing — &#8377;899/month total.',ti:'4d ago',a:'Review', im:'&#8377;899/mo',ic:'#94a3b8'},
  ],
  monthly:[
    {e:'📊',t:'Monthly Report',c:'i',tx:'Total spending this month is <strong>&#8377;31,420</strong> — down 8.3% from last month.',ti:'Jun 1',a:'Full report',im:'-8.3%',ic:'#10b981'},
    {e:'🏆',t:'Personal Best', c:'s',tx:'You achieved a <strong>38% savings rate</strong> — your all-time personal best!',ti:'May 31',a:'Celebrate 🎉',im:'38% saved',ic:'#10b981'},
    {e:'📉',t:'Good Trend',    c:'s',tx:'Transport expenses dropped by <strong>22%</strong> this month. Great progress!',ti:'May 28',a:'See trend',im:'-22%',ic:'#10b981'},
    {e:'🍕',t:'Food Spike',    c:'w',tx:'Food spending hit <strong>&#8377;8,400</strong> — 20% above your 3-month average.',ti:'May 25',a:'Compare',im:'+20%',ic:'#f59e0b'},
  ],
  alerts:[
    {e:'🚨',t:'Urgent',          c:'d',tx:'Housing budget exceeded by <strong>&#8377;3,200</strong>. Immediate review recommended.',ti:'Now',  a:'Fix now',im:'-&#8377;3,200',ic:'#f43f5e',u:1},
    {e:'⚡',t:'Spike Detected',  c:'w',tx:'Unusual spending of <strong>&#8377;5,600 in a single day</strong> on May 24.',ti:'2d ago',a:'Investigate',im:'&#8377;5,600',ic:'#f59e0b'},
    {e:'🔔',t:'Subscription',    c:'i',tx:'<strong>Netflix + Spotify + Adobe</strong> renewals due this week — &#8377;1,899 total.',ti:'3d ago',a:'Manage',im:'&#8377;1,899',ic:'#94a3b8'},
  ],
};

var fgrid  = document.getElementById('fgrid');
var fcount = document.getElementById('fcount');

window.switchTab = function(tab, btn){
  document.querySelectorAll('.feed-tab').forEach(function(t){
    t.classList.remove('text-white'); t.classList.add('text-slate-500');
    t.style.background = '';
  });
  btn.classList.add('text-white'); btn.classList.remove('text-slate-500');
  btn.style.background = 'linear-gradient(135deg,#6366f1,#22d3ee)';
  renderFeed(tab);
};

function renderFeed(tab){
  if(!fgrid) return;
  var items = FEED[tab] || [];
  if(fcount) fcount.innerHTML = 'Showing <strong style="color:#22d3ee">' + items.length + '</strong> insights';
  fgrid.innerHTML = '';
  items.forEach(function(it, i){
    var card = document.createElement('div');
    card.className = 'feed-card glass glass-hover card-glow rounded-2xl p-6 flex flex-col gap-3';
    card.style.animationDelay = (i * 0.07) + 's';
    if(it.u) card.style.background = 'linear-gradient(135deg,rgba(244,63,94,.06),rgba(15,18,36,.72))';
    card.innerHTML =
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem">'
      +'<span style="font-size:1.9rem;line-height:1">' + it.e + '</span>'
      +'<span style="font-size:.65rem;color:#475569;font-weight:600;background:rgba(255,255,255,.04);padding:4px 10px;border-radius:100px;white-space:nowrap">' + it.ti + '</span>'
      +'</div>'
      +'<span class="tag-' + it.c + '" style="display:inline-block;font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:5px 12px;border-radius:100px;width:fit-content">' + it.t + '</span>'
      +'<p style="font-size:.875rem;color:#94a3b8;line-height:1.6;flex:1">' + it.tx + '</p>'
      +'<div style="display:flex;align-items:center;justify-content:space-between;padding-top:.75rem;border-top:1px solid rgba(148,163,184,.07)">'
      +'<span style="font-size:.75rem;font-weight:700;color:#22d3ee;display:flex;align-items:center;gap:4px;cursor:pointer">' + it.a + ' <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>'
      +'<span style="font-size:.75rem;font-weight:700;color:' + it.ic + '">' + it.im + '</span>'
      +'</div>';
    fgrid.appendChild(card);
  });
}
renderFeed('weekly');

/* ── prefers-reduced-motion ── */
if(matchMedia('(prefers-reduced-motion:reduce)').matches){
  document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
}

})();
} catch(e) { console.warn('Landing script error:', e); }
`;
