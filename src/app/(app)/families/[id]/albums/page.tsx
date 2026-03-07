'use client';

import React, { useState, use } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar, Modal, EmptyState, Icons } from '@/components/shared';

const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';
const GREEN = '#2F5D50';

type AlbumPrivacy = 'public' | 'family' | 'members_only';
type AlbumEvent = 'wedding' | 'reunion' | 'funeral' | 'birthday' | 'cultural' | 'general';

interface AlbumPhoto {
    id: string; uploader: string; caption: string; emoji: string;
    taggedMembers: string[]; date: string;
    approved: boolean; pendingApproval: boolean;
}

interface Album {
    id: string; title: string; description?: string; event: AlbumEvent;
    privacy: AlbumPrivacy; coverEmoji: string; date?: string;
    photos: AlbumPhoto[]; comments: { id: string; author: string; text: string; date: string }[];
    reactions: { userId: string; type: string }[];
    requiresApproval: boolean;
    createdBy: string; createdAt: string;
}

const EVENT_META: Record<AlbumEvent, { emoji: string; label: string; color: string }> = {
    wedding: { emoji: '💍', label: 'Wedding', color: '#C62828' },
    reunion: { emoji: '👨‍👩‍👧‍👦', label: 'Reunion', color: BROWN },
    funeral: { emoji: '🕊️', label: 'Memorial', color: GOLD },
    birthday: { emoji: '🎂', label: 'Birthday', color: GREEN },
    cultural: { emoji: '🎭', label: 'Cultural', color: '#2563EB' },
    general: { emoji: '📸', label: 'General', color: '#888' },
};

const SAMPLE_ALBUMS: Album[] = [
    {
        id: 'alb1', title: 'Annual Reunion 2024', event: 'reunion',
        privacy: 'family', coverEmoji: '👨‍👩‍👧‍👦', date: '2024-08-10',
        description: 'Our family gathering in Bandjoun — three generations together.',
        photos: [
            { id: 'p1', uploader: 'Ambe Nkeng', caption: 'The whole family!', emoji: '🤩', taggedMembers: ['Ambe Nkeng', 'Ngono Meka'], date: '2024-08-10', approved: true, pendingApproval: false },
            { id: 'p2', uploader: 'Ngono Meka', caption: 'Grandchildren of Pa Nkeng', emoji: '👶', taggedMembers: ['Nkeng Jr.'], date: '2024-08-10', approved: true, pendingApproval: false },
            { id: 'p3', uploader: 'Tabi Eyong', caption: 'Evening feast', emoji: '🍖', taggedMembers: [], date: '2024-08-11', approved: false, pendingApproval: true },
        ],
        comments: [{ id: 'c1', author: 'Fien Njoya', text: 'Beautiful memories! Wish I was there.', date: '2024-08-12' }],
        reactions: [{ userId: 'user-2', type: '❤️' }, { userId: 'user-3', type: '👏' }],
        requiresApproval: true, createdBy: 'Ambe Nkeng', createdAt: '2024-08-10',
    },
    {
        id: 'alb2', title: 'Memorial — Pa Nkeng Fomonyuy', event: 'funeral',
        privacy: 'family', coverEmoji: '🕊️', date: '2018-11-05',
        description: 'In loving memory of our patriarch.',
        photos: [
            { id: 'p4', uploader: 'Ambe Nkeng', caption: 'Portrait, circa 1978', emoji: '👴', taggedMembers: ['Pa Nkeng Fomonyuy'], date: '2018-11-05', approved: true, pendingApproval: false },
        ],
        comments: [],
        reactions: [{ userId: 'user-1', type: '🕊️' }, { userId: 'user-3', type: '😢' }],
        requiresApproval: false, createdBy: 'Ambe Nkeng', createdAt: '2018-11-05',
    },
];

export default function FamilyAlbumsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getFamilyById, currentUser, getUserRoleInFamily, getFamilyTreeNodes } = useHeritage();

    const family = getFamilyById(id);
    const role = currentUser ? getUserRoleInFamily(currentUser.id, id) : null;
    const canEdit = role === 'creator' || role === 'editor';
    const treeNodes = getFamilyTreeNodes(id);

    const [albums, setAlbums] = useState<Album[]>(SAMPLE_ALBUMS);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [createModal, setCreateModal] = useState(false);
    const [uploadModal, setUploadModal] = useState(false);
    const [view, setView] = useState<'grid' | 'timeline'>('grid');
    const [newComment, setNewComment] = useState('');

    const [createForm, setCreateForm] = useState({
        title: '', description: '', event: 'general' as AlbumEvent,
        privacy: 'family' as AlbumPrivacy, requiresApproval: false, date: '',
    });

    const [uploadForm, setUploadForm] = useState({
        caption: '', emoji: '📸', taggedMembers: [] as string[], date: '',
    });

    const PHOTO_EMOJIS = ['📸', '🖼️', '🌿', '🏔️', '🎭', '🥂', '🤩', '👴', '👶', '🍖', '🌙', '🌅'];

    const handleCreateAlbum = () => {
        if (!createForm.title.trim() || !currentUser) return;
        const album: Album = {
            id: `alb-${Date.now()}`, ...createForm,
            coverEmoji: EVENT_META[createForm.event].emoji,
            photos: [], comments: [], reactions: [],
            createdBy: currentUser.fullName, createdAt: new Date().toISOString(),
        };
        setAlbums(prev => [album, ...prev]);
        setCreateForm({ title: '', description: '', event: 'general', privacy: 'family', requiresApproval: false, date: '' });
        setCreateModal(false);
    };

    const handleUploadPhoto = () => {
        if (!uploadForm.caption.trim() || !selectedAlbum || !currentUser) return;
        const photo: AlbumPhoto = {
            id: `p-${Date.now()}`, uploader: currentUser.fullName, ...uploadForm,
            approved: !selectedAlbum.requiresApproval || canEdit,
            pendingApproval: selectedAlbum.requiresApproval && !canEdit,
        };
        const updated = { ...selectedAlbum, photos: [...selectedAlbum.photos, photo] };
        setAlbums(prev => prev.map(a => a.id === selectedAlbum.id ? updated : a));
        setSelectedAlbum(updated);
        setUploadForm({ caption: '', emoji: '📸', taggedMembers: [], date: '' });
        setUploadModal(false);
    };

    const handleApprovePhoto = (photoId: string) => {
        if (!selectedAlbum) return;
        const updated = {
            ...selectedAlbum,
            photos: selectedAlbum.photos.map(p => p.id === photoId ? { ...p, approved: true, pendingApproval: false } : p),
        };
        setAlbums(prev => prev.map(a => a.id === selectedAlbum.id ? updated : a));
        setSelectedAlbum(updated);
    };

    const handleAddComment = () => {
        if (!newComment.trim() || !selectedAlbum || !currentUser) return;
        const comment = { id: `cm-${Date.now()}`, author: currentUser.fullName, text: newComment, date: new Date().toLocaleDateString('en-GB') };
        const updated = { ...selectedAlbum, comments: [...selectedAlbum.comments, comment] };
        setAlbums(prev => prev.map(a => a.id === selectedAlbum.id ? updated : a));
        setSelectedAlbum(updated);
        setNewComment('');
    };

    const handleReact = (type: string) => {
        if (!selectedAlbum || !currentUser) return;
        const existing = selectedAlbum.reactions.find(r => r.userId === currentUser.id);
        const reactions = existing
            ? existing.type === type
                ? selectedAlbum.reactions.filter(r => r.userId !== currentUser.id)
                : selectedAlbum.reactions.map(r => r.userId === currentUser.id ? { ...r, type } : r)
            : [...selectedAlbum.reactions, { userId: currentUser.id, type }];
        const updated = { ...selectedAlbum, reactions };
        setAlbums(prev => prev.map(a => a.id === selectedAlbum.id ? updated : a));
        setSelectedAlbum(updated);
    };

    if (!family) return null;

    // Album detail view
    if (selectedAlbum) {
        const approvedPhotos = selectedAlbum.photos.filter(p => p.approved);
        const pendingPhotos = selectedAlbum.photos.filter(p => p.pendingApproval);
        const meta = EVENT_META[selectedAlbum.event];

        return (
            <div className="max-w-5xl mx-auto px-4 py-6">
                <button onClick={() => setSelectedAlbum(null)} className="flex items-center gap-2 text-sm mb-4 font-semibold transition-colors" style={{ color: BROWN }}>
                    ← Back to Albums
                </button>

                {/* Album Header */}
                <div className="p-6 rounded-2xl mb-6" style={{ background: `linear-gradient(135deg, ${BROWN} 0%, #422917 100%)` }}>
                    <div className="flex items-start gap-4">
                        <span className="text-4xl">{selectedAlbum.coverEmoji}</span>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h1 className="text-xl font-black" style={{ color: CREAM }}>{selectedAlbum.title}</h1>
                                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${GOLD}25`, color: GOLD }}>
                                    {meta.emoji} {meta.label}
                                </span>
                            </div>
                            {selectedAlbum.description && <p className="text-sm mb-2" style={{ color: 'rgba(244,239,230,0.7)' }}>{selectedAlbum.description}</p>}
                            <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(244,239,230,0.5)' }}>
                                <span>🖼️ {approvedPhotos.length} photos</span>
                                {selectedAlbum.date && <span>📅 {new Date(selectedAlbum.date).toLocaleDateString()}</span>}
                                <span>{selectedAlbum.privacy === 'public' ? '🌍 Public' : selectedAlbum.privacy === 'family' ? '👨‍👩‍👧 Family' : '🔒 Members'}</span>
                            </div>
                        </div>
                        <button onClick={() => setUploadModal(true)} className="btn-sm px-4 py-2 rounded-xl font-bold" style={{ background: GOLD, color: CHARCOAL }}>
                            + Add Photo
                        </button>
                    </div>
                </div>

                {/* Pending approvals (editors only) */}
                {canEdit && pendingPhotos.length > 0 && (
                    <div className="p-4 rounded-2xl mb-5" style={{ background: 'rgba(237,139,0,0.06)', border: '1px solid rgba(237,139,0,0.2)' }}>
                        <p className="text-sm font-bold mb-3" style={{ color: '#ED8B00' }}>⏳ {pendingPhotos.length} photo{pendingPhotos.length > 1 ? 's' : ''} pending approval</p>
                        <div className="flex flex-wrap gap-3">
                            {pendingPhotos.map(photo => (
                                <div key={photo.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: CREAM }}>
                                    <span className="text-2xl">{photo.emoji}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold truncate" style={{ color: CHARCOAL }}>{photo.caption}</p>
                                        <p className="text-xs" style={{ color: '#888' }}>by {photo.uploader}</p>
                                    </div>
                                    <button onClick={() => handleApprovePhoto(photo.id)} className="text-xs px-3 py-1.5 rounded-lg font-bold" style={{ background: `${GREEN}15`, color: GREEN }}>
                                        ✓ Approve
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Photos Grid */}
                {approvedPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                        {approvedPhotos.map(photo => (
                            <div key={photo.id} className="aspect-square rounded-2xl flex flex-col items-center justify-center relative group cursor-pointer overflow-hidden transition-all"
                                style={{ background: `${GOLD}08`, border: '1px solid rgba(92,58,33,0.1)' }}
                                onMouseEnter={e => { (e.currentTarget as any).style.transform = 'scale(1.03)'; }}
                                onMouseLeave={e => { (e.currentTarget as any).style.transform = ''; }}>
                                <span className="text-5xl">{photo.emoji}</span>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-2 rounded-2xl"
                                    style={{ background: 'linear-gradient(to top, rgba(92,58,33,0.85), transparent)' }}>
                                    <p className="text-xs font-medium text-white text-center line-clamp-2">{photo.caption}</p>
                                    {photo.taggedMembers.length > 0 && <p className="text-[10px] text-white opacity-70 mt-0.5">👤 {photo.taggedMembers.join(', ')}</p>}
                                </div>
                            </div>
                        ))}
                        <div onClick={() => setUploadModal(true)} className="aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all"
                            style={{ borderColor: 'rgba(92,58,33,0.2)' }}
                            onMouseEnter={e => (e.currentTarget as any).style.borderColor = BROWN}
                            onMouseLeave={e => (e.currentTarget as any).style.borderColor = 'rgba(92,58,33,0.2)'}>
                            <span className="text-3xl mb-1">+</span>
                            <p className="text-xs" style={{ color: '#aaa' }}>Add Photo</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 mb-6">
                        <p className="text-4xl mb-2">📷</p>
                        <p className="text-sm" style={{ color: '#888' }}>No photos yet. Be the first to add one!</p>
                    </div>
                )}

                {/* Reactions */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {['❤️', '😢', '👏', '🕊️', '🙏'].map(r => {
                        const count = selectedAlbum.reactions.filter(rx => rx.type === r).length;
                        const myReaction = currentUser && selectedAlbum.reactions.find(rx => rx.userId === currentUser.id && rx.type === r);
                        return (
                            <button key={r} onClick={() => handleReact(r)}
                                className={`reaction-pill ${myReaction ? 'active' : ''}`}>
                                {r} {count > 0 && count}
                            </button>
                        );
                    })}
                </div>

                {/* Comments */}
                <div className="p-5 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                    <h3 className="font-bold text-sm mb-3" style={{ color: CHARCOAL }}>Comments ({selectedAlbum.comments.length})</h3>
                    <div className="space-y-3 mb-4">
                        {selectedAlbum.comments.map(c => (
                            <div key={c.id} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: BROWN, color: CREAM }}>
                                    {c.author[0]}
                                </div>
                                <div className="flex-1 p-3 rounded-xl" style={{ background: CREAM }}>
                                    <p className="text-xs font-semibold mb-0.5" style={{ color: BROWN }}>{c.author}</p>
                                    <p className="text-sm" style={{ color: CHARCOAL }}>{c.text}</p>
                                    <p className="text-[10px] mt-1" style={{ color: '#aaa' }}>{c.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                            className="input-field flex-1" placeholder="Write a comment..." />
                        <button onClick={handleAddComment} disabled={!newComment.trim()}
                            className="px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-40"
                            style={{ background: GOLD, color: CHARCOAL }}>
                            Send
                        </button>
                    </div>
                </div>

                {/* Upload Photo Modal */}
                <Modal isOpen={uploadModal} onClose={() => setUploadModal(false)} title="Add Photo to Album">
                    <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer" style={{ borderColor: 'rgba(92,58,33,0.2)' }}>
                            <p className="text-4xl mb-2">📎</p>
                            <p className="text-sm font-semibold" style={{ color: BROWN }}>Click to select or drag & drop</p>
                            <p className="text-xs mt-1" style={{ color: '#aaa' }}>JPG, PNG, HEIC · Max 20MB</p>
                        </div>
                        <div>
                            <label className="input-label">Caption *</label>
                            <input type="text" value={uploadForm.caption} onChange={e => setUploadForm(f => ({ ...f, caption: e.target.value }))} className="input-field" placeholder="Describe this photo..." />
                        </div>
                        <div>
                            <label className="input-label">Emoji placeholder (until real upload)</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {PHOTO_EMOJIS.map(e => (
                                    <button key={e} onClick={() => setUploadForm(f => ({ ...f, emoji: e }))}
                                        className="w-9 h-9 rounded-lg text-xl flex items-center justify-center border-2 transition-all"
                                        style={{ borderColor: uploadForm.emoji === e ? BROWN : 'rgba(92,58,33,0.15)', background: uploadForm.emoji === e ? `${BROWN}10` : 'transparent' }}>
                                        {e}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="input-label">Tag Family Members</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {treeNodes.map(n => {
                                    const tagged = uploadForm.taggedMembers.includes(n.name);
                                    return (
                                        <button key={n.id} onClick={() => setUploadForm(f => ({ ...f, taggedMembers: tagged ? f.taggedMembers.filter(x => x !== n.name) : [...f.taggedMembers, n.name] }))}
                                            className="text-xs px-2.5 py-1 rounded-full border font-semibold transition-all"
                                            style={tagged ? { background: BROWN, color: CREAM, borderColor: BROWN } : { borderColor: 'rgba(92,58,33,0.2)', color: '#888', background: 'transparent' }}>
                                            {n.name.split(' ')[0]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <label className="input-label">Date</label>
                            <input type="date" value={uploadForm.date} onChange={e => setUploadForm(f => ({ ...f, date: e.target.value }))} className="input-field" />
                        </div>
                        {selectedAlbum.requiresApproval && !canEdit && (
                            <div className="text-xs p-3 rounded-xl" style={{ background: 'rgba(237,139,0,0.08)', color: '#ED8B00', border: '1px solid rgba(237,139,0,0.2)' }}>
                                ⏳ This album requires editor approval before your photo becomes visible.
                            </div>
                        )}
                        <button onClick={handleUploadPhoto} disabled={!uploadForm.caption.trim()}
                            className="btn-primary w-full disabled:opacity-40" style={{ background: GOLD, color: CHARCOAL }}>
                            Add Photo
                        </button>
                    </div>
                </Modal>
            </div>
        );
    }

    // Albums grid
    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: CHARCOAL }}>Family Albums</h1>
                    <p className="text-sm" style={{ color: '#888' }}>{family.name} · {albums.length} album{albums.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex gap-1 p-1 rounded-xl" style={{ background: CREAM, border: '1px solid rgba(92,58,33,0.12)' }}>
                        {(['grid', 'timeline'] as const).map(v => (
                            <button key={v} onClick={() => setView(v)}
                                className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize"
                                style={view === v ? { background: BROWN, color: CREAM } : { color: '#888', background: 'transparent' }}>
                                {v === 'grid' ? '⊞ Grid' : '📅 Timeline'}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setCreateModal(true)} className="btn-primary btn-sm" style={{ background: GOLD, color: CHARCOAL }}>
                        + New Album
                    </button>
                </div>
            </div>

            {/* Grid view */}
            {view === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
                    {albums.map(album => {
                        const meta = EVENT_META[album.event];
                        const approved = album.photos.filter(p => p.approved).length;
                        const pending = album.photos.filter(p => p.pendingApproval).length;
                        return (
                            <div key={album.id} onClick={() => setSelectedAlbum(album)}
                                className="rounded-2xl overflow-hidden cursor-pointer group transition-all"
                                style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                                onMouseEnter={e => { (e.currentTarget as any).style.transform = 'translateY(-3px)'; (e.currentTarget as any).style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; }}
                                onMouseLeave={e => { (e.currentTarget as any).style.transform = ''; (e.currentTarget as any).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}>
                                {/* Cover */}
                                <div className="h-36 flex items-center justify-center relative"
                                    style={{ background: `linear-gradient(135deg, ${BROWN}18 0%, ${GOLD}10 100%)` }}>
                                    <span className="text-6xl">{album.coverEmoji}</span>
                                    <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-semibold"
                                        style={{ background: 'rgba(255,255,255,0.9)', color: meta.color }}>
                                        {meta.emoji} {meta.label}
                                    </span>
                                    <span className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full font-semibold"
                                        style={{ background: 'rgba(255,255,255,0.9)', color: '#888' }}>
                                        {album.privacy === 'public' ? '🌍' : album.privacy === 'family' ? '👨‍👩‍👧' : '🔒'}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-sm mb-0.5" style={{ color: CHARCOAL }}>{album.title}</h3>
                                    {album.date && <p className="text-xs mb-2" style={{ color: '#888' }}>{new Date(album.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                                    <div className="flex items-center gap-3 text-xs" style={{ color: '#aaa' }}>
                                        <span>🖼️ {approved} photo{approved !== 1 ? 's' : ''}</span>
                                        {pending > 0 && canEdit && <span className="font-semibold" style={{ color: '#ED8B00' }}>⏳ {pending} pending</span>}
                                        <span>💬 {album.comments.length}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {album.reactions.slice(0, 3).map((r, i) => (
                                            <span key={i} className="text-sm">{r.type}</span>
                                        ))}
                                        {album.reactions.length > 0 && <span className="text-xs" style={{ color: '#aaa' }}>({album.reactions.length})</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {/* New album tile */}
                    <div onClick={() => setCreateModal(true)} className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center h-52 cursor-pointer transition-all"
                        style={{ borderColor: 'rgba(92,58,33,0.2)' }}
                        onMouseEnter={e => (e.currentTarget as any).style.borderColor = BROWN}
                        onMouseLeave={e => (e.currentTarget as any).style.borderColor = 'rgba(92,58,33,0.2)'}>
                        <span className="text-4xl mb-2">+</span>
                        <p className="text-sm font-semibold" style={{ color: '#aaa' }}>Create Album</p>
                    </div>
                </div>
            )}

            {/* Timeline view */}
            {view === 'timeline' && (
                <div className="animate-fade-in relative pl-8">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5" style={{ background: `${BROWN}20` }} />
                    {[...albums].sort((a, b) => (b.date || '').localeCompare(a.date || '')).map((album, i) => (
                        <div key={album.id} className="relative mb-6 animate-fade-in-up cursor-pointer" style={{ animationDelay: `${i * 0.05}s` }}
                            onClick={() => setSelectedAlbum(album)}>
                            <div className="absolute -left-5 w-8 h-8 rounded-full flex items-center justify-center text-lg border-2"
                                style={{ background: CREAM, borderColor: BROWN, top: 8 }}>
                                {EVENT_META[album.event].emoji}
                            </div>
                            <div className="p-4 rounded-2xl transition-all" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}
                                onMouseEnter={e => (e.currentTarget as any).style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'}
                                onMouseLeave={e => (e.currentTarget as any).style.boxShadow = ''}>
                                <div className="flex items-center gap-2 mb-0.5">
                                    {album.date && <span className="text-xs font-black" style={{ color: BROWN }}>{new Date(album.date).getFullYear()}</span>}
                                    <h3 className="font-bold text-sm" style={{ color: CHARCOAL }}>{album.title}</h3>
                                </div>
                                <p className="text-xs" style={{ color: '#888' }}>{album.photos.filter(p => p.approved).length} photos · {album.comments.length} comments</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Album Modal */}
            <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create New Album">
                <div className="space-y-4">
                    <div>
                        <label className="input-label">Album Title *</label>
                        <input type="text" value={createForm.title} onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))} className="input-field" placeholder="e.g. Annual Reunion 2026" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="input-label">Event Type</label>
                            <select value={createForm.event} onChange={e => setCreateForm(f => ({ ...f, event: e.target.value as AlbumEvent }))} className="input-field">
                                {(Object.entries(EVENT_META) as [AlbumEvent, any][]).map(([k, v]) => (
                                    <option key={k} value={k}>{v.emoji} {v.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Date</label>
                            <input type="date" value={createForm.date} onChange={e => setCreateForm(f => ({ ...f, date: e.target.value }))} className="input-field" />
                        </div>
                    </div>
                    <div>
                        <label className="input-label">Privacy</label>
                        <select value={createForm.privacy} onChange={e => setCreateForm(f => ({ ...f, privacy: e.target.value as AlbumPrivacy }))} className="input-field">
                            <option value="public">🌍 Public</option>
                            <option value="family">👨‍👩‍👧 Family Only</option>
                            <option value="members_only">🔒 Members Only</option>
                        </select>
                    </div>
                    <div>
                        <label className="input-label">Description</label>
                        <textarea value={createForm.description} onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))} className="input-field min-h-[70px] resize-none" placeholder="What's this album about?" />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={createForm.requiresApproval} onChange={e => setCreateForm(f => ({ ...f, requiresApproval: e.target.checked }))} className="w-4 h-4" />
                        <span className="text-sm" style={{ color: CHARCOAL }}>⏳ Require editor approval for photos</span>
                    </label>
                    <button onClick={handleCreateAlbum} disabled={!createForm.title.trim()} className="btn-primary w-full disabled:opacity-40" style={{ background: GOLD, color: CHARCOAL }}>
                        Create Album
                    </button>
                </div>
            </Modal>
        </div>
    );
}
