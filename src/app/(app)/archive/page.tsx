'use client';

import React, { useState } from 'react';
import { useHeritage } from '@/context/HeritageContext';

const BROWN = '#5C3A21'; const GOLD = '#C6A75E'; const CREAM = '#F4EFE6'; const CHARCOAL = '#1F1F1F'; const GREEN = '#2F5D50';

interface BackupEntry { id: string; name: string; type: 'full' | 'tree' | 'media' | 'documents'; size: string; members: number; nodes: number; createdAt: string; status: 'ready' | 'processing' | 'expired'; }

const SAMPLE_BACKUPS: BackupEntry[] = [
    { id: 'bk1', name: 'Nkeng Family — Full Backup', type: 'full', size: '142 MB', members: 24, nodes: 68, createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), status: 'ready' },
    { id: 'bk2', name: 'Nkeng Family — Tree Only', type: 'tree', size: '1.2 MB', members: 24, nodes: 68, createdAt: new Date(Date.now() - 14 * 86400000).toISOString(), status: 'ready' },
    { id: 'bk3', name: 'Nkeng Family — Media Archive', type: 'media', size: '138 MB', members: 24, nodes: 0, createdAt: new Date(Date.now() - 30 * 86400000).toISOString(), status: 'expired' },
];

const TYPE_META = { full: { icon: '📦', label: 'Full Backup', color: BROWN }, tree: { icon: '🌿', label: 'Tree Only', color: GREEN }, media: { icon: '📸', label: 'Media Archive', color: '#2563EB' }, documents: { icon: '📄', label: 'Documents', color: '#7C3AED' } };

function timeAgo(d: string) {
    const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
    return days === 0 ? 'Today' : `${days}d ago`;
}

export default function FamilyArchivePage() {
    const { currentUser, getUserFamilies } = useHeritage();
    const [backups, setBackups] = useState<BackupEntry[]>(SAMPLE_BACKUPS);
    const [generating, setGenerating] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<BackupEntry['type']>('full');
    const [mediaOwnership, setMediaOwnership] = useState([
        { id: 'm1', title: 'Family Portrait 1978', type: 'photo', owner: 'Ambe Nkeng', uploadedBy: 'Ngono Meka', visibility: 'family', approved: true },
        { id: 'm2', title: 'Reunion Video 2024', type: 'video', owner: 'Family', uploadedBy: 'Tabi Eyong', visibility: 'public', approved: true },
        { id: 'm3', title: 'Pa Nkeng — Audio Story', type: 'audio', owner: 'Ambe Nkeng', uploadedBy: 'Ambe Nkeng', visibility: 'family', approved: true },
        { id: 'm4', title: 'Wedding Certificate 1952', type: 'document', owner: 'Nkeng Family', uploadedBy: 'Ambe Nkeng', visibility: 'private', approved: false },
    ]);
    const [mediaFilter, setMediaFilter] = useState('all');
    const [tab, setTab] = useState<'backups' | 'ownership'>('backups');

    const families = currentUser ? getUserFamilies(currentUser.id) : [];

    const handleGenerate = () => {
        if (!currentUser) return;
        const newId = `bk-${Date.now()}`;
        const newBackup: BackupEntry = { id: newId, name: `${families[0]?.name || 'My Family'} — ${TYPE_META[selectedType].label}`, type: selectedType, size: '—', members: families[0]?.memberCount || 0, nodes: 0, createdAt: new Date().toISOString(), status: 'processing' };
        setBackups(prev => [newBackup, ...prev]);
        setGenerating(newId);
        setTimeout(() => {
            setBackups(prev => prev.map(b => b.id === newId ? { ...b, status: 'ready', size: selectedType === 'full' ? '138 MB' : selectedType === 'tree' ? '1.1 MB' : '124 MB' } : b));
            setGenerating(null);
        }, 3000);
    };

    const handleVisibilityChange = (id: string, v: string) => { setMediaOwnership(prev => prev.map(m => m.id === id ? { ...m, visibility: v } : m)); };

    const filteredMedia = mediaFilter === 'all' ? mediaOwnership : mediaOwnership.filter(m => m.type === mediaFilter);

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold" style={{ color: CHARCOAL }}>Family Archive & Data</h1>
                <p className="text-sm" style={{ color: '#888' }}>Manage family backups and media ownership</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: CREAM, border: '1px solid rgba(92,58,33,0.12)' }}>
                {[{ v: 'backups', l: '📦 Family Backups' }, { v: 'ownership', l: '🔑 Media Ownership' }].map(t => (
                    <button key={t.v} onClick={() => setTab(t.v as any)} className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                        style={tab === t.v ? { background: BROWN, color: CREAM } : { color: '#888', background: 'transparent' }}>{t.l}</button>
                ))}
            </div>

            {/* BACKUPS TAB */}
            {tab === 'backups' && (
                <>
                    {/* Generate new backup */}
                    <div className="p-5 rounded-2xl mb-5" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                        <h2 className="font-bold text-sm mb-3" style={{ color: CHARCOAL }}>Generate New Backup</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                            {(Object.entries(TYPE_META) as [BackupEntry['type'], any][]).map(([k, v]) => (
                                <button key={k} onClick={() => setSelectedType(k)} className="p-3 rounded-xl border-2 text-center transition-all"
                                    style={selectedType === k ? { borderColor: v.color, background: `${v.color}08` } : { borderColor: 'rgba(92,58,33,0.15)', background: 'transparent' }}>
                                    <p className="text-2xl">{v.icon}</p>
                                    <p className="text-[10px] font-bold mt-1" style={{ color: CHARCOAL }}>{v.label}</p>
                                </button>
                            ))}
                        </div>
                        {families.length > 0 ? (
                            <button onClick={handleGenerate} disabled={!!generating} className="btn-primary w-full disabled:opacity-60" style={{ background: GOLD, color: CHARCOAL }}>
                                {generating ? '⏳ Generating backup...' : `📦 Generate ${TYPE_META[selectedType].label}`}
                            </button>
                        ) : (
                            <p className="text-sm text-center" style={{ color: '#aaa' }}>Join a family to generate backups</p>
                        )}
                    </div>

                    {/* Backup list */}
                    <div className="space-y-3">
                        {backups.map((b, i) => {
                            const meta = TYPE_META[b.type];
                            return (
                                <div key={b.id} className="flex items-center gap-4 p-4 rounded-2xl animate-fade-in-up" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.08)', animationDelay: `${i * 0.05}s` }}>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${meta.color}10` }}>{meta.icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate" style={{ color: CHARCOAL }}>{b.name}</p>
                                        <p className="text-xs" style={{ color: '#aaa' }}>{b.size} · {b.members} members · {timeAgo(b.createdAt)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${b.status === 'ready' ? 'badge-approved' : b.status === 'processing' ? 'badge-pending' : 'badge-rejected'}`}>{b.status}</span>
                                        {b.status === 'ready' && (
                                            <button className="text-xs px-3 py-1.5 rounded-xl font-bold" style={{ background: `${BROWN}10`, color: BROWN }}>⬇ Download</button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-5 p-4 rounded-xl" style={{ background: `${GOLD}08`, border: '1px solid rgba(198,167,94,0.2)' }}>
                        <p className="text-xs font-bold" style={{ color: CHARCOAL }}>📌 Backup Policy</p>
                        <ul className="text-xs mt-2 space-y-1" style={{ color: '#666' }}>
                            <li>• Full backups are available for 30 days, then archived</li>
                            <li>• Backups include tree data, posts, media, and governance records</li>
                            <li>• All backups are encrypted and only accessible to family Creators</li>
                            <li>• Download your data at any time via Settings → Data</li>
                        </ul>
                    </div>
                </>
            )}

            {/* MEDIA OWNERSHIP TAB */}
            {tab === 'ownership' && (
                <>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {['all', 'photo', 'video', 'audio', 'document'].map(f => (
                            <button key={f} onClick={() => setMediaFilter(f)} className="text-xs px-3 py-1.5 rounded-full border font-semibold capitalize transition-all"
                                style={mediaFilter === f ? { background: BROWN, color: CREAM, borderColor: BROWN } : { borderColor: 'rgba(92,58,33,0.2)', color: '#888', background: 'transparent' }}>{f}</button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {filteredMedia.map((m, i) => (
                            <div key={m.id} className="p-4 rounded-2xl animate-fade-in-up" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.08)', animationDelay: `${i * 0.05}s` }}>
                                <div className="flex items-start gap-3 flex-wrap">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-bold text-sm" style={{ color: CHARCOAL }}>{m.title}</p>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold capitalize" style={{ background: `${BROWN}10`, color: BROWN }}>{m.type}</span>
                                            {!m.approved && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${GOLD}20`, color: '#966e2e' }}>Pending</span>}
                                        </div>
                                        <p className="text-xs mt-1" style={{ color: '#aaa' }}>Owner: <strong style={{ color: CHARCOAL }}>{m.owner}</strong> · Uploaded by: {m.uploadedBy}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-xs" style={{ color: '#aaa' }}>Visibility:</span>
                                        <select value={m.visibility} onChange={e => handleVisibilityChange(m.id, e.target.value)} className="text-xs border rounded-lg px-2 py-1 font-semibold" style={{ borderColor: 'rgba(92,58,33,0.2)', color: BROWN }}>
                                            <option value="public">🌍 Public</option>
                                            <option value="family">👨‍👩‍👧 Family</option>
                                            <option value="friends">👥 Friends</option>
                                            <option value="private">🔒 Private</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 p-4 rounded-xl" style={{ background: `${GREEN}08`, border: '1px solid rgba(47,93,80,0.2)' }}>
                        <p className="text-xs font-bold" style={{ color: CHARCOAL }}>🔑 Media Ownership Rules</p>
                        <ul className="text-xs mt-2 space-y-1" style={{ color: '#666' }}>
                            <li>• The uploader retains original ownership of all media</li>
                            <li>• Family creators can change visibility settings for family content</li>
                            <li>• Media of deceased members defaults to family-only visibility</li>
                            <li>• You can request removal of your media at any time via Settings</li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
