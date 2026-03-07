'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHeritage } from '@/context/HeritageContext';
import { Icons } from '@/components/shared';

export default function CreateFamilyPage() {
    const { createFamily } = useHeritage();
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [privacy, setPrivacy] = useState<'public' | 'private' | 'unlisted'>('public');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setLoading(true);
        setTimeout(() => {
            const family = createFamily({ name: name.trim(), description: description.trim(), privacy });
            router.push(`/families/${family.id}`);
        }, 500);
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-surface-100 mb-2">Create a Family</h1>
            <p className="text-surface-400 text-sm mb-8">Start preserving your family&apos;s heritage and lineage.</p>

            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
                <div>
                    <label className="input-label">Family Name *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="e.g. The Nkeng Dynasty" required />
                </div>

                <div>
                    <label className="input-label">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="input-field min-h-[100px] resize-none" placeholder="Tell the story of your family..." />
                </div>

                <div>
                    <label className="input-label">Privacy Level</label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                        {(['public', 'private', 'unlisted'] as const).map(p => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPrivacy(p)}
                                className={`p-4 rounded-xl border text-center transition-all ${privacy === p
                                        ? 'border-heritage-500 bg-heritage-600/15 text-heritage-300'
                                        : 'border-white/10 bg-white/5 text-surface-400 hover:border-white/20'
                                    }`}
                            >
                                <div className="text-2xl mb-2">
                                    {p === 'public' ? '🌍' : p === 'private' ? '🔒' : '👁️'}
                                </div>
                                <p className="text-sm font-semibold capitalize">{p}</p>
                                <p className="text-xs mt-1 text-surface-500">
                                    {p === 'public' ? 'Anyone can find' : p === 'private' ? 'Invite only' : 'Link only'}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-heritage-900/30 border border-heritage-700/20">
                    <p className="text-xs text-heritage-400 font-semibold mb-1">📋 Governance</p>
                    <p className="text-xs text-surface-400">You will be the Family Creator with full control. You can assign editors and manage the family tree. Family deletion requires admin approval and a 7-day freeze.</p>
                </div>

                <button type="submit" disabled={loading || !name.trim()} className="btn-gold w-full py-3 text-base disabled:opacity-50">
                    {loading ? 'Creating...' : 'Create Family'}
                </button>
            </form>
        </div>
    );
}
