'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHeritage } from '@/context/HeritageContext';

const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';

export default function LoginPage() {
    const { login } = useHeritage();
    const router = useRouter();
    const [email, setEmail] = useState('ambe.nkeng@heritage.cm');
    const [password, setPassword] = useState('demo123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setTimeout(() => {
            const success = login(email, password);
            if (success) {
                router.push('/feed');
            } else {
                setError('Invalid email or password.');
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: CREAM }}>
            {/* Decorative blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
                    style={{ background: 'rgba(92,58,33,0.08)' }} />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl"
                    style={{ background: 'rgba(198,167,94,0.08)' }} />
            </div>

            <div className="w-full max-w-md animate-fade-in-up relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                        style={{ background: BROWN }}>
                        <span className="text-3xl font-bold" style={{ color: GOLD }}>H</span>
                    </div>
                    <h1 className="text-3xl font-bold" style={{ color: BROWN }}>Heritage</h1>
                    <p className="mt-2 text-sm" style={{ color: '#666666' }}>Preserve Your African Identity</p>
                </div>

                {/* Login Card */}
                <div className="p-8 rounded-2xl shadow-lg"
                    style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                    <h2 className="text-xl font-bold mb-6" style={{ color: CHARCOAL }}>Welcome Back</h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl text-sm animate-fade-in"
                            style={{ background: 'rgba(198,40,40,0.08)', border: '1px solid rgba(198,40,40,0.2)', color: '#C62828' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="input-label">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                className="input-field" placeholder="your@email.com" required />
                        </div>
                        <div>
                            <label className="input-label">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                className="input-field" placeholder="••••••••" required />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full py-3 rounded-xl font-bold text-base transition-all disabled:opacity-50"
                            style={{ background: GOLD, color: CHARCOAL }}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm" style={{ color: '#666666' }}>
                            New to Heritage?{' '}
                            <Link href="/register" className="font-semibold transition-colors" style={{ color: BROWN }}>
                                Create Account
                            </Link>
                        </p>
                    </div>

                    {/* Demo credentials */}
                    <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(92,58,33,0.06)', border: '1px solid rgba(92,58,33,0.1)' }}>
                        <p className="text-sm font-bold mb-3" style={{ color: BROWN }}>🔑 Available Demo Roles / Credentials</p>
                        <div className="space-y-3 text-xs" style={{ color: '#666666' }}>
                            <div className="pb-2 border-b" style={{ borderColor: 'rgba(92,58,33,0.1)' }}>
                                <p><span className="font-semibold text-sm" style={{ color: CHARCOAL }}>Admin </span>(Super Administrator)</p>
                                <p className="mt-1 font-mono">admin@heritage.cm</p>
                            </div>
                            <div className="pb-2 border-b" style={{ borderColor: 'rgba(92,58,33,0.1)' }}>
                                <p><span className="font-semibold text-sm" style={{ color: CHARCOAL }}>Family Creator </span>(Bamiléké, The Nkeng Dynasty)</p>
                                <p className="mt-1 font-mono">ambe.nkeng@heritage.cm</p>
                            </div>
                            <div className="pb-2 border-b" style={{ borderColor: 'rgba(92,58,33,0.1)' }}>
                                <p><span className="font-semibold text-sm" style={{ color: CHARCOAL }}>Family Editor </span>(Ewondo)</p>
                                <p className="mt-1 font-mono">ngono.meka@heritage.cm</p>
                            </div>
                            <div className="pb-2 border-b" style={{ borderColor: 'rgba(92,58,33,0.1)' }}>
                                <p><span className="font-semibold text-sm" style={{ color: CHARCOAL }}>Family Creator </span>(Ejagham)</p>
                                <p className="mt-1 font-mono">tabi.eyong@heritage.cm</p>
                            </div>
                            <div>
                                <p><span className="font-semibold text-sm" style={{ color: CHARCOAL }}>Family Creator </span>(Bamoun, Njoya House)</p>
                                <p className="mt-1 font-mono">fien.njoya@heritage.cm</p>
                            </div>
                            <div className="mt-3 pt-2 text-center text-xs" style={{ borderTop: '1px dashed rgba(92,58,33,0.2)' }}>
                                <p className="italic mb-1">Password for all users:</p>
                                <p className="font-bold font-mono text-sm" style={{ color: GOLD }}>demo123 <span className="text-xs font-normal" style={{ color: '#999' }}>(or any value)</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to home */}
                <p className="text-center text-xs mt-6" style={{ color: '#999' }}>
                    <Link href="/" style={{ color: BROWN }}>← Back to Home</Link>
                    {'  ·  '}🌍 Built for Cameroon
                </p>
            </div>
        </div>
    );
}
