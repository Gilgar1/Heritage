'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ─── Inline icons ────────────────────────────────────────────────────────────
const TreeIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V8" />
        <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        <path d="M12 2a5 5 0 0 1 5 5v1H7V7a5 5 0 0 1 5-5z" />
    </svg>
);
const UsersIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
const ShieldIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);
const CandleIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="8" width="8" height="14" rx="1" />
        <path d="M12 2c1 1 2 3 0 6" />
    </svg>
);
const MapIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
);
const BookIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);
const ArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);
const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const MenuIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);
const XIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// ─── Colors ────────────────────────────────────────────────────────────────
const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';
const GREEN = '#2F5D50';
const CREAM_CARD = '#fcfbfa';

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC HEADER
// ─────────────────────────────────────────────────────────────────────────────
function PublicHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                background: scrolled ? BROWN : 'transparent',
                boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.15)' : 'none',
            }}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg"
                        style={{ background: GOLD, color: CHARCOAL }}>H</div>
                    <span className="text-xl font-bold" style={{ color: CREAM }}>Heritage</span>
                </div>

                {/* Desktop links */}
                <nav className="hidden md:flex items-center gap-8">
                    {['Features', 'How it Works', 'About'].map(label => (
                        <a key={label} href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm font-medium transition-colors"
                            style={{ color: 'rgba(244,239,230,0.8)' }}
                            onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(244,239,230,0.8)')}
                        >
                            {label}
                        </a>
                    ))}
                </nav>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login"
                        className="text-sm font-semibold transition-colors px-4 py-2 rounded-xl"
                        style={{ color: CREAM, background: 'rgba(255,255,255,0.1)' }}>
                        Sign In
                    </Link>
                    <Link href="/register"
                        className="text-sm font-bold px-5 py-2 rounded-xl transition-all"
                        style={{ background: GOLD, color: CHARCOAL }}>
                        Get Started
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl"
                    style={{ color: CREAM }}>
                    {mobileOpen ? <XIcon /> : <MenuIcon />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div style={{ background: BROWN, borderTop: '1px solid rgba(255,255,255,0.1)' }} className="md:hidden">
                    <nav className="px-6 py-4 flex flex-col gap-3">
                        {['Features', 'How it Works', 'About'].map(label => (
                            <a key={label} href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
                                onClick={() => setMobileOpen(false)}
                                className="text-sm font-medium py-2" style={{ color: 'rgba(244,239,230,0.9)' }}>
                                {label}
                            </a>
                        ))}
                        <div className="pt-2 flex gap-3">
                            <Link href="/login" className="flex-1 text-center text-sm py-2.5 rounded-xl font-semibold"
                                style={{ background: 'rgba(255,255,255,0.1)', color: CREAM }}>Sign In</Link>
                            <Link href="/register" className="flex-1 text-center text-sm py-2.5 rounded-xl font-bold"
                                style={{ background: GOLD, color: CHARCOAL }}>Get Started</Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────────────────────
function Hero() {
    return (
        <section
            className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 relative overflow-hidden"
            style={{ background: `linear-gradient(160deg, ${BROWN} 0%, #422917 40%, #2d1b0e 100%)` }}
        >
            {/* Decorative background pattern */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                <div className="absolute top-10 left-10 w-64 h-64 rounded-full" style={{ border: `2px solid ${GOLD}` }} />
                <div className="absolute top-32 left-32 w-48 h-48 rounded-full" style={{ border: `1px solid ${GOLD}` }} />
                <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full" style={{ border: `2px solid ${GOLD}` }} />
                <div className="absolute -bottom-20 right-20 w-52 h-52 rounded-full" style={{ border: `1px solid ${GOLD}` }} />
            </div>

            {/* Floating tree nodes decoration */}
            <div className="absolute inset-0 pointer-events-none select-none">
                {[
                    { top: '20%', left: '5%', size: 56, opacity: 0.12 },
                    { top: '55%', left: '3%', size: 40, opacity: 0.08 },
                    { top: '25%', right: '6%', size: 48, opacity: 0.1 },
                    { top: '65%', right: '4%', size: 60, opacity: 0.12 },
                ].map((style, i) => (
                    <div key={i}
                        className="absolute rounded-2xl flex items-center justify-center"
                        style={{
                            top: style.top, left: (style as any).left, right: (style as any).right,
                            width: style.size, height: style.size,
                            background: `rgba(198,167,94,${style.opacity})`,
                            border: `1px solid rgba(198,167,94,0.2)`,
                        }}>
                        <span style={{ fontSize: Math.round(style.size * 0.45), opacity: 0.7 }}>🌿</span>
                    </div>
                ))}
            </div>

            {/* Badge */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
                    style={{ background: 'rgba(198,167,94,0.15)', color: GOLD, border: `1px solid rgba(198,167,94,0.3)` }}>
                    🌍 &nbsp;Built for Cameroon — Preserving African Identity
                </span>
            </div>

            {/* Main heading */}
            <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight max-w-5xl animate-fade-in-up"
                style={{ color: CREAM, animationDelay: '0.2s' }}
            >
                Your Family&apos;s Story<br />
                <span style={{ color: GOLD }}>Deserves to Live</span><br />
                Forever
            </h1>

            <p
                className="mt-6 text-base sm:text-lg max-w-2xl leading-relaxed animate-fade-in-up"
                style={{ color: 'rgba(244,239,230,0.75)', animationDelay: '0.35s' }}
            >
                Heritage is Cameroon&apos;s digital platform for preserving lineage, documenting identity,
                and building structured family trees — one generation at a time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <Link href="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all"
                    style={{ background: GOLD, color: CHARCOAL, boxShadow: '0 8px 24px rgba(198,167,94,0.35)' }}>
                    Start Your Family Tree <ArrowRight />
                </Link>
                <Link href="/login"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base transition-all"
                    style={{ background: 'rgba(255,255,255,0.1)', color: CREAM, border: '1px solid rgba(255,255,255,0.2)' }}>
                    Sign In
                </Link>
            </div>

            {/* Stats Row */}
            <div
                className="grid grid-cols-3 gap-8 mt-16 pt-10 border-t max-w-lg w-full animate-fade-in-up"
                style={{ borderColor: 'rgba(198,167,94,0.2)', animationDelay: '0.65s' }}
            >
                {[
                    { number: '300+', label: 'Families' },
                    { number: '10', label: 'Regions' },
                    { number: '🕊️', label: 'Ancestors Preserved' },
                ].map(stat => (
                    <div key={stat.label} className="text-center">
                        <p className="text-2xl sm:text-3xl font-black" style={{ color: GOLD }}>{stat.number}</p>
                        <p className="text-xs mt-1" style={{ color: 'rgba(244,239,230,0.6)' }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Scroll hint */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in"
                style={{ color: 'rgba(244,239,230,0.4)', animationDelay: '1s' }}>
                <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
                <div className="w-px h-8 opacity-40" style={{ background: CREAM }} />
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURES SECTION
// ─────────────────────────────────────────────────────────────────────────────
const features = [
    {
        icon: <TreeIcon />,
        title: 'Interactive Family Trees',
        desc: 'Build multi-generation family trees with parent-child, spousal, and sibling relationships. Support for multiple marriages and half-siblings.',
        color: BROWN,
    },
    {
        icon: <UsersIcon />,
        title: 'Role-Based Family Governance',
        desc: 'Each family has a Creator, Editors, and Members — with contextual permissions. A user can be Creator in one family and Member in another.',
        color: GREEN,
    },
    {
        icon: <CandleIcon />,
        title: 'Deceased Member Profiles',
        desc: 'Document loved ones who have passed with birth & death dates, tributes, and a special protected profile — only editable by authorised family members.',
        color: '#a98d4d',
    },
    {
        icon: <ShieldIcon />,
        title: 'Tribute Approval System',
        desc: 'Tribute posts for deceased members must be approved by the Family Creator or assigned Editor before going public — ensuring dignity and respect.',
        color: BROWN,
    },
    {
        icon: <MapIcon />,
        title: 'Cameroon Identity Fields',
        desc: "Profiles capture Region, Tribe, Village, Native Language, and Traditional Title — preserving Cameroon's rich cultural diversity in one place.",
        color: GREEN,
    },
    {
        icon: <BookIcon />,
        title: 'Privacy-First Platform',
        desc: 'Login required to view anything. Users control visibility of birth dates, friend lists, and connections. Families can be Public, Private, or Unlisted.',
        color: '#a98d4d',
    },
];

function Features() {
    return (
        <section id="features" style={{ background: CREAM }} className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                        style={{ background: 'rgba(92,58,33,0.1)', color: BROWN }}>
                        Features
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black" style={{ color: CHARCOAL }}>
                        Everything You Need to<br />
                        <span style={{ color: BROWN }}>Preserve Your Heritage</span>
                    </h2>
                    <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#666666' }}>
                        Built specifically for Cameroonian families — with the cultural depth and governance tools your lineage deserves.
                    </p>
                </div>

                {/* Feature cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="p-7 rounded-2xl transition-all group"
                            style={{
                                background: CREAM_CARD,
                                border: '1px solid rgba(92,58,33,0.08)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                            }}
                        >
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                                style={{ background: `${f.color}12`, color: f.color }}>
                                {f.icon}
                            </div>
                            <h3 className="text-lg font-bold mb-2" style={{ color: CHARCOAL }}>{f.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: '#555555' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────
const steps = [
    { num: '01', title: 'Create Your Account', desc: 'Register with your identity — tribe, region, village, native language. It takes two minutes.' },
    { num: '02', title: 'Start or Join a Family', desc: 'Create your family or request to join one. Set privacy levels and begin documenting your lineage.' },
    { num: '03', title: 'Build the Family Tree', desc: 'Add parents, children, spouses, and siblings. Mark deceased members and document their stories.' },
    { num: '04', title: 'Share & Preserve', desc: 'Write posts, post tributes, connect with relatives, and protect your family\'s memory for generations.' },
];

function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="py-24 px-6"
            style={{ background: `linear-gradient(135deg, ${BROWN}08 0%, ${CREAM} 100%)` }}
        >
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                        style={{ background: 'rgba(92,58,33,0.1)', color: BROWN }}>
                        How It Works
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black" style={{ color: CHARCOAL }}>
                        Four Steps to
                        <span style={{ color: BROWN }}> Preserve Your Legacy</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {steps.map((step, i) => (
                        <div key={i}
                            className="flex gap-5 p-6 rounded-2xl"
                            style={{ background: CREAM_CARD, border: '1px solid rgba(92,58,33,0.08)' }}>
                            <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl"
                                style={{ background: BROWN, color: GOLD }}>
                                {step.num}
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-1.5" style={{ color: CHARCOAL }}>{step.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MVP MISSION SECTION
// ─────────────────────────────────────────────────────────────────────────────
function Mission() {
    return (
        <section id="about" className="py-24 px-6" style={{ background: CREAM }}>
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Text */}
                    <div>
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
                            style={{ background: `${GREEN}15`, color: GREEN }}>
                            Our Mission
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-6" style={{ color: CHARCOAL }}>
                            Addressing the African
                            <span style={{ color: BROWN }}> Identity Crisis</span>
                        </h2>
                        <p className="text-base leading-relaxed mb-4" style={{ color: '#555555' }}>
                            Across Cameroon and Africa at large, family stories are lost between generations.
                            Elders pass on without their wisdom being recorded. Children grow up disconnected
                            from their roots.
                        </p>
                        <p className="text-base leading-relaxed mb-8" style={{ color: '#555555' }}>
                            Heritage begins with memory preservation — the foundation upon which language,
                            history, and mindset will be built. This is Layer One.
                        </p>
                        <ul className="space-y-3">
                            {[
                                'Structured family trees with relational accuracy',
                                'Deceased member profiles with dignity & tribute governance',
                                'Cross-family connections across all 10 regions',
                                'Privacy-first — your data, your control',
                                'Built to scale to 300+ concurrent families',
                            ].map(item => (
                                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: '#444444' }}>
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                                        style={{ background: `${GREEN}15`, color: GREEN }}>
                                        <CheckIcon />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: Visual card stack */}
                    <div className="relative flex items-center justify-center min-h-[380px]">
                        {/* Background card */}
                        <div className="absolute" style={{
                            width: 280, height: 340, background: `${BROWN}12`,
                            border: `1px solid ${BROWN}20`, borderRadius: 24,
                            transform: 'rotate(-6deg) translate(-10px, 10px)',
                        }} />
                        {/* Middle card */}
                        <div className="absolute" style={{
                            width: 280, height: 340, background: `${GOLD}10`,
                            border: `1px solid ${GOLD}30`, borderRadius: 24,
                            transform: 'rotate(3deg)',
                        }} />
                        {/* Front card */}
                        <div className="relative z-10 p-7 rounded-3xl shadow-xl" style={{
                            width: 280, background: CREAM_CARD,
                            border: `1px solid rgba(92,58,33,0.12)`,
                        }}>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl"
                                    style={{ background: BROWN, color: GOLD }}>N</div>
                                <div>
                                    <p className="font-bold text-sm" style={{ color: CHARCOAL }}>The Nkeng Dynasty</p>
                                    <p className="text-xs" style={{ color: '#888' }}>Bandjoun · West Region</p>
                                </div>
                            </div>
                            {/* Mini tree nodes */}
                            <div className="space-y-2 mb-5">
                                {[
                                    { name: 'Pa Nkeng Fomonyuy', role: 'Patriarch', deceased: true },
                                    { name: 'Ambe Nkeng', role: 'Creator', deceased: false },
                                    { name: 'Nkeng Sandrine', role: 'Member', deceased: false },
                                ].map(p => (
                                    <div key={p.name} className="flex items-center gap-2.5 p-2.5 rounded-xl"
                                        style={{ background: `rgba(92,58,33,0.05)` }}>
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                            style={{ background: p.deceased ? '#e5dac9' : BROWN, color: p.deceased ? '#a98d4d' : CREAM }}>
                                            {p.name[0]}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold" style={{ color: CHARCOAL }}>{p.name}</p>
                                            <p className="text-[10px]" style={{ color: '#888' }}>{p.role} {p.deceased ? '· 🕊️' : ''}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs" style={{ color: '#888' }}>4 members · Public</span>
                                <span className="text-xs px-2 py-1 rounded-full font-semibold"
                                    style={{ background: `${GREEN}15`, color: GREEN }}>Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS / QUOTES
// ─────────────────────────────────────────────────────────────────────────────
const quotes = [
    {
        quote: "My grandfather's story was slipping away. Heritage gave us a place to make it permanent for our grandchildren.",
        name: 'Ambe Nkeng',
        role: 'Family Creator · Bamiléké, West Region',
    },
    {
        quote: "Being able to govern tribute posts means only respectful, approved content honours our deceased. That matters deeply.",
        name: 'Tabi Eyong',
        role: 'Family Creator · Ejagham, South-West Region',
    },
    {
        quote: "I found cousins I never knew I had — from Douala to Yaoundé — all on one platform built for us.",
        name: 'Fien Njoya',
        role: 'Member · Bamoun, West Region',
    },
];

function Testimonials() {
    return (
        <section className="py-24 px-6"
            style={{ background: `linear-gradient(160deg, ${BROWN} 0%, #2d1e10 100%)` }}>
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-black" style={{ color: CREAM }}>
                        Families Are <span style={{ color: GOLD }}>Already Preserving</span> Their Legacy
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quotes.map((q, i) => (
                        <div key={i} className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(198,167,94,0.15)' }}>
                            <p className="text-3xl mb-3" style={{ color: GOLD }}>&ldquo;</p>
                            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(244,239,230,0.85)' }}>{q.quote}</p>
                            <div>
                                <p className="font-bold text-sm" style={{ color: CREAM }}>{q.name}</p>
                                <p className="text-xs mt-0.5" style={{ color: 'rgba(198,167,94,0.7)' }}>{q.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// CTA SECTION
// ─────────────────────────────────────────────────────────────────────────────
function CTA() {
    return (
        <section className="py-28 px-6 text-center" style={{ background: CREAM }}>
            <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 font-black text-4xl shadow-lg"
                    style={{ background: BROWN, color: GOLD }}>H</div>
                <h2 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: CHARCOAL }}>
                    Your Ancestors Deserve to Be<br />
                    <span style={{ color: BROWN }}>Remembered</span>
                </h2>
                <p className="text-base mb-10" style={{ color: '#666666' }}>
                    Join Heritage today. Build your family tree. Preserve your identity. Connect with your roots.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register"
                        className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold text-base transition-all"
                        style={{ background: BROWN, color: CREAM, boxShadow: '0 8px 24px rgba(92,58,33,0.3)' }}>
                        Begin Your Heritage <ArrowRight />
                    </Link>
                    <Link href="/login"
                        className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-semibold text-base border transition-all"
                        style={{ color: BROWN, borderColor: `${BROWN}40`, background: 'transparent' }}>
                        I Already Have an Account
                    </Link>
                </div>
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer() {
    return (
        <footer style={{ background: BROWN }} className="py-10 px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold"
                        style={{ background: GOLD, color: CHARCOAL }}>H</div>
                    <span className="font-bold" style={{ color: CREAM }}>Heritage</span>
                </div>
                <p className="text-xs text-center" style={{ color: 'rgba(244,239,230,0.5)' }}>
                    © 2026 Heritage. Built for Cameroon — Preserving African Identity, one family at a time.
                </p>
                <div className="flex gap-4">
                    <Link href="/login" className="text-xs font-medium transition-colors" style={{ color: 'rgba(244,239,230,0.6)' }}>Sign In</Link>
                    <Link href="/register" className="text-xs font-medium" style={{ color: GOLD }}>Get Started</Link>
                </div>
            </div>
        </footer>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE ASSEMBLY
// ─────────────────────────────────────────────────────────────────────────────
export default function LandingPage() {
    return (
        <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <PublicHeader />
            <Hero />
            <Features />
            <HowItWorks />
            <Mission />
            <Testimonials />
            <CTA />
            <Footer />
        </div>
    );
}
