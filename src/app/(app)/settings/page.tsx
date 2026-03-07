'use client';

import React, { useState } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { Icons, Tabs } from '@/components/shared';

const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';
const GREEN = '#2F5D50';

const Toggle = ({ checked, onChange, label, sublabel }: {
    checked: boolean; onChange: (v: boolean) => void; label: string; sublabel?: string;
}) => (
    <div className="flex items-center justify-between py-3">
        <div>
            <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>{label}</p>
            {sublabel && <p className="text-xs mt-0.5" style={{ color: '#888' }}>{sublabel}</p>}
        </div>
        <button
            onClick={() => onChange(!checked)}
            className="relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
            style={{ background: checked ? BROWN : '#d1d5db' }}
        >
            <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                style={{ transform: checked ? 'translateX(26px)' : 'translateX(2px)' }} />
        </button>
    </div>
);

const VisibilityPicker = ({ value, onChange }: {
    value: string; onChange: (v: string) => void;
}) => {
    const opts = [
        { v: 'public', label: '🌍 Public', desc: 'Anyone can see' },
        { v: 'family', label: '👨‍👩‍👧 Family', desc: 'Family members only' },
        { v: 'friends', label: '👥 Friends', desc: 'Friends only' },
        { v: 'private', label: '🔒 Private', desc: 'Only you' },
    ];
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {opts.map(o => (
                <button key={o.v} onClick={() => onChange(o.v)}
                    className="py-2 px-3 rounded-xl text-xs font-semibold border-2 transition-all text-center"
                    style={value === o.v
                        ? { borderColor: BROWN, background: `${BROWN}10`, color: BROWN }
                        : { borderColor: 'rgba(92,58,33,0.15)', color: '#888', background: 'transparent' }}>
                    <div>{o.label}</div>
                    <div className="font-normal mt-0.5" style={{ color: '#aaa', fontSize: '10px' }}>{o.desc}</div>
                </button>
            ))}
        </div>
    );
};

export default function SettingsPage() {
    const { currentUser, updateUserProfile } = useHeritage();
    const [tab, setTab] = useState('privacy');
    const [saved, setSaved] = useState(false);

    // Local copies of settings
    const [privacy, setPrivacy] = useState({
        profileVisibility: (currentUser as any)?.profileVisibility || 'public',
        birthDateVisible: currentUser?.birthDateVisible ?? true,
        friendListVisible: currentUser?.friendListVisible ?? true,
        connectionsVisible: currentUser?.connectionsVisible ?? true,
    });

    const [notifications, setNotifications] = useState({
        notifyFriendRequests: (currentUser as any)?.notifyFriendRequests ?? true,
        notifyTributes: (currentUser as any)?.notifyTributes ?? true,
        notifyFamilyEvents: (currentUser as any)?.notifyFamilyEvents ?? true,
        notifyTreeEdits: (currentUser as any)?.notifyTreeEdits ?? true,
        notifyMessages: (currentUser as any)?.notifyMessages ?? true,
        notifyGovernance: (currentUser as any)?.notifyGovernance ?? true,
    });

    const [blockedUsers] = useState<string[]>([]);

    const handleSavePrivacy = () => {
        if (!currentUser) return;
        updateUserProfile(currentUser.id, privacy as any);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleSaveNotifications = () => {
        if (!currentUser) return;
        updateUserProfile(currentUser.id, notifications as any);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (!currentUser) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold" style={{ color: CHARCOAL }}>Settings</h1>
                {saved && (
                    <span className="text-sm font-semibold px-3 py-1 rounded-full animate-fade-in"
                        style={{ background: `${GREEN}15`, color: GREEN }}>
                        ✓ Saved
                    </span>
                )}
            </div>

            <Tabs
                tabs={[
                    { id: 'privacy', label: '🔒 Privacy' },
                    { id: 'notifications', label: '🔔 Notifications' },
                    { id: 'verification', label: '✅ Verification' },
                    { id: 'data', label: '📦 Data' },
                    { id: 'account', label: '⚙️ Account' },
                ]}
                activeTab={tab}
                onChange={setTab}
            />

            <div className="mt-6 space-y-4">

                {/* ─── PRIVACY ─── */}
                {tab === 'privacy' && (
                    <div className="space-y-4 animate-fade-in">
                        {/* Profile Visibility */}
                        <div className="p-6 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                            <h2 className="font-bold text-base mb-1" style={{ color: CHARCOAL }}>Profile Visibility</h2>
                            <p className="text-xs mb-3" style={{ color: '#888' }}>Who can view your full profile?</p>
                            <VisibilityPicker
                                value={privacy.profileVisibility}
                                onChange={v => setPrivacy(p => ({ ...p, profileVisibility: v }))}
                            />
                        </div>

                        {/* Field Visibility */}
                        <div className="p-6 rounded-2xl divide-y" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)', borderColor: 'rgba(92,58,33,0.1)' }}>
                            <h2 className="font-bold text-base mb-2" style={{ color: CHARCOAL }}>Field Visibility</h2>
                            <Toggle
                                label="Show Birth Date"
                                sublabel="Display your date of birth on your profile"
                                checked={privacy.birthDateVisible}
                                onChange={v => setPrivacy(p => ({ ...p, birthDateVisible: v }))}
                            />
                            <Toggle
                                label="Show Friend List"
                                sublabel="Others can see who your friends are"
                                checked={privacy.friendListVisible}
                                onChange={v => setPrivacy(p => ({ ...p, friendListVisible: v }))}
                            />
                            <Toggle
                                label="Show Connections"
                                sublabel="Display your family connections"
                                checked={privacy.connectionsVisible}
                                onChange={v => setPrivacy(p => ({ ...p, connectionsVisible: v }))}
                            />
                        </div>

                        {/* Block List */}
                        <div className="p-6 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                            <h2 className="font-bold text-base mb-3" style={{ color: CHARCOAL }}>Blocked Users</h2>
                            {blockedUsers.length === 0 ? (
                                <p className="text-sm" style={{ color: '#999' }}>You have not blocked anyone.</p>
                            ) : (
                                <div className="space-y-2">
                                    {blockedUsers.map(uid => (
                                        <div key={uid} className="flex items-center justify-between">
                                            <span className="text-sm" style={{ color: CHARCOAL }}>{uid}</span>
                                            <button className="text-xs text-red-600 font-semibold">Unblock</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button onClick={handleSavePrivacy} className="btn-primary w-full"
                            style={{ background: GOLD, color: CHARCOAL }}>
                            Save Privacy Settings
                        </button>
                    </div>
                )}

                {/* ─── NOTIFICATIONS ─── */}
                {tab === 'notifications' && (
                    <div className="animate-fade-in">
                        <div className="p-6 rounded-2xl divide-y" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                            <h2 className="font-bold text-base mb-2" style={{ color: CHARCOAL }}>Notification Preferences</h2>
                            {[
                                { key: 'notifyFriendRequests', label: 'Friend Requests', sub: 'When someone sends you a friend request' },
                                { key: 'notifyTributes', label: 'Tribute Activity', sub: 'Tribute submissions and approvals' },
                                { key: 'notifyFamilyEvents', label: 'Family Events', sub: 'Event creation and RSVP reminders' },
                                { key: 'notifyTreeEdits', label: 'Tree Edits', sub: 'When your family tree is updated' },
                                { key: 'notifyMessages', label: 'Messages', sub: 'New direct messages and family threads' },
                                { key: 'notifyGovernance', label: 'Governance & Voting', sub: 'Active votes and governance decisions' },
                            ].map(({ key, label, sub }) => (
                                <Toggle
                                    key={key}
                                    label={label}
                                    sublabel={sub}
                                    checked={notifications[key as keyof typeof notifications]}
                                    onChange={v => setNotifications(n => ({ ...n, [key]: v }))}
                                />
                            ))}
                        </div>
                        <button onClick={handleSaveNotifications} className="btn-primary w-full mt-4"
                            style={{ background: GOLD, color: CHARCOAL }}>
                            Save Notification Settings
                        </button>
                    </div>
                )}

                {/* ─── VERIFICATION ─── */}
                {tab === 'verification' && (
                    <div className="animate-fade-in space-y-4">
                        {/* Status */}
                        <div className="p-6 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                            <h2 className="font-bold text-base mb-4" style={{ color: CHARCOAL }}>Identity Verification</h2>
                            <div className="flex items-center gap-4 p-4 rounded-xl mb-4"
                                style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}30` }}>
                                <span className="text-3xl">🪪</span>
                                <div>
                                    <p className="font-semibold text-sm" style={{ color: CHARCOAL }}>Current Status:
                                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold"
                                            style={{ background: `${GOLD}20`, color: BROWN }}>
                                            Unverified
                                        </span>
                                    </p>
                                    <p className="text-xs mt-1" style={{ color: '#888' }}>
                                        Verified users receive a gold ✓ badge on their profile and in search results.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>Submit for Verification</p>
                                <div>
                                    <label className="input-label">Full Legal Name (as on ID)</label>
                                    <input type="text" className="input-field" placeholder="e.g. Ambe Pierre Nkeng" />
                                </div>
                                <div>
                                    <label className="input-label">Document Type</label>
                                    <select className="input-field">
                                        <option>National ID Card</option>
                                        <option>Passport</option>
                                        <option>Voter Card</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="input-label">Upload ID Document (front)</label>
                                    <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
                                        style={{ borderColor: 'rgba(92,58,33,0.2)' }}>
                                        <p className="text-sm" style={{ color: '#888' }}>📎 Click to upload or drag & drop</p>
                                        <p className="text-xs mt-1" style={{ color: '#bbb' }}>JPG, PNG or PDF · Max 5MB</p>
                                    </div>
                                </div>
                                <button className="btn-primary w-full" style={{ background: BROWN, color: CREAM }}>
                                    Submit for Verification
                                </button>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl" style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}20` }}>
                            <p className="text-xs font-semibold" style={{ color: GREEN }}>🔒 Privacy Note</p>
                            <p className="text-xs mt-1" style={{ color: '#666' }}>
                                Your ID document is reviewed only by Heritage admins and is never shared publicly. Verification decisions are made within 3–5 business days.
                            </p>
                        </div>
                    </div>
                )}

                {/* ─── DATA OWNERSHIP ─── */}
                {tab === 'data' && (
                    <div className="animate-fade-in space-y-4">
                        <div className="p-6 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                            <h2 className="font-bold text-base mb-4" style={{ color: CHARCOAL }}>Your Data</h2>
                            <div className="space-y-3">
                                <div className="p-4 rounded-xl flex items-center justify-between"
                                    style={{ background: CREAM, border: '1px solid rgba(92,58,33,0.1)' }}>
                                    <div>
                                        <p className="font-semibold text-sm" style={{ color: CHARCOAL }}>Export My Data</p>
                                        <p className="text-xs" style={{ color: '#888' }}>Download all your posts, family tree data, and media</p>
                                    </div>
                                    <button className="btn-secondary btn-sm">Request Export</button>
                                </div>
                                <div className="p-4 rounded-xl flex items-center justify-between"
                                    style={{ background: CREAM, border: '1px solid rgba(92,58,33,0.1)' }}>
                                    <div>
                                        <p className="font-semibold text-sm" style={{ color: CHARCOAL }}>Family Archive Backup</p>
                                        <p className="text-xs" style={{ color: '#888' }}>Download your family tree as PDF or JSON</p>
                                    </div>
                                    <button className="btn-secondary btn-sm">Download</button>
                                </div>
                                <div className="p-4 rounded-xl flex items-center justify-between"
                                    style={{ background: CREAM, border: '1px solid rgba(92,58,33,0.1)' }}>
                                    <div>
                                        <p className="font-semibold text-sm" style={{ color: CHARCOAL }}>Consent Management</p>
                                        <p className="text-xs" style={{ color: '#888' }}>Review what data we store and why</p>
                                    </div>
                                    <button className="btn-secondary btn-sm">Review</button>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="p-6 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(198,40,40,0.2)' }}>
                            <h2 className="font-bold text-base mb-4" style={{ color: '#C62828' }}>Danger Zone</h2>
                            <div className="p-4 rounded-xl" style={{ background: 'rgba(198,40,40,0.05)', border: '1px solid rgba(198,40,40,0.15)' }}>
                                <p className="font-semibold text-sm" style={{ color: CHARCOAL }}>Delete My Account</p>
                                <p className="text-xs mt-1 mb-3" style={{ color: '#888' }}>
                                    This will permanently remove your profile, posts, and media. Your family memberships will be transferred to another member or dissolved. This cannot be undone.
                                </p>
                                <button className="btn-danger btn-sm text-xs">Request Account Deletion</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── ACCOUNT ─── */}
                {tab === 'account' && (
                    <div className="animate-fade-in space-y-4">
                        <div className="p-6 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                            <h2 className="font-bold text-base mb-4" style={{ color: CHARCOAL }}>Account Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="input-label">Email Address</label>
                                    <input type="email" defaultValue={currentUser.email} className="input-field" />
                                </div>
                                <div>
                                    <label className="input-label">Username</label>
                                    <input type="text" defaultValue={currentUser.username} className="input-field" />
                                </div>
                                <div>
                                    <label className="input-label">New Password</label>
                                    <input type="password" placeholder="Leave blank to keep current" className="input-field" />
                                </div>
                                <button className="btn-primary w-full" style={{ background: GOLD, color: CHARCOAL }}>
                                    Update Account
                                </button>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                            <h2 className="font-bold text-base mb-3" style={{ color: CHARCOAL }}>Language Preference</h2>
                            <select className="input-field">
                                <option value="en">🇬🇧 English</option>
                                <option value="fr">🇫🇷 Français</option>
                            </select>
                            <p className="text-xs mt-2" style={{ color: '#888' }}>Full French translation coming soon.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
