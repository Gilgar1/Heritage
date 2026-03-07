'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar, Icons, EmptyState } from '@/components/shared';

const BROWN = '#5C3A21'; const GOLD = '#C6A75E'; const CREAM = '#F4EFE6'; const CHARCOAL = '#1F1F1F'; const GREEN = '#2F5D50';

type NotifType = 'friend' | 'tribute' | 'like' | 'comment' | 'event' | 'anniversary' | 'governance' | 'tree_edit' | 'media_tag' | 'system';

const TYPE_CONFIG: Record<NotifType, { icon: string; color: string; label: string }> = {
    friend: { icon: '👤', color: '#2563EB', label: 'Friend Request' },
    tribute: { icon: '🕯️', color: GOLD, label: 'Tribute' },
    like: { icon: '❤️', color: '#C62828', label: 'Like' },
    comment: { icon: '💬', color: BROWN, label: 'Comment' },
    event: { icon: '📅', color: '#7C3AED', label: 'Event Reminder' },
    anniversary: { icon: '🌸', color: '#E91E63', label: 'Anniversary' },
    governance: { icon: '⚖️', color: '#ED6C02', label: 'Governance' },
    tree_edit: { icon: '🌿', color: GREEN, label: 'Tree Edit' },
    media_tag: { icon: '📸', color: '#0097A7', label: 'Media Tag' },
    system: { icon: '🏛️', color: '#888', label: 'System' },
};

interface ExtNotif {
    id: string; type: NotifType; title: string; message: string; link?: string;
    read: boolean; createdAt: string; actorName?: string; actorAvatar?: string;
}

const SAMPLE_NOTIFS: ExtNotif[] = [
    { id: 'n1', type: 'anniversary', title: 'Remembrance', message: 'Today marks 3 years since Pa Nkeng Fomonyuy passed. Light a candle to honour his memory.', link: '/memorial/u-1', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'n2', type: 'governance', title: 'Vote Closing', message: 'The governance vote "Open family tree to public?" closes in 24 hours. You haven\'t voted yet.', link: '/families/family-1/governance', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: 'n3', type: 'tree_edit', title: 'Tree Updated', message: 'Ngono Meka added Ma Nkeng Rose as a new member to your family tree.', link: '/families/family-1/tree', read: false, createdAt: new Date(Date.now() - 86400000).toISOString(), actorName: 'Ngono Meka' },
    { id: 'n4', type: 'media_tag', title: 'You Were Tagged', message: 'Tabi Eyong tagged you in a photo from the 2024 Family Reunion album.', link: '/families/family-1/albums', read: false, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), actorName: 'Tabi Eyong' },
    { id: 'n5', type: 'event', title: 'Event Reminder', message: 'Nkeng Annual Reunion 2026 is in 30 days. RSVP if you haven\'t already.', link: '/families/family-1/events', read: true, createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: 'n6', type: 'tribute', title: 'Tribute Approved', message: 'Your tribute post for Pa Nkeng Fomonyuy has been approved by the family custodian.', link: '/memorial/u-1', read: true, createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
    { id: 'n7', type: 'comment', title: 'New Comment', message: 'Ambe Nkeng replied to your post: "Well said! Grandfather would be proud."', link: '/feed', read: true, createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), actorName: 'Ambe Nkeng' },
    { id: 'n8', type: 'like', title: 'Post Liked', message: '5 people liked your heritage story post.', link: '/feed', read: true, createdAt: new Date(Date.now() - 6 * 86400000).toISOString() },
    { id: 'n9', type: 'system', title: 'Verification Approved', message: 'Your identity has been verified. Your Heritage profile now shows a ✅ Verified badge.', link: '/profile', read: true, createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: 'n10', type: 'governance', title: 'Dispute Submitted', message: 'A dispute has been filed in the Nkeng Family. Review it as a custodian.', link: '/families/family-1/governance', read: true, createdAt: new Date(Date.now() - 8 * 86400000).toISOString() },
];

function timeAgo(d: string) {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return 'just now'; if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`; if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
    return new Date(d).toLocaleDateString('en-GB');
}

export default function NotificationsPage() {
    const { notifications, markAllNotificationsRead, markNotificationRead, friendRequests, acceptFriendRequest, rejectFriendRequest } = useHeritage();
    const [extNotifs, setExtNotifs] = useState<ExtNotif[]>(SAMPLE_NOTIFS);
    const [filter, setFilter] = useState<'all' | NotifType>('all');
    const [readMap, setReadMap] = useState<Set<string>>(new Set(SAMPLE_NOTIFS.filter(n => n.read).map(n => n.id)));

    useEffect(() => { return () => { markAllNotificationsRead(); }; }, [markAllNotificationsRead]);

    const ctxNotifs: ExtNotif[] = notifications.map(n => ({ id: n.id, type: (n.type.includes('friend') ? 'friend' : n.type.includes('tribute') ? 'tribute' : n.type.includes('like') ? 'like' : n.type.includes('comment') ? 'comment' : 'system') as NotifType, title: n.title, message: n.message, read: n.read, createdAt: n.createdAt }));
    const allNotifs = [...extNotifs, ...ctxNotifs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const filtered = filter === 'all' ? allNotifs : allNotifs.filter(n => n.type === filter);
    const unreadCount = allNotifs.filter(n => !readMap.has(n.id) && !n.read).length;

    const markRead = (id: string) => { setReadMap(prev => new Set(prev).add(id)); markNotificationRead(id); };
    const markAllRead = () => { setReadMap(new Set(allNotifs.map(n => n.id))); markAllNotificationsRead(); };

    const filterTypes: { v: 'all' | NotifType; label: string }[] = [
        { v: 'all', label: 'All' }, { v: 'anniversary', label: '🌸 Anniversaries' }, { v: 'governance', label: '⚖️ Governance' },
        { v: 'tree_edit', label: '🌿 Tree Edits' }, { v: 'media_tag', label: '📸 Media Tags' },
        { v: 'event', label: '📅 Events' }, { v: 'tribute', label: '🕯️ Tributes' },
        { v: 'friend', label: '👤 Friends' }, { v: 'like', label: '❤️ Likes' },
    ];

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: CHARCOAL }}>Notifications</h1>
                    {unreadCount > 0 && <p className="text-xs mt-0.5" style={{ color: GOLD }}>{unreadCount} new notifications</p>}
                </div>
                {unreadCount > 0 && <button onClick={markAllRead} className="text-xs font-semibold px-3 py-1.5 rounded-xl" style={{ background: `${BROWN}10`, color: BROWN }}>Mark all read</button>}
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
                {filterTypes.map(f => (
                    <button key={f.v} onClick={() => setFilter(f.v)}
                        className="text-xs px-3 py-1.5 rounded-full border font-semibold flex-shrink-0 whitespace-nowrap transition-all"
                        style={filter === f.v ? { background: BROWN, color: CREAM, borderColor: BROWN } : { borderColor: 'rgba(92,58,33,0.2)', color: '#888', background: 'transparent' }}>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Friend Requests */}
            {(filter === 'all' || filter === 'friend') && friendRequests.filter(r => r.status === 'pending').length > 0 && (
                <div className="mb-5">
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#aaa' }}>Friend Requests</h2>
                    <div className="space-y-2">
                        {friendRequests.filter(r => r.status === 'pending').map(req => (
                            <div key={req.id} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                                <Link href={`/profile/${req.fromUserId}`}><Avatar name={req.fromUserName} url={req.fromUserAvatar} size="md" /></Link>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/profile/${req.fromUserId}`} className="font-bold text-sm hover:underline" style={{ color: CHARCOAL }}>{req.fromUserName}</Link>
                                    <p className="text-xs mt-0.5" style={{ color: '#aaa' }}>Wants to connect on Heritage</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={() => acceptFriendRequest(req.id)} className="text-xs px-3 py-1.5 rounded-xl font-bold" style={{ background: BROWN, color: CREAM }}>Accept</button>
                                    <button onClick={() => rejectFriendRequest(req.id)} className="text-xs px-3 py-1.5 rounded-xl font-bold border" style={{ borderColor: 'rgba(92,58,33,0.2)', color: '#888' }}>Ignore</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Notifications timeline */}
            {filtered.length === 0 ? (
                <EmptyState icon={<Icons.Bell />} title="No notifications" description="You're all caught up! Check back later." />
            ) : (
                <div className="space-y-2">
                    {filtered.map((notif, i) => {
                        const cfg = TYPE_CONFIG[notif.type];
                        const isUnread = !readMap.has(notif.id) && !notif.read;
                        return (
                            <div key={notif.id} onClick={() => isUnread && markRead(notif.id)} className="flex gap-3 p-4 rounded-2xl cursor-pointer transition-all group animate-fade-in-up"
                                style={{
                                    background: isUnread ? '#fcfbfa' : 'transparent',
                                    border: isUnread ? `1px solid ${cfg.color}20` : '1px solid rgba(92,58,33,0.06)',
                                    boxShadow: isUnread ? `0 2px 12px ${cfg.color}10` : '',
                                    animationDelay: `${i * 0.03}s`,
                                }}>
                                {/* Icon */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: `${cfg.color}12` }}>
                                        {cfg.icon}
                                    </div>
                                    {isUnread && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ background: cfg.color }} />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfg.color }}>{cfg.label}</span>
                                            <p className="text-sm font-semibold mt-0.5" style={{ color: CHARCOAL }}>{notif.title}</p>
                                            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#666' }}>{notif.message}</p>
                                        </div>
                                        <span className="text-[10px] flex-shrink-0 mt-1" style={{ color: '#bbb' }}>{timeAgo(notif.createdAt)}</span>
                                    </div>
                                    {notif.link && (
                                        <Link href={notif.link} className="text-xs font-bold mt-2 inline-block" style={{ color: cfg.color }}
                                            onClick={e => e.stopPropagation()}>
                                            View →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
