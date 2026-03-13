'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar, Icons, EmptyState, Tabs } from '@/components/shared';

const BROWN = '#5C3A21'; const GOLD = '#C6A75E'; const CREAM = '#F4EFE6'; const CHARCOAL = '#1F1F1F'; const GREEN = '#2F5D50';

const TRIBES = ["Bamiléké", "Ewondo", "Bassa", "Bamoun", "Fulani", "Ejagham", "Yemba", "Fe'fe'", "Nso", "Bulu", "Bayangi", "Tikar", "Maka", "Kom"];
const REGIONS = ['West', 'Littoral', 'Centre', 'North-West', 'South-West', 'Adamawa', 'Far North', 'North', 'East', 'South'];
const RELATIONSHIP_TYPES = ['parents', 'children', 'siblings', 'cousins', 'grandparents', 'grandchildren', 'ancestors', 'descendants'];

export default function SearchPage() {
    const { search, users, families, getFamilyTreeNodes } = useHeritage();
    const [query, setQuery] = useState('');
    const [tab, setTab] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Advanced filters
    const [filterTribe, setFilterTribe] = useState('');
    const [filterRegion, setFilterRegion] = useState('');
    const [filterVillage, setFilterVillage] = useState('');
    const [filterMinAge, setFilterMinAge] = useState('');
    const [filterMaxAge, setFilterMaxAge] = useState('');
    const [filterGeneration, setFilterGeneration] = useState('');
    const [filterLanguage, setFilterLanguage] = useState('');
    const [filterVerified, setFilterVerified] = useState(false);
    const [filterDeceased, setFilterDeceased] = useState(false);
    const [relationshipSearch, setRelationshipSearch] = useState('');
    const [mediaPerson, setMediaPerson] = useState('');
    const [mediaEvent, setMediaEvent] = useState('');

    const activeFilterCount = [filterTribe, filterRegion, filterVillage, filterMinAge, filterMaxAge, filterGeneration, filterLanguage].filter(Boolean).length + (filterVerified ? 1 : 0) + (filterDeceased ? 1 : 0);

    const rawResults = useMemo(() => {
        if (!query.trim() && !activeFilterCount) return [];
        return search(query, tab);
    }, [query, tab, search, activeFilterCount]);

    const filteredResults = useMemo(() => {
        let r = rawResults;
        if (filterTribe) r = r.filter(x => x.metadata?.tribe?.toLowerCase().includes(filterTribe.toLowerCase()));
        if (filterRegion) r = r.filter(x => x.metadata?.region?.toLowerCase().includes(filterRegion.toLowerCase()));
        if (filterVillage) r = r.filter(x => x.metadata?.village?.toLowerCase().includes(filterVillage.toLowerCase()));
        if (filterVerified) r = r.filter(x => (x as any).verificationStatus === 'verified');
        if (filterDeceased) r = r.filter(x => (x as any).isDeceased);
        if (filterMinAge || filterMaxAge) {
            const now = new Date().getFullYear();
            r = r.filter(x => {
                const birthDateStr = x.metadata?.birthDate;
                const birthYear = birthDateStr ? new Date(birthDateStr).getFullYear() : null;
                if (!birthYear) return false;
                const age = now - birthYear;
                if (filterMinAge && age < parseInt(filterMinAge)) return false;
                if (filterMaxAge && age > parseInt(filterMaxAge)) return false;
                return true;
            });
        }
        return r;
    }, [rawResults, filterTribe, filterRegion, filterVillage, filterVerified, filterDeceased, filterMinAge, filterMaxAge]);

    // Relationship search — find people in same family by relation
    const relationshipResults = useMemo(() => {
        if (!relationshipSearch) return [];
        const term = relationshipSearch.toLowerCase();
        const allNodes = families.flatMap(f => getFamilyTreeNodes(f.id).map(n => ({ ...n, familyId: f.id, familyName: f.name })));
        if (term === 'ancestors') return allNodes.filter(n => n.generation === 0);
        if (term === 'descendants') return allNodes.filter(n => n.generation >= 2);
        if (term === 'cousins') return allNodes.filter(n => n.generation >= 1);
        if (term === 'parents' || term === 'grandparents') return allNodes.filter(n => n.generation <= 1);
        if (term === 'children' || term === 'grandchildren') return allNodes.filter(n => n.generation >= 1);
        return allNodes.filter(n => n.name.toLowerCase().includes(term));
    }, [relationshipSearch, families, getFamilyTreeNodes]);

    // Tribe lineage search — find all families of a tribe
    const tribeResults = useMemo(() => {
        if (!filterTribe) return [];
        return users.filter(u => u.tribe?.toLowerCase().includes(filterTribe.toLowerCase()));
    }, [users, filterTribe]);

    // Village origin search
    const villageResults = useMemo(() => {
        if (!filterVillage && !query) return [];
        const term = filterVillage || query;
        return users.filter(u => u.village?.toLowerCase().includes(term.toLowerCase()));
    }, [users, filterVillage, query]);

    // Mock media search results
    const mediaResults = useMemo(() => {
        if (!mediaPerson && !mediaEvent) return [];
        return [
            { id: 'm1', title: 'Family Portrait 1978', type: 'photo', person: 'Pa Nkeng', event: 'reunion', emoji: '📸' },
            { id: 'm2', title: 'Wedding Video', type: 'video', person: 'Ambe Nkeng', event: 'wedding', emoji: '🎬' },
            { id: 'm3', title: 'Oral History Recording', type: 'audio', person: 'Pa Nkeng', event: 'cultural', emoji: '🎙️' },
        ].filter(m => (mediaPerson ? m.person.toLowerCase().includes(mediaPerson.toLowerCase()) : true) && (mediaEvent ? m.event.toLowerCase().includes(mediaEvent.toLowerCase()) : true));
    }, [mediaPerson, mediaEvent]);

    const clearFilters = () => { setFilterTribe(''); setFilterRegion(''); setFilterVillage(''); setFilterMinAge(''); setFilterMaxAge(''); setFilterGeneration(''); setFilterLanguage(''); setFilterVerified(false); setFilterDeceased(false); };

    const tabConfig = [{ id: 'all', label: 'All' }, { id: 'users', label: 'People' }, { id: 'families', label: 'Families' }, { id: 'relationship', label: '🔗 Relations' }, { id: 'tribe', label: '🏛️ Tribe' }, { id: 'village', label: '🏡 Village' }, { id: 'media', label: '📸 Media' }];

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-5" style={{ color: CHARCOAL }}>Search Heritage</h1>

            {/* Search bar */}
            <div className="relative mb-3">
                <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#aaa' }}><Icons.Search /></div>
                <input type="text" value={query} onChange={e => setQuery(e.target.value)} autoFocus
                    className="input-field pl-12 py-3.5 text-base" placeholder="Search people, families, villages, tribes..." />
                <button onClick={() => setShowFilters(!showFilters)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={showFilters || activeFilterCount > 0 ? { background: BROWN, color: CREAM } : { background: CREAM, color: BROWN, border: '1px solid rgba(92,58,33,0.2)' }}>
                    🎛️ Filters {activeFilterCount > 0 && <span className="w-4 h-4 rounded-full bg-white text-brown-500 text-[10px] flex items-center justify-center" style={{ color: BROWN }}>{activeFilterCount}</span>}
                </button>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
                <div className="p-5 rounded-2xl mb-4 animate-fade-in" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.12)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-sm" style={{ color: CHARCOAL }}>Advanced Filters</h3>
                        {activeFilterCount > 0 && <button onClick={clearFilters} className="text-xs font-semibold" style={{ color: '#C62828' }}>Clear All</button>}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="input-label">Tribe</label>
                            <select value={filterTribe} onChange={e => setFilterTribe(e.target.value)} className="input-field text-sm">
                                <option value="">Any tribe</option>{TRIBES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Region</label>
                            <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)} className="input-field text-sm">
                                <option value="">Any region</option>{REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Village</label>
                            <input type="text" value={filterVillage} onChange={e => setFilterVillage(e.target.value)} className="input-field text-sm" placeholder="e.g. Bandjoun" />
                        </div>
                        <div>
                            <label className="input-label">Min Age</label>
                            <input type="number" value={filterMinAge} onChange={e => setFilterMinAge(e.target.value)} className="input-field text-sm" placeholder="e.g. 18" min="0" max="150" />
                        </div>
                        <div>
                            <label className="input-label">Max Age</label>
                            <input type="number" value={filterMaxAge} onChange={e => setFilterMaxAge(e.target.value)} className="input-field text-sm" placeholder="e.g. 80" min="0" max="150" />
                        </div>
                        <div>
                            <label className="input-label">Generation</label>
                            <select value={filterGeneration} onChange={e => setFilterGeneration(e.target.value)} className="input-field text-sm">
                                <option value="">Any</option><option value="0">Founders</option><option value="1">Gen 1</option><option value="2">Gen 2</option><option value="3">Gen 3+</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: CHARCOAL }}>
                            <input type="checkbox" checked={filterVerified} onChange={e => setFilterVerified(e.target.checked)} className="w-4 h-4" />✅ Verified only
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: CHARCOAL }}>
                            <input type="checkbox" checked={filterDeceased} onChange={e => setFilterDeceased(e.target.checked)} className="w-4 h-4" />🕊️ Deceased profiles
                        </label>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto mb-5 pb-1">
                {tabConfig.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className="text-xs px-3 py-2 rounded-xl font-semibold flex-shrink-0 whitespace-nowrap transition-all"
                        style={tab === t.id ? { background: BROWN, color: CREAM } : { background: CREAM, color: '#888', border: '1px solid rgba(92,58,33,0.1)' }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Relationship Search Tab */}
            {tab === 'relationship' && (
                <div className="space-y-4 animate-fade-in">
                    <div>
                        <label className="input-label">Find Relatives by Relationship Type</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {RELATIONSHIP_TYPES.map(r => (
                                <button key={r} onClick={() => setRelationshipSearch(r)}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all border"
                                    style={relationshipSearch === r ? { background: BROWN, color: CREAM, borderColor: BROWN } : { borderColor: 'rgba(92,58,33,0.2)', color: '#888', background: 'transparent' }}>
                                    {r}
                                </button>
                            ))}
                        </div>
                        <div className="mt-3">
                            <input type="text" value={relationshipSearch} onChange={e => setRelationshipSearch(e.target.value)} className="input-field" placeholder="Or type a name to search relations..." />
                        </div>
                    </div>
                    {relationshipResults.length > 0 && (
                        <p className="text-xs" style={{ color: '#888' }}>Found {relationshipResults.length} results for <strong>"{relationshipSearch}"</strong></p>
                    )}
                    <div className="space-y-2">
                        {relationshipResults.slice(0, 10).map((n: any, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl animate-fade-in-up" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.08)', animationDelay: `${i * 0.04}s` }}>
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: n.isDeceased ? `${GOLD}15` : `${BROWN}12` }}>
                                    {n.gender === 'female' ? '👩' : '👨'}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm" style={{ color: CHARCOAL }}>{n.name}</p>
                                    <p className="text-xs" style={{ color: '#aaa' }}>
                                        {n.familyName} · Gen {n.generation}{n.isDeceased ? ' · 🕊️ Deceased' : ''}
                                    </p>
                                </div>
                                {n.isDeceased && <Link href={`/memorial/${n.id}`} className="text-xs px-3 py-1 rounded-lg font-semibold" style={{ background: `${GOLD}15`, color: BROWN }}>Memorial</Link>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tribe lineage search */}
            {tab === 'tribe' && (
                <div className="space-y-4 animate-fade-in">
                    <div>
                        <label className="input-label">Search by Tribe / Ethnic Group</label>
                        <select value={filterTribe} onChange={e => setFilterTribe(e.target.value)} className="input-field mt-1">
                            <option value="">Select a tribe...</option>{TRIBES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    {tribeResults.length > 0 && (
                        <>
                            <p className="text-xs" style={{ color: '#888' }}>{tribeResults.length} Heritage members from <strong>{filterTribe}</strong></p>
                            <div className="space-y-2">
                                {tribeResults.slice(0, 8).map((u, i) => (
                                    <Link key={u.id} href={`/profile/${u.id}`} className="flex items-center gap-4 p-4 rounded-2xl transition-all animate-fade-in-up"
                                        style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.08)', animationDelay: `${i * 0.04}s` }}
                                        onMouseEnter={e => (e.currentTarget as any).style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'}
                                        onMouseLeave={e => (e.currentTarget as any).style.boxShadow = ''}>
                                        <Avatar name={u.fullName} url={u.avatarUrl} size="md" />
                                        <div className="flex-1">
                                            <p className="font-bold text-sm" style={{ color: CHARCOAL }}>{u.fullName}</p>
                                            <p className="text-xs" style={{ color: '#aaa' }}>{u.tribe} · {u.village || u.region || 'Cameroon'}</p>
                                        </div>
                                        <span className="tribe-tag">{u.tribe}</span>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                    {filterTribe && tribeResults.length === 0 && <EmptyState icon={<Icons.Search />} title="No matches" description={`No Heritage members from ${filterTribe} found yet.`} />}
                </div>
            )}

            {/* Village origin search */}
            {tab === 'village' && (
                <div className="space-y-4 animate-fade-in">
                    <div>
                        <label className="input-label">Search by Village of Origin</label>
                        <input type="text" value={filterVillage} onChange={e => setFilterVillage(e.target.value)} className="input-field mt-1" placeholder="e.g. Bandjoun, Foumban, Mamfe..." />
                    </div>
                    {villageResults.length > 0 && <p className="text-xs" style={{ color: '#888' }}>{villageResults.length} members from <strong>{filterVillage || query}</strong></p>}
                    <div className="space-y-2">
                        {villageResults.slice(0, 8).map((u, i) => (
                            <Link key={u.id} href={`/profile/${u.id}`} className="flex items-center gap-4 p-4 rounded-2xl transition-all animate-fade-in-up"
                                style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.08)', animationDelay: `${i * 0.04}s` }}
                                onMouseEnter={e => (e.currentTarget as any).style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'}
                                onMouseLeave={e => (e.currentTarget as any).style.boxShadow = ''}>
                                <Avatar name={u.fullName} url={u.avatarUrl} size="md" />
                                <div className="flex-1">
                                    <p className="font-bold text-sm" style={{ color: CHARCOAL }}>{u.fullName}</p>
                                    <p className="text-xs" style={{ color: '#aaa' }}>🏡 {u.village} · {u.tribe}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Media search */}
            {tab === 'media' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="input-label">By Person Tagged</label>
                            <input type="text" value={mediaPerson} onChange={e => setMediaPerson(e.target.value)} className="input-field" placeholder="e.g. Pa Nkeng" />
                        </div>
                        <div>
                            <label className="input-label">By Event Type</label>
                            <select value={mediaEvent} onChange={e => setMediaEvent(e.target.value)} className="input-field">
                                <option value="">Any event</option>
                                {['wedding', 'reunion', 'funeral', 'birthday', 'cultural', 'general'].map(e => <option key={e} value={e} className="capitalize">{e}</option>)}
                            </select>
                        </div>
                    </div>
                    {mediaResults.length > 0 && (
                        <div className="space-y-2">
                            {mediaResults.map((m, i) => (
                                <div key={m.id} className="flex items-center gap-4 p-4 rounded-2xl animate-fade-in-up" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.08)', animationDelay: `${i * 0.05}s` }}>
                                    <span className="text-3xl">{m.emoji}</span>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm" style={{ color: CHARCOAL }}>{m.title}</p>
                                        <p className="text-xs" style={{ color: '#aaa' }}>👤 {m.person} · 📅 {m.event}</p>
                                    </div>
                                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize" style={{ background: `${BROWN}10`, color: BROWN }}>{m.type}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {(mediaPerson || mediaEvent) && mediaResults.length === 0 && <EmptyState icon={<Icons.Search />} title="No media found" description="Try different search terms." />}
                </div>
            )}

            {/* Standard results (all / people / families) */}
            {!['relationship', 'tribe', 'village', 'media'].includes(tab) && (
                <div className="space-y-3">
                    {filteredResults.length > 0 ? filteredResults.map((result, i) => (
                        <Link key={result.id} href={result.type === 'user' ? `/profile/${result.id}` : `/families/${result.id}`}
                            className="flex items-center gap-4 p-4 rounded-2xl transition-all animate-fade-in-up"
                            style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.08)', animationDelay: `${i * 0.03}s` }}
                            onMouseEnter={e => (e.currentTarget as any).style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'}
                            onMouseLeave={e => (e.currentTarget as any).style.boxShadow = ''}>
                            {result.type === 'user'
                                ? <Avatar name={result.name} url={result.avatarUrl} size="md" />
                                : <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl" style={{ background: BROWN, color: CREAM }}>{result.name[0]}</div>
                            }
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-bold text-sm" style={{ color: CHARCOAL }}>{result.name}</p>
                                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: result.type === 'user' ? `${BROWN}12` : `${GOLD}15`, color: result.type === 'user' ? BROWN : '#966e2e' }}>
                                        {result.type === 'user' ? 'Person' : 'Family'}
                                    </span>
                                    {(result as any).verificationStatus === 'verified' && <span className="badge-verified">✓ Verified</span>}
                                    {(result as any).isDeceased && <span className="text-xs">🕊️</span>}
                                </div>
                                {result.subtitle && <p className="text-xs mt-0.5" style={{ color: '#888' }}>{result.subtitle}</p>}
                            </div>
                        </Link>
                    )) : (query.trim() || activeFilterCount > 0) ? (
                        <EmptyState icon={<Icons.Search />} title="No results" description={`No matches for "${query}". Try different keywords or adjust filters.`} />
                    ) : (
                        <div className="text-center py-16">
                            <span className="text-5xl">🔍</span>
                            <p className="mt-3 text-sm" style={{ color: '#aaa' }}>Search members, families, villages, tribes, or media</p>
                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                {['Bamiléké', 'Bandjoun', 'Nkeng', 'ancestors'].map(s => (
                                    <button key={s} onClick={() => setQuery(s)} className="text-xs px-3 py-1.5 rounded-full border font-semibold transition-all"
                                        style={{ borderColor: 'rgba(92,58,33,0.2)', color: BROWN, background: CREAM }}>{s}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
