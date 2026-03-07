'use client';

import React, { useState, use } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar, Icons, EmptyState, Modal } from '@/components/shared';

const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';

export default function MemorialPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getUserById, currentUser, posts, isFriend } = useHeritage();

    const [candles, setCandles] = useState<{ userId: string; message: string; lit: number }[]>([
        { userId: 'user-2', message: 'Rest in eternal peace, Pa Nkeng. Your wisdom carries us forward.', lit: Date.now() - 86400000 },
        { userId: 'user-3', message: 'A great chief whose memory lives in every generation.', lit: Date.now() - 172800000 },
    ]);
    const [lightingCandle, setLightingCandle] = useState(false);
    const [candleMessage, setCandleMessage] = useState('');
    const [hasLit, setHasLit] = useState(false);
    const [activeTab, setActiveTab] = useState<'tributes' | 'biography' | 'media' | 'candles'>('tributes');

    const user = getUserById(id);

    if (!user) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                <p style={{ color: '#888' }}>Memorial not found.</p>
            </div>
        );
    }

    if (!user.isDeceased) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                <p style={{ color: '#888' }}>This memorial page is only for deceased members.</p>
            </div>
        );
    }

    const tributePosts = posts.filter(p => p.targetDeceasedId === id && p.tributeStatus === 'approved');

    const handleLightCandle = () => {
        if (!currentUser || !candleMessage.trim()) return;
        setCandles(prev => [
            { userId: currentUser.id, message: candleMessage, lit: Date.now() },
            ...prev,
        ]);
        setHasLit(true);
        setCandleMessage('');
        setLightingCandle(false);
    };

    const tabs: { id: typeof activeTab; label: string }[] = [
        { id: 'biography', label: 'Legacy' },
        { id: 'tributes', label: `Tributes (${tributePosts.length})` },
        { id: 'candles', label: `Candles (${candles.length})` },
        { id: 'media', label: 'Gallery' },
    ];

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            {/* Memorial Header */}
            <div className="rounded-3xl overflow-hidden mb-6 shadow-lg">
                {/* Gradient cover */}
                <div className="relative h-52 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, #2d1e10 0%, ${BROWN} 50%, #a98d4d 100%)` }}>
                    {/* Candle decorations */}
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className="absolute text-2xl animate-pulse"
                            style={{
                                left: `${15 + i * 18}%`,
                                bottom: '20px',
                                animationDelay: `${i * 0.4}s`,
                                opacity: 0.6,
                            }}>🕯️</span>
                    ))}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl mb-2">🕊️</span>
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(244,239,230,0.5)' }}>
                            In Loving Memory
                        </p>
                    </div>
                </div>

                {/* Profile strip */}
                <div className="p-6 -mt-10 relative bg-white" style={{ background: '#fcfbfa' }}>
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                        <Avatar name={user.fullName} size="xl" isDeceased={true} className="border-4 border-gold-300" />
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-black" style={{ color: CHARCOAL }}>{user.fullName}</h1>
                            {user.traditionalTitle && (
                                <p className="text-sm font-semibold mt-0.5" style={{ color: BROWN }}>{user.traditionalTitle}</p>
                            )}
                            <p className="text-sm mt-1" style={{ color: '#888' }}>
                                {user.tribe} · {user.village} · {user.region}
                            </p>
                            <p className="text-sm mt-1 font-semibold" style={{ color: GOLD }}>
                                {user.birthDate ? new Date(user.birthDate).getFullYear() : '?'}
                                {' — '}
                                {user.deathDate ? new Date(user.deathDate).getFullYear() : '?'}
                            </p>
                        </div>
                        <div className="sm:ml-auto flex flex-col gap-2">
                            {!hasLit && (
                                <button onClick={() => setLightingCandle(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"
                                    style={{ background: GOLD, color: CHARCOAL }}>
                                    🕯️ Light a Candle
                                </button>
                            )}
                            {hasLit && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                                    style={{ background: `${GOLD}15`, color: BROWN }}>
                                    🕯️ You lit a candle
                                </div>
                            )}
                            <div className="text-center text-xs" style={{ color: '#888' }}>
                                {candles.length} candle{candles.length !== 1 ? 's' : ''} lit
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 overflow-x-auto mb-6" style={{ borderBottom: '2px solid rgba(92,58,33,0.1)' }}>
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className={`tab-item ${activeTab === t.id ? 'active' : ''}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Legacy Biography */}
            {activeTab === 'biography' && (
                <div className="animate-fade-in space-y-4">
                    <div className="p-6 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                        <h2 className="font-bold text-base mb-4" style={{ color: CHARCOAL }}>Legacy Biography</h2>
                        {user.bio ? (
                            <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{user.bio}</p>
                        ) : (
                            <div className="border-2 border-dashed rounded-xl p-6 text-center"
                                style={{ borderColor: 'rgba(92,58,33,0.2)' }}>
                                <p className="text-sm" style={{ color: '#999' }}>
                                    No biography written yet. Family members can contribute to this person's legacy by adding their story.
                                </p>
                                <button className="btn-secondary btn-sm mt-3">Add Biography</button>
                            </div>
                        )}
                    </div>

                    <div className="p-6 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                        <h2 className="font-bold text-base mb-4" style={{ color: CHARCOAL }}>Life Milestones</h2>
                        <div className="relative">
                            {[
                                user.birthDate && { year: new Date(user.birthDate).getFullYear(), label: 'Born', icon: '🌱', color: '#2F5D50' },
                                { year: 1965, label: 'Married', icon: '💍', color: GOLD },
                                { year: 1978, label: 'Became Village Chief', icon: '👑', color: BROWN },
                                user.deathDate && { year: new Date(user.deathDate).getFullYear(), label: 'Passed', icon: '🕊️', color: GOLD },
                            ].filter(Boolean).map((event: any, i) => (
                                <div key={i} className="flex gap-4 mb-4 last:mb-0">
                                    <div className="flex flex-col items-center">
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 border-2"
                                            style={{ background: `${event.color}15`, borderColor: `${event.color}40` }}>
                                            {event.icon}
                                        </div>
                                        {i < 3 && <div className="w-px h-6 mt-1" style={{ background: 'rgba(92,58,33,0.15)' }} />}
                                    </div>
                                    <div className="pt-1.5">
                                        <p className="text-xs font-bold" style={{ color: event.color }}>{event.year}</p>
                                        <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>{event.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Tributes */}
            {activeTab === 'tributes' && (
                <div className="animate-fade-in space-y-3">
                    {tributePosts.length > 0 ? tributePosts.map(post => (
                        <div key={post.id} className="p-5 rounded-2xl animate-fade-in-up"
                            style={{ background: '#fcfbfa', border: `1px solid ${GOLD}25` }}>
                            <div className="flex items-center gap-3 mb-3">
                                <Avatar name={post.authorName} size="sm" />
                                <div>
                                    <p className="font-semibold text-sm" style={{ color: CHARCOAL }}>{post.authorName}</p>
                                    <p className="text-xs" style={{ color: '#888' }}>{new Date(post.createdAt).toLocaleDateString('en-GB')}</p>
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: '#444' }}>{post.content}</p>
                            <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: '1px solid rgba(92,58,33,0.08)' }}>
                                <span className="text-xs" style={{ color: '#888' }}>❤️ {post.likes.length}</span>
                                <span className="text-xs" style={{ color: '#888' }}>💬 {post.comments.length}</span>
                            </div>
                        </div>
                    )) : (
                        <EmptyState icon={<Icons.Candle />}
                            title="No tributes yet"
                            description="Be the first to write a tribute for this person. Tributes require family approval before appearing here." />
                    )}
                </div>
            )}

            {/* Candles */}
            {activeTab === 'candles' && (
                <div className="animate-fade-in space-y-3">
                    <div className="text-center py-4">
                        <p className="text-3xl mb-2">🕯️</p>
                        <p className="text-sm font-semibold" style={{ color: BROWN }}>{candles.length} candles lit across the Heritage community</p>
                    </div>
                    {candles.map((c, i) => {
                        const lighter = getUserById(c.userId);
                        return (
                            <div key={i} className="p-4 rounded-xl animate-fade-in-up"
                                style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}20` }}>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl flex-shrink-0">🕯️</span>
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>
                                            {lighter?.fullName || 'A community member'}
                                        </p>
                                        <p className="text-sm mt-0.5" style={{ color: '#555' }}>{c.message}</p>
                                        <p className="text-xs mt-1.5" style={{ color: '#aaa' }}>
                                            {new Date(c.lit).toLocaleDateString('en-GB')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Media Gallery */}
            {activeTab === 'media' && (
                <div className="animate-fade-in">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                            { label: 'Portrait, 1978', emoji: '📸' },
                            { label: 'Family reunion, 1985', emoji: '👨‍👩‍👧‍👦' },
                            { label: 'Village ceremony', emoji: '🎭' },
                        ].map((item, i) => (
                            <div key={i} className="aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer group transition-all"
                                style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}20` }}>
                                <span className="text-4xl mb-2">{item.emoji}</span>
                                <p className="text-xs text-center px-2 font-medium" style={{ color: BROWN }}>{item.label}</p>
                            </div>
                        ))}
                        <div className="aspect-square rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all"
                            style={{ borderColor: 'rgba(92,58,33,0.2)' }}>
                            <div className="text-center">
                                <p className="text-xl mb-1">+</p>
                                <p className="text-xs" style={{ color: '#999' }}>Add Photo</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Light Candle Modal */}
            <Modal isOpen={lightingCandle} onClose={() => setLightingCandle(false)} title="🕯️ Light a Candle">
                <div className="space-y-4">
                    <p className="text-sm" style={{ color: '#666' }}>
                        Light a candle in memory of <strong style={{ color: CHARCOAL }}>{user.fullName}</strong>.
                        Add a personal message or simply light in silence.
                    </p>
                    <div>
                        <label className="input-label">Your Message (optional)</label>
                        <textarea value={candleMessage} onChange={e => setCandleMessage(e.target.value)}
                            className="input-field min-h-[100px] resize-none"
                            placeholder="Share a memory, a prayer, or words of comfort..." />
                    </div>
                    <button onClick={handleLightCandle}
                        className="w-full py-3 rounded-xl font-bold transition-all"
                        style={{ background: GOLD, color: CHARCOAL }}>
                        🕯️ Light This Candle
                    </button>
                </div>
            </Modal>
        </div>
    );
}
