'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar } from '@/components/shared';

const BROWN = '#5C3A21'; const GOLD = '#C6A75E'; const CREAM = '#F4EFE6'; const CHARCOAL = '#1F1F1F'; const GREEN = '#2F5D50';

interface TrustProfile {
    userId: string; name: string; score: number; level: string; levelColor: string; levelIcon: string;
    badges: string[]; breakdown: { label: string; points: number; icon: string }[];
    streak: number; treeStat: number; postsCount: number; verifiedAt?: string;
}

function getTrustLevel(score: number): { level: string; color: string; icon: string } {
    if (score >= 900) return { level: 'Heritage Guardian', color: '#FFD700', icon: '👑' };
    if (score >= 750) return { level: 'Elder', color: GOLD, icon: '🌟' };
    if (score >= 500) return { level: 'Trusted Member', color: GREEN, icon: '✅' };
    if (score >= 250) return { level: 'Active Member', color: BROWN, icon: '🌿' };
    if (score >= 100) return { level: 'New Member', color: '#888', icon: '🌱' };
    return { level: 'Unverified', color: '#C62828', icon: '⚠️' };
}

function ScoreBar({ score, max = 1000 }: { score: number; max?: number }) {
    const pct = Math.min((score / max) * 100, 100);
    const { color } = getTrustLevel(score);
    return (
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(92,58,33,0.08)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: `linear-gradient(to right, ${BROWN}, ${color})` }} />
        </div>
    );
}

export default function TrustScorePage() {
    const { currentUser, users } = useHeritage();
    const [viewUser, setViewUser] = useState<string | null>(null);

    // Build trust profiles for all users
    const profiles: TrustProfile[] = users.filter(u => !u.isDeceased).map(u => {
        const score = Math.floor(Math.random() * 900) + 50;
        const { level, color, icon } = getTrustLevel(score);
        const breakdown = [
            { label: 'Identity Verified', points: u.verificationStatus === 'verified' ? 200 : 0, icon: '✅' },
            { label: 'Family Tree Nodes', points: Math.floor(Math.random() * 150), icon: '🌿' },
            { label: 'Posts & Tributes', points: Math.floor(Math.random() * 100), icon: '📝' },
            { label: 'Tributes Approved', points: Math.floor(Math.random() * 80), icon: '🕯️' },
            { label: 'Community Reports', points: -Math.floor(Math.random() * 30), icon: '⚠️' },
            { label: 'Days Active', points: Math.floor(Math.random() * 200), icon: '🔥' },
            { label: 'Media Uploads', points: Math.floor(Math.random() * 100), icon: '📸' },
        ];
        const badges: string[] = [];
        if (score >= 750) badges.push('⭐ Elder');
        if ((u as any).verificationStatus === 'verified') badges.push('✅ Verified');
        if (Math.random() > 0.5) badges.push('🌿 Tree Builder');
        if (Math.random() > 0.7) badges.push('🕯️ Tribute Keeper');
        if (Math.random() > 0.8) badges.push('👑 Custodian');
        return { userId: u.id, name: u.fullName, score, level, levelColor: color, levelIcon: icon, badges, breakdown, streak: Math.floor(Math.random() * 60), treeStat: Math.floor(Math.random() * 25), postsCount: Math.floor(Math.random() * 40), verifiedAt: (u as any).verificationStatus === 'verified' ? '2026-01-15' : undefined };
    }).sort((a, b) => b.score - a.score);

    const myProfile = profiles.find(p => p.userId === currentUser?.id) || profiles[0];
    const selectedProfile = viewUser ? profiles.find(p => p.userId === viewUser) : myProfile;

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold" style={{ color: CHARCOAL }}>Trust & Reputation</h1>
                <p className="text-sm" style={{ color: '#888' }}>Heritage trust scores reflect identity integrity, activity, and community standing</p>
            </div>

            {/* My score hero */}
            {myProfile && (
                <div className="p-6 rounded-3xl mb-6" style={{ background: `linear-gradient(135deg, ${BROWN} 0%, #2D1A0A 100%)` }}>
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ background: 'rgba(244,239,230,0.1)' }}>{myProfile.levelIcon}</div>
                        <div className="flex-1">
                            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(244,239,230,0.6)' }}>Your Trust Score</p>
                            <p className="text-4xl font-black" style={{ color: CREAM }}>{myProfile.score}<span className="text-lg font-normal opacity-60">/1000</span></p>
                            <p className="text-sm font-semibold mt-0.5" style={{ color: GOLD }}>{myProfile.levelIcon} {myProfile.level}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {myProfile.badges.map(b => (
                                <span key={b} className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(244,239,230,0.1)', color: CREAM }}>{b}</span>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4">
                        <ScoreBar score={myProfile.score} />
                        <div className="flex items-center justify-between mt-1 text-xs" style={{ color: 'rgba(244,239,230,0.5)' }}>
                            <span>0</span>
                            <span>{myProfile.score} pts — {myProfile.level}</span>
                            <span>1000</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                        {[{ label: 'Day Streak', value: `🔥 ${myProfile.streak}d` }, { label: 'Tree Nodes', value: `🌿 ${myProfile.treeStat}` }, { label: 'Posts', value: `📝 ${myProfile.postsCount}` }].map((s, i) => (
                            <div key={i} className="text-center p-3 rounded-xl" style={{ background: 'rgba(244,239,230,0.07)' }}>
                                <p className="font-black text-base" style={{ color: CREAM }}>{s.value}</p>
                                <p className="text-[10px]" style={{ color: 'rgba(244,239,230,0.5)' }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Score breakdown */}
                <div className="p-5 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                    <h2 className="font-bold text-sm mb-4" style={{ color: CHARCOAL }}>Score Breakdown</h2>
                    <div className="space-y-3">
                        {(selectedProfile || myProfile).breakdown.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-lg flex-shrink-0">{item.icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold" style={{ color: CHARCOAL }}>{item.label}</span>
                                        <span className="text-xs font-bold" style={{ color: item.points < 0 ? '#C62828' : GREEN }}>{item.points > 0 ? '+' : ''}{item.points}</span>
                                    </div>
                                    {item.points > 0 && (
                                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(92,58,33,0.08)' }}>
                                            <div className="h-full rounded-full" style={{ width: `${Math.min((item.points / 200) * 100, 100)}%`, background: GREEN }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(92,58,33,0.08)' }}>
                        <span className="text-sm font-bold" style={{ color: CHARCOAL }}>Total Score</span>
                        <span className="text-xl font-black" style={{ color: BROWN }}>{(selectedProfile || myProfile).score}</span>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="p-5 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                    <h2 className="font-bold text-sm mb-4" style={{ color: CHARCOAL }}>Community Leaderboard</h2>
                    <div className="space-y-2">
                        {profiles.slice(0, 8).map((p, i) => {
                            const isMe = p.userId === currentUser?.id;
                            return (
                                <button key={p.userId} onClick={() => setViewUser(p.userId)} className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                                    style={{ background: isMe ? `${GOLD}12` : viewUser === p.userId ? `${BROWN}05` : 'transparent' }}
                                    onMouseEnter={e => { if (!isMe) (e.currentTarget as any).style.background = CREAM; }}
                                    onMouseLeave={e => { if (!isMe) (e.currentTarget as any).style.background = viewUser === p.userId ? `${BROWN}05` : 'transparent'; }}>
                                    <span className="w-6 text-sm font-black text-center flex-shrink-0" style={{ color: i < 3 ? GOLD : '#aaa' }}>
                                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                                    </span>
                                    <Avatar name={p.name} size="xs" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold truncate" style={{ color: CHARCOAL }}>{p.name} {isMe && <span style={{ color: GOLD }}>(You)</span>}</p>
                                        <p className="text-[10px]" style={{ color: '#aaa' }}>{p.levelIcon} {p.level}</p>
                                    </div>
                                    <span className="text-sm font-black flex-shrink-0" style={{ color: p.levelColor }}>{p.score}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* How to improve */}
            <div className="p-5 rounded-2xl mt-6" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                <h2 className="font-bold text-sm mb-4" style={{ color: CHARCOAL }}>How to Improve Your Score</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { icon: '✅', title: 'Verify your identity', pts: '+200 pts', link: '/settings', desc: 'Submit ID for verification' },
                        { icon: '🌿', title: 'Build your family tree', pts: '+5 pts/node', link: '/families', desc: 'Add and verify tree members' },
                        { icon: '🕯️', title: 'Write approved tributes', pts: '+20 pts/tribute', link: '/feed', desc: 'Tributes approved by custodians' },
                        { icon: '📸', title: 'Upload cultural media', pts: '+10 pts/upload', link: '/cultural-archive', desc: 'Contribute to the cultural archive' },
                        { icon: '🔥', title: 'Stay active daily', pts: '+1 pt/day', link: '/feed', desc: 'Log in and contribute daily' },
                        { icon: '🤝', title: 'Connect with family', pts: '+5 pts/connection', link: '/discover', desc: 'Add real relatives to your network' },
                    ].map((tip, i) => (
                        <Link key={i} href={tip.link} className="flex items-start gap-3 p-3 rounded-xl transition-all"
                            style={{ background: CREAM }}
                            onMouseEnter={e => (e.currentTarget as any).style.background = '#ede7da'}
                            onMouseLeave={e => (e.currentTarget as any).style.background = CREAM}>
                            <span className="text-2xl">{tip.icon}</span>
                            <div className="flex-1">
                                <p className="text-sm font-bold" style={{ color: CHARCOAL }}>{tip.title}</p>
                                <p className="text-xs" style={{ color: '#888' }}>{tip.desc}</p>
                            </div>
                            <span className="text-xs font-black flex-shrink-0" style={{ color: GREEN }}>{tip.pts}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
