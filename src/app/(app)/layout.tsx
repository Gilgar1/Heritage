'use client';

import React, { useState } from 'react';
import { Header } from '@/components/shared';

import { useRouter } from 'next/navigation';
import { useHeritage } from '@/context/HeritageContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { currentUser, isAuthenticated } = useHeritage();
    const router = useRouter();

    React.useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <>
            <Header />
            <main
                className="pt-16 pb-20 md:pb-4 min-h-screen"
                style={{ background: '#F4EFE6' }}
            >
                {children}
            </main>
            <ServiceWorkerRegistrar />
        </>
    );
}

// Registers SW + shows activity streak on first daily visit
function ServiceWorkerRegistrar() {
    const [streakToast, setStreakToast] = useState<string | null>(null);

    React.useEffect(() => {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => { });
        }

        // Activity streak logic
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem('heritage_last_visit');
        const streak = parseInt(localStorage.getItem('heritage_streak') || '0');

        if (lastVisit !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            const newStreak = lastVisit === yesterday ? streak + 1 : 1;
            localStorage.setItem('heritage_streak', String(newStreak));
            localStorage.setItem('heritage_last_visit', today);
            if (newStreak > 1) {
                setStreakToast(`🔥 ${newStreak}-day streak! Keep exploring your heritage.`);
                setTimeout(() => setStreakToast(null), 4000);
            }
        }
    }, []);

    if (!streakToast) return null;

    return (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl shadow-xl z-50 animate-fade-in"
            style={{ background: '#1F1F1F', color: '#F4EFE6', whiteSpace: 'nowrap', border: '1px solid rgba(198,167,94,0.3)' }}>
            <span className="text-sm font-bold">{streakToast}</span>
        </div>
    );
}
