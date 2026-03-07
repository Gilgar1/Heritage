'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar, Icons, EmptyState, Tabs, Modal } from '@/components/shared';

export default function AdminDashboardPage() {
    const { isAdmin, users, families, deletionRequests, approveFamilyDeletion, suspendUser, freezeFamily } = useHeritage();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [suspendModal, setSuspendModal] = useState<string | null>(null);

    // Security check
    if (!isAdmin) {
        if (typeof window !== 'undefined') router.push('/');
        return null;
    }

    const pendingDeletions = deletionRequests.filter(r => r.status === 'pending');

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-6">
                <Icons.Shield />
                <h1 className="text-2xl font-bold text-surface-100">Admin Dashboard</h1>
            </div>

            <Tabs
                tabs={[
                    { id: 'overview', label: 'Overview' },
                    { id: 'deletions', label: 'Family Deletions', count: pendingDeletions.length },
                    { id: 'users', label: 'Manage Users' },
                    { id: 'families', label: 'Manage Families' },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            <div className="mt-6">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-card p-6 border-heritage-500/20">
                            <p className="text-surface-400 text-sm font-semibold mb-2">Total Users</p>
                            <p className="text-3xl font-bold text-surface-100">{users.length}</p>
                        </div>
                        <div className="glass-card p-6 border-gold-500/20">
                            <p className="text-surface-400 text-sm font-semibold mb-2">Total Families</p>
                            <p className="text-3xl font-bold text-surface-100">{families.length}</p>
                        </div>
                        <div className="glass-card p-6 border-danger/20">
                            <p className="text-surface-400 text-sm font-semibold mb-2">Pending Deletions</p>
                            <p className="text-3xl font-bold text-surface-100 text-danger">{pendingDeletions.length}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'deletions' && (
                    <div className="space-y-4">
                        {pendingDeletions.length > 0 ? pendingDeletions.map(req => (
                            <div key={req.id} className="glass-card p-5 border-danger/30">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-surface-200">Delete Family: {req.familyName}</h3>
                                        <p className="text-sm text-surface-400 mt-1">Requested by: {req.requestedByName}</p>
                                        <p className="text-xs text-surface-500 mt-2">
                                            <span className="text-warning font-semibold">Freeze Period Ends: </span>
                                            {new Date(req.freezeExpiresAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <button onClick={() => approveFamilyDeletion(req.id)} className="btn-danger p-2">
                                            Approve Deletion
                                        </button>
                                        <button className="btn-secondary p-2 border-surface-600">Reject</button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <EmptyState icon={<Icons.Check />} title="All Clear" description="No pending family deletion requests." />
                        )}
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-surface-300">
                                <thead className="bg-surface-800/80 uppercase text-xs font-semibold text-surface-500">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4">Joined</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <Avatar name={u.fullName} url={u.avatarUrl} size="sm" isDeceased={u.isDeceased} />
                                                <div>
                                                    <p className="font-semibold text-surface-200">{u.fullName}</p>
                                                    <p className="text-xs text-surface-500">{u.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {u.tribe || '—'} · {u.village || '—'}
                                            </td>
                                            <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => setSuspendModal(u.id)} className="text-danger hover:text-red-400 font-medium">Suspend</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'families' && (
                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-surface-300">
                                <thead className="bg-surface-800/80 uppercase text-xs font-semibold text-surface-500">
                                    <tr>
                                        <th className="px-6 py-4">Family</th>
                                        <th className="px-6 py-4">Members</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {families.map(f => (
                                        <tr key={f.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-surface-200">{f.name}</p>
                                                <p className="text-xs text-surface-500 capitalize">{f.privacy}</p>
                                            </td>
                                            <td className="px-6 py-4">{f.memberCount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${f.status === 'active' ? 'bg-success/20 text-success' :
                                                    f.status === 'frozen' ? 'bg-warning/20 text-warning' : 'bg-danger/20 text-danger'
                                                    }`}>{f.status}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {f.status !== 'frozen' && (
                                                    <button onClick={() => freezeFamily(f.id)} className="text-warning hover:text-orange-400 font-medium">Freeze</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <Modal isOpen={!!suspendModal} onClose={() => setSuspendModal(null)} title="Suspend User">
                <div className="space-y-4">
                    <p className="text-sm text-surface-300">Are you sure you want to suspend this user? They will lose access to their account.</p>
                    <div className="flex gap-3 justify-end">
                        <button onClick={() => setSuspendModal(null)} className="btn-secondary">Cancel</button>
                        <button onClick={() => { if (suspendModal) suspendUser(suspendModal); setSuspendModal(null); }} className="btn-danger">Yes, Suspend</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
