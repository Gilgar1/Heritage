'use client';

import React, { useState, use } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar, Icons, Modal, EmptyState } from '@/components/shared';

const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';

type EventType = 'reunion' | 'funeral' | 'wedding' | 'birth_celebration' | 'cultural' | 'governance' | 'other';
type RSVPStatus = 'going' | 'maybe' | 'not_going';

interface FamilyEvent {
    id: string; familyId: string; createdBy: string; createdByName: string;
    title: string; description?: string; eventType: EventType;
    date: string; location?: string;
    rsvps: { userId: string; userName: string; status: RSVPStatus }[];
    createdAt: string;
}

const EVENT_EMOJIS: Record<EventType, string> = {
    reunion: '👨‍👩‍👧‍👦', funeral: '🕊️', wedding: '💍', birth_celebration: '🎉',
    cultural: '🎭', governance: '⚖️', other: '📅',
};

export default function FamilyEventsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getFamilyById, currentUser, getUserRoleInFamily } = useHeritage();

    const family = getFamilyById(id);
    const role = currentUser ? getUserRoleInFamily(currentUser.id, id) : null;
    const canCreate = role === 'creator' || role === 'editor';

    const [events, setEvents] = useState<FamilyEvent[]>([
        {
            id: 'evt1', familyId: id, createdBy: 'user-1', createdByName: 'Ambe Nkeng',
            title: 'Annual Nkeng Family Reunion 2026',
            description: 'Our yearly gathering to celebrate our lineage, share stories, and honour our ancestors. All family members welcome.',
            eventType: 'reunion', date: '2026-07-15', location: 'Bandjoun, West Region',
            rsvps: [
                { userId: 'user-2', userName: 'Ngono Meka', status: 'going' },
                { userId: 'user-3', userName: 'Tabi Eyong', status: 'maybe' },
            ],
            createdAt: new Date().toISOString(),
        },
        {
            id: 'evt2', familyId: id, createdBy: 'user-1', createdByName: 'Ambe Nkeng',
            title: 'Memorial Day — Pa Nkeng Fomonyuy',
            description: 'Annual remembrance of our patriarch. Come light a candle and share a memory.',
            eventType: 'funeral', date: '2026-04-20', location: 'Family Compound, Bandjoun',
            rsvps: [
                { userId: 'user-1', userName: 'Ambe Nkeng', status: 'going' },
            ],
            createdAt: new Date().toISOString(),
        },
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', eventType: 'reunion' as EventType,
        date: '', location: '',
    });

    const handleCreate = () => {
        if (!form.title.trim() || !form.date || !currentUser) return;
        const evt: FamilyEvent = {
            id: `evt-${Date.now()}`, familyId: id,
            createdBy: currentUser.id, createdByName: currentUser.fullName,
            ...form, rsvps: [], createdAt: new Date().toISOString(),
        };
        setEvents(prev => [evt, ...prev]);
        setForm({ title: '', description: '', eventType: 'reunion', date: '', location: '' });
        setShowCreateModal(false);
    };

    const handleRSVP = (eventId: string, status: RSVPStatus) => {
        if (!currentUser) return;
        setEvents(prev => prev.map(e => {
            if (e.id !== eventId) return e;
            const existing = e.rsvps.filter(r => r.userId !== currentUser.id);
            return {
                ...e,
                rsvps: [...existing, { userId: currentUser.id, userName: currentUser.fullName, status }],
            };
        }));
    };

    const upcoming = events.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const past = events.filter(e => new Date(e.date) < new Date());

    if (!family) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: CHARCOAL }}>Family Events</h1>
                    <p className="text-sm" style={{ color: '#888' }}>{family.name}</p>
                </div>
                {canCreate && (
                    <button onClick={() => setShowCreateModal(true)} className="btn-primary btn-sm"
                        style={{ background: GOLD, color: CHARCOAL }}>
                        + Create Event
                    </button>
                )}
            </div>

            {/* Upcoming */}
            <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: BROWN }}>
                    Upcoming Events ({upcoming.length})
                </h2>
                {upcoming.length > 0 ? (
                    <div className="space-y-4">
                        {upcoming.map(event => {
                            const myRSVP = currentUser ? event.rsvps.find(r => r.userId === currentUser.id) : null;
                            const going = event.rsvps.filter(r => r.status === 'going').length;
                            const maybe = event.rsvps.filter(r => r.status === 'maybe').length;
                            const daysAway = Math.ceil((new Date(event.date).getTime() - Date.now()) / 86400000);
                            return (
                                <div key={event.id} className="p-5 rounded-2xl animate-fade-in-up"
                                    style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.12)', borderLeft: `4px solid ${GOLD}` }}>
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
                                            style={{ background: `${BROWN}10`, border: `1px solid ${BROWN}20` }}>
                                            <span className="text-2xl">{EVENT_EMOJIS[event.eventType]}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-bold text-base" style={{ color: CHARCOAL }}>{event.title}</h3>
                                                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-semibold"
                                                    style={{ background: `${GOLD}15`, color: BROWN }}>
                                                    {daysAway === 0 ? 'Today!' : `In ${daysAway}d`}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: '#888' }}>
                                                <span>📅 {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                {event.location && <span>📍 {event.location}</span>}
                                            </div>
                                            {event.description && (
                                                <p className="text-sm mt-2 leading-relaxed" style={{ color: '#555' }}>{event.description}</p>
                                            )}
                                            {/* RSVP Stats */}
                                            <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: '#888' }}>
                                                <span>✅ {going} going</span>
                                                <span>🤔 {maybe} maybe</span>
                                            </div>
                                            {/* RSVP Buttons */}
                                            <div className="flex gap-2 mt-3">
                                                {(['going', 'maybe', 'not_going'] as RSVPStatus[]).map(status => {
                                                    const labels = { going: '✅ Going', maybe: '🤔 Maybe', not_going: '❌ Not Going' };
                                                    return (
                                                        <button key={status} onClick={() => handleRSVP(event.id, status)}
                                                            className="text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all"
                                                            style={myRSVP?.status === status
                                                                ? { background: BROWN, color: CREAM, borderColor: BROWN }
                                                                : { background: 'transparent', color: '#888', borderColor: 'rgba(92,58,33,0.2)' }}>
                                                            {labels[status]}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState icon={<Icons.Bell />} title="No upcoming events"
                        description="Family events, reunions, and memorials will appear here."
                        action={canCreate ? (
                            <button onClick={() => setShowCreateModal(true)} className="btn-primary btn-sm"
                                style={{ background: GOLD, color: CHARCOAL }}>
                                Create First Event
                            </button>
                        ) : undefined}
                    />
                )}
            </div>

            {/* Past */}
            {past.length > 0 && (
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#aaa' }}>Past Events</h2>
                    <div className="space-y-3 opacity-70">
                        {past.map(event => (
                            <div key={event.id} className="p-4 rounded-xl flex items-center gap-4"
                                style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.08)' }}>
                                <span className="text-2xl">{EVENT_EMOJIS[event.eventType]}</span>
                                <div>
                                    <p className="font-semibold text-sm" style={{ color: CHARCOAL }}>{event.title}</p>
                                    <p className="text-xs" style={{ color: '#aaa' }}>{new Date(event.date).toLocaleDateString('en-GB')} · {event.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Create Event Modal */}
            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Family Event">
                <div className="space-y-4">
                    <div>
                        <label className="input-label">Event Title *</label>
                        <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            className="input-field" placeholder="e.g. Annual Nkeng Reunion 2026" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="input-label">Event Type</label>
                            <select value={form.eventType} onChange={e => setForm(f => ({ ...f, eventType: e.target.value as EventType }))} className="input-field">
                                {Object.entries(EVENT_EMOJIS).map(([type, emoji]) => (
                                    <option key={type} value={type}>{emoji} {type.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Date *</label>
                            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-field" />
                        </div>
                    </div>
                    <div>
                        <label className="input-label">Location</label>
                        <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                            className="input-field" placeholder="Village, town, or online" />
                    </div>
                    <div>
                        <label className="input-label">Description</label>
                        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            className="input-field min-h-[80px] resize-none" placeholder="What's this event about?" />
                    </div>
                    <button onClick={handleCreate} disabled={!form.title || !form.date}
                        className="btn-primary w-full disabled:opacity-40" style={{ background: GOLD, color: CHARCOAL }}>
                        Create Event
                    </button>
                </div>
            </Modal>
        </div>
    );
}
