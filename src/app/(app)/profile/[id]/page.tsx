'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar, Icons, EmptyState } from '@/components/shared';

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getUserById, currentUser, isFriend, sendFriendRequest, unfriend, getUserFamilies, posts, friendships, users, getOrCreateConversation } = useHeritage();

    const user = getUserById(id);

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <EmptyState icon={<Icons.User />} title="User not found" description="This profile doesn't exist." />
            </div>
        );
    }

    // Redirect to own profile
    if (currentUser?.id === id) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="text-center py-8">
                    <p className="text-surface-400 mb-4">This is your profile!</p>
                    <Link href="/profile" className="btn-primary">View My Profile</Link>
                </div>
            </div>
        );
    }

    const areFriends = isFriend(id);
    const userFamilies = getUserFamilies(id);
    const userPosts = posts.filter(p => p.authorId === id && (p.type === 'regular' || p.tributeStatus === 'approved'));
    const friendCount = friendships.filter(f => f.userId === id || f.friendId === id).length;

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Cover & Profile */}
            <div className="glass-card overflow-hidden mb-6">
                <div className="h-40 gradient-heritage relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 to-transparent" />
                </div>

                <div className="p-6 -mt-12 relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                        <Avatar name={user.fullName} url={user.avatarUrl} size="xl" isDeceased={user.isDeceased} className="border-4 border-surface-800" />
                        <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl font-bold text-surface-100">{user.fullName}</h1>
                                {user.traditionalTitle && <span className="badge-role">{user.traditionalTitle}</span>}
                                {user.isDeceased && <span className="badge-deceased px-2 py-0.5 rounded-full text-xs">🕊️ Deceased</span>}
                            </div>
                            <p className="text-surface-400 text-sm">@{user.username}</p>
                            {user.bio && <p className="text-surface-300 text-sm mt-2">{user.bio}</p>}

                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                                {user.tribe && <span className="text-xs text-surface-400">🏛️ {user.tribe}</span>}
                                {user.village && <span className="text-xs text-surface-400">📍 {user.village}</span>}
                                {user.region && <span className="text-xs text-surface-400">🗺️ {user.region}</span>}
                                {user.nativeLanguage && <span className="text-xs text-surface-400">🗣️ {user.nativeLanguage}</span>}
                                {user.birthDate && user.birthDateVisible && (
                                    <span className="text-xs text-surface-400">🎂 {new Date(user.birthDate).toLocaleDateString('en-GB')}</span>
                                )}
                                {user.isDeceased && user.deathDate && (
                                    <span className="text-xs text-gold-400">✝️ {new Date(user.deathDate).toLocaleDateString('en-GB')}</span>
                                )}
                            </div>

                            <div className="flex gap-6 mt-4">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-surface-100">{userFamilies.length}</p>
                                    <p className="text-xs text-surface-500">Families</p>
                                </div>
                                {user.friendListVisible && (
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-surface-100">{friendCount}</p>
                                        <p className="text-xs text-surface-500">Friends</p>
                                    </div>
                                )}
                                <div className="text-center">
                                    <p className="text-lg font-bold text-surface-100">{userPosts.length}</p>
                                    <p className="text-xs text-surface-500">Posts</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {!user.isDeceased && (
                            <div className="flex gap-2">
                                {areFriends ? (
                                    <>
                                        <button onClick={() => unfriend(id)} className="btn-danger btn-sm">Unfriend</button>
                                        <Link href="/messages" onClick={() => getOrCreateConversation(id)} className="btn-primary btn-sm">
                                            <Icons.Message /> Message
                                        </Link>
                                    </>
                                ) : (
                                    <button onClick={() => sendFriendRequest(id)} className="btn-primary">
                                        <Icons.UserPlus /> Add Friend
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* User's Posts */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-surface-200">Posts</h2>
                {userPosts.length > 0 ? userPosts.map(post => (
                    <div key={post.id} className="glass-card p-5">
                        <p className="text-surface-200">{post.content}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-surface-500">
                            <span>❤️ {post.likes.length}</span>
                            <span>💬 {post.comments.length}</span>
                            <span>{new Date(post.createdAt).toLocaleDateString('en-GB')}</span>
                        </div>
                    </div>
                )) : (
                    <p className="text-surface-500 text-center py-8">No public posts</p>
                )}
            </div>
        </div>
    );
}
