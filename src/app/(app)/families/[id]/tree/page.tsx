'use client';

import React, { useState, use } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar, Icons, EmptyState, Modal } from '@/components/shared';

const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';
const GREEN = '#2F5D50';

type ViewMode = 'generational' | 'timeline' | 'graph';

interface MarriageRecord {
    id: string; spouseAId: string; spouseBId: string;
    marriageDate?: string; divorceDate?: string; location?: string; isDivorced: boolean;
}

interface EditLog {
    id: string; editorName: string; action: string; description: string; createdAt: string;
}

const GENDER_ICON: Record<string, string> = { male: '👨', female: '👩', other: '🧑' };
const ACTION_ICON: Record<string, string> = { add_node: '➕', edit_node: '✏️', remove_node: '🗑️', add_edge: '🔗', remove_edge: '✂️' };

export default function FamilyTreePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getFamilyById, getFamilyTreeNodes, currentUser, getUserRoleInFamily, addFamilyTreeNode } = useHeritage();

    const family = getFamilyById(id);
    const nodes = getFamilyTreeNodes(id);
    const role = currentUser ? getUserRoleInFamily(currentUser.id, id) : null;
    const canEdit = role === 'creator' || role === 'editor';

    const [viewMode, setViewMode] = useState<ViewMode>('generational');
    const [addModal, setAddModal] = useState(false);
    const [marriageModal, setMarriageModal] = useState(false);
    const [historyModal, setHistoryModal] = useState(false);
    const [exportModal, setExportModal] = useState(false);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [traceMode, setTraceMode] = useState<'none' | 'ancestor' | 'descendant'>('none');

    const [marriageRecords, setMarriageRecords] = useState<MarriageRecord[]>([
        { id: 'mr1', spouseAId: 'node-1', spouseBId: 'node-2', marriageDate: '1960-04-15', location: 'Bandjoun', isDivorced: false },
    ]);

    const [editHistory] = useState<EditLog[]>([
        { id: 'l1', editorName: 'Ambe Nkeng', action: 'add_node', description: 'Added Pa Nkeng Fomonyuy to the tree', createdAt: '2026-03-01T10:00:00Z' },
        { id: 'l2', editorName: 'Ambe Nkeng', action: 'add_node', description: 'Added Ma Nkeng Rose to the tree', createdAt: '2026-03-01T10:05:00Z' },
        { id: 'l3', editorName: 'Ambe Nkeng', action: 'add_edge', description: 'Linked Pa Nkeng & Ma Nkeng as spouses', createdAt: '2026-03-01T10:10:00Z' },
        { id: 'l4', editorName: 'Ambe Nkeng', action: 'add_node', description: 'Added Ambe Nkeng as child (Gen 1)', createdAt: '2026-03-02T09:00:00Z' },
    ]);

    const [addForm, setAddForm] = useState({
        name: '', birthDate: '', deathDate: '', isDeceased: false, isAdopted: false,
        gender: 'male' as 'male' | 'female' | 'other', parentId: '', nodePrivacy: 'visible',
    });

    const [marriageForm, setMarriageForm] = useState({
        spouseAId: '', spouseBId: '', marriageDate: '', location: '', isDivorced: false, divorceDate: '',
    });

    const generations = Array.from(new Set(nodes.map(n => n.generation))).sort();

    const getTracedNodes = (nodeId: string, mode: 'ancestor' | 'descendant'): Set<string> => {
        const result = new Set<string>([nodeId]);
        const queue = [nodeId];
        while (queue.length > 0) {
            const current = queue.shift()!;
            const node = nodes.find(n => n.id === current);
            if (!node) continue;
            const related = mode === 'ancestor' ? node.parentIds : node.childIds;
            related.forEach(rid => { if (!result.has(rid)) { result.add(rid); queue.push(rid); } });
        }
        return result;
    };

    const tracedNodes = selectedNode && traceMode !== 'none' ? getTracedNodes(selectedNode, traceMode) : null;

    const handleAddNode = () => {
        if (!addForm.name.trim()) return;
        const parentNode = nodes.find(n => n.id === addForm.parentId);
        addFamilyTreeNode(id, {
            id: `node-${Date.now()}`, userId: '', name: addForm.name,
            birthDate: addForm.birthDate, deathDate: addForm.isDeceased ? addForm.deathDate : undefined,
            isDeceased: addForm.isDeceased, gender: addForm.gender,
            parentIds: addForm.parentId ? [addForm.parentId] : [],
            spouseIds: [], childIds: [],
            generation: parentNode ? parentNode.generation + 1 : 0,
            nodePrivacy: addForm.nodePrivacy as any,
        });
        setAddForm({ name: '', birthDate: '', deathDate: '', isDeceased: false, isAdopted: false, gender: 'male', parentId: '', nodePrivacy: 'visible' });
        setAddModal(false);
    };

    const handleAddMarriage = () => {
        if (!marriageForm.spouseAId || !marriageForm.spouseBId || marriageForm.spouseAId === marriageForm.spouseBId) return;
        setMarriageRecords(prev => [...prev, { id: `mr-${Date.now()}`, ...marriageForm }]);
        setMarriageForm({ spouseAId: '', spouseBId: '', marriageDate: '', location: '', isDivorced: false, divorceDate: '' });
        setMarriageModal(false);
    };

    if (!family) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: CHARCOAL }}>Family Tree</h1>
                    <p className="text-sm" style={{ color: '#888' }}>{family.name} · {nodes.length} member{nodes.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {canEdit && (
                        <>
                            <button onClick={() => setAddModal(true)} className="btn-primary btn-sm" style={{ background: GOLD, color: CHARCOAL }}>+ Add Member</button>
                            <button onClick={() => setMarriageModal(true)} className="btn-secondary btn-sm">💍 Marriage</button>
                        </>
                    )}
                    <button onClick={() => setHistoryModal(true)} className="btn-secondary btn-sm">📜 History</button>
                    <button onClick={() => setExportModal(true)} className="btn-secondary btn-sm">⬇️ Export</button>
                </div>
            </div>

            {/* View Mode Switcher */}
            <div className="flex flex-wrap gap-3 mb-5 items-center justify-between">
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: CREAM, border: '1px solid rgba(92,58,33,0.12)' }}>
                    {(['generational', 'timeline', 'graph'] as ViewMode[]).map(mode => (
                        <button key={mode} onClick={() => setViewMode(mode)}
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                            style={viewMode === mode ? { background: BROWN, color: CREAM } : { color: '#888', background: 'transparent' }}>
                            {mode === 'generational' ? '🌿 Generational' : mode === 'timeline' ? '📅 Timeline' : '🕸️ Graph'}
                        </button>
                    ))}
                </div>
                {selectedNode && (
                    <div className="flex gap-2 items-center">
                        <span className="text-xs font-semibold" style={{ color: BROWN }}>Trace:</span>
                        {(['none', 'ancestor', 'descendant'] as const).map(t => (
                            <button key={t} onClick={() => setTraceMode(t)}
                                className="text-xs px-3 py-1.5 rounded-full border font-semibold transition-all"
                                style={traceMode === t ? { background: BROWN, color: CREAM, borderColor: BROWN } : { borderColor: 'rgba(92,58,33,0.2)', color: '#888', background: 'transparent' }}>
                                {t === 'none' ? '✕ Clear' : t === 'ancestor' ? '⬆️ Ancestors' : '⬇️ Descendants'}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Marriage Records */}
            {marriageRecords.length > 0 && viewMode === 'generational' && (
                <div className="flex flex-wrap gap-2 mb-5">
                    {marriageRecords.map(mr => {
                        const a = nodes.find(n => n.id === mr.spouseAId);
                        const b = nodes.find(n => n.id === mr.spouseBId);
                        if (!a || !b) return null;
                        return (
                            <span key={mr.id} className="text-xs px-3 py-1 rounded-full font-semibold"
                                style={{ background: mr.isDivorced ? 'rgba(198,40,40,0.08)' : `${GOLD}15`, color: mr.isDivorced ? '#C62828' : BROWN, border: `1px solid ${mr.isDivorced ? 'rgba(198,40,40,0.2)' : `${GOLD}30`}` }}>
                                {mr.isDivorced ? '💔' : '💍'} {a.name.split(' ')[0]} & {b.name.split(' ')[0]}
                                {mr.marriageDate && ` · ${new Date(mr.marriageDate).getFullYear()}`}
                            </span>
                        );
                    })}
                </div>
            )}

            {/* ── GENERATIONAL VIEW ── */}
            {viewMode === 'generational' && (
                <div className="space-y-8">
                    {nodes.length === 0 ? (
                        <EmptyState icon={<Icons.TreeSmall />} title="No family tree yet"
                            description="Begin by adding the first member of your family."
                            action={canEdit ? <button onClick={() => setAddModal(true)} className="btn-primary btn-sm" style={{ background: GOLD, color: CHARCOAL }}>Add First Member</button> : undefined}
                        />
                    ) : generations.map(gen => {
                        const genNodes = nodes.filter(n => n.generation === gen);
                        const labels = ['Founders', 'Generation 1', 'Generation 2', 'Generation 3'];
                        return (
                            <div key={gen}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-px flex-1" style={{ background: `${GOLD}30` }} />
                                    <span className="text-xs font-bold uppercase tracking-widest px-3" style={{ color: GOLD }}>{labels[gen] || `Generation ${gen}`}</span>
                                    <div className="h-px flex-1" style={{ background: `${GOLD}30` }} />
                                </div>
                                {gen > 0 && <div className="flex justify-center mb-4"><div className="w-px h-6" style={{ background: `${BROWN}30` }} /></div>}
                                <div className="flex flex-wrap justify-center gap-5">
                                    {genNodes.map(node => {
                                        const isFaded = tracedNodes && !tracedNodes.has(node.id);
                                        const isSelected = selectedNode === node.id;
                                        return (
                                            <div key={node.id} onClick={() => setSelectedNode(isSelected ? null : node.id)}
                                                className="flex flex-col items-center cursor-pointer transition-all"
                                                style={{ opacity: isFaded ? 0.2 : 1, transform: isSelected ? 'scale(1.08)' : 'scale(1)' }}>
                                                <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 transition-all"
                                                    style={{
                                                        background: node.isDeceased ? '#e8dfc9' : CREAM,
                                                        borderColor: isSelected ? BROWN : node.isDeceased ? GOLD : 'rgba(92,58,33,0.2)',
                                                        boxShadow: isSelected ? `0 0 0 3px ${GOLD}50` : '0 2px 8px rgba(0,0,0,0.08)',
                                                    }}>
                                                    {GENDER_ICON[node.gender]}
                                                    {node.isDeceased && <span className="absolute -top-2 -right-2 text-sm">🕊️</span>}
                                                </div>
                                                <p className="text-xs font-bold text-center mt-2 max-w-[88px] leading-tight" style={{ color: CHARCOAL }}>{node.name}</p>
                                                {node.birthDate && (
                                                    <p className="text-[10px]" style={{ color: '#aaa' }}>
                                                        {new Date(node.birthDate).getFullYear()}{node.isDeceased && node.deathDate ? `–${new Date(node.deathDate).getFullYear()}` : ''}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── TIMELINE VIEW ── */}
            {viewMode === 'timeline' && (
                <div className="animate-fade-in relative pl-8">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5" style={{ background: `${BROWN}25` }} />
                    {[
                        ...nodes.filter(n => n.birthDate).map(n => ({ year: new Date(n.birthDate!).getFullYear(), label: `${n.name} born`, icon: '🌱', type: 'birth' })),
                        ...nodes.filter(n => n.isDeceased && n.deathDate).map(n => ({ year: new Date(n.deathDate!).getFullYear(), label: `${n.name} passed`, icon: '🕊️', type: 'death' })),
                        ...marriageRecords.filter(mr => mr.marriageDate).map(mr => {
                            const a = nodes.find(n => n.id === mr.spouseAId);
                            const b = nodes.find(n => n.id === mr.spouseBId);
                            return { year: new Date(mr.marriageDate!).getFullYear(), label: `${a?.name || '?'} & ${b?.name || '?'} married`, icon: '💍', type: 'marriage' };
                        }),
                        ...marriageRecords.filter(mr => mr.isDivorced && mr.divorceDate).map(mr => {
                            const a = nodes.find(n => n.id === mr.spouseAId);
                            const b = nodes.find(n => n.id === mr.spouseBId);
                            return { year: new Date(mr.divorceDate!).getFullYear(), label: `${a?.name || '?'} & ${b?.name || '?'} divorced`, icon: '💔', type: 'divorce' };
                        }),
                    ].sort((a, b) => a.year - b.year).map((event, i) => (
                        <div key={i} className="relative flex gap-4 mb-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
                            <div className="absolute -left-5 w-5 h-5 rounded-full flex items-center justify-center text-xs border-2"
                                style={{ background: CREAM, borderColor: event.type === 'death' ? GOLD : event.type === 'marriage' ? '#C62828' : BROWN, top: 4 }}>
                                <span style={{ fontSize: '9px' }}>{event.icon}</span>
                            </div>
                            <div className="flex-1 p-3 rounded-xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.08)' }}>
                                <span className="text-xs font-black mr-2" style={{ color: BROWN }}>{event.year}</span>
                                <span className="text-sm" style={{ color: CHARCOAL }}>{event.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── GRAPH VIEW ── */}
            {viewMode === 'graph' && (
                <div className="animate-fade-in">
                    <div className="rounded-2xl overflow-hidden relative" style={{ background: '#1a1008', minHeight: 440 }}>
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(circle, #C6A75E 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                        <div className="relative p-8 flex flex-wrap justify-center gap-8 items-center min-h-[440px]">
                            {nodes.map(node => {
                                const isFaded = tracedNodes && !tracedNodes.has(node.id);
                                const isSelected = selectedNode === node.id;
                                return (
                                    <div key={node.id} onClick={() => setSelectedNode(isSelected ? null : node.id)}
                                        className="flex flex-col items-center cursor-pointer transition-all"
                                        style={{ opacity: isFaded ? 0.15 : 1 }}>
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border-2 shadow-lg transition-all hover:scale-110"
                                            style={{
                                                background: node.isDeceased ? 'rgba(198,167,94,0.2)' : 'rgba(92,58,33,0.3)',
                                                borderColor: isSelected ? GOLD : node.isDeceased ? `${GOLD}80` : `${BROWN}80`,
                                                boxShadow: isSelected ? `0 0 20px ${GOLD}60` : '0 4px 12px rgba(0,0,0,0.3)',
                                            }}>
                                            {GENDER_ICON[node.gender]}
                                        </div>
                                        <p className="text-xs font-bold mt-1.5 text-center max-w-[70px] leading-tight" style={{ color: '#F4EFE6' }}>{node.name.split(' ')[0]}</p>
                                        {node.isDeceased && <span className="text-sm">🕊️</span>}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="absolute bottom-4 left-4 flex gap-4">
                            {[{ icon: '👨', l: 'Male' }, { icon: '👩', l: 'Female' }, { icon: '🕊️', l: 'Deceased' }, { icon: '💍', l: 'Married' }].map(x => (
                                <div key={x.l} className="flex items-center gap-1">
                                    <span className="text-sm">{x.icon}</span>
                                    <span className="text-xs" style={{ color: 'rgba(244,239,230,0.4)' }}>{x.l}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {selectedNode && (() => {
                        const n = nodes.find(x => x.id === selectedNode);
                        if (!n) return null;
                        return (
                            <div className="mt-4 p-4 rounded-2xl flex items-center gap-3" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                                <span className="text-2xl">{GENDER_ICON[n.gender]}</span>
                                <div>
                                    <p className="font-bold" style={{ color: CHARCOAL }}>{n.name}</p>
                                    <p className="text-xs" style={{ color: '#888' }}>
                                        Gen {n.generation}{n.birthDate ? ` · Born ${new Date(n.birthDate).getFullYear()}` : ''}{n.isDeceased && n.deathDate ? ` · Died ${new Date(n.deathDate).getFullYear()}` : ''}
                                    </p>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* Add Member Modal */}
            <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add Family Member">
                <div className="space-y-4">
                    <div>
                        <label className="input-label">Full Name *</label>
                        <input type="text" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} className="input-field" placeholder="e.g. Pa Nkeng Fomonyuy" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="input-label">Gender</label>
                            <select value={addForm.gender} onChange={e => setAddForm(f => ({ ...f, gender: e.target.value as any }))} className="input-field">
                                <option value="male">👨 Male</option><option value="female">👩 Female</option><option value="other">🧑 Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Parent Node</label>
                            <select value={addForm.parentId} onChange={e => setAddForm(f => ({ ...f, parentId: e.target.value }))} className="input-field">
                                <option value="">None (Founder)</option>
                                {nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Birth Date</label>
                            <input type="date" value={addForm.birthDate} onChange={e => setAddForm(f => ({ ...f, birthDate: e.target.value }))} className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Node Privacy</label>
                            <select value={addForm.nodePrivacy} onChange={e => setAddForm(f => ({ ...f, nodePrivacy: e.target.value }))} className="input-field">
                                <option value="visible">🌍 Visible to all</option>
                                <option value="hidden_living">🔒 Hidden (living only)</option>
                                <option value="private">🔕 Private</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={addForm.isDeceased} onChange={e => setAddForm(f => ({ ...f, isDeceased: e.target.checked }))} className="w-4 h-4" />
                            <span className="text-sm" style={{ color: CHARCOAL }}>🕊️ Deceased</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={addForm.isAdopted} onChange={e => setAddForm(f => ({ ...f, isAdopted: e.target.checked }))} className="w-4 h-4" />
                            <span className="text-sm" style={{ color: CHARCOAL }}>🤝 Adopted</span>
                        </label>
                    </div>
                    {addForm.isDeceased && (
                        <div>
                            <label className="input-label">Death Date</label>
                            <input type="date" value={addForm.deathDate} onChange={e => setAddForm(f => ({ ...f, deathDate: e.target.value }))} className="input-field" />
                        </div>
                    )}
                    {addForm.parentId && addForm.birthDate && (() => {
                        const parent = nodes.find(n => n.id === addForm.parentId);
                        const childYear = new Date(addForm.birthDate).getFullYear();
                        const parentYear = parent?.birthDate ? new Date(parent.birthDate).getFullYear() : null;
                        if (parentYear && childYear <= parentYear) return (
                            <div className="text-xs p-3 rounded-xl" style={{ background: 'rgba(198,40,40,0.08)', color: '#C62828', border: '1px solid rgba(198,40,40,0.2)' }}>
                                ⚠️ Validation: child birth year ({childYear}) cannot be ≤ parent birth year ({parentYear})
                            </div>
                        );
                        return null;
                    })()}
                    <button onClick={handleAddNode} disabled={!addForm.name.trim()} className="btn-primary w-full disabled:opacity-40" style={{ background: GOLD, color: CHARCOAL }}>
                        Add to Tree
                    </button>
                </div>
            </Modal>

            {/* Marriage Modal */}
            <Modal isOpen={marriageModal} onClose={() => setMarriageModal(false)} title="💍 Record Marriage / Divorce">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="input-label">Spouse A *</label>
                            <select value={marriageForm.spouseAId} onChange={e => setMarriageForm(f => ({ ...f, spouseAId: e.target.value }))} className="input-field">
                                <option value="">Select...</option>
                                {nodes.filter(n => n.id !== marriageForm.spouseBId).map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Spouse B *</label>
                            <select value={marriageForm.spouseBId} onChange={e => setMarriageForm(f => ({ ...f, spouseBId: e.target.value }))} className="input-field">
                                <option value="">Select...</option>
                                {nodes.filter(n => n.id !== marriageForm.spouseAId).map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Marriage Date</label>
                            <input type="date" value={marriageForm.marriageDate} onChange={e => setMarriageForm(f => ({ ...f, marriageDate: e.target.value }))} className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Location</label>
                            <input type="text" value={marriageForm.location} onChange={e => setMarriageForm(f => ({ ...f, location: e.target.value }))} className="input-field" placeholder="e.g. Bandjoun" />
                        </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={marriageForm.isDivorced} onChange={e => setMarriageForm(f => ({ ...f, isDivorced: e.target.checked }))} className="w-4 h-4" />
                        <span className="text-sm" style={{ color: CHARCOAL }}>💔 Record as Divorced</span>
                    </label>
                    {marriageForm.isDivorced && (
                        <div>
                            <label className="input-label">Divorce Date</label>
                            <input type="date" value={marriageForm.divorceDate} onChange={e => setMarriageForm(f => ({ ...f, divorceDate: e.target.value }))} className="input-field" />
                        </div>
                    )}
                    <button onClick={handleAddMarriage} disabled={!marriageForm.spouseAId || !marriageForm.spouseBId || marriageForm.spouseAId === marriageForm.spouseBId}
                        className="btn-primary w-full disabled:opacity-40" style={{ background: GOLD, color: CHARCOAL }}>Record</button>
                </div>
            </Modal>

            {/* History Modal */}
            <Modal isOpen={historyModal} onClose={() => setHistoryModal(false)} title="📜 Tree Edit History">
                <div className="space-y-2">
                    {editHistory.map((log, i) => (
                        <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: CREAM }}>
                            <span className="text-lg">{ACTION_ICON[log.action] || '📝'}</span>
                            <div>
                                <p className="text-sm" style={{ color: CHARCOAL }}>{log.description}</p>
                                <p className="text-xs mt-0.5" style={{ color: '#aaa' }}>by <strong style={{ color: BROWN }}>{log.editorName}</strong> · {new Date(log.createdAt).toLocaleDateString('en-GB')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>

            {/* Export Modal */}
            <Modal isOpen={exportModal} onClose={() => setExportModal(false)} title="⬇️ Export Family Tree">
                <div className="space-y-3">
                    {[{ f: 'PDF', i: '📄', d: 'Printable family tree document' }, { f: 'PNG Image', i: '🖼️', d: 'Image of your current tree view' }, { f: 'JSON Data', i: '📦', d: 'Raw data for backup / import' }, { f: 'GEDCOM', i: '🌐', d: 'Universal genealogy format' }].map(opt => (
                        <button key={opt.f} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all"
                            style={{ borderColor: 'rgba(92,58,33,0.15)', background: 'transparent' }}
                            onMouseEnter={e => (e.currentTarget as any).style.borderColor = BROWN}
                            onMouseLeave={e => (e.currentTarget as any).style.borderColor = 'rgba(92,58,33,0.15)'}>
                            <span className="text-2xl">{opt.i}</span>
                            <div>
                                <p className="font-bold text-sm" style={{ color: CHARCOAL }}>{opt.f}</p>
                                <p className="text-xs" style={{ color: '#888' }}>{opt.d}</p>
                            </div>
                        </button>
                    ))}
                    <p className="text-xs text-center" style={{ color: '#aaa' }}>Export requires backend integration</p>
                </div>
            </Modal>
        </div>
    );
}
