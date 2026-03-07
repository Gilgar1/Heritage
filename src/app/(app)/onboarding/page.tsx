'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHeritage } from '@/context/HeritageContext';

const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';
const GREEN = '#2F5D50';

const STEPS = [
    { id: 1, title: 'Welcome to Heritage', icon: '🌍' },
    { id: 2, title: 'Your Identity', icon: '👤' },
    { id: 3, title: 'Your Origin', icon: '🏡' },
    { id: 4, title: 'Create or Join a Family', icon: '👨‍👩‍👧' },
    { id: 5, title: 'Privacy Preferences', icon: '🔒' },
    { id: 6, title: 'You\'re All Set!', icon: '🎉' },
];

const CAMEROON_REGIONS = ['West', 'Littoral', 'Centre', 'North-West', 'South-West', 'Adamawa', 'Far North', 'North', 'East', 'South'];
const TRIBES = ["Bamiléké", "Ewondo", "Bassa", "Bamoun", "Fulani", "Ejagham", "Yemba", "Fe'fe'", "Nso", "Bulu", "Bayangi", "Tikar", "Maka", "Kom", "Other"];

export default function OnboardingPage() {
    const router = useRouter();
    const { currentUser, updateUserProfile, createFamily } = useHeritage();
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

    const [form, setForm] = useState({
        bio: '',
        tribe: '', region: '', village: '', nativeLanguage: '', traditionalTitle: '',
        familyChoice: 'create' as 'create' | 'join' | 'skip',
        familyName: '', familyDescription: '',
        profileVisibility: 'public',
        birthDateVisible: true,
        friendListVisible: true,
    });

    const goNext = () => { setDirection('forward'); setStep(s => Math.min(s + 1, STEPS.length)); };
    const goPrev = () => { setDirection('backward'); setStep(s => Math.max(s - 1, 1)); };

    const handleFinish = () => {
        if (!currentUser) return;
        updateUserProfile(currentUser.id, {
            bio: form.bio, tribe: form.tribe, region: form.region,
            village: form.village, nativeLanguage: form.nativeLanguage,
            traditionalTitle: form.traditionalTitle,
            profileVisible: form.profileVisibility === 'public',
            birthDateVisible: form.birthDateVisible,
            friendListVisible: form.friendListVisible,
        } as any);
        if (form.familyChoice === 'create' && form.familyName.trim()) {
            createFamily({ name: form.familyName, description: form.familyDescription, privacy: 'public' });
        }
        router.push('/feed');
    };

    const progress = ((step - 1) / (STEPS.length - 1)) * 100;

    const ProgressBar = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
                {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s.id ? 'shadow-md' : ''}`}
                            style={{
                                background: step > s.id ? GREEN : step === s.id ? BROWN : 'rgba(92,58,33,0.12)',
                                color: step >= s.id ? CREAM : '#aaa',
                            }}>
                            {step > s.id ? '✓' : s.id}
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className="flex-1 h-1 mx-1 rounded-full transition-all" style={{ background: step > s.id ? GREEN : 'rgba(92,58,33,0.1)', minWidth: 20 }} />
                        )}
                    </div>
                ))}
            </div>
            <p className="text-xs text-center" style={{ color: '#aaa' }}>Step {step} of {STEPS.length}</p>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: CREAM }}>
            <div className="w-full max-w-lg">
                {/* Card */}
                <div className="p-8 rounded-3xl shadow-xl animate-fade-in" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                    <ProgressBar />

                    {/* Step 1 — Welcome */}
                    {step === 1 && (
                        <div className="text-center animate-fade-in">
                            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg"
                                style={{ background: BROWN }}>🌍</div>
                            <h1 className="text-2xl font-black mb-3" style={{ color: CHARCOAL }}>Welcome to Heritage</h1>
                            <p className="text-sm leading-relaxed mb-4" style={{ color: '#666' }}>
                                Heritage is built for Cameroonians to preserve their family lineage, document identity, and keep memory alive across generations.
                            </p>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[{ icon: '🌿', label: 'Build your family tree' }, { icon: '🕯️', label: 'Honour those who came before' }, { icon: '🌍', label: 'Connect with your people' }].map((f, i) => (
                                    <div key={i} className="p-3 rounded-2xl text-center" style={{ background: CREAM }}>
                                        <p className="text-2xl mb-1">{f.icon}</p>
                                        <p className="text-xs font-semibold" style={{ color: BROWN }}>{f.label}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs" style={{ color: '#aaa' }}>This will take about 3 minutes. Let's begin.</p>
                        </div>
                    )}

                    {/* Step 2 — Identity */}
                    {step === 2 && (
                        <div className="animate-fade-in space-y-4">
                            <div className="text-center mb-6">
                                <span className="text-4xl">👤</span>
                                <h2 className="text-xl font-black mt-2" style={{ color: CHARCOAL }}>Tell us about yourself</h2>
                                <p className="text-xs mt-1" style={{ color: '#888' }}>This helps others find and connect with you</p>
                            </div>
                            <div>
                                <label className="input-label">Bio / Short introduction</label>
                                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                    className="input-field min-h-[80px] resize-none" placeholder="e.g. I am Ambe Nkeng, father of three, born in Bandjoun..." />
                            </div>
                            <div>
                                <label className="input-label">Traditional Title (if any)</label>
                                <input type="text" value={form.traditionalTitle} onChange={e => setForm(f => ({ ...f, traditionalTitle: e.target.value }))}
                                    className="input-field" placeholder="e.g. Fon, Njang, Chief, Ndap..." />
                            </div>
                            <div>
                                <label className="input-label">Native Language</label>
                                <input type="text" value={form.nativeLanguage} onChange={e => setForm(f => ({ ...f, nativeLanguage: e.target.value }))}
                                    className="input-field" placeholder="e.g. Ghomálá', Ewondo, Fulfulde..." />
                            </div>
                        </div>
                    )}

                    {/* Step 3 — Origin */}
                    {step === 3 && (
                        <div className="animate-fade-in space-y-4">
                            <div className="text-center mb-6">
                                <span className="text-4xl">🏡</span>
                                <h2 className="text-xl font-black mt-2" style={{ color: CHARCOAL }}>Your Origin</h2>
                                <p className="text-xs mt-1" style={{ color: '#888' }}>Used to help you find relatives from the same region</p>
                            </div>
                            <div>
                                <label className="input-label">Tribe / Ethnic Group</label>
                                <select value={form.tribe} onChange={e => setForm(f => ({ ...f, tribe: e.target.value }))} className="input-field">
                                    <option value="">Select your tribe...</option>
                                    {TRIBES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="input-label">Region of Origin</label>
                                <select value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} className="input-field">
                                    <option value="">Select region...</option>
                                    {CAMEROON_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="input-label">Village / Town of Origin</label>
                                <input type="text" value={form.village} onChange={e => setForm(f => ({ ...f, village: e.target.value }))}
                                    className="input-field" placeholder="e.g. Bandjoun, Foumban, Mamfe..." />
                            </div>
                        </div>
                    )}

                    {/* Step 4 — Family */}
                    {step === 4 && (
                        <div className="animate-fade-in space-y-4">
                            <div className="text-center mb-6">
                                <span className="text-4xl">👨‍👩‍👧</span>
                                <h2 className="text-xl font-black mt-2" style={{ color: CHARCOAL }}>Family</h2>
                                <p className="text-xs mt-1" style={{ color: '#888' }}>Start or join a family to begin building your tree</p>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {(['create', 'join', 'skip'] as const).map(choice => (
                                    <button key={choice} onClick={() => setForm(f => ({ ...f, familyChoice: choice }))}
                                        className="p-4 rounded-xl border-2 text-center font-semibold text-sm transition-all capitalize"
                                        style={form.familyChoice === choice
                                            ? { borderColor: BROWN, background: `${BROWN}08`, color: BROWN }
                                            : { borderColor: 'rgba(92,58,33,0.15)', color: '#888', background: 'transparent' }}>
                                        {choice === 'create' ? '🌿 Create' : choice === 'join' ? '🔍 Join' : '⏭️ Skip'}
                                    </button>
                                ))}
                            </div>
                            {form.familyChoice === 'create' && (
                                <div className="space-y-3 animate-fade-in">
                                    <div>
                                        <label className="input-label">Family Name *</label>
                                        <input type="text" value={form.familyName} onChange={e => setForm(f => ({ ...f, familyName: e.target.value }))}
                                            className="input-field" placeholder="e.g. Nkeng Family" />
                                    </div>
                                    <div>
                                        <label className="input-label">Description</label>
                                        <textarea value={form.familyDescription} onChange={e => setForm(f => ({ ...f, familyDescription: e.target.value }))}
                                            className="input-field min-h-[70px] resize-none" placeholder="Briefly describe your family..." />
                                    </div>
                                </div>
                            )}
                            {form.familyChoice === 'join' && (
                                <div className="animate-fade-in">
                                    <label className="input-label">Search for your family</label>
                                    <input type="text" className="input-field" placeholder="Type family name or code..." />
                                    <p className="text-xs mt-2" style={{ color: '#aaa' }}>You can also search and join families from the Families page later.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 5 — Privacy */}
                    {step === 5 && (
                        <div className="animate-fade-in space-y-4">
                            <div className="text-center mb-6">
                                <span className="text-4xl">🔒</span>
                                <h2 className="text-xl font-black mt-2" style={{ color: CHARCOAL }}>Privacy Preferences</h2>
                                <p className="text-xs mt-1" style={{ color: '#888' }}>Control who can see your information</p>
                            </div>
                            <div>
                                <label className="input-label">Who can view your profile?</label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {[
                                        { v: 'public', label: '🌍 Public', desc: 'Anyone on Heritage' },
                                        { v: 'family', label: '👨‍👩‍👧 Family', desc: 'Family members only' },
                                        { v: 'friends', label: '👥 Friends', desc: 'Friends only' },
                                        { v: 'private', label: '🔒 Private', desc: 'Only you' },
                                    ].map(opt => (
                                        <button key={opt.v} onClick={() => setForm(f => ({ ...f, profileVisibility: opt.v }))}
                                            className="py-3 px-3 rounded-xl border-2 text-left transition-all"
                                            style={form.profileVisibility === opt.v
                                                ? { borderColor: BROWN, background: `${BROWN}08` }
                                                : { borderColor: 'rgba(92,58,33,0.15)', background: 'transparent' }}>
                                            <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>{opt.label}</p>
                                            <p className="text-[10px] mt-0.5" style={{ color: '#aaa' }}>{opt.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="divide-y" style={{ borderColor: 'rgba(92,58,33,0.08)' }}>
                                {[
                                    { key: 'birthDateVisible', label: 'Show birth date on profile' },
                                    { key: 'friendListVisible', label: 'Show my friend list' },
                                ].map(({ key, label }) => (
                                    <label key={key} className="flex items-center justify-between py-3 cursor-pointer">
                                        <span className="text-sm" style={{ color: CHARCOAL }}>{label}</span>
                                        <div className="relative w-10 h-5 rounded-full transition-colors" style={{ background: (form as any)[key] ? BROWN : '#d1d5db' }}
                                            onClick={() => setForm(f => ({ ...f, [key]: !(f as any)[key] }))}>
                                            <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                                                style={{ transform: (form as any)[key] ? 'translateX(22px)' : 'translateX(2px)' }} />
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 6 — Done */}
                    {step === 6 && (
                        <div className="text-center animate-fade-in">
                            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg"
                                style={{ background: `linear-gradient(135deg, ${BROWN} 0%, ${GOLD} 100%)` }}>🎉</div>
                            <h2 className="text-2xl font-black mb-3" style={{ color: CHARCOAL }}>You're All Set!</h2>
                            <p className="text-sm leading-relaxed mb-6" style={{ color: '#666' }}>
                                Your Heritage profile is ready. Start building your family tree, document your lineage, and connect with relatives across Cameroon.
                            </p>
                            <div className="grid grid-cols-2 gap-3 mb-6 text-left">
                                {[
                                    { icon: '🌿', title: 'Build your tree', desc: 'Add family members one by one' },
                                    { icon: '📸', title: 'Upload photos', desc: 'Create family albums' },
                                    { icon: '🕯️', title: 'Memorial pages', desc: 'Honour those who passed' },
                                    { icon: '🔍', title: 'Discover', desc: 'Find relatives and tribes' },
                                ].map((item, i) => (
                                    <div key={i} className="p-3 rounded-xl" style={{ background: CREAM }}>
                                        <p className="text-xl mb-1">{item.icon}</p>
                                        <p className="text-xs font-semibold" style={{ color: CHARCOAL }}>{item.title}</p>
                                        <p className="text-[10px]" style={{ color: '#aaa' }}>{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className={`flex gap-3 mt-8 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
                        {step > 1 && (
                            <button onClick={goPrev} className="btn-secondary px-6">← Back</button>
                        )}
                        {step < STEPS.length ? (
                            <button onClick={goNext} className="btn-primary px-8" style={{ background: GOLD, color: CHARCOAL }}>
                                {step === 1 ? 'Get Started' : 'Continue'} →
                            </button>
                        ) : (
                            <button onClick={handleFinish} className="btn-primary px-8" style={{ background: BROWN, color: CREAM }}>
                                Enter Heritage 🌍
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
