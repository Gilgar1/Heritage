'use client';

import React, { useState } from 'react';
import { useHeritage } from '@/context/HeritageContext';

const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';
const GREEN = '#2F5D50';

const Bar = ({ pct, color }: { pct: number; color: string }) => (
    <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'rgba(92,58,33,0.08)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
);

const StatCard = ({ icon, title, value, sub, color }: { icon: string; title: string; value: string | number; sub?: string; color: string }) => (
    <div className="p-5 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
        <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">{icon}</span>
            <span className="text-2xl font-black" style={{ color }}>{value}</span>
        </div>
        <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>{title}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: '#aaa' }}>{sub}</p>}
    </div>
);

export default function AnalyticsPage() {
    const { users, families, posts } = useHeritage();
    const [period, setPeriod] = useState<'week' | 'month' | 'all'>('month');

    // Derived metrics
    const publicFamilies = families.filter(f => f.privacy === 'public').length;
    const deceasedUsers = users.filter(u => u.isDeceased).length;
    const tributePosts = posts.filter(p => p.type === 'tribute').length;
    const verifiedUsers = users.filter((u: any) => u.verificationStatus === 'verified').length;

    const regionData = [
        { name: 'West', families: 68, members: 312, pct: 28 },
        { name: 'Littoral', families: 45, members: 198, pct: 18 },
        { name: 'Centre', families: 52, members: 241, pct: 21 },
        { name: 'North-West', families: 33, members: 156, pct: 13 },
        { name: 'South-West', families: 29, members: 121, pct: 12 },
        { name: 'Adamawa', families: 17, members: 89, pct: 7 },
        { name: 'Other', families: 14, members: 71, pct: 6 },
    ];

    const tribeData = [
        { name: 'Bamiléké', pct: 34, color: BROWN },
        { name: 'Ewondo', pct: 18, color: GOLD },
        { name: 'Fulani', pct: 14, color: GREEN },
        { name: 'Bassa', pct: 12, color: '#2563EB' },
        { name: 'Bamoun', pct: 10, color: '#7C3AED' },
        { name: 'Ejagham', pct: 7, color: '#C62828' },
        { name: 'Other', pct: 5, color: '#aaa' },
    ];

    const weeklyGrowth = [
        { week: 'W1', users: 12, families: 3 },
        { week: 'W2', users: 28, families: 6 },
        { week: 'W3', users: 47, families: 10 },
        { week: 'W4', users: 89, families: 18 },
        { week: 'W5', users: 134, families: 27 },
        { week: 'W6', users: 198, families: 41 },
        { week: 'W7', users: 267, families: 55 },
        { week: 'W8', users: 312, families: 68 },
    ];

    const maxUsers = Math.max(...weeklyGrowth.map(w => w.users));

    const depthData = [
        { depth: '2 gen', families: 18, pct: 26 },
        { depth: '3 gen', families: 28, pct: 41 },
        { depth: '4 gen', families: 15, pct: 22 },
        { depth: '5+ gen', families: 7, pct: 10 },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: CHARCOAL }}>Heritage Analytics</h1>
                    <p className="text-sm" style={{ color: '#888' }}>Platform insights and family tree metrics</p>
                </div>
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: CREAM, border: '1px solid rgba(92,58,33,0.12)' }}>
                    {(['week', 'month', 'all'] as const).map(p => (
                        <button key={p} onClick={() => setPeriod(p)}
                            className="px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all"
                            style={period === p ? { background: BROWN, color: CREAM } : { color: '#888', background: 'transparent' }}>
                            {p === 'all' ? 'All Time' : `This ${p.charAt(0).toUpperCase() + p.slice(1)}`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard icon="👤" title="Total Users" value={users.length} sub="Active accounts" color={BROWN} />
                <StatCard icon="👨‍👩‍👧" title="Families" value={families.length} sub={`${publicFamilies} public`} color={GOLD} />
                <StatCard icon="📝" title="Total Posts" value={posts.length} sub={`${tributePosts} tributes`} color={GREEN} />
                <StatCard icon="🕊️" title="Memorial Profiles" value={deceasedUsers} sub="Preserved memories" color={GOLD} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <StatCard icon="✅" title="Verified Users" value={verifiedUsers} sub="Identity confirmed" color={GREEN} />
                <StatCard icon="🌍" title="Public Families" value={publicFamilies} sub="Open to discovery" color={BROWN} />
            </div>

            {/* Growth Chart */}
            <div className="p-5 rounded-2xl mb-4" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                <h2 className="font-bold text-sm mb-4" style={{ color: CHARCOAL }}>User Growth (Weekly)</h2>
                <div className="flex items-end gap-2" style={{ height: 120 }}>
                    {weeklyGrowth.map((w, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full rounded-t-lg transition-all relative group" style={{ height: `${(w.users / maxUsers) * 100}px`, background: `linear-gradient(to top, ${BROWN}, ${GOLD})`, minHeight: 4 }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10" style={{ background: BROWN, color: CREAM }}>
                                    {w.users} users
                                </div>
                            </div>
                            <span className="text-[10px]" style={{ color: '#aaa' }}>{w.week}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: '#aaa' }}>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: BROWN }} /> Users</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Regional distribution */}
                <div className="p-5 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                    <h2 className="font-bold text-sm mb-4" style={{ color: CHARCOAL }}>Regional Distribution</h2>
                    <div className="space-y-3">
                        {regionData.map(r => (
                            <div key={r.name}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold" style={{ color: CHARCOAL }}>{r.name}</span>
                                    <div className="flex gap-3 text-xs" style={{ color: '#aaa' }}>
                                        <span>{r.families} families</span>
                                        <span className="font-bold" style={{ color: BROWN }}>{r.pct}%</span>
                                    </div>
                                </div>
                                <Bar pct={r.pct} color={BROWN} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tribe distribution */}
                <div className="p-5 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                    <h2 className="font-bold text-sm mb-4" style={{ color: CHARCOAL }}>Tribe Distribution</h2>
                    <div className="space-y-3">
                        {tribeData.map(t => (
                            <div key={t.name}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold" style={{ color: CHARCOAL }}>{t.name}</span>
                                    <span className="text-xs font-bold" style={{ color: t.color }}>{t.pct}%</span>
                                </div>
                                <Bar pct={t.pct} color={t.color} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tree Depth */}
            <div className="p-5 rounded-2xl mb-4" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                <h2 className="font-bold text-sm mb-4" style={{ color: CHARCOAL }}>Genealogy Depth (Generations Documented)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {depthData.map(d => (
                        <div key={d.depth} className="text-center p-4 rounded-xl" style={{ background: CREAM, border: '1px solid rgba(92,58,33,0.08)' }}>
                            <p className="text-2xl font-black mb-1" style={{ color: BROWN }}>{d.families}</p>
                            <p className="text-xs font-semibold" style={{ color: CHARCOAL }}>{d.depth}</p>
                            <p className="text-[10px] mt-0.5" style={{ color: '#aaa' }}>{d.pct}% of families</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Engagement */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { icon: '🔥', title: 'Active Families (30d)', value: '43', sub: '62% of all families', color: BROWN },
                    { icon: '💬', title: 'Avg. Posts/Family', value: '7.3', sub: 'Posts per month', color: GOLD },
                    { icon: '🌱', title: 'Avg. Tree Nodes', value: '12', sub: 'Members per tree', color: GREEN },
                ].map((s, i) => (
                    <div key={i} className="p-5 rounded-2xl text-center" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                        <span className="text-3xl">{s.icon}</span>
                        <p className="text-3xl font-black mt-2" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-sm font-semibold mt-1" style={{ color: CHARCOAL }}>{s.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#aaa' }}>{s.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
