'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar } from '@/components/shared';

const BROWN = '#5C3A21'; const GOLD = '#C6A75E'; const CREAM = '#F4EFE6'; const CHARCOAL = '#1F1F1F'; const GREEN = '#2F5D50';

// Simplified Cameroon 10 regions map layout (grid-based heat map)
const REGIONS = [
    { name: 'Far North', shortName: 'FAR N', members: 42, families: 9, col: 4, row: 0, color: '#C62828' },
    { name: 'Adamawa', shortName: 'ADAM.', members: 89, families: 17, col: 4, row: 1, color: '#ED6C02' },
    { name: 'North', shortName: 'NORTH', members: 61, families: 11, col: 4, row: 2, color: '#ED6C02' },
    { name: 'North-West', shortName: 'N-W', members: 156, families: 33, col: 2, row: 2, color: GOLD },
    { name: 'West', shortName: 'WEST', members: 312, families: 68, col: 3, row: 3, color: BROWN },
    { name: 'Littoral', shortName: 'LIT.', members: 198, families: 45, col: 3, row: 4, color: '#966e2e' },
    { name: 'Centre', shortName: 'CTR.', members: 241, families: 52, col: 4, row: 4, color: '#966e2e' },
    { name: 'South-West', shortName: 'S-W', members: 121, families: 29, col: 2, row: 4, color: GOLD },
    { name: 'East', shortName: 'EAST', members: 71, families: 14, col: 5, row: 4, color: '#aaa' },
    { name: 'South', shortName: 'SOUTH', members: 89, families: 18, col: 4, row: 5, color: '#888' },
];

const TRIBES = [
    { name: 'Bamiléké', region: 'West', members: 134, icon: '🏔️', tradition: 'Funerary dances, bronze artwork, chiefdomy system' },
    { name: 'Ewondo', region: 'Centre', members: 89, icon: '🌿', tradition: 'Oral literature, royal court, palm wine culture' },
    { name: 'Bassa', region: 'Littoral', members: 67, icon: '🎭', tradition: 'Initiation rites, traditional medicine, weaving' },
    { name: 'Bamoun', region: 'West', members: 54, icon: '📜', tradition: 'Own script (Shu-Mom), Islamic art, sultanate' },
    { name: 'Fulani', region: 'Adamawa', members: 43, icon: '🐄', tradition: 'Cattle herding, Islamic scholarship, poetry' },
    { name: 'Ejagham', region: 'South-West', members: 38, icon: '🎨', tradition: 'Nsibidi writing, masquerades, leopard society' },
];

const SHARED_ANCESTORS = [
    { name: 'Pa Nkeng Fomonyuy', tribe: 'Bamiléké', sharedWith: ['Ambe Nkeng', 'Ngono Meka', 'Tabi Eyong'], generation: 0, year: '~1895', region: 'West' },
    { name: 'Chief Ewondo Mbida', tribe: 'Ewondo', sharedWith: ['Fien Njoya', 'Claude Mvondo'], generation: 0, year: '~1880', region: 'Centre' },
];

const SUGGESTIONS = [
    { id: 's1', name: 'Mbe Nkeng', reason: 'Same tribe: Bamiléké', mutual: 3, tribe: 'Bamiléké', village: 'Bandjoun', avatar: '' },
    { id: 's2', name: 'Chantale Ndongo', reason: 'Same region: West', mutual: 1, tribe: 'Bamiléké', village: 'Bafoussam', avatar: '' },
    { id: 's3', name: 'Joseph Biloa', reason: 'Shared ancestor tree', mutual: 5, tribe: 'Ewondo', village: 'Yaoundé', avatar: '' },
    { id: 's4', name: 'Astride Foye', reason: 'Same village: Bandjoun', mutual: 2, tribe: 'Bamiléké', village: 'Bandjoun', avatar: '' },
    { id: 's5', name: 'Patrick Nkemba', reason: 'Family connection detected', mutual: 4, tribe: 'Bamiléké', village: 'Dschang', avatar: '' },
];

export default function DiscoverPage() {
    const { users, families, sendFriendRequest } = useHeritage();
    const [tab, setTab] = useState<'map' | 'ancestors' | 'relatives' | 'tribes'>('map');
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [requested, setRequested] = useState<Set<string>>(new Set());

    const selectedReg = REGIONS.find(r => r.name === selectedRegion);

    const maxMembers = Math.max(...REGIONS.map(r => r.members));

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold" style={{ color: CHARCOAL }}>Discover Heritage</h1>
                <p className="text-sm" style={{ color: '#888' }}>Explore Cameroon's regions, tribes, shared ancestors, and relatives</p>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1 p-1 rounded-2xl mb-5" style={{ background: CREAM, border: '1px solid rgba(92,58,33,0.12)' }}>
                {[{ v: 'map', l: '🗺️ Regional Map' }, { v: 'ancestors', l: '🌳 Shared Ancestors' }, { v: 'relatives', l: '👥 Suggested Relatives' }, { v: 'tribes', l: '🏛️ Tribes' }].map(t => (
                    <button key={t.v} onClick={() => setTab(t.v as any)} className="flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all"
                        style={tab === t.v ? { background: BROWN, color: CREAM } : { color: '#888', background: 'transparent' }}>{t.l}</button>
                ))}
            </div>

            {/* REGIONAL MAP */}
            {tab === 'map' && (
                <div className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Map grid */}
                        <div className="md:col-span-2">
                            <div className="p-5 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                                <h2 className="font-bold text-sm mb-4" style={{ color: CHARCOAL }}>Heritage Members by Region</h2>
                                <div className="grid grid-cols-6 gap-1.5 mb-4" style={{ gridTemplateRows: 'repeat(6, 56px)' }}>
                                    {REGIONS.map(r => {
                                        const pct = r.members / maxMembers;
                                        const isHovered = hoveredRegion === r.name;
                                        const isSelected = selectedRegion === r.name;
                                        return (
                                            <div key={r.name}
                                                style={{ gridColumn: r.col + 1, gridRow: r.row + 1 }}
                                                className="relative cursor-pointer transition-all"
                                                onMouseEnter={() => setHoveredRegion(r.name)}
                                                onMouseLeave={() => setHoveredRegion(null)}
                                                onClick={() => setSelectedRegion(selectedRegion === r.name ? null : r.name)}>
                                                <div className="w-full h-full rounded-xl flex flex-col items-center justify-center transition-all"
                                                    style={{
                                                        background: `${r.color}${Math.round(20 + pct * 80).toString(16).padStart(2, '0')}`,
                                                        border: isSelected ? `2px solid ${r.color}` : isHovered ? `1px solid ${r.color}` : '1px solid rgba(92,58,33,0.08)',
                                                        transform: isHovered || isSelected ? 'scale(1.05)' : 'scale(1)',
                                                        boxShadow: isSelected ? `0 6px 20px ${r.color}30` : '',
                                                    }}>
                                                    <span className="text-[9px] font-black text-center leading-none" style={{ color: CHARCOAL }}>{r.shortName}</span>
                                                    <span className="text-[9px] font-bold mt-0.5" style={{ color: r.color }}>{r.members}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* Legend */}
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-10 h-3 rounded" style={{ background: `${BROWN}80` }} />
                                        <span className="text-[10px]" style={{ color: '#888' }}>High density</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-10 h-3 rounded" style={{ background: `${BROWN}20` }} />
                                        <span className="text-[10px]" style={{ color: '#888' }}>Low density</span>
                                    </div>
                                    <span className="text-[10px] ml-auto" style={{ color: '#aaa' }}>Click a region to filter</span>
                                </div>
                            </div>
                        </div>

                        {/* Region detail / list */}
                        <div>
                            {selectedReg ? (
                                <div className="p-5 rounded-2xl animate-fade-in" style={{ background: '#fcfbfa', border: `1px solid ${selectedReg.color}30` }}>
                                    <button onClick={() => setSelectedRegion(null)} className="text-xs mb-3" style={{ color: '#aaa' }}>← Back</button>
                                    <h3 className="font-black text-lg" style={{ color: CHARCOAL }}>{selectedReg.name} Region</h3>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="p-3 rounded-xl text-center" style={{ background: CREAM }}>
                                            <p className="text-2xl font-black" style={{ color: selectedReg.color }}>{selectedReg.members}</p>
                                            <p className="text-xs" style={{ color: '#888' }}>Members</p>
                                        </div>
                                        <div className="p-3 rounded-xl text-center" style={{ background: CREAM }}>
                                            <p className="text-2xl font-black" style={{ color: selectedReg.color }}>{selectedReg.families}</p>
                                            <p className="text-xs" style={{ color: '#888' }}>Families</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs font-bold mb-2" style={{ color: CHARCOAL }}>Members from this region</p>
                                        {users.filter(u => u.region === selectedReg.name || Math.random() > 0.7).slice(0, 5).map(u => (
                                            <Link key={u.id} href={`/profile/${u.id}`} className="flex items-center gap-2 py-2 border-b last:border-0" style={{ borderColor: 'rgba(92,58,33,0.06)' }}>
                                                <Avatar name={u.fullName} size="xs" />
                                                <div><p className="text-xs font-semibold" style={{ color: CHARCOAL }}>{u.fullName}</p>
                                                    <p className="text-[10px]" style={{ color: '#aaa' }}>{u.tribe}</p></div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {REGIONS.sort((a, b) => b.members - a.members).slice(0, 6).map(r => (
                                        <button key={r.name} onClick={() => setSelectedRegion(r.name)}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                                            style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.08)' }}
                                            onMouseEnter={e => (e.currentTarget as any).style.background = CREAM}
                                            onMouseLeave={e => (e.currentTarget as any).style.background = '#fcfbfa'}>
                                            <div className="w-3 h-8 rounded-full flex-shrink-0" style={{ background: r.color }} />
                                            <div className="flex-1">
                                                <p className="text-sm font-bold" style={{ color: CHARCOAL }}>{r.name}</p>
                                                <p className="text-xs" style={{ color: '#aaa' }}>{r.families} families</p>
                                            </div>
                                            <span className="text-sm font-black" style={{ color: r.color }}>{r.members}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* SHARED ANCESTORS */}
            {tab === 'ancestors' && (
                <div className="animate-fade-in space-y-4">
                    <div className="p-4 rounded-xl" style={{ background: `${GOLD}10`, border: '1px solid rgba(198,167,94,0.2)' }}>
                        <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>🌳 Shared ancestors are identified when multiple Heritage members share a common ancestor in their family trees. This feature helps you discover unknown relatives.</p>
                    </div>
                    {SHARED_ANCESTORS.map((a, i) => (
                        <div key={i} className="p-5 rounded-2xl animate-fade-in-up" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)', animationDelay: `${i * 0.08}s` }}>
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: `${BROWN}12` }}>👴</div>
                                <div className="flex-1">
                                    <h3 className="font-black text-base" style={{ color: CHARCOAL }}>{a.name}</h3>
                                    <p className="text-xs" style={{ color: '#aaa' }}>{a.tribe} · {a.region} · Born ~{a.year}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs font-semibold" style={{ color: BROWN }}>Shared by:</span>
                                        <div className="flex flex-wrap gap-1">
                                            {a.sharedWith.map(name => (
                                                <span key={name} className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${BROWN}10`, color: BROWN }}>{name}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-8">
                                <div className="text-center">
                                    <div className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center text-lg" style={{ background: `${BROWN}12` }}>👴</div>
                                    <p className="text-[10px] font-bold" style={{ color: CHARCOAL }}>{a.name}</p>
                                    <p className="text-[10px]" style={{ color: '#aaa' }}>Gen 0</p>
                                </div>
                                <div className="flex-1 flex items-center">
                                    <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: GOLD }} />
                                    <span className="text-lg mx-2">🌿</span>
                                    <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: GOLD }} />
                                </div>
                                <div className="flex gap-4">
                                    {a.sharedWith.slice(0, 2).map(name => (
                                        <div key={name} className="text-center">
                                            <div className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center text-base font-bold" style={{ background: GOLD, color: CHARCOAL }}>{name[0]}</div>
                                            <p className="text-[10px] font-bold" style={{ color: CHARCOAL }}>{name.split(' ')[0]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="p-5 rounded-2xl text-center" style={{ background: CREAM, border: '1px solid rgba(92,58,33,0.08)' }}>
                        <p className="text-4xl mb-2">🔍</p>
                        <p className="font-semibold text-sm" style={{ color: '#888' }}>More shared ancestors discovered as users add tree data</p>
                    </div>
                </div>
            )}

            {/* SUGGESTED RELATIVES */}
            {tab === 'relatives' && (
                <div className="animate-fade-in space-y-4">
                    <div className="p-4 rounded-xl mb-2" style={{ background: `${GREEN}10`, border: '1px solid rgba(47,93,80,0.2)' }}>
                        <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>👥 These suggestions are based on shared tribe, village, region, and detected family tree overlaps.</p>
                    </div>
                    {SUGGESTIONS.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-4 p-4 rounded-2xl animate-fade-in-up" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)', animationDelay: `${i * 0.06}s` }}>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0" style={{ background: BROWN, color: CREAM }}>{s.name[0]}</div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm" style={{ color: CHARCOAL }}>{s.name}</p>
                                <p className="text-xs" style={{ color: '#aaa' }}>{s.tribe} · {s.village}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${GOLD}15`, color: '#966e2e' }}>{s.reason}</span>
                                    <span className="text-[10px]" style={{ color: '#bbb' }}>{s.mutual} mutual connections</span>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                {requested.has(s.id) ? (
                                    <span className="text-xs px-3 py-1.5 rounded-xl font-bold" style={{ color: GREEN, background: `${GREEN}10` }}>✓ Sent</span>
                                ) : (
                                    <button onClick={() => { setRequested(prev => new Set(prev).add(s.id)); sendFriendRequest(s.id); }}
                                        className="text-xs px-3 py-1.5 rounded-xl font-bold" style={{ background: BROWN, color: CREAM }}>
                                        + Connect
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TRIBES */}
            {tab === 'tribes' && (
                <div className="animate-fade-in space-y-4">
                    {TRIBES.map((t, i) => (
                        <div key={t.name} className="p-5 rounded-2xl animate-fade-in-up" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)', animationDelay: `${i * 0.06}s` }}>
                            <div className="flex items-start gap-4">
                                <span className="text-4xl">{t.icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <h3 className="font-black text-base" style={{ color: CHARCOAL }}>{t.name}</h3>
                                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${BROWN}10`, color: BROWN }}>{t.members} Heritage members</span>
                                    </div>
                                    <p className="text-xs mt-0.5" style={{ color: '#888' }}>Region: {t.region}</p>
                                    <p className="text-xs mt-2 leading-relaxed" style={{ color: '#555' }}><strong>Traditions:</strong> {t.tradition}</p>
                                    <div className="mt-3">
                                        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(92,58,33,0.08)' }}>
                                            <div className="h-full rounded-full" style={{ width: `${(t.members / 134) * 100}%`, background: `linear-gradient(to right, ${BROWN}, ${GOLD})` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
