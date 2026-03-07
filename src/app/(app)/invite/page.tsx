'use client';

import React, { useState } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { Icons, Avatar } from '@/components/shared';

const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';
const GREEN = '#2F5D50';

export default function InvitePage() {
    const { currentUser } = useHeritage();
    const [phoneNumbers, setPhoneNumbers] = useState('');
    const [sent, setSent] = useState(false);
    const [copied, setCopied] = useState(false);

    const referralCode = currentUser ? `${currentUser.username.toUpperCase()}-HERITAGE` : 'HERITAGE';
    const referralLink = `https://heritage.cm/register?ref=${referralCode}`;
    const whatsappMsg = encodeURIComponent(
        `🌍 I'm building our family tree on Heritage — the digital platform for preserving Cameroonian lineage.\n\nJoin here and connect with us: ${referralLink}`
    );

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleSend = () => {
        if (!phoneNumbers.trim()) return;
        setSent(true);
        setPhoneNumbers('');
        setTimeout(() => setSent(false), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: BROWN }}>
                    <span className="text-3xl">📲</span>
                </div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: CHARCOAL }}>Invite Your Relatives</h1>
                <p className="text-sm" style={{ color: '#888' }}>
                    Every family is stronger with more members. Invite relatives to join Heritage and start building your family tree together.
                </p>
            </div>

            <div className="space-y-4">
                {/* Referral link */}
                <div className="p-5 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                    <h2 className="font-bold text-sm mb-3 uppercase tracking-wider" style={{ color: BROWN }}>Your Referral Link</h2>
                    <div className="flex gap-2">
                        <div className="flex-1 px-4 py-3 rounded-xl text-sm font-mono truncate"
                            style={{ background: CREAM, border: '1px solid rgba(92,58,33,0.15)', color: CHARCOAL }}>
                            {referralLink}
                        </div>
                        <button onClick={handleCopy}
                            className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex-shrink-0"
                            style={{
                                background: copied ? `${GREEN}15` : BROWN,
                                color: copied ? GREEN : CREAM,
                                border: copied ? `1px solid ${GREEN}40` : 'none',
                            }}>
                            {copied ? '✓ Copied!' : 'Copy'}
                        </button>
                    </div>
                    <p className="text-xs mt-2" style={{ color: '#aaa' }}>
                        Your referral code: <strong style={{ color: BROWN }}>{referralCode}</strong>
                    </p>
                </div>

                {/* WhatsApp */}
                <div className="p-5 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                    <h2 className="font-bold text-sm mb-3 uppercase tracking-wider" style={{ color: BROWN }}>Share via WhatsApp</h2>
                    <a href={`https://wa.me/?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl font-bold transition-all"
                        style={{ background: '#25D366', color: 'white' }}>
                        <span className="text-xl">💬</span>
                        Share on WhatsApp
                    </a>
                    <p className="text-xs text-center mt-2" style={{ color: '#aaa' }}>Opens WhatsApp with a pre-written message</p>
                </div>

                {/* Phone number invite */}
                <div className="p-5 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                    <h2 className="font-bold text-sm mb-3 uppercase tracking-wider" style={{ color: BROWN }}>Send SMS Invites</h2>
                    <div>
                        <label className="input-label">Phone numbers (separated by commas)</label>
                        <textarea
                            value={phoneNumbers}
                            onChange={e => setPhoneNumbers(e.target.value)}
                            className="input-field min-h-[80px] resize-none"
                            placeholder="+237 677 000 000, +237 699 000 000, ..."
                        />
                    </div>
                    <button onClick={handleSend} disabled={!phoneNumbers.trim()}
                        className="btn-primary w-full mt-3 disabled:opacity-40"
                        style={{ background: GOLD, color: CHARCOAL }}>
                        {sent ? '✓ Invites Sent!' : 'Send Invites'}
                    </button>
                </div>

                {/* Email share */}
                <div className="p-5 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                    <h2 className="font-bold text-sm mb-3 uppercase tracking-wider" style={{ color: BROWN }}>Share via Email</h2>
                    <a href={`mailto:?subject=Join me on Heritage — Preserving our family lineage&body=${encodeURIComponent(`Hi,\n\nI'm building our family tree on Heritage, a platform for preserving Cameroonian family identity.\n\nJoin here: ${referralLink}\n\nOnce you're in, look for me and we can start connecting our trees.\n\n${currentUser?.fullName}`)}`}
                        className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl font-bold border transition-all"
                        style={{ borderColor: 'rgba(92,58,33,0.2)', color: BROWN }}>
                        <span className="text-xl">✉️</span>
                        Open Email
                    </a>
                </div>

                {/* Streak/engagement */}
                <div className="p-5 rounded-2xl text-center"
                    style={{ background: `linear-gradient(135deg, ${BROWN} 0%, #422917 100%)` }}>
                    <p className="text-2xl mb-2">🔥</p>
                    <p className="font-bold text-base mb-1" style={{ color: CREAM }}>Referral Streak</p>
                    <p className="text-sm mb-3" style={{ color: 'rgba(244,239,230,0.7)' }}>
                        Invite 5 relatives to unlock a special <span style={{ color: GOLD }}>Heritage Guardian</span> badge on your profile.
                    </p>
                    <div className="flex justify-center gap-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm"
                                style={{
                                    borderColor: i < 1 ? GOLD : 'rgba(244,239,230,0.2)',
                                    background: i < 1 ? `${GOLD}20` : 'transparent',
                                    color: i < 1 ? GOLD : 'rgba(244,239,230,0.3)',
                                }}>
                                {i < 1 ? '✓' : i + 1}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs mt-3" style={{ color: 'rgba(244,239,230,0.4)' }}>1 of 5 relatives invited</p>
                </div>
            </div>
        </div>
    );
}
