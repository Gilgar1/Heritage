'use client';

import React from 'react';

const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';
const GREEN = '#2F5D50';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="p-5 rounded-2xl mb-4" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.08)' }}>
        <h2 className="font-bold text-base mb-4" style={{ color: CHARCOAL }}>{title}</h2>
        {children}
    </div>
);

export default function TransparencyPage() {
    const stats = [
        { label: 'Total Reports (March 2026)', value: '12' },
        { label: 'Content Removed', value: '3' },
        { label: 'Accounts Warned', value: '4' },
        { label: 'Accounts Suspended', value: '1' },
        { label: 'Disputes Resolved', value: '2' },
        { label: 'Avg. Resolution Time', value: '2.3 days' },
    ];

    const auditLog = [
        { date: '2026-03-04', action: 'Tribute Removed', description: 'Tribute post on Profile #U-2031 removed for inaccurate information.', actor: 'Admin Team' },
        { date: '2026-03-03', action: 'Account Warned', description: 'Account warned for posting non-heritage promotional content in family feed.', actor: 'Admin Team' },
        { date: '2026-03-02', action: 'Family Frozen', description: 'Ndi Family tree frozen per 7-day deletion request from Creator.', actor: 'System' },
        { date: '2026-03-01', action: 'Dispute Resolved', description: 'Tree accuracy dispute in the Eyong Family resolved. Entry corrected.', actor: 'Admin Team' },
        { date: '2026-02-28', action: 'Content Removed', description: 'Photo removed from family album for containing non-consenting minor.', actor: 'Admin Team' },
    ];

    const dataCommitments = [
        { icon: '🔒', title: 'We never sell your data', desc: 'Heritage does not sell, rent, or trade personal data to any third party, ever.' },
        { icon: '🌍', title: 'African data sovereignty', desc: 'Your family data is stored with African-first data residency principles in mind.' },
        { icon: '📦', title: 'You own your data', desc: 'You can export or delete your data at any time via Settings > Data.' },
        { icon: '🔐', title: 'Encryption at rest and transit', desc: 'All data is encrypted using industry-standard AES-256 and TLS 1.3.' },
        { icon: '👁️', title: 'No advertising tracking', desc: 'Heritage does not use advertising networks or cross-site tracking cookies.' },
        { icon: '✅', title: 'Admin actions are logged', desc: 'Every admin action on user data or family trees is permanently logged.' },
    ];

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg" style={{ background: BROWN }}>🌐</div>
                <h1 className="text-2xl font-black mb-2" style={{ color: CHARCOAL }}>Platform Transparency</h1>
                <p className="text-sm" style={{ color: '#888' }}>Last updated: March 2026</p>
                <p className="text-sm mt-3 leading-relaxed max-w-xl mx-auto" style={{ color: '#666' }}>
                    Heritage is committed to operating openly and honestly. This page publishes our moderation actions, data practices, and governance decisions.
                </p>
            </div>

            {/* Moderation Stats */}
            <Section title="📊 Monthly Moderation Report — March 2026">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center p-4 rounded-xl" style={{ background: CREAM }}>
                            <p className="text-xl font-black" style={{ color: BROWN }}>{s.value}</p>
                            <p className="text-xs mt-1" style={{ color: '#666' }}>{s.label}</p>
                        </div>
                    ))}
                </div>
                <p className="text-xs mt-4" style={{ color: '#aaa' }}>
                    Reports are reviewed by the Heritage moderation team within 24–48 hours. All decisions are made by human reviewers.
                </p>
            </Section>

            {/* Audit Log */}
            <Section title="📋 Recent Moderation Actions (Public Log)">
                <div className="space-y-3">
                    {auditLog.map((entry, i) => (
                        <div key={i} className="p-4 rounded-xl animate-fade-in-up" style={{ background: CREAM, animationDelay: `${i * 0.05}s` }}>
                            <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                                <span className="text-sm font-bold" style={{ color: CHARCOAL }}>{entry.action}</span>
                                <span className="text-xs" style={{ color: '#bbb' }}>{entry.date}</span>
                            </div>
                            <p className="text-xs" style={{ color: '#555' }}>{entry.description}</p>
                            <p className="text-xs mt-1" style={{ color: '#aaa' }}>By: {entry.actor}</p>
                        </div>
                    ))}
                </div>
                <p className="text-xs mt-4 text-center" style={{ color: '#aaa' }}>
                    Identities of individuals involved in moderation actions are anonymized for privacy protection.
                </p>
            </Section>

            {/* Data Commitments */}
            <Section title="🔒 Data & Privacy Commitments">
                <div className="space-y-3">
                    {dataCommitments.map((c, i) => (
                        <div key={i} className="flex items-start gap-4 p-3 rounded-xl" style={{ background: CREAM }}>
                            <span className="text-2xl flex-shrink-0">{c.icon}</span>
                            <div>
                                <p className="font-semibold text-sm" style={{ color: CHARCOAL }}>{c.title}</p>
                                <p className="text-xs mt-0.5" style={{ color: '#666' }}>{c.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Heritage Council */}
            <Section title="👥 Heritage Council (Platform Governance)">
                <p className="text-sm mb-4" style={{ color: '#555' }}>
                    Heritage is governed by a Heritage Council — an independent body of community representatives, cultural stewards, and technical experts who oversee platform decisions affecting all users.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        { role: 'Cultural Steward', icon: '🏛️', desc: 'Represents Cameroonian cultural and traditional values' },
                        { role: 'Community Advocate', icon: '👥', desc: 'Represents user interests and resolves systemic disputes' },
                        { role: 'Technical Advisor', icon: '⚙️', desc: 'Reviews platform integrity, privacy, and security practices' },
                    ].map((member, i) => (
                        <div key={i} className="p-4 rounded-xl text-center" style={{ background: CREAM }}>
                            <span className="text-3xl">{member.icon}</span>
                            <p className="font-bold text-sm mt-2" style={{ color: CHARCOAL }}>{member.role}</p>
                            <p className="text-xs mt-1" style={{ color: '#888' }}>{member.desc}</p>
                        </div>
                    ))}
                </div>
                <p className="text-xs mt-4 text-center" style={{ color: '#aaa' }}>
                    Council seats are filled via community nomination. Applications open Q3 2026.
                </p>
            </Section>

            <div className="text-center py-4">
                <p className="text-xs" style={{ color: '#bbb' }}>Transparency report updated monthly. Contact <span style={{ color: BROWN }}>governance@heritage.cm</span> for questions.</p>
            </div>
        </div>
    );
}
