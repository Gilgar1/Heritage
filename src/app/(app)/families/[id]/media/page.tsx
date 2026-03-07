'use client';

import React, { use } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { MediaGallery } from '@/components/MediaGallery';

export default function FamilyMediaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getFamilyById } = useHeritage();
    const family = getFamilyById(id);
    if (!family) return null;
    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#1F1F1F' }}>Family Media</h1>
            <p className="text-sm mb-6" style={{ color: '#888' }}>{family.name} · Photos, Videos, Audio & Documents</p>
            <MediaGallery contextType="family" contextId={id} contextName={family.name} />
        </div>
    );
}
