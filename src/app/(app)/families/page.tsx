'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar, PrivacyBadge, Icons, EmptyState, Modal, Tabs } from '@/components/shared';
import { useRouter } from 'next/navigation';

export default function FamiliesPage() {
    const { currentUser, families, getUserFamilies, getUserRoleInFamily } = useHeritage();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('my');
    const [searchQuery, setSearchQuery] = useState('');

    const myFamilies = currentUser ? getUserFamilies(currentUser.id) : [];
    const discoverFamilies = families.filter(f =>
        f.privacy === 'public' &&
        !myFamilies.some(mf => mf.id === f.id)
    );

    const displayFamilies = activeTab === 'my' ? myFamilies : discoverFamilies;
    const filteredFamilies = displayFamilies.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-surface-100">Families</h1>
                    <p className="text-surface-400 text-sm mt-1">Build and explore family trees</p>
                </div>
                <Link href="/families/create" className="btn-primary">
                    <Icons.Plus />
                    Create Family
                </Link>
            </div>

            {/* Search */}
            <div className="mb-4">
                <div className="relative">
                    <Icons.Search />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="input-field pl-10"
                        placeholder="Search families..."
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">
                        <Icons.Search />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs
                tabs={[
                    { id: 'my', label: 'My Families', count: myFamilies.length },
                    { id: 'discover', label: 'Discover', count: discoverFamilies.length },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {/* Families Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {filteredFamilies.map((family, index) => {
                    const role = currentUser ? getUserRoleInFamily(currentUser.id, family.id) : null;
                    return (
                        <Link
                            key={family.id}
                            href={`/families/${family.id}`}
                            className="glass-card glass-card-hover p-5 transition-all animate-fade-in-up group"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl gradient-heritage flex items-center justify-center text-white font-bold text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                                    {family.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-bold text-surface-100 truncate">{family.name}</h3>
                                        <PrivacyBadge privacy={family.privacy} />
                                    </div>
                                    <p className="text-sm text-surface-400 mt-1 line-clamp-2">{family.description}</p>

                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="text-xs text-surface-500 flex items-center gap-1">
                                            <Icons.Users />
                                            {family.memberCount} members
                                        </span>
                                        {role && <span className="badge-role">{role}</span>}
                                        {family.status === 'frozen' && (
                                            <span className="badge-pending text-xs px-2 py-0.5 rounded-full">Frozen</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {filteredFamilies.length === 0 && (
                <EmptyState
                    icon={<Icons.Users />}
                    title={activeTab === 'my' ? 'No families yet' : 'No families to discover'}
                    description={activeTab === 'my' ? 'Create your first family to start preserving your heritage.' : 'All public families are either yours or hidden.'}
                    action={
                        activeTab === 'my' ? (
                            <Link href="/families/create" className="btn-primary">
                                <Icons.Plus /> Create Family
                            </Link>
                        ) : undefined
                    }
                />
            )}
        </div>
    );
}
