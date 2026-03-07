'use client';

import React, { useState } from 'react';

const BROWN = '#5C3A21'; const GOLD = '#C6A75E'; const CREAM = '#F4EFE6'; const CHARCOAL = '#1F1F1F'; const GREEN = '#2F5D50';

type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';
type ReportReason = 'fake_identity' | 'harassment' | 'false_tribute' | 'spam' | 'inappropriate' | 'duplicate_profile';

interface Report {
    id: string; reason: ReportReason; contentType: 'post' | 'profile' | 'tribute' | 'comment' | 'media';
    contentId: string; reportedUser: string; reportedBy: string;
    description: string; status: ReportStatus; createdAt: string;
    trustImpact: number; adminNotes?: string;
}

const REASON_META: Record<ReportReason, { label: string; color: string; icon: string }> = {
    fake_identity: { label: 'Fake Identity', color: '#C62828', icon: '🪪' },
    harassment: { label: 'Harassment', color: '#E53935', icon: '🚫' },
    false_tribute: { label: 'False Tribute', color: GOLD, icon: '🕯️' },
    spam: { label: 'Spam', color: '#888', icon: '📧' },
    inappropriate: { label: 'Inappropriate', color: '#7C3AED', icon: '⚠️' },
    duplicate_profile: { label: 'Duplicate Profile', color: '#2563EB', icon: '👥' },
};

const SAMPLE_REPORTS: Report[] = [
    { id: 'r1', reason: 'false_tribute', contentType: 'tribute', contentId: 'p-43', reportedUser: 'Ebong Tabe', reportedBy: 'Ambe Nkeng', description: 'This tribute contains factually incorrect information about the deceased. The date and circumstances of death are wrong.', status: 'pending', createdAt: new Date(Date.now() - 3600000).toISOString(), trustImpact: -15 },
    { id: 'r2', reason: 'fake_identity', contentType: 'profile', contentId: 'u-88', reportedUser: 'Unknown User', reportedBy: 'Ngono Meka', description: 'This account is impersonating Pa Nkeng Fomonyuy who is deceased. The account is posting content as if they were still alive.', status: 'reviewing', createdAt: new Date(Date.now() - 7200000).toISOString(), trustImpact: -50, adminNotes: 'Profile review in progress. Matching family records.' },
    { id: 'r3', reason: 'harassment', contentType: 'comment', contentId: 'c-201', reportedUser: 'John Doe', reportedBy: 'Tabi Eyong', description: 'User has been sending threatening messages and attacking my family heritage posts with hostile comments.', status: 'pending', createdAt: new Date(Date.now() - 86400000).toISOString(), trustImpact: -30 },
    { id: 'r4', reason: 'duplicate_profile', contentType: 'profile', contentId: 'u-55', reportedUser: 'Ambe Nkeng Jr.', reportedBy: 'Family Admin', description: 'This profile is a duplicate of existing profile U-12. Same person, different account. Merge requested.', status: 'resolved', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), trustImpact: 0, adminNotes: 'Profiles merged. Original account retained.' },
    { id: 'r5', reason: 'spam', contentType: 'post', contentId: 'p-77', reportedUser: 'Commerce Bot', reportedBy: 'Fien Njoya', description: 'User is posting commercial advertisements in family heritage feeds repeatedly.', status: 'dismissed', createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), trustImpact: -5, adminNotes: 'User warned. Single occurrence, not spam pattern.' },
];

const ACTIONS = [
    { id: 'warn', label: 'Warn User', icon: '⚠️', color: GOLD },
    { id: 'remove_content', label: 'Remove Content', icon: '🗑️', color: '#ED6C02' },
    { id: 'restrict', label: 'Restrict Account', icon: '🔒', color: '#C62828' },
    { id: 'suspend', label: 'Suspend Account', icon: '🚫', color: '#B71C1C' },
    { id: 'dismiss', label: 'Dismiss Report', icon: '✓', color: '#888' },
    { id: 'merge', label: 'Merge Profiles', icon: '🔄', color: '#2563EB' },
];

function timeAgo(d: string) {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return 'just now'; if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`; return `${Math.floor(s / 86400)}d ago`;
}

export default function AdminModerationPage() {
    const [reports, setReports] = useState<Report[]>(SAMPLE_REPORTS);
    const [selected, setSelected] = useState<Report | null>(null);
    const [adminNote, setAdminNote] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | ReportStatus>('all');
    const [actionTaken, setActionTaken] = useState<string | null>(null);
    const [trustAdjustments, setTrustAdjustments] = useState<Record<string, number>>({});

    const filtered = statusFilter === 'all' ? reports : reports.filter(r => r.status === statusFilter);
    const pending = reports.filter(r => r.status === 'pending').length;

    const handleAction = (actionId: string, report: Report) => {
        let newStatus: ReportStatus = 'resolved';
        if (actionId === 'dismiss') newStatus = 'dismissed';
        else if (actionId === 'warn' || actionId === 'restrict' || actionId === 'remove_content') newStatus = 'resolved';

        setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: newStatus, adminNotes: adminNote || r.adminNotes } : r));
        if (report.trustImpact !== 0) {
            setTrustAdjustments(prev => ({ ...prev, [report.reportedUser]: (prev[report.reportedUser] || 0) + report.trustImpact }));
        }
        setActionTaken(actionId);
        setTimeout(() => { setActionTaken(null); setSelected(null); setAdminNote(''); }, 1500);
    };

    const stats = [
        { label: 'Pending Review', value: reports.filter(r => r.status === 'pending').length, color: '#C62828' },
        { label: 'In Review', value: reports.filter(r => r.status === 'reviewing').length, color: GOLD },
        { label: 'Resolved (7d)', value: reports.filter(r => r.status === 'resolved').length, color: GREEN },
        { label: 'Dismissed', value: reports.filter(r => r.status === 'dismissed').length, color: '#888' },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold" style={{ color: CHARCOAL }}>Moderation Queue</h1>
                <p className="text-sm" style={{ color: '#888' }}>Review and action all incoming content reports</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {stats.map((s, i) => (
                    <div key={i} className="p-4 rounded-2xl text-center" style={{ background: '#fcfbfa', border: `1px solid ${s.color}20` }}>
                        <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#888' }}>{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Reports list */}
                <div className="lg:col-span-1">
                    {/* Filter */}
                    <div className="flex flex-wrap gap-1 mb-4">
                        {(['all', 'pending', 'reviewing', 'resolved', 'dismissed'] as const).map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)} className="text-xs px-2.5 py-1 rounded-full border font-semibold capitalize transition-all"
                                style={statusFilter === s ? { background: BROWN, color: CREAM, borderColor: BROWN } : { borderColor: 'rgba(92,58,33,0.2)', color: '#888', background: 'transparent' }}>
                                {s} {s === 'pending' && pending > 0 && `(${pending})`}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        {filtered.map((r, i) => {
                            const meta = REASON_META[r.reason];
                            return (
                                <button key={r.id} onClick={() => { setSelected(r); setAdminNote(r.adminNotes || ''); }}
                                    className="w-full p-4 rounded-2xl text-left transition-all animate-fade-in-up"
                                    style={{
                                        background: selected?.id === r.id ? `${BROWN}05` : '#fcfbfa',
                                        border: selected?.id === r.id ? `1px solid ${BROWN}30` : '1px solid rgba(92,58,33,0.08)',
                                        animationDelay: `${i * 0.04}s`,
                                    }}>
                                    <div className="flex items-start gap-3">
                                        <span className="text-xl">{meta.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold" style={{ color: meta.color }}>{meta.label}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${r.status === 'pending' ? 'badge-pending' : r.status === 'resolved' ? 'badge-approved' : r.status === 'dismissed' ? 'badge-rejected' : ''}`}>{r.status}</span>
                                            </div>
                                            <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: CHARCOAL }}>vs. {r.reportedUser}</p>
                                            <p className="text-[10px] mt-0.5 line-clamp-2" style={{ color: '#aaa' }}>{r.description}</p>
                                            <p className="text-[10px] mt-1" style={{ color: '#ccc' }}>{timeAgo(r.createdAt)}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Review panel */}
                <div className="lg:col-span-2">
                    {selected ? (
                        <div className="p-6 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                            {actionTaken ? (
                                <div className="text-center py-12">
                                    <p className="text-5xl mb-3">✅</p>
                                    <p className="font-bold text-lg" style={{ color: GREEN }}>Action taken: {ACTIONS.find(a => a.id === actionTaken)?.label}</p>
                                    <p className="text-sm mt-1" style={{ color: '#888' }}>Report updated successfully</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: REASON_META[selected.reason].color }}>{REASON_META[selected.reason].icon} {REASON_META[selected.reason].label}</span>
                                            <h2 className="font-bold text-base mt-1" style={{ color: CHARCOAL }}>Reported: {selected.reportedUser}</h2>
                                            <p className="text-xs" style={{ color: '#aaa' }}>Reported by {selected.reportedBy} · {timeAgo(selected.createdAt)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-semibold" style={{ color: '#888' }}>Trust Impact</p>
                                            <p className="text-lg font-black" style={{ color: selected.trustImpact < 0 ? '#C62828' : GREEN }}>{selected.trustImpact > 0 ? '+' : ''}{selected.trustImpact}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl mb-4" style={{ background: CREAM }}>
                                        <p className="text-xs font-bold mb-1" style={{ color: CHARCOAL }}>Reporter's Description</p>
                                        <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{selected.description}</p>
                                    </div>

                                    <div className="p-3 rounded-xl mb-4 flex gap-3" style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}20` }}>
                                        <span className="text-base">🔗</span>
                                        <div>
                                            <p className="text-xs font-bold" style={{ color: CHARCOAL }}>Content</p>
                                            <p className="text-xs" style={{ color: '#888' }}>Type: {selected.contentType} · ID: {selected.contentId}</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="input-label">Admin Notes</label>
                                        <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} className="input-field min-h-[80px] resize-none" placeholder="Add notes about this decision..." />
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold mb-3" style={{ color: CHARCOAL }}>Take Action</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {ACTIONS.filter(a => {
                                                if (selected.reason !== 'duplicate_profile' && a.id === 'merge') return false;
                                                return true;
                                            }).map(action => (
                                                <button key={action.id} onClick={() => handleAction(action.id, selected)}
                                                    className="p-3 rounded-xl text-sm font-bold text-left transition-all border-2"
                                                    style={{ borderColor: action.color, color: action.color, background: 'transparent' }}
                                                    onMouseEnter={e => { (e.currentTarget as any).style.background = `${action.color}10`; }}
                                                    onMouseLeave={e => { (e.currentTarget as any).style.background = 'transparent'; }}>
                                                    <span className="text-base">{action.icon}</span>
                                                    <p className="mt-0.5 text-xs">{action.label}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-80 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.08)' }}>
                            <p className="text-5xl mb-3">⚖️</p>
                            <p className="font-semibold" style={{ color: '#888' }}>Select a report to review</p>
                            {pending > 0 && <p className="text-xs mt-1" style={{ color: '#C62828' }}>{pending} pending report{pending > 1 ? 's' : ''} need review</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
