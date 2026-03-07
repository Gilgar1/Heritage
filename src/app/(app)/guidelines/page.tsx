'use client';

import React from 'react';

const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';
const GREEN = '#2F5D50';

const Section = ({ id, title, emoji, children }: { id?: string; title: string; emoji: string; children: React.ReactNode }) => (
    <section id={id} className="p-6 rounded-2xl mb-4" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.08)' }}>
        <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{emoji}</span>
            <h2 className="text-lg font-bold" style={{ color: CHARCOAL }}>{title}</h2>
        </div>
        {children}
    </section>
);

const Rule = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
    <div className="flex gap-4 py-3 border-b last:border-0" style={{ borderColor: 'rgba(92,58,33,0.06)' }}>
        <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
        <div>
            <p className="font-semibold text-sm mb-0.5" style={{ color: CHARCOAL }}>{title}</p>
            <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{children}</p>
        </div>
    </div>
);

export default function GuidelinesPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg" style={{ background: BROWN }}>📜</div>
                <h1 className="text-2xl font-black mb-2" style={{ color: CHARCOAL }}>Community Guidelines</h1>
                <p className="text-sm" style={{ color: '#888' }}>Last updated: March 2026 · Version 1.0</p>
                <p className="text-sm mt-3 leading-relaxed max-w-xl mx-auto" style={{ color: '#666' }}>
                    Heritage exists to preserve African family identity with dignity and respect. These guidelines protect every user, family, and memory on the platform.
                </p>
            </div>

            {/* Core Values */}
            <div className="p-5 rounded-2xl mb-6 text-center" style={{ background: `linear-gradient(135deg, ${BROWN} 0%, #422917 100%)` }}>
                <p className="font-bold text-base mb-3" style={{ color: CREAM }}>Our Three Pillars</p>
                <div className="grid grid-cols-3 gap-3">
                    {[{ icon: '🌿', label: 'Respect', sub: 'For identity and memory' }, { icon: '🔒', label: 'Privacy', sub: 'Data is never for sale' }, { icon: '🤝', label: 'Truth', sub: 'Accuracy in lineage' }].map((p, i) => (
                        <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(244,239,230,0.08)' }}>
                            <p className="text-2xl mb-1">{p.icon}</p>
                            <p className="text-sm font-bold" style={{ color: CREAM }}>{p.label}</p>
                            <p className="text-xs" style={{ color: 'rgba(244,239,230,0.6)' }}>{p.sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Section id="content" title="Content Standards" emoji="📝">
                <Rule icon="✅" title="Share authentic content">
                    Only post content you own or have explicit permission to share. Accurately represent people, events, and dates. Do not fabricate family relationships or historical facts.
                </Rule>
                <Rule icon="🚫" title="No harmful or offensive content">
                    Content that is hateful, discriminatory, sexually explicit, or threatening is strictly prohibited. Respect for cultural practices and traditional values is expected at all times.
                </Rule>
                <Rule icon="📸" title="Media responsibility">
                    Only upload photos, videos, or audio to family albums you are a member of. Tag people accurately and do not upload media of individuals without consent.
                </Rule>
                <Rule icon="🕯️" title="Tribute dignity">
                    Tributes to deceased individuals must be respectful and truthful. Tribute posts require family approval before publication. False or malicious tributes will be removed immediately.
                </Rule>
            </Section>

            <Section id="identity" title="Identity & Accuracy" emoji="🪪">
                <Rule icon="👤" title="Use your real identity">
                    Profiles must represent real individuals. Impersonating another person, creating fake accounts, or misrepresenting your identity will result in immediate removal.
                </Rule>
                <Rule icon="🌿" title="Family tree accuracy">
                    Your family tree must reflect true biological, adoptive, or traditional relationships. Do not add fictional entries, link unrelated individuals, or create impossible relationships.
                </Rule>
                <Rule icon="🔍" title="Duplicate profiles">
                    If you notice a duplicate profile of a real person, use the merge request system to report it rather than creating conflicting records.
                </Rule>
                <Rule icon="✅" title="Verification">
                    The Heritage verification badge confirms your real identity was reviewed by our team. Do not attempt to mislead any verification process.
                </Rule>
            </Section>

            <Section id="privacy" title="Privacy & Safety" emoji="🔒">
                <Rule icon="🔒" title="Respect others' privacy settings">
                    Do not screenshot and share content from private profiles or family-only sections. Hidden living members must not be identified or exposed publicly.
                </Rule>
                <Rule icon="🚫" title="No harassment or bullying">
                    Any form of harassment, intimidation, or targeted abuse toward any user or family group is a serious violation. This includes messaging, comments, tribute posts, and profile reports.
                </Rule>
                <Rule icon="👶" title="Children's protection">
                    Do not publicly post identifying information about minors. Children under 16 should only appear in family-only or private albums with parental consent.
                </Rule>
                <Rule icon="🔕" title="Blocking and muting">
                    You always have the right to block any user. Blocked users cannot see your profile, contact you, or tag you in content.
                </Rule>
            </Section>

            <Section id="governance" title="Family Governance" emoji="⚖️">
                <Rule icon="👑" title="Creator responsibilities">
                    Family Creators are responsible for the integrity of their family space. This includes approving members, managing tributes, and upholding these guidelines within their family.
                </Rule>
                <Rule icon="🗳️" title="Governance decisions">
                    Major family decisions must go through the governance vote system. Editors and Creators must not use their role to impose unilateral changes that affect all members.
                </Rule>
                <Rule icon="💔" title="Disputes">
                    All family disputes must be submitted through the Heritage dispute resolution system. Community-level conflicts may be escalated to the Heritage moderation team.
                </Rule>
                <Rule icon="🔄" title="Deletion">
                    Family deletion requests are subject to a 7-day freeze period. All custodians will be notified. The Heritage admin team can override deletion if it endangers important lineage records.
                </Rule>
            </Section>

            <Section id="enforcement" title="Enforcement" emoji="🛡️">
                <div className="space-y-3">
                    {[
                        { level: 'Warning', color: '#ED8B00', desc: 'A formal warning for first-time or minor violations. No restrictions applied.' },
                        { level: 'Content Removal', color: BROWN, desc: 'The offending post, photo, tribute, or comment is removed by the moderation team.' },
                        { level: 'Feature Restriction', color: '#C62828', desc: 'Access to specific features (posting, tree editing, messaging) is temporarily suspended.' },
                        { level: 'Account Suspension', color: '#C62828', desc: 'Full account suspended for a defined period. All access removed.' },
                        { level: 'Permanent Removal', color: '#1F1F1F', desc: 'Account permanently banned. Family memberships dissolved. Cannot re-register.' },
                    ].map((level, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: CREAM }}>
                            <span className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ background: level.color }} />
                            <div>
                                <p className="text-sm font-bold" style={{ color: CHARCOAL }}>{level.level}</p>
                                <p className="text-xs mt-0.5" style={{ color: '#666' }}>{level.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs mt-4" style={{ color: '#aaa' }}>
                    You may appeal any moderation decision by submitting a request through the Help Center. Appeals are reviewed within 5 business days.
                </p>
            </Section>

            <div className="text-center py-4">
                <p className="text-xs" style={{ color: '#bbb' }}>
                    By using Heritage, you agree to these guidelines. Questions? Contact <span style={{ color: BROWN }}>support@heritage.cm</span>
                </p>
            </div>
        </div>
    );
}
