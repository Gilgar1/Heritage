'use client';

import React, { useState } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar } from '@/components/shared';

const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';
const GREEN = '#2F5D50';

interface ActivityItem {
    id: string;
    type: 'post' | 'member_joined' | 'tree_edit' | 'tribute' | 'album' | 'event' | 'governance' | 'memorial';
    familyId: string;
    familyName: string;
    actorName: string;
    actorAvatar?: string;
    description: string;
    metadata?: string;
    createdAt: string;
}

const TYPE_META: Record<ActivityItem['type'], { icon: string; color: string }> = {
    post: { icon: '📝', color: BROWN },
    member_joined: { icon: '👤', color: GREEN },
    tree_edit: { icon: '🌿', color: BROWN },
    tribute: { icon: '🕯️', color: GOLD },
    album: { icon: '📷', color: '#2563EB' },
    event: { icon: '📅', color: '#7C3AED' },
    governance: { icon: '⚖️', color: '#ED6C02' },
    memorial: { icon: '🕊️', color: GOLD },
};

const SAMPLE_ACTIVITY: ActivityItem[] = [
    { id: 'a1', type: 'tree_edit', familyId: 'f1', familyName: 'Nkeng Family', actorName: 'Ambe Nkeng', description: 'Added Pa Nkeng Fomonyuy to the family tree', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'a2', type: 'tribute', familyId: 'f1', familyName: 'Nkeng Family', actorName: 'Ngono Meka', description: 'Posted a tribute for Pa Nkeng Fomonyuy — pending approval', createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: 'a3', type: 'album', familyId: 'f1', familyName: 'Nkeng Family', actorName: 'Ambe Nkeng', description: 'Created album "Annual Reunion 2024" with 12 photos', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'a4', type: 'member_joined', familyId: 'f1', familyName: 'Nkeng Family', actorName: 'Tabi Eyong', description: 'Joined the Nkeng Family as a new member', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'a5', type: 'governance', familyId: 'f1', familyName: 'Nkeng Family', actorName: 'Ambe Nkeng', description: 'Started a governance vote: "Should we open the tree to public viewing?"', createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: 'a6', type: 'event', familyId: 'f1', familyName: 'Nkeng Family', actorName: 'Ambe Nkeng', description: 'Created event: Annual Nkeng Family Reunion 2026 on July 15', createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
    { id: 'a7', type: 'post', familyId: 'f1', familyName: 'Nkeng Family', actorName: 'Fien Njoya', description: 'Posted a memory: "Remembering grandfather\'s wisdom..."', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: 'a8', type: 'tree_edit', familyId: 'f1', familyName: 'Nkeng Family', actorName: 'Ngono Meka', description: 'Added Ma Nkeng Rose to the family tree and linked as spouse', createdAt: new Date(Date.now() - 6 * 86400000).toISOString() },
    { id: 'a9', type: 'memorial', familyId: 'f1', familyName: 'Nkeng Family', actorName: 'Tabi Eyong', description: 'Lit a candle on the memorial page for Pa Nkeng Fomonyuy', createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: 'a10', type: 'album', familyId: 'f1', familyName: 'Nkeng Family', actorName: 'Ambe Nkeng', description: 'Uploaded 3 photos to "Memorial — Pa Nkeng Fomonyuy"', createdAt: new Date(Date.now() - 8 * 86400000).toISOString() },
];

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString('en-GB');
}

export default function ActivityPage() {
    const { currentUser, families } = useHeritage();
    const [filter, setFilter] = useState<'all' | ActivityItem['type']>('all');

    const filtered = filter === 'all' ? SAMPLE_ACTIVITY : SAMPLE_ACTIVITY.filter(a => a.type === filter);

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold" style={{ color: CHARCOAL }}>Family Activity</h1>
                <p className="text-sm" style={{ color: '#888' }}>Everything happening across your families</p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 mb-5 overflow-x-auto pb-1">
                <button onClick={() => setFilter('all')}
                    className="text-xs px-3 py-1.5 rounded-full border font-semibold flex-shrink-0 transition-all"
                    style={filter === 'all' ? { background: BROWN, color: CREAM, borderColor: BROWN } : { borderColor: 'rgba(92,58,33,0.2)', color: '#888', background: 'transparent' }}>
                    All Activity
                </button>
                {(Object.entries(TYPE_META) as [ActivityItem['type'], any][]).map(([type, meta]) => (
                    <button key={type} onClick={() => setFilter(type)}
                        className="text-xs px-3 py-1.5 rounded-full border font-semibold flex-shrink-0 capitalize transition-all"
                        style={filter === type ? { background: meta.color, color: CREAM, borderColor: meta.color } : { borderColor: 'rgba(92,58,33,0.2)', color: '#888', background: 'transparent' }}>
                        {meta.icon} {type.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Activity feed */}
            <div className="space-y-3">
                {filtered.map((item, i) => {
                    const meta = TYPE_META[item.type];
                    return (
                        <div key={item.id} className="flex items-start gap-4 p-4 rounded-2xl animate-fade-in-up transition-all"
                            style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.08)', animationDelay: `${i * 0.04}s` }}
                            onMouseEnter={e => (e.currentTarget as any).style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'}
                            onMouseLeave={e => (e.currentTarget as any).style.boxShadow = ''}>
                            {/* Icon circle */}
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                style={{ background: `${meta.color}12`, border: `1px solid ${meta.color}25` }}>
                                {meta.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm leading-snug" style={{ color: CHARCOAL }}>
                                        <strong style={{ color: BROWN }}>{item.actorName}</strong> {item.description}
                                    </p>
                                    <span className="text-xs flex-shrink-0" style={{ color: '#bbb' }}>{timeAgo(item.createdAt)}</span>
                                </div>
                                <p className="text-xs mt-1" style={{ color: '#aaa' }}>
                                    <span style={{ color: GOLD }}>👨‍👩‍👧 {item.familyName}</span>
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-sm font-semibold" style={{ color: '#888' }}>No {filter.replace('_', ' ')} activity yet</p>
                </div>
            )}
        </div>
    );
}
