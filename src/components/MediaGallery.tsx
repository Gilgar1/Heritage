'use client';

import React, { useState } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { Icons, Modal } from '@/components/shared';

const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';
const GREEN = '#2F5D50';

type MediaType = 'photo' | 'video' | 'audio' | 'document';
type MediaEvent = 'birth' | 'marriage' | 'funeral' | 'reunion' | 'graduation' | 'celebration' | 'other';
type MediaVisibility = 'public' | 'family' | 'friends' | 'private';

interface MediaItem {
    id: string; uploaderId: string; uploaderName: string;
    caption?: string; type: MediaType; event?: MediaEvent;
    visibility: MediaVisibility; url?: string; emoji?: string;
    downloadAllowed: boolean; createdAt: string;
}

interface Props {
    contextType: 'family' | 'user';
    contextId: string;
    contextName: string;
}

const EVENT_LABELS: Record<MediaEvent, string> = {
    birth: '🎉 Birth', marriage: '💍 Wedding', funeral: '🕊️ Funeral',
    reunion: '👨‍👩‍👧 Reunion', graduation: '🎓 Graduation',
    celebration: '🥂 Celebration', other: '📸 General',
};

const DEMO_MEDIA: MediaItem[] = [
    { id: 'm1', uploaderId: 'user-1', uploaderName: 'Ambe Nkeng', caption: 'Pa Nkeng Fomonyuy portrait, circa 1978', type: 'photo', event: 'other', visibility: 'family', emoji: '👴', downloadAllowed: true, createdAt: '2023-01-10' },
    { id: 'm2', uploaderId: 'user-1', uploaderName: 'Ambe Nkeng', caption: 'Family reunion in Bandjoun, 1985', type: 'photo', event: 'reunion', visibility: 'family', emoji: '👨‍👩‍👧‍👦', downloadAllowed: true, createdAt: '2023-02-15' },
    { id: 'm3', uploaderId: 'user-2', uploaderName: 'Ngono Meka', caption: 'Village ceremony, June 2010', type: 'photo', event: 'celebration', visibility: 'public', emoji: '🎭', downloadAllowed: false, createdAt: '2023-03-02' },
    { id: 'm4', uploaderId: 'user-1', uploaderName: 'Ambe Nkeng', caption: "Grandfather's oral history recording", type: 'audio', event: 'other', visibility: 'family', emoji: '🎙️', downloadAllowed: true, createdAt: '2023-04-20' },
    { id: 'm5', uploaderId: 'user-3', uploaderName: 'Tabi Eyong', caption: 'Wedding ceremony, 2019', type: 'video', event: 'marriage', visibility: 'family', emoji: '🎬', downloadAllowed: false, createdAt: '2023-05-10' },
];

export function MediaGallery({ contextType, contextId, contextName }: Props) {
    const { currentUser } = useHeritage();
    const [media, setMedia] = useState<MediaItem[]>(DEMO_MEDIA);
    const [filter, setFilter] = useState<'all' | MediaType>('all');
    const [eventFilter, setEventFilter] = useState<'all' | MediaEvent>('all');
    const [uploadModal, setUploadModal] = useState(false);
    const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
    const [form, setForm] = useState<{
        caption: string; type: MediaType; event: MediaEvent; visibility: MediaVisibility; downloadAllowed: boolean;
    }>({
        caption: '', type: 'photo', event: 'other', visibility: 'family', downloadAllowed: true,
    });

    const filtered = media.filter(m => {
        if (filter !== 'all' && m.type !== filter) return false;
        if (eventFilter !== 'all' && m.event !== eventFilter) return false;
        return true;
    });

    const PHOTO_EMOJIS = ['📸', '🖼️', '🎨', '🏔️', '🌿', '🏡'];

    const handleUpload = () => {
        if (!form.caption.trim() || !currentUser) return;
        const item: MediaItem = {
            id: `m-${Date.now()}`,
            uploaderId: currentUser.id,
            uploaderName: currentUser.fullName,
            emoji: PHOTO_EMOJIS[Math.floor(Math.random() * PHOTO_EMOJIS.length)],
            ...form,
            createdAt: new Date().toISOString().split('T')[0],
        };
        setMedia(prev => [item, ...prev]);
        setForm({ caption: '', type: 'photo', event: 'other', visibility: 'family', downloadAllowed: true });
        setUploadModal(false);
    };

    return (
        <div>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 mb-5 items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                    {(['all', 'photo', 'video', 'audio', 'document'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className="text-xs px-3 py-1.5 rounded-full font-semibold border transition-all capitalize"
                            style={filter === f
                                ? { background: BROWN, color: CREAM, borderColor: BROWN }
                                : { background: 'transparent', color: '#888', borderColor: 'rgba(92,58,33,0.2)' }}>
                            {f === 'all' ? 'All Media' : { photo: '📷 Photos', video: '🎬 Videos', audio: '🎙️ Audio', document: '📄 Docs' }[f]}
                        </button>
                    ))}
                </div>
                <button onClick={() => setUploadModal(true)}
                    className="btn-primary btn-sm" style={{ background: GOLD, color: CHARCOAL }}>
                    + Upload
                </button>
            </div>

            {/* Event filter */}
            <div className="flex gap-2 flex-wrap mb-5 overflow-x-auto pb-1">
                <button onClick={() => setEventFilter('all')}
                    className="text-xs px-3 py-1 rounded-full border flex-shrink-0 transition-all"
                    style={eventFilter === 'all'
                        ? { background: `${GOLD}20`, color: BROWN, borderColor: `${GOLD}40` }
                        : { background: 'transparent', color: '#aaa', borderColor: 'rgba(92,58,33,0.15)' }}>
                    All Events
                </button>
                {(Object.entries(EVENT_LABELS) as [MediaEvent, string][]).map(([key, label]) => (
                    <button key={key} onClick={() => setEventFilter(key)}
                        className="text-xs px-3 py-1 rounded-full border flex-shrink-0 transition-all"
                        style={eventFilter === key
                            ? { background: `${GOLD}20`, color: BROWN, borderColor: `${GOLD}40` }
                            : { background: 'transparent', color: '#aaa', borderColor: 'rgba(92,58,33,0.15)' }}>
                        {label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filtered.map(item => (
                        <div key={item.id}
                            onClick={() => setLightboxItem(item)}
                            className="aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer group transition-all relative overflow-hidden"
                            style={{ background: `${GOLD}08`, border: '1px solid rgba(92,58,33,0.1)' }}
                            onMouseEnter={e => { (e.currentTarget as any).style.transform = 'scale(1.03)'; (e.currentTarget as any).style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; }}
                            onMouseLeave={e => { (e.currentTarget as any).style.transform = ''; (e.currentTarget as any).style.boxShadow = ''; }}>
                            <span className="text-5xl">{item.emoji || '📸'}</span>
                            {/* Hover overlay */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-2"
                                style={{ background: 'linear-gradient(to top, rgba(92,58,33,0.8), transparent)' }}>
                                <p className="text-xs font-medium text-white text-center line-clamp-2">{item.caption}</p>
                            </div>
                            {/* Type badge */}
                            <div className="absolute top-2 right-2">
                                <span className="text-xs px-1.5 py-0.5 rounded-md"
                                    style={{ background: 'rgba(255,255,255,0.85)', color: BROWN, fontWeight: 600 }}>
                                    {item.type === 'photo' ? '📷' : item.type === 'video' ? '🎬' : item.type === 'audio' ? '🎙️' : '📄'}
                                </span>
                            </div>
                            {/* Privacy badge */}
                            <div className="absolute top-2 left-2">
                                <span className="text-[10px] px-1.5 py-0.5 rounded-md"
                                    style={{ background: 'rgba(255,255,255,0.85)', color: '#888' }}>
                                    {item.visibility === 'public' ? '🌍' : item.visibility === 'family' ? '👨‍👩‍👧' : item.visibility === 'friends' ? '👥' : '🔒'}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Upload tile */}
                    <div onClick={() => setUploadModal(true)}
                        className="aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all"
                        style={{ borderColor: 'rgba(92,58,33,0.2)' }}
                        onMouseEnter={e => (e.currentTarget as any).style.borderColor = BROWN}
                        onMouseLeave={e => (e.currentTarget as any).style.borderColor = 'rgba(92,58,33,0.2)'}>
                        <span className="text-3xl mb-1">+</span>
                        <p className="text-xs font-semibold" style={{ color: '#aaa' }}>Add Media</p>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-4xl mb-3">📷</p>
                    <p className="text-sm font-semibold" style={{ color: '#888' }}>No media in this category</p>
                </div>
            )}

            {/* Lightbox */}
            <Modal isOpen={!!lightboxItem} onClose={() => setLightboxItem(null)} title={lightboxItem?.caption || 'Media'}>
                {lightboxItem && (
                    <div className="space-y-4">
                        <div className="aspect-video rounded-xl flex items-center justify-center"
                            style={{ background: `${GOLD}10` }}>
                            <span className="text-8xl">{lightboxItem.emoji || '📸'}</span>
                        </div>
                        <div>
                            <p className="font-semibold text-sm" style={{ color: CHARCOAL }}>{lightboxItem.caption}</p>
                            <div className="flex gap-3 mt-1 text-xs" style={{ color: '#888' }}>
                                <span>👤 {lightboxItem.uploaderName}</span>
                                <span>📅 {lightboxItem.createdAt}</span>
                                {lightboxItem.event && <span>{EVENT_LABELS[lightboxItem.event]}</span>}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {lightboxItem.downloadAllowed && (
                                <button className="btn-secondary btn-sm flex-1">⬇️ Download</button>
                            )}
                            <button className="btn-secondary btn-sm flex-1">🔗 Share</button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Upload Modal */}
            <Modal isOpen={uploadModal} onClose={() => setUploadModal(false)} title="Upload Media">
                <div className="space-y-4">
                    {/* Dropzone */}
                    <div className="border-2 border-dashed rounded-2xl p-8 text-center"
                        style={{ borderColor: 'rgba(92,58,33,0.25)' }}>
                        <p className="text-4xl mb-2">📎</p>
                        <p className="text-sm font-semibold" style={{ color: BROWN }}>Click to select or drag & drop</p>
                        <p className="text-xs mt-1" style={{ color: '#aaa' }}>Photos · Videos · Audio · Documents · Max 50MB</p>
                    </div>
                    <div>
                        <label className="input-label">Caption *</label>
                        <input type="text" value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                            className="input-field" placeholder="Describe this media..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="input-label">Type</label>
                            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as MediaType }))} className="input-field">
                                <option value="photo">📷 Photo</option>
                                <option value="video">🎬 Video</option>
                                <option value="audio">🎙️ Audio</option>
                                <option value="document">📄 Document</option>
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Event</label>
                            <select value={form.event} onChange={e => setForm(f => ({ ...f, event: e.target.value as MediaEvent }))} className="input-field">
                                {Object.entries(EVENT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="input-label">Visibility</label>
                        <select value={form.visibility} onChange={e => setForm(f => ({ ...f, visibility: e.target.value as MediaVisibility }))} className="input-field">
                            <option value="public">🌍 Public</option>
                            <option value="family">👨‍👩‍👧 Family Only</option>
                            <option value="friends">👥 Friends Only</option>
                            <option value="private">🔒 Private</option>
                        </select>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={form.downloadAllowed}
                            onChange={e => setForm(f => ({ ...f, downloadAllowed: e.target.checked }))}
                            className="w-4 h-4 accent-amber-700" />
                        <span className="text-sm" style={{ color: CHARCOAL }}>Allow downloads</span>
                    </label>
                    <button onClick={handleUpload} disabled={!form.caption.trim()}
                        className="btn-primary w-full disabled:opacity-40" style={{ background: GOLD, color: CHARCOAL }}>
                        Upload
                    </button>
                </div>
            </Modal>
        </div>
    );
}
