'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHeritage } from '@/context/HeritageContext';

const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';

const regions = [
    'Adamawa', 'Centre', 'East', 'Far North', 'Littoral',
    'North', 'North-West', 'South', 'South-West', 'West',
];
const tribes = [
    'Bamiléké', 'Ewondo', 'Bassa', 'Douala', 'Fulani', 'Bamoun',
    'Ejagham', 'Bakweri', 'Beti', 'Tikar', 'Maka', 'Gbaya', 'Other',
];

export default function RegisterPage() {
    const { register } = useHeritage();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '', username: '', email: '', password: '', confirmPassword: '',
        birthDate: '', nativeLanguage: '', village: '', region: '', tribe: '', bio: '',
    });

    const handleChange = (field: string, value: string) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) { setStep(step + 1); return; }
        setLoading(true);
        setTimeout(() => {
            register({ ...formData, password: formData.password });
            router.push('/feed');
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: CREAM }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
                    style={{ background: 'rgba(92,58,33,0.07)' }} />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl"
                    style={{ background: 'rgba(198,167,94,0.07)' }} />
            </div>

            <div className="w-full max-w-lg animate-fade-in-up relative z-10">
                {/* Logo */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
                        style={{ background: BROWN }}>
                        <span className="text-2xl font-bold" style={{ color: GOLD }}>H</span>
                    </div>
                    <h1 className="text-2xl font-bold" style={{ color: BROWN }}>Join Heritage</h1>
                    <p className="mt-1 text-sm" style={{ color: '#666666' }}>Begin preserving your lineage</p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                                style={s === step
                                    ? { background: BROWN, color: GOLD, transform: 'scale(1.1)' }
                                    : s < step
                                        ? { background: 'rgba(46,125,50,0.15)', color: '#2E7D32' }
                                        : { background: 'rgba(92,58,33,0.08)', color: '#aaa' }}>
                                {s < step ? '✓' : s}
                            </div>
                            {s < 3 && <div className="w-8 h-0.5" style={{ background: s < step ? '#2E7D32' : 'rgba(92,58,33,0.15)' }} />}
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <div className="p-8 rounded-2xl shadow-lg"
                    style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Account */}
                        {step === 1 && (
                            <div className="space-y-4 animate-fade-in">
                                <h2 className="text-lg font-bold mb-4" style={{ color: CHARCOAL }}>Account Details</h2>
                                <div>
                                    <label className="input-label">Full Name</label>
                                    <input type="text" value={formData.fullName} onChange={e => handleChange('fullName', e.target.value)}
                                        className="input-field" placeholder="e.g. Ambe Nkeng" required />
                                </div>
                                <div>
                                    <label className="input-label">Username</label>
                                    <input type="text" value={formData.username} onChange={e => handleChange('username', e.target.value)}
                                        className="input-field" placeholder="e.g. ambe_nkeng" required />
                                </div>
                                <div>
                                    <label className="input-label">Email</label>
                                    <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)}
                                        className="input-field" placeholder="your@email.com" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="input-label">Password</label>
                                        <input type="password" value={formData.password} onChange={e => handleChange('password', e.target.value)}
                                            className="input-field" placeholder="••••••••" required />
                                    </div>
                                    <div>
                                        <label className="input-label">Confirm</label>
                                        <input type="password" value={formData.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)}
                                            className="input-field" placeholder="••••••••" required />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Identity */}
                        {step === 2 && (
                            <div className="space-y-4 animate-fade-in">
                                <h2 className="text-lg font-bold mb-4" style={{ color: CHARCOAL }}>Your Identity</h2>
                                <div>
                                    <label className="input-label">Date of Birth</label>
                                    <input type="date" value={formData.birthDate} onChange={e => handleChange('birthDate', e.target.value)}
                                        className="input-field" />
                                </div>
                                <div>
                                    <label className="input-label">Native Language</label>
                                    <input type="text" value={formData.nativeLanguage} onChange={e => handleChange('nativeLanguage', e.target.value)}
                                        className="input-field" placeholder="e.g. Ghomálá', Ewondo, Bamoun..." />
                                </div>
                                <div>
                                    <label className="input-label">Region</label>
                                    <select value={formData.region} onChange={e => handleChange('region', e.target.value)} className="input-field">
                                        <option value="">Select your region</option>
                                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="input-label">Tribe</label>
                                    <select value={formData.tribe} onChange={e => handleChange('tribe', e.target.value)} className="input-field">
                                        <option value="">Select your tribe</option>
                                        {tribes.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Heritage */}
                        {step === 3 && (
                            <div className="space-y-4 animate-fade-in">
                                <h2 className="text-lg font-bold mb-4" style={{ color: CHARCOAL }}>Roots & Heritage</h2>
                                <div>
                                    <label className="input-label">Village of Origin</label>
                                    <input type="text" value={formData.village} onChange={e => handleChange('village', e.target.value)}
                                        className="input-field" placeholder="e.g. Bandjoun, Foumban, Mamfe..." />
                                </div>
                                <div>
                                    <label className="input-label">Bio</label>
                                    <textarea value={formData.bio} onChange={e => handleChange('bio', e.target.value)}
                                        className="input-field min-h-[100px] resize-none"
                                        placeholder="Tell us about yourself and your heritage..." />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 mt-6">
                            {step > 1 && (
                                <button type="button" onClick={() => setStep(step - 1)}
                                    className="flex-1 py-3 rounded-xl font-semibold border transition-all"
                                    style={{ color: BROWN, borderColor: 'rgba(92,58,33,0.3)', background: 'transparent' }}>
                                    Back
                                </button>
                            )}
                            <button type="submit" disabled={loading}
                                className="flex-1 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                                style={{ background: GOLD, color: CHARCOAL }}>
                                {loading ? 'Creating...' : step === 3 ? 'Create Account' : 'Continue'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm" style={{ color: '#666666' }}>
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold transition-colors" style={{ color: BROWN }}>
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs mt-6" style={{ color: '#999' }}>
                    <Link href="/" style={{ color: BROWN }}>← Back to Home</Link>
                </p>
            </div>
        </div>
    );
}
