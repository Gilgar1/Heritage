'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar, PrivacyBadge, Icons, EmptyState, Modal, Tabs } from '@/components/shared';
import { FamilyTreeNode } from '@/types';

// ==============================
// FAMILY TREE VISUALIZATION
// ==============================
function FamilyTreeView({ familyId }: { familyId: string }) {
    const { getFamilyTreeNodes, getUserRoleInFamily, currentUser, addFamilyTreeNode } = useHeritage();
    const nodes = getFamilyTreeNodes(familyId);
    const role = currentUser ? getUserRoleInFamily(currentUser.id, familyId) : null;
    const canEdit = role === 'creator' || role === 'editor';
    const [showAddModal, setShowAddModal] = useState(false);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(nodes.map(n => n.id)));

    // For SVG links
    const containerRef = React.useRef<HTMLDivElement>(null);
    const nodeRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
    const [links, setLinks] = useState<{ id: string, path: string, type: 'parent' | 'spouse' }[]>([]);

    React.useEffect(() => {
        const computeLinks = () => {
            if (!containerRef.current) return;
            const containerRect = containerRef.current.getBoundingClientRect();

            const newLinks: { id: string, path: string, type: 'parent' | 'spouse' }[] = [];
            const drawnSpouses = new Set<string>();

            nodes.forEach(node => {
                const el = nodeRefs.current[node.id];
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const cx = rect.left + rect.width / 2 - containerRect.left;
                const cy = rect.top + rect.height / 2 - containerRect.top;

                // Parent links (smooth vertical curves)
                node.parentIds.forEach(pid => {
                    const pEl = nodeRefs.current[pid];
                    if (!pEl) return;
                    const pRect = pEl.getBoundingClientRect();
                    const px = pRect.left + pRect.width / 2 - containerRect.left;
                    const py = pRect.top + pRect.height / 2 - containerRect.top;

                    // Quadratic bezier top-to-bottom
                    const path = `M ${px} ${py} C ${px} ${(py + cy) / 2}, ${cx} ${(py + cy) / 2}, ${cx} ${cy}`;
                    newLinks.push({ id: `p-${pid}-${node.id}`, path, type: 'parent' });
                });

                // Spouse links (dashed straight or small curve)
                node.spouseIds.forEach(sid => {
                    const linkId = [node.id, sid].sort().join('-');
                    if (drawnSpouses.has(linkId)) return;
                    drawnSpouses.add(linkId);

                    const sEl = nodeRefs.current[sid];
                    if (!sEl) return;
                    const sRect = sEl.getBoundingClientRect();
                    const sx = sRect.left + sRect.width / 2 - containerRect.left;
                    const sy = sRect.top + sRect.height / 2 - containerRect.top;

                    // Just a straight dashed line between centers looks fine since they're in same generation row usually
                    const path = `M ${cx} ${cy} L ${sx} ${sy}`;
                    newLinks.push({ id: `s-${linkId}`, path, type: 'spouse' });
                });
            });
            setLinks(newLinks);
        };

        const timer = setTimeout(computeLinks, 50); // slight delay to allow layout completion
        window.addEventListener('resize', computeLinks);
        return () => { clearTimeout(timer); window.removeEventListener('resize', computeLinks); };
    }, [nodes, expandedNodes]);

    const toggleNode = (id: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // Group nodes by generation
    const generations: Record<number, FamilyTreeNode[]> = {};
    nodes.forEach(node => {
        if (!generations[node.generation]) generations[node.generation] = [];
        generations[node.generation].push(node);
    });

    const generationKeys = Object.keys(generations).map(Number).sort();

    const [newMember, setNewMember] = useState({
        name: '', gender: 'male' as 'male' | 'female', birthDate: '',
        isDeceased: false, deathDate: '', parentId: '',
    });

    const handleAddMember = () => {
        if (!newMember.name.trim()) return;
        const parentNode = nodes.find(n => n.id === newMember.parentId);
        const newNode: FamilyTreeNode = {
            id: `node-${Date.now()}`,
            userId: '',
            name: newMember.name,
            birthDate: newMember.birthDate,
            deathDate: newMember.isDeceased ? newMember.deathDate : undefined,
            isDeceased: newMember.isDeceased,
            gender: newMember.gender,
            parentIds: newMember.parentId ? [newMember.parentId] : [],
            spouseIds: [],
            childIds: [],
            generation: parentNode ? parentNode.generation + 1 : 0,
            nodePrivacy: 'visible',
        };
        addFamilyTreeNode(familyId, newNode);
        setShowAddModal(false);
        setNewMember({ name: '', gender: 'male', birthDate: '', isDeceased: false, deathDate: '', parentId: '' });
    };

    if (nodes.length === 0) {
        return (
            <EmptyState
                icon={<Icons.Tree />}
                title="No family tree yet"
                description="Start building your family tree by adding the first member."
                action={canEdit ? (
                    <button onClick={() => setShowAddModal(true)} className="btn-primary">
                        <Icons.Plus /> Add First Member
                    </button>
                ) : undefined}
            />
        );
    }

    return (
        <div className="relative">
            {canEdit && (
                <div className="flex justify-end mb-4">
                    <button onClick={() => setShowAddModal(true)} className="btn-primary btn-sm">
                        <Icons.Plus /> Add Member
                    </button>
                </div>
            )}

            {/* Tree Visualization */}
            <div className="overflow-x-auto overflow-y-hidden pb-12 pt-4 relative min-h-[400px]" ref={containerRef}>
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ minWidth: 800 }}>
                    {links.map(link => (
                        <path
                            key={link.id}
                            d={link.path}
                            fill="none"
                            stroke={link.type === 'parent' ? '#C6A75E' : '#C6A75E'}
                            strokeWidth={link.type === 'parent' ? 2.5 : 2}
                            strokeDasharray={link.type === 'spouse' ? '6,6' : 'none'}
                            strokeOpacity={link.type === 'parent' ? 0.6 : 0.4}
                            className="transition-all duration-300 ease-in-out"
                        />
                    ))}
                </svg>
                <div className="min-w-[800px] relative z-10 flex flex-col items-center">
                    {generationKeys.map((gen, genIndex) => (
                        <div key={gen} className="relative w-full mb-16">
                            {/* Generation Label */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider bg-[#F4EFE6] px-2 rounded hidden lg:block border border-surface-200" style={{ background: '#fcfbfa' }}>
                                    Generation {gen + 1}
                                </span>
                            </div>

                            {/* Nodes Row */}
                            <div className="flex flex-wrap gap-10 justify-center">
                                {generations[gen].map(node => (
                                    <div
                                        key={node.id}
                                        ref={el => { nodeRefs.current[node.id] = el; }}
                                        onClick={() => toggleNode(node.id)}
                                        className={`glass-card p-4 min-w-[140px] cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg group bg-white ${node.isDeceased ? 'border-gold-500/20' : ''}`}
                                        style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}
                                    >
                                        <div className="flex flex-col items-center text-center">
                                            <Avatar
                                                name={node.name}
                                                url={node.avatarUrl}
                                                size="md"
                                                isDeceased={node.isDeceased}
                                            />
                                            <p className="font-semibold text-sm mt-3 group-hover:text-heritage-500 transition-colors" style={{ color: '#1F1F1F' }}>
                                                {node.name}
                                            </p>
                                            {node.birthDate && (
                                                <p className="text-xs mt-1" style={{ color: '#888' }}>
                                                    b. {new Date(node.birthDate).getFullYear()}
                                                    {node.deathDate && ` — d. ${new Date(node.deathDate).getFullYear()}`}
                                                </p>
                                            )}
                                            {node.isDeceased && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full mt-2 flex items-center gap-1 font-semibold" style={{ background: '#e5dac9', color: '#8c7644' }}>
                                                    🕊️ Passed
                                                </span>
                                            )}
                                            {/* Relationship Indicators */}
                                            <div className="flex gap-2 mt-2 border-t border-dashed w-full justify-center pt-2 border-surface-200">
                                                <span className="text-[10px] font-medium" style={{ color: '#666' }}>
                                                    💍 {node.spouseIds.length}
                                                </span>
                                                <span className="text-[10px] font-medium" style={{ color: '#666' }}>
                                                    👶 {node.childIds.length}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Member Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Family Member">
                <div className="space-y-4">
                    <div>
                        <label className="input-label">Full Name *</label>
                        <input type="text" value={newMember.name} onChange={e => setNewMember(prev => ({ ...prev, name: e.target.value }))} className="input-field" placeholder="Full name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="input-label">Gender</label>
                            <select value={newMember.gender} onChange={e => setNewMember(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))} className="input-field">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Birth Date</label>
                            <input type="date" value={newMember.birthDate} onChange={e => setNewMember(prev => ({ ...prev, birthDate: e.target.value }))} className="input-field" />
                        </div>
                    </div>
                    {nodes.length > 0 && (
                        <div>
                            <label className="input-label">Parent (Optional)</label>
                            <select value={newMember.parentId} onChange={e => setNewMember(prev => ({ ...prev, parentId: e.target.value }))} className="input-field">
                                <option value="">No parent (root)</option>
                                {nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={newMember.isDeceased} onChange={e => setNewMember(prev => ({ ...prev, isDeceased: e.target.checked }))} className="w-4 h-4 rounded accent-gold-500" />
                            <span className="text-sm text-surface-300">This person is deceased</span>
                        </label>
                    </div>
                    {newMember.isDeceased && (
                        <div>
                            <label className="input-label">Date of Death</label>
                            <input type="date" value={newMember.deathDate} onChange={e => setNewMember(prev => ({ ...prev, deathDate: e.target.value }))} className="input-field" />
                        </div>
                    )}
                    <button onClick={handleAddMember} disabled={!newMember.name.trim()} className="btn-primary w-full disabled:opacity-50">
                        Add to Family Tree
                    </button>
                </div>
            </Modal>
        </div>
    );
}

// ==============================
// MEMBERS LIST
// ==============================
function MembersList({ familyId }: { familyId: string }) {
    const { getFamilyById, getUserById, currentUser, getUserRoleInFamily, assignEditor, removeEditor, leaveFamily } = useHeritage();
    const family = getFamilyById(familyId);
    const currentUserRole = currentUser ? getUserRoleInFamily(currentUser.id, familyId) : null;

    if (!family) return null;

    return (
        <div className="space-y-3">
            {family.members.map(membership => {
                const member = getUserById(membership.userId);
                if (!member) return null;
                return (
                    <div key={membership.userId} className="glass-card p-4 flex items-center gap-4">
                        <Link href={`/profile/${member.id}`}>
                            <Avatar name={member.fullName} url={member.avatarUrl} size="md" isDeceased={member.isDeceased} />
                        </Link>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Link href={`/profile/${member.id}`} className="font-semibold text-surface-100 hover:text-heritage-300 transition-colors">
                                    {member.fullName}
                                </Link>
                                <span className="badge-role">{membership.role}</span>
                                {member.isDeceased && <span className="badge-deceased text-xs px-2 py-0.5 rounded-full">🕊️</span>}
                            </div>
                            <p className="text-xs text-surface-500 mt-0.5">
                                {member.tribe} · {member.village}
                            </p>
                        </div>
                        {currentUserRole === 'creator' && membership.role !== 'creator' && (
                            <div className="flex gap-2">
                                {membership.role === 'member' ? (
                                    <button onClick={() => assignEditor(familyId, membership.userId)} className="btn-secondary btn-sm text-xs">
                                        Make Editor
                                    </button>
                                ) : (
                                    <button onClick={() => removeEditor(familyId, membership.userId)} className="btn-danger btn-sm text-xs">
                                        Remove Editor
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ==============================
// TRIBUTE MANAGEMENT
// ==============================
function TributeManagement({ familyId }: { familyId: string }) {
    const { posts, currentUser, getUserRoleInFamily, approveTribute, rejectTribute } = useHeritage();
    const role = currentUser ? getUserRoleInFamily(currentUser.id, familyId) : null;
    const canApprove = role === 'creator' || role === 'editor';

    const tributePosts = posts.filter(p => p.type === 'tribute' && p.familyId === familyId);
    const pendingTributes = tributePosts.filter(p => p.tributeStatus === 'pending');
    const approvedTributes = tributePosts.filter(p => p.tributeStatus === 'approved');

    return (
        <div className="space-y-6">
            {canApprove && pendingTributes.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gold-400 text-sm mb-3 flex items-center gap-2">
                        <Icons.Candle /> Pending Tributes ({pendingTributes.length})
                    </h3>
                    <div className="space-y-3">
                        {pendingTributes.map(post => (
                            <div key={post.id} className="glass-card p-4 border-gold-500/10">
                                <div className="flex items-start gap-3">
                                    <Avatar name={post.authorName} size="sm" />
                                    <div className="flex-1">
                                        <p className="font-medium text-surface-200 text-sm">{post.authorName}</p>
                                        <p className="text-surface-300 text-sm mt-1">{post.content}</p>
                                        <div className="flex gap-2 mt-3">
                                            <button onClick={() => approveTribute(post.id)} className="btn-primary btn-sm text-xs">
                                                <Icons.Check /> Approve
                                            </button>
                                            <button onClick={() => rejectTribute(post.id)} className="btn-danger btn-sm text-xs">
                                                <Icons.X /> Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {approvedTributes.length > 0 && (
                <div>
                    <h3 className="font-semibold text-surface-200 text-sm mb-3">Approved Tributes</h3>
                    <div className="space-y-3">
                        {approvedTributes.map(post => (
                            <div key={post.id} className="glass-card p-4 bg-gradient-to-r from-gold-500/5 to-transparent">
                                <div className="flex items-start gap-3">
                                    <Avatar name={post.authorName} size="sm" />
                                    <div>
                                        <p className="font-medium text-surface-200 text-sm">{post.authorName}</p>
                                        <p className="text-surface-300 text-sm mt-1">{post.content}</p>
                                        <p className="text-xs text-surface-500 mt-2">{new Date(post.createdAt).toLocaleDateString('en-GB')}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tributePosts.length === 0 && (
                <EmptyState
                    icon={<Icons.Candle />}
                    title="No tributes yet"
                    description="Tributes honor deceased family members. They require approval before being published."
                />
            )}
        </div>
    );
}

// ==============================
// FAMILY DETAIL PAGE
// ==============================
export default function FamilyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getFamilyById, currentUser, getUserRoleInFamily, joinFamily, leaveFamily, requestFamilyDeletion } = useHeritage();
    const [activeTab, setActiveTab] = useState('tree');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const family = getFamilyById(id);
    const role = currentUser ? getUserRoleInFamily(currentUser.id, id) : null;
    const isMember = !!role;
    const isCreator = role === 'creator';

    if (!family) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8">
                <EmptyState icon={<Icons.Users />} title="Family not found" description="This family doesn't exist or has been deleted." />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Family Header */}
            <div className="glass-card overflow-hidden mb-6">
                {/* Cover */}
                <div className="h-40 gradient-heritage relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 to-transparent" />
                    {family.status === 'frozen' && (
                        <div className="absolute top-4 right-4 badge-pending px-3 py-1 rounded-full text-xs font-semibold">
                            ❄️ Family Frozen
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-6 -mt-8 relative z-10">
                    <div className="flex items-end gap-4">
                        <div className="w-20 h-20 rounded-2xl gradient-heritage flex items-center justify-center text-white font-bold text-3xl border-4 border-surface-800 shadow-xl">
                            {family.name[0]}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl font-bold text-surface-100">{family.name}</h1>
                                <PrivacyBadge privacy={family.privacy} />
                            </div>
                            <p className="text-surface-400 text-sm mt-1">{family.description}</p>
                            <div className="flex items-center gap-4 mt-3">
                                <span className="text-xs text-surface-500">{family.memberCount} members</span>
                                <span className="text-xs text-surface-500">Created {new Date(family.createdAt).toLocaleDateString('en-GB')}</span>
                                {role && <span className="badge-role">Your Role: {role}</span>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                            {!isMember && family.privacy !== 'private' && (
                                <button onClick={() => currentUser && joinFamily(id, currentUser.id)} className="btn-primary">
                                    Join Family
                                </button>
                            )}
                            {isMember && !isCreator && (
                                <button onClick={() => currentUser && leaveFamily(id, currentUser.id)} className="btn-danger btn-sm">
                                    Leave
                                </button>
                            )}
                            {isCreator && (
                                <button onClick={() => setShowDeleteModal(true)} className="btn-danger btn-sm">
                                    Request Deletion
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs
                tabs={[
                    { id: 'tree', label: 'Family Tree' },
                    { id: 'members', label: 'Members', count: family.memberCount },
                    { id: 'tributes', label: 'Tributes' },
                    { id: 'discussion', label: 'Discussion' },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'tree' && <FamilyTreeView familyId={id} />}
                {activeTab === 'members' && <MembersList familyId={id} />}
                {activeTab === 'tributes' && <TributeManagement familyId={id} />}
                {activeTab === 'discussion' && (
                    <EmptyState
                        icon={<Icons.Message />}
                        title="Family Discussion"
                        description="A place for family conversations. Start the discussion!"
                        action={
                            <Link href="/messages" className="btn-primary btn-sm">
                                Open Family Thread
                            </Link>
                        }
                    />
                )}
            </div>

            {/* Deletion Modal */}
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Request Family Deletion">
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-danger/10 border border-danger/20">
                        <p className="text-sm text-danger font-semibold">⚠️ This action is serious</p>
                        <p className="text-xs text-surface-300 mt-1">
                            Requesting deletion will freeze this family for 7 days while admin reviews. All editors will be notified. This cannot be undone after approval.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            requestFamilyDeletion(id);
                            setShowDeleteModal(false);
                        }}
                        className="btn-danger w-full"
                    >
                        Request Deletion
                    </button>
                </div>
            </Modal>
        </div>
    );
}
