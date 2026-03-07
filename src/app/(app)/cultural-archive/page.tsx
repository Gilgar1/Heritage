'use client';

import React, { useState } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar, Modal, Icons } from '@/components/shared';

const BROWN = '#5C3A21'; const GOLD = '#C6A75E'; const CREAM = '#F4EFE6'; const CHARCOAL = '#1F1F1F'; const GREEN = '#2F5D50';

type MediaType = 'oral_history' | 'document' | 'photo' | 'video';
interface ArchiveItem { id: string; type: MediaType; title: string; description: string; language: string; tribe?: string; person?: string; event?: string; year?: string; tags: string[]; format: string; size: string; uploadedBy: string; uploadedAt: string; approved: boolean; }

const LANGUAGES = ['English', 'French', 'Ghomálá\'', 'Ewondo', 'Fulfulde', 'Bassa', 'Bamoun', 'Fe\'fe\'', 'Nso', 'Bulu'];
const TRIBES = ['Bamiléké', 'Ewondo', 'Bassa', 'Bamoun', 'Fulani', 'Ejagham', 'Yemba'];

const SAMPLE_ARCHIVE: ArchiveItem[] = [
    { id: 'a1', type: 'oral_history', title: 'Pa Nkeng speaks about the founding of Bandjoun', description: 'Recorded in 1987. Pa Nkeng Fomonyuy recounts the founding stories of the Bandjoun chiefdom and early Bamiléké migrations.', language: 'Ghomálá\'', tribe: 'Bamiléké', person: 'Pa Nkeng Fomonyuy', year: '1987', tags: ['founding', 'chiefdom', 'migration', 'history'], format: 'MP3', size: '14.2 MB', uploadedBy: 'Ambe Nkeng', uploadedAt: new Date(Date.now() - 7 * 86400000).toISOString(), approved: true },
    { id: 'a2', type: 'document', title: 'Birth Certificate — Ambe Pierre Nkeng (1954)', description: 'Original birth certificate of Ambe Pierre Nkeng, issued by the colonial administration of West Cameroon.', language: 'French', year: '1954', tags: ['birth', 'certificate', 'colonial', 'official'], format: 'PDF', size: '2.1 MB', uploadedBy: 'Ambe Nkeng', uploadedAt: new Date(Date.now() - 14 * 86400000).toISOString(), approved: true },
    { id: 'a3', type: 'oral_history', title: 'Ma Ngono recites the Ewondo marriage song', description: 'A traditional Ewondo wedding ceremony song preserved by Ma Ngono Meka, one of the last keepers of this tradition.', language: 'Ewondo', tribe: 'Ewondo', event: 'wedding', year: '2001', tags: ['song', 'wedding', 'tradition', 'ewondo'], format: 'WAV', size: '31.7 MB', uploadedBy: 'Ngono Meka', uploadedAt: new Date(Date.now() - 21 * 86400000).toISOString(), approved: true },
    { id: 'a4', type: 'document', title: 'Land Registration — Nkeng Family Farm (1961)', description: 'Original land registration document for the Nkeng family farmland in the Bandjoun region.', language: 'French', year: '1961', tags: ['land', 'registration', 'property', 'colonial'], format: 'PDF', size: '1.8 MB', uploadedBy: 'Ambe Nkeng', uploadedAt: new Date(Date.now() - 30 * 86400000).toISOString(), approved: false },
    { id: 'a5', type: 'video', title: 'Traditional Bamiléké funerary rites (1994)', description: 'Rare video recording of traditional funeral rites practiced by the Bamiléké, documenting customs at risk of disappearing.', language: 'Ghomálá\'', tribe: 'Bamiléké', event: 'funeral', year: '1994', tags: ['funeral', 'ritual', 'tradition', 'preservation'], format: 'MP4', size: '284 MB', uploadedBy: 'Tabi Eyong', uploadedAt: new Date(Date.now() - 45 * 86400000).toISOString(), approved: true },
];

const TYPE_META: Record<MediaType, { icon: string; color: string; label: string }> = {
    oral_history: { icon: '🎙️', color: BROWN, label: 'Oral History' },
    document: { icon: '📄', color: '#2563EB', label: 'Document' },
    photo: { icon: '📸', color: GREEN, label: 'Photo' },
    video: { icon: '🎬', color: '#7C3AED', label: 'Video' },
};

export default function CulturalArchivePage() {
    const { currentUser } = useHeritage();
    const [items, setItems] = useState<ArchiveItem[]>(SAMPLE_ARCHIVE);
    const [uploadModal, setUploadModal] = useState(false);
    const [viewItem, setViewItem] = useState<ArchiveItem | null>(null);
    const [filter, setFilter] = useState<'all' | MediaType>('all');
    const [filterLang, setFilterLang] = useState('');
    const [filterTribe, setFilterTribe] = useState('');
    const [uploadForm, setUploadForm] = useState({ type: 'oral_history' as MediaType, title: '', description: '', language: 'English', tribe: '', person: '', event: '', year: '', tags: '', languageTag: '' });

    const filtered = items.filter(i => {
        if (filter !== 'all' && i.type !== filter) return false;
        if (filterLang && i.language !== filterLang) return false;
        if (filterTribe && i.tribe !== filterTribe) return false;
        return true;
    });

    const handleUpload = () => {
        if (!uploadForm.title.trim() || !currentUser) return;
        const newItem: ArchiveItem = { id: `a-${Date.now()}`, type: uploadForm.type, title: uploadForm.title, description: uploadForm.description, language: uploadForm.language, tribe: uploadForm.tribe || undefined, person: uploadForm.person || undefined, event: uploadForm.event || undefined, year: uploadForm.year || undefined, tags: uploadForm.tags.split(',').map(t => t.trim()).filter(Boolean), format: uploadForm.type === 'oral_history' ? 'MP3' : uploadForm.type === 'document' ? 'PDF' : uploadForm.type === 'video' ? 'MP4' : 'JPG', size: '—', uploadedBy: currentUser.fullName, uploadedAt: new Date().toISOString(), approved: false };
        setItems(prev => [newItem, ...prev]);
        setUploadModal(false);
        setUploadForm({ type: 'oral_history', title: '', description: '', language: 'English', tribe: '', person: '', event: '', year: '', tags: '', languageTag: '' });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: CHARCOAL }}>Cultural Archive</h1>
                    <p className="text-sm" style={{ color: '#888' }}>Oral histories, documents, and cultural recordings</p>
                </div>
                <button onClick={() => setUploadModal(true)} className="btn-primary" style={{ background: GOLD, color: CHARCOAL }}>+ Upload Record</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[{ icon: '🎙️', label: 'Oral Histories', value: items.filter(i => i.type === 'oral_history').length },
                { icon: '📄', label: 'Documents', value: items.filter(i => i.type === 'document').length },
                { icon: '🎬', label: 'Videos', value: items.filter(i => i.type === 'video').length },
                { icon: '🌍', label: 'Languages', value: new Set(items.map(i => i.language)).size }
                ].map((s, i) => (
                    <div key={i} className="p-4 rounded-2xl text-center" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.08)' }}>
                        <p className="text-2xl">{s.icon}</p>
                        <p className="text-xl font-black mt-1" style={{ color: BROWN }}>{s.value}</p>
                        <p className="text-xs" style={{ color: '#888' }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
                <div className="flex gap-1">
                    {(['all', 'oral_history', 'document', 'video', 'photo'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className="text-xs px-3 py-1.5 rounded-full border font-semibold capitalize whitespace-nowrap transition-all"
                            style={filter === f ? { background: BROWN, color: CREAM, borderColor: BROWN } : { borderColor: 'rgba(92,58,33,0.2)', color: '#888', background: 'transparent' }}>
                            {f === 'all' ? 'All Types' : TYPE_META[f].icon + ' ' + TYPE_META[f].label}
                        </button>
                    ))}
                </div>
                <select value={filterLang} onChange={e => setFilterLang(e.target.value)} className="text-xs border rounded-xl px-3 py-1.5 font-semibold" style={{ borderColor: 'rgba(92,58,33,0.2)', color: '#888' }}>
                    <option value="">🌐 All Languages</option>{LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <select value={filterTribe} onChange={e => setFilterTribe(e.target.value)} className="text-xs border rounded-xl px-3 py-1.5 font-semibold" style={{ borderColor: 'rgba(92,58,33,0.2)', color: '#888' }}>
                    <option value="">🏛️ All Tribes</option>{TRIBES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {/* Items list */}
            <div className="space-y-3">
                {filtered.map((item, i) => {
                    const meta = TYPE_META[item.type];
                    return (
                        <div key={item.id} className="flex gap-4 p-5 rounded-2xl cursor-pointer transition-all animate-fade-in-up"
                            style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.08)', animationDelay: `${i * 0.05}s` }}
                            onClick={() => setViewItem(item)}
                            onMouseEnter={e => (e.currentTarget as any).style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'}
                            onMouseLeave={e => (e.currentTarget as any).style.boxShadow = ''}>
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: `${meta.color}10` }}>{meta.icon}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-sm" style={{ color: CHARCOAL }}>{item.title}</h3>
                                            {!item.approved && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${GOLD}20`, color: '#966e2e' }}>Pending Approval</span>}
                                        </div>
                                        <p className="text-xs mt-1 line-clamp-2" style={{ color: '#666' }}>{item.description}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xs font-semibold" style={{ color: meta.color }}>{item.format}</p>
                                        <p className="text-xs" style={{ color: '#aaa' }}>{item.size}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {item.language && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${GREEN}10`, color: GREEN }}>🌐 {item.language}</span>}
                                    {item.tribe && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${BROWN}10`, color: BROWN }}>🏛️ {item.tribe}</span>}
                                    {item.year && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.04)', color: '#888' }}>📅 {item.year}</span>}
                                    {item.tags.slice(0, 3).map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: CREAM, color: '#888' }}>#{t}</span>)}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && <div className="text-center py-16"><p className="text-5xl mb-3">📚</p><p className="text-sm" style={{ color: '#888' }}>No archive items match your filters</p></div>}
            </div>

            {/* View Item Modal */}
            <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.title || ''}>
                {viewItem && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${TYPE_META[viewItem.type].color}10` }}>{TYPE_META[viewItem.type].icon}</div>
                            <div>
                                <p className="font-bold" style={{ color: CHARCOAL }}>{viewItem.title}</p>
                                <p className="text-xs" style={{ color: '#aaa' }}>Uploaded by {viewItem.uploadedBy} · {viewItem.format} · {viewItem.size}</p>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{viewItem.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {viewItem.language && <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: `${GREEN}10`, color: GREEN }}>🌐 {viewItem.language}</span>}
                            {viewItem.tribe && <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: `${BROWN}10`, color: BROWN }}>🏛️ {viewItem.tribe}</span>}
                            {viewItem.person && <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: `${GOLD}10`, color: '#966e2e' }}>👤 {viewItem.person}</span>}
                            {viewItem.year && <span className="text-xs px-3 py-1 rounded-full" style={{ background: CREAM }}>📅 {viewItem.year}</span>}
                        </div>
                        {viewItem.type === 'oral_history' && (
                            <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: CREAM }}>
                                <button className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: BROWN, color: CREAM }}>▶</button>
                                <div className="flex-1">
                                    <div className="h-2 rounded-full" style={{ background: 'rgba(92,58,33,0.15)' }}>
                                        <div className="h-2 w-[30%] rounded-full" style={{ background: BROWN }} />
                                    </div>
                                    <p className="text-xs mt-1" style={{ color: '#aaa' }}>Demo player — {viewItem.format} · {viewItem.size}</p>
                                </div>
                            </div>
                        )}
                        {(viewItem.type === 'document') && (
                            <div className="rounded-xl p-4 text-center" style={{ background: CREAM }}>
                                <p className="text-4xl mb-2">📄</p>
                                <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>{viewItem.format} Document</p>
                                <button className="btn-primary mt-3 text-sm" style={{ background: BROWN, color: CREAM }}>⬇ Download (Demo)</button>
                            </div>
                        )}
                        {viewItem.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {viewItem.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: CREAM, color: '#888' }}>#{t}</span>)}
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Upload Modal */}
            <Modal isOpen={uploadModal} onClose={() => setUploadModal(false)} title="Upload Cultural Record">
                <div className="space-y-4">
                    <div>
                        <label className="input-label">Record Type *</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            {Object.entries(TYPE_META).map(([k, v]) => (
                                <button key={k} onClick={() => setUploadForm(f => ({ ...f, type: k as MediaType }))}
                                    className="p-3 rounded-xl border-2 text-left transition-all"
                                    style={uploadForm.type === k ? { borderColor: BROWN, background: `${BROWN}05` } : { borderColor: 'rgba(92,58,33,0.15)', background: 'transparent' }}>
                                    <span className="text-xl">{v.icon}</span>
                                    <p className="text-xs font-bold mt-1" style={{ color: CHARCOAL }}>{v.label}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div><label className="input-label">Title *</label><input type="text" value={uploadForm.title} onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))} className="input-field" placeholder="e.g. Pa Nkeng's founding story" /></div>
                    <div><label className="input-label">Description</label><textarea value={uploadForm.description} onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))} className="input-field min-h-[70px] resize-none" placeholder="Describe what this record contains..." /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="input-label">Language</label>
                            <select value={uploadForm.language} onChange={e => setUploadForm(f => ({ ...f, language: e.target.value }))} className="input-field">
                                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        <div><label className="input-label">Tribe / Ethnic Group</label>
                            <select value={uploadForm.tribe} onChange={e => setUploadForm(f => ({ ...f, tribe: e.target.value }))} className="input-field">
                                <option value="">Any</option>{TRIBES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="input-label">Person Featured</label><input type="text" value={uploadForm.person} onChange={e => setUploadForm(f => ({ ...f, person: e.target.value }))} className="input-field" placeholder="e.g. Pa Nkeng" /></div>
                        <div><label className="input-label">Year</label><input type="text" value={uploadForm.year} onChange={e => setUploadForm(f => ({ ...f, year: e.target.value }))} className="input-field" placeholder="e.g. 1987" /></div>
                    </div>
                    <div><label className="input-label">Language Tag (for multilingual content)</label>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {['en', 'fr', 'gh', 'ew', 'ff'].map(l => (
                                <button key={l} onClick={() => setUploadForm(f => ({ ...f, languageTag: l }))}
                                    className="text-xs px-2.5 py-1 rounded-full border font-bold transition-all"
                                    style={uploadForm.languageTag === l ? { background: GREEN, color: 'white', borderColor: GREEN } : { borderColor: 'rgba(92,58,33,0.2)', color: '#888' }}>
                                    {l === 'en' ? '🇬🇧 EN' : l === 'fr' ? '🇫🇷 FR' : l === 'gh' ? "Ghomálá'" : l === 'ew' ? 'Ewondo' : "Fulfulde"}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div><label className="input-label">Tags (comma-separated)</label><input type="text" value={uploadForm.tags} onChange={e => setUploadForm(f => ({ ...f, tags: e.target.value }))} className="input-field" placeholder="e.g. founding, migration, history" /></div>
                    <div className="p-3 rounded-xl text-center" style={{ background: CREAM, border: '2px dashed rgba(92,58,33,0.2)' }}>
                        <p className="text-2xl mb-1">☁️</p>
                        <p className="text-xs font-semibold" style={{ color: BROWN }}>Click to select file (demo)</p>
                        <p className="text-[10px] mt-0.5" style={{ color: '#aaa' }}>MP3, WAV, MP4, PDF, JPG, PNG supported</p>
                    </div>
                    <button onClick={handleUpload} disabled={!uploadForm.title.trim()} className="btn-primary w-full disabled:opacity-40" style={{ background: GOLD, color: CHARCOAL }}>Submit for Approval</button>
                </div>
            </Modal>
        </div>
    );
}
