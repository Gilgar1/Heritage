'use client';

import React, { useState, use } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar, Icons, EmptyState, Modal, Tabs } from '@/components/shared';

const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';
const GREEN = '#2F5D50';

export default function GovernancePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getFamilyById, currentUser, getUserRoleInFamily, getUserById, users } = useHeritage();

    const family = getFamilyById(id);
    const role = currentUser ? getUserRoleInFamily(currentUser.id, id) : null;
    const isCreator = role === 'creator';
    const canVote = !!role;

    const [tab, setTab] = useState('council');
    const [constitution, setConstitution] = useState(
        (family as any)?.constitution ||
        `Article 1 — Family Values\nThis family is governed by principles of respect, unity, and preservation of our lineage.\n\nArticle 2 — Membership\nAll blood relatives and their spouses are eligible for membership, subject to Creator approval.\n\nArticle 3 — Roles\n- Creator: Holds ultimate governance authority.\n- Editor: Can manage the family tree and approve tributes.\n- Member: Can view the tree and participate in discussions.\n\nArticle 4 — Major Decisions\nAny decision affecting more than 50% of members must be put to a governance vote.\n\nArticle 5 — Deletion\nFamily deletion requires a 7-day freeze period reviewed by the Heritage admin team.`
    );
    const [editingConstitution, setEditingConstitution] = useState(false);

    // Mock votes
    const [votes, setVotes] = useState([
        {
            id: 'v1',
            question: 'Should we open the family tree to public viewing?',
            description: 'This would allow non-members to browse our family tree in read-only mode.',
            options: [
                { id: 'yes', label: '✅ Yes, open it', votes: ['user-2', 'user-3'] },
                { id: 'no', label: '🔒 No, keep private', votes: ['user-4'] },
            ],
            status: 'active' as const,
            closesAt: new Date(Date.now() + 5 * 86400000).toISOString(),
            createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
        {
            id: 'v2',
            question: 'Should we invite the Nkeng diaspora in the UK to join?',
            description: 'We have identified 12 family members in the UK diaspora who could join Heritage.',
            options: [
                { id: 'yes', label: '✅ Yes, invite them', votes: ['user-1', 'user-2', 'user-3', 'user-4'] },
                { id: 'no', label: '❌ Not yet', votes: [] },
            ],
            status: 'closed' as const,
            closesAt: new Date(Date.now() - 86400000).toISOString(),
            createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
        },
    ]);

    const [newVoteModal, setNewVoteModal] = useState(false);
    const [newVote, setNewVote] = useState({ question: '', description: '', days: '7' });
    const [disputes, setDisputes] = useState<{ id: string; title: string; description: string; status: string; createdAt: string }[]>([]);
    const [disputeModal, setDisputeModal] = useState(false);
    const [disputeForm, setDisputeForm] = useState({ title: '', description: '' });
    const [transferModal, setTransferModal] = useState(false);
    const [transferTo, setTransferTo] = useState('');

    if (!family) {
        return <div className="max-w-4xl mx-auto px-4 py-8"><p style={{ color: '#888' }}>Family not found.</p></div>;
    }

    const handleVote = (voteId: string, optionId: string) => {
        if (!currentUser) return;
        setVotes(prev => prev.map(v => {
            if (v.id !== voteId || v.status === 'closed') return v;
            return {
                ...v,
                options: v.options.map(o => ({
                    ...o,
                    votes: o.id === optionId
                        ? o.votes.includes(currentUser.id) ? o.votes : [...o.votes, currentUser.id]
                        : o.votes.filter(uid => uid !== currentUser.id),
                })),
            };
        }));
    };

    const handleCreateVote = () => {
        if (!newVote.question.trim() || !currentUser) return;
        const freshVote = {
            id: `v-${Date.now()}`,
            question: newVote.question,
            description: newVote.description,
            options: [
                { id: 'yes', label: '✅ Yes', votes: [] as string[] },
                { id: 'no', label: '❌ No', votes: [] as string[] },
            ],
            status: 'active' as const,
            closesAt: new Date(Date.now() + parseInt(newVote.days) * 86400000).toISOString(),
            createdAt: new Date().toISOString(),
        };
        setVotes(prev => [freshVote, ...prev]);
        setNewVote({ question: '', description: '', days: '7' });
        setNewVoteModal(false);
    };

    const handleDisputeSubmit = () => {
        if (!disputeForm.title.trim() || !currentUser) return;
        setDisputes(prev => [{
            id: `d-${Date.now()}`,
            title: disputeForm.title,
            description: disputeForm.description,
            status: 'pending',
            createdAt: new Date().toISOString(),
        }, ...prev]);
        setDisputeForm({ title: '', description: '' });
        setDisputeModal(false);
    };

    const members = family.members.map(m => getUserById(m.userId)).filter(Boolean);
    const custodians = family.members.filter(m => m.role === 'creator' || m.role === 'editor');

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: CHARCOAL }}>Family Governance</h1>
                    <p className="text-sm mt-0.5" style={{ color: '#888' }}>{family.name}</p>
                </div>
                {isCreator && (
                    <div className="flex gap-2">
                        <button onClick={() => setNewVoteModal(true)} className="btn-secondary btn-sm">
                            + New Vote
                        </button>
                    </div>
                )}
            </div>

            <Tabs
                tabs={[
                    { id: 'council', label: '👥 Council' },
                    { id: 'constitution', label: '📜 Constitution' },
                    { id: 'votes', label: '🗳️ Votes', count: votes.filter(v => v.status === 'active').length },
                    { id: 'permissions', label: '🔐 Permissions' },
                    { id: 'disputes', label: '⚖️ Disputes' },
                    { id: 'transfer', label: '🔄 Ownership' },
                ]}
                activeTab={tab}
                onChange={setTab}
            />

            <div className="mt-6">

                {/* COUNCIL */}
                {tab === 'council' && (
                    <div className="animate-fade-in space-y-4">
                        <div className="p-5 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                            <h2 className="font-bold text-sm mb-4 uppercase tracking-wider" style={{ color: BROWN }}>Governance Council</h2>
                            <p className="text-xs mb-4" style={{ color: '#888' }}>
                                The council protects the family tree and approves major decisions. Creators and Editors form the governing body.
                            </p>
                            <div className="space-y-3">
                                {custodians.map(m => {
                                    const member = getUserById(m.userId);
                                    if (!member) return null;
                                    return (
                                        <div key={m.userId} className="flex items-center gap-4 p-3 rounded-xl"
                                            style={{ background: CREAM, border: '1px solid rgba(92,58,33,0.08)' }}>
                                            <Avatar name={member.fullName} url={member.avatarUrl} size="md" />
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm" style={{ color: CHARCOAL }}>{member.fullName}</p>
                                                <p className="text-xs" style={{ color: '#888' }}>{member.tribe} · {member.village}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="badge-role">{m.role}</span>
                                                {m.role === 'creator' && <span className="text-xs" style={{ color: GOLD }}>👑 Custodian</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* CONSTITUTION */}
                {tab === 'constitution' && (
                    <div className="animate-fade-in">
                        <div className="p-6 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-base" style={{ color: CHARCOAL }}>Family Constitution</h2>
                                {isCreator && (
                                    <button onClick={() => setEditingConstitution(!editingConstitution)} className="btn-secondary btn-sm">
                                        {editingConstitution ? 'Cancel' : 'Edit'}
                                    </button>
                                )}
                            </div>
                            {editingConstitution ? (
                                <div className="space-y-3">
                                    <textarea
                                        value={constitution}
                                        onChange={e => setConstitution(e.target.value)}
                                        className="input-field font-mono text-sm"
                                        style={{ minHeight: 320, lineHeight: '1.7' }}
                                    />
                                    <button onClick={() => setEditingConstitution(false)}
                                        className="btn-primary w-full" style={{ background: GOLD, color: CHARCOAL }}>
                                        Save Constitution
                                    </button>
                                </div>
                            ) : (
                                <div className="prose prose-sm max-w-none">
                                    {constitution.split('\n').map((line: string, i: number) => (
                                        <p key={i} className={`${line.startsWith('Article') ? 'font-bold mt-4' : ''} text-sm`}
                                            style={{ color: line.startsWith('Article') ? CHARCOAL : '#555', margin: '4px 0' }}>
                                            {line || '\u00A0'}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* GOVERNANCE VOTES */}
                {tab === 'votes' && (
                    <div className="animate-fade-in space-y-4">
                        {votes.map(vote => {
                            const totalVotes = vote.options.reduce((sum, o) => sum + o.votes.length, 0);
                            const myVote = vote.options.find(o => currentUser && o.votes.includes(currentUser.id));
                            return (
                                <div key={vote.id} className="p-5 rounded-2xl"
                                    style={{ background: '#fcfbfa', border: `1px solid ${vote.status === 'active' ? `${BROWN}30` : 'rgba(92,58,33,0.1)'}` }}>
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full mr-2 ${vote.status === 'active' ? '' : ''}`}
                                                style={vote.status === 'active'
                                                    ? { background: `${GREEN}15`, color: GREEN }
                                                    : { background: 'rgba(0,0,0,0.06)', color: '#888' }}>
                                                {vote.status === 'active' ? '🟢 Active' : '⚫ Closed'}
                                            </span>
                                        </div>
                                        {vote.status === 'active' && (
                                            <p className="text-xs" style={{ color: '#888' }}>
                                                Closes {new Date(vote.closesAt).toLocaleDateString('en-GB')}
                                            </p>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-base mb-1" style={{ color: CHARCOAL }}>{vote.question}</h3>
                                    {vote.description && <p className="text-sm mb-4" style={{ color: '#666' }}>{vote.description}</p>}

                                    <div className="space-y-2">
                                        {vote.options.map(opt => {
                                            const pct = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
                                            const isMyVote = currentUser && opt.votes.includes(currentUser.id);
                                            return (
                                                <button key={opt.id}
                                                    onClick={() => canVote && vote.status === 'active' && handleVote(vote.id, opt.id)}
                                                    disabled={vote.status === 'closed' || !canVote}
                                                    className="w-full text-left p-3 rounded-xl border-2 transition-all relative overflow-hidden"
                                                    style={{
                                                        borderColor: isMyVote ? BROWN : 'rgba(92,58,33,0.15)',
                                                        background: 'transparent',
                                                        cursor: vote.status === 'closed' ? 'default' : 'pointer',
                                                    }}>
                                                    {/* Progress bar */}
                                                    <div className="absolute inset-0 rounded-xl transition-all"
                                                        style={{ width: `${pct}%`, background: isMyVote ? `${BROWN}10` : `${GOLD}10` }} />
                                                    <div className="relative flex items-center justify-between">
                                                        <span className="text-sm font-semibold" style={{ color: CHARCOAL }}>{opt.label}</span>
                                                        <span className="text-sm font-bold" style={{ color: BROWN }}>{pct}% ({opt.votes.length})</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs mt-3" style={{ color: '#999' }}>{totalVotes} vote{totalVotes !== 1 ? 's' : ''} cast</p>
                                </div>
                            );
                        })}

                        {isCreator && (
                            <button onClick={() => setNewVoteModal(true)}
                                className="w-full py-4 rounded-2xl border-2 border-dashed font-semibold text-sm transition-all"
                                style={{ borderColor: 'rgba(92,58,33,0.2)', color: BROWN }}>
                                + Create New Vote
                            </button>
                        )}
                    </div>
                )}

                {/* PERMISSIONS */}
                {tab === 'permissions' && (
                    <div className="animate-fade-in">
                        <div className="p-5 rounded-2xl overflow-hidden" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                            <h2 className="font-bold text-base mb-4" style={{ color: CHARCOAL }}>Role Permission Matrix</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr style={{ background: CREAM }}>
                                            <th className="text-left p-3 font-semibold" style={{ color: CHARCOAL }}>Permission</th>
                                            <th className="text-center p-3 font-semibold" style={{ color: GOLD }}>👑 Creator</th>
                                            <th className="text-center p-3 font-semibold" style={{ color: BROWN }}>✏️ Editor</th>
                                            <th className="text-center p-3 font-semibold" style={{ color: '#888' }}>👤 Member</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ borderTop: '1px solid rgba(92,58,33,0.08)' }}>
                                        {[
                                            ['View Family Tree', true, true, true],
                                            ['Add Tree Members', true, true, false],
                                            ['Edit Tree Members', true, true, false],
                                            ['Remove Tree Members', true, false, false],
                                            ['Approve Tributes', true, true, false],
                                            ['Add Members', true, true, false],
                                            ['Assign Editors', true, false, false],
                                            ['Edit Constitution', true, false, false],
                                            ['Create Governance Vote', true, false, false],
                                            ['Vote on Decisions', true, true, true],
                                            ['Request Deletion', true, false, false],
                                            ['Transfer Ownership', true, false, false],
                                        ].map(([label, creator, editor, member], i) => (
                                            <tr key={i} className="transition-colors" style={{ borderTop: '1px solid rgba(92,58,33,0.06)' }}
                                                onMouseEnter={e => (e.currentTarget as any).style.background = CREAM}
                                                onMouseLeave={e => (e.currentTarget as any).style.background = ''}>
                                                <td className="p-3" style={{ color: '#555', fontSize: '0.85rem' }}>{label as string}</td>
                                                {[creator, editor, member].map((has, j) => (
                                                    <td key={j} className="p-3 text-center">
                                                        <span className={`text-base ${has ? 'opacity-100' : 'opacity-20'}`}>
                                                            {has ? '✅' : '❌'}
                                                        </span>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* DISPUTES */}
                {tab === 'disputes' && (
                    <div className="animate-fade-in space-y-4">
                        <div className="p-4 rounded-xl mb-2" style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}25` }}>
                            <p className="text-xs font-semibold" style={{ color: BROWN }}>⚖️ Dispute Resolution</p>
                            <p className="text-xs mt-1" style={{ color: '#666' }}>
                                Submit a dispute if you believe a family tree entry, tribute, or governance decision was made incorrectly. A Heritage mediator will review within 5 days.
                            </p>
                        </div>

                        <button onClick={() => setDisputeModal(true)}
                            className="w-full py-3 rounded-xl font-semibold text-sm border-2 border-dashed transition-all"
                            style={{ borderColor: 'rgba(92,58,33,0.25)', color: BROWN }}>
                            + Submit a Dispute
                        </button>

                        {disputes.length > 0 ? disputes.map(d => (
                            <div key={d.id} className="p-4 rounded-xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-semibold text-sm" style={{ color: CHARCOAL }}>{d.title}</p>
                                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${GOLD}15`, color: BROWN }}>
                                        {d.status}
                                    </span>
                                </div>
                                <p className="text-xs" style={{ color: '#666' }}>{d.description}</p>
                                <p className="text-xs mt-2" style={{ color: '#aaa' }}>Submitted {new Date(d.createdAt).toLocaleDateString('en-GB')}</p>
                            </div>
                        )) : (
                            <p className="text-center py-8 text-sm" style={{ color: '#aaa' }}>No disputes submitted yet.</p>
                        )}
                    </div>
                )}

                {/* OWNERSHIP TRANSFER */}
                {tab === 'transfer' && (
                    <div className="animate-fade-in space-y-4">
                        <div className="p-6 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                            <h2 className="font-bold text-base mb-2" style={{ color: CHARCOAL }}>Transfer Family Ownership</h2>
                            <p className="text-sm mb-4" style={{ color: '#666' }}>
                                As Creator, you can transfer ownership of this family to another existing member. This is a permanent and irreversible action that will be logged.
                            </p>
                            {isCreator ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="input-label">Transfer ownership to</label>
                                        <select value={transferTo} onChange={e => setTransferTo(e.target.value)} className="input-field">
                                            <option value="">Select a family member...</option>
                                            {family.members.filter(m => m.userId !== currentUser?.id).map(m => {
                                                const u = getUserById(m.userId);
                                                return u ? <option key={m.userId} value={m.userId}>{u.fullName} ({m.role})</option> : null;
                                            })}
                                        </select>
                                    </div>
                                    {transferTo && (
                                        <div className="p-4 rounded-xl" style={{ background: 'rgba(198,40,40,0.05)', border: '1px solid rgba(198,40,40,0.2)' }}>
                                            <p className="text-xs font-semibold" style={{ color: '#C62828' }}>⚠️ This action is permanent</p>
                                            <p className="text-xs mt-1" style={{ color: '#666' }}>
                                                You will be downgraded to Editor. The new Creator will have full governance authority.
                                            </p>
                                        </div>
                                    )}
                                    <button disabled={!transferTo} className="btn-danger w-full disabled:opacity-30">
                                        Transfer Ownership
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm" style={{ color: '#888' }}>Only the Family Creator can transfer ownership.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Vote Modal */}
            <Modal isOpen={newVoteModal} onClose={() => setNewVoteModal(false)} title="Create Governance Vote">
                <div className="space-y-4">
                    <div>
                        <label className="input-label">Question *</label>
                        <input type="text" value={newVote.question} onChange={e => setNewVote(n => ({ ...n, question: e.target.value }))}
                            className="input-field" placeholder="What should the family decide?" />
                    </div>
                    <div>
                        <label className="input-label">Description</label>
                        <textarea value={newVote.description} onChange={e => setNewVote(n => ({ ...n, description: e.target.value }))}
                            className="input-field min-h-[80px] resize-none" placeholder="Provide context for this vote..." />
                    </div>
                    <div>
                        <label className="input-label">Voting period (days)</label>
                        <select value={newVote.days} onChange={e => setNewVote(n => ({ ...n, days: e.target.value }))} className="input-field">
                            {['3', '5', '7', '14'].map(d => <option key={d} value={d}>{d} days</option>)}
                        </select>
                    </div>
                    <button onClick={handleCreateVote} disabled={!newVote.question.trim()}
                        className="btn-primary w-full disabled:opacity-40" style={{ background: GOLD, color: CHARCOAL }}>
                        Start Vote
                    </button>
                </div>
            </Modal>

            {/* Dispute Modal */}
            <Modal isOpen={disputeModal} onClose={() => setDisputeModal(false)} title="Submit a Dispute">
                <div className="space-y-4">
                    <div>
                        <label className="input-label">Title *</label>
                        <input type="text" value={disputeForm.title} onChange={e => setDisputeForm(f => ({ ...f, title: e.target.value }))}
                            className="input-field" placeholder="Brief description of the issue" />
                    </div>
                    <div>
                        <label className="input-label">Full Description</label>
                        <textarea value={disputeForm.description} onChange={e => setDisputeForm(f => ({ ...f, description: e.target.value }))}
                            className="input-field min-h-[100px] resize-none" placeholder="Explain what happened and what you'd like resolved..." />
                    </div>
                    <button onClick={handleDisputeSubmit} disabled={!disputeForm.title.trim()}
                        className="btn-primary w-full disabled:opacity-40" style={{ background: BROWN, color: CREAM }}>
                        Submit Dispute
                    </button>
                </div>
            </Modal>
        </div>
    );
}
