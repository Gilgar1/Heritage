'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar, PrivacyBadge, Icons, Modal, Tabs } from '@/components/shared';

export default function MyProfilePage() {
    const { currentUser, updateUserProfile, getUserFamilies, friendships, posts, users } = useHeritage();
    const [activeTab, setActiveTab] = useState('posts');
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState(currentUser || {});

    if (!currentUser) return null;

    const myFamilies = getUserFamilies(currentUser.id);
    const myPosts = posts.filter(p => p.authorId === currentUser.id);
    const friendCount = friendships.filter(f => f.userId === currentUser.id || f.friendId === currentUser.id).length;

    const handleSave = () => {
        updateUserProfile(currentUser.id, editData as any);
        setEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Cover & Profile */}
            <div className="glass-card overflow-hidden mb-6">
                <div className="h-48 gradient-heritage relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900/90 to-transparent" />
                </div>

                <div className="p-6 -mt-16 relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                        <Avatar name={currentUser.fullName} url={currentUser.avatarUrl} size="xl" className="border-4 border-surface-800 shadow-xl" />
                        <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl font-bold text-surface-100">{currentUser.fullName}</h1>
                                {currentUser.traditionalTitle && (
                                    <span className="badge-role">{currentUser.traditionalTitle}</span>
                                )}
                                {currentUser.isDeceased && <span className="badge-deceased px-2 py-0.5 rounded-full text-xs">🕊️ Deceased</span>}
                            </div>
                            <p className="text-surface-400 text-sm mt-1">@{currentUser.username}</p>
                            {currentUser.bio && <p className="text-surface-300 text-sm mt-2">{currentUser.bio}</p>}

                            {/* Identity Info */}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                                {currentUser.tribe && <span className="text-xs text-surface-400">🏛️ {currentUser.tribe}</span>}
                                {currentUser.village && <span className="text-xs text-surface-400">📍 {currentUser.village}</span>}
                                {currentUser.region && <span className="text-xs text-surface-400">🗺️ {currentUser.region}</span>}
                                {currentUser.nativeLanguage && <span className="text-xs text-surface-400">🗣️ {currentUser.nativeLanguage}</span>}
                                {currentUser.birthDate && currentUser.birthDateVisible && (
                                    <span className="text-xs text-surface-400">🎂 {new Date(currentUser.birthDate).toLocaleDateString('en-GB')}</span>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex gap-6 mt-4">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-surface-100">{myFamilies.length}</p>
                                    <p className="text-xs text-surface-500">Families</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-surface-100">{friendCount}</p>
                                    <p className="text-xs text-surface-500">Friends</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-surface-100">{myPosts.length}</p>
                                    <p className="text-xs text-surface-500">Posts</p>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => { setEditData(currentUser); setEditing(true); }} className="btn-secondary btn-sm">
                            <Icons.Settings /> Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Privacy Indicator */}
            <div className="glass-card p-4 mb-4 flex items-center gap-3">
                <Icons.Lock />
                <div className="flex-1">
                    <p className="text-sm font-medium text-surface-200">Privacy Settings</p>
                    <p className="text-xs text-surface-400">
                        Birth date: {currentUser.birthDateVisible ? '✅ Visible' : '🔒 Hidden'} ·
                        Friend list: {currentUser.friendListVisible ? '✅ Visible' : '🔒 Hidden'} ·
                        Connections: {currentUser.connectionsVisible ? '✅ Visible' : '🔒 Hidden'}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs
                tabs={[
                    { id: 'posts', label: 'Posts', count: myPosts.length },
                    { id: 'families', label: 'Families', count: myFamilies.length },
                    { id: 'friends', label: 'Friends', count: friendCount },
                    { id: 'media', label: 'Media' },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            <div className="mt-6">
                {activeTab === 'posts' && (
                    <div className="space-y-4">
                        {myPosts.length > 0 ? myPosts.map(post => (
                            <div key={post.id} className="glass-card p-5">
                                <p className="text-surface-200">{post.content}</p>
                                <div className="flex items-center gap-4 mt-3 text-xs text-surface-500">
                                    <span>❤️ {post.likes.length}</span>
                                    <span>💬 {post.comments.length}</span>
                                    <span>{new Date(post.createdAt).toLocaleDateString('en-GB')}</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-surface-500 py-8">No posts yet</p>
                        )}
                    </div>
                )}

                {activeTab === 'families' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myFamilies.map(f => (
                            <Link key={f.id} href={`/families/${f.id}`} className="glass-card glass-card-hover p-4 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl gradient-heritage flex items-center justify-center text-white font-bold text-lg">{f.name[0]}</div>
                                <div>
                                    <p className="font-semibold text-surface-100">{f.name}</p>
                                    <p className="text-xs text-surface-500">{f.memberCount} members</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {activeTab === 'friends' && (
                    <div className="space-y-3">
                        {friendships.filter(f => f.userId === currentUser.id || f.friendId === currentUser.id).map(f => {
                            const friendId = f.userId === currentUser.id ? f.friendId : f.userId;
                            const friend = users.find(u => u.id === friendId);
                            if (!friend) return null;
                            return (
                                <Link key={f.id} href={`/profile/${friend.id}`} className="glass-card glass-card-hover p-4 flex items-center gap-4">
                                    <Avatar name={friend.fullName} url={friend.avatarUrl} size="md" />
                                    <div>
                                        <p className="font-semibold text-surface-100">{friend.fullName}</p>
                                        <p className="text-xs text-surface-500">{friend.tribe} · {friend.village}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className="text-center py-8 text-surface-500">
                        <p>No media uploaded yet</p>
                        <p className="text-xs mt-1">Photos, videos, and audio clips will appear here</p>
                    </div>
                )}
            </div>

            {/* Edit Profile Modal */}
            <Modal isOpen={editing} onClose={() => setEditing(false)} title="Edit Profile">
                <div className="space-y-4">
                    <div>
                        <label className="input-label">Full Name</label>
                        <input type="text" value={(editData as any).fullName || ''} onChange={e => setEditData(prev => ({ ...prev, fullName: e.target.value }))} className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Bio</label>
                        <textarea value={(editData as any).bio || ''} onChange={e => setEditData(prev => ({ ...prev, bio: e.target.value }))} className="input-field min-h-[80px] resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="input-label">Village</label>
                            <input type="text" value={(editData as any).village || ''} onChange={e => setEditData(prev => ({ ...prev, village: e.target.value }))} className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Tribe</label>
                            <input type="text" value={(editData as any).tribe || ''} onChange={e => setEditData(prev => ({ ...prev, tribe: e.target.value }))} className="input-field" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="input-label">Region</label>
                            <input type="text" value={(editData as any).region || ''} onChange={e => setEditData(prev => ({ ...prev, region: e.target.value }))} className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Native Language</label>
                            <input type="text" value={(editData as any).nativeLanguage || ''} onChange={e => setEditData(prev => ({ ...prev, nativeLanguage: e.target.value }))} className="input-field" />
                        </div>
                    </div>
                    <div>
                        <label className="input-label">Traditional Title</label>
                        <input type="text" value={(editData as any).traditionalTitle || ''} onChange={e => setEditData(prev => ({ ...prev, traditionalTitle: e.target.value }))} className="input-field" placeholder="e.g. Fo'o, Chief, Notable" />
                    </div>

                    {/* Privacy Controls */}
                    <div className="p-4 rounded-xl bg-surface-800 border border-white/5">
                        <p className="text-sm font-semibold text-surface-200 mb-3">🔒 Privacy Controls</p>
                        <div className="space-y-2">
                            {[
                                { key: 'birthDateVisible', label: 'Show birth date' },
                                { key: 'friendListVisible', label: 'Show friend list' },
                                { key: 'connectionsVisible', label: 'Show connections' },
                            ].map(({ key, label }) => (
                                <label key={key} className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-surface-300">{label}</span>
                                    <input
                                        type="checkbox"
                                        checked={(editData as any)[key] ?? true}
                                        onChange={e => setEditData(prev => ({ ...prev, [key]: e.target.checked }))}
                                        className="w-4 h-4 rounded accent-heritage-500"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleSave} className="btn-primary w-full">Save Changes</button>
                </div>
            </Modal>
        </div>
    );
}
