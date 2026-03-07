'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar, Icons, EmptyState } from '@/components/shared';
import { Post } from '@/types';
import { ReportModal } from '@/components/ReportModal';

const BROWN = '#5C3A21'; const GOLD = '#C6A75E'; const CREAM = '#F4EFE6'; const CHARCOAL = '#1F1F1F'; const GREEN = '#2F5D50';

const REACTIONS = ['❤️', '👏', '😢', '🙏', '🕯️', '😮'];

function timeAgo(d: string) {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return 'just now'; if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`; if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
    return new Date(d).toLocaleDateString('en-GB');
}

interface ThreadedComment { id: string; authorId: string; authorName: string; authorAvatar?: string; content: string; createdAt: string; replies: ThreadedComment[]; likes: string[]; }

function CommentThread({ comment, depth = 0, onReply, currentUserId }: { comment: ThreadedComment; depth?: number; onReply: (parentId: string, text: string) => void; currentUserId: string; }) {
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showReplies, setShowReplies] = useState(false);

    const submit = () => { if (!replyText.trim()) return; onReply(comment.id, replyText.trim()); setReplyText(''); setShowReply(false); };

    return (
        <div className={`flex gap-2.5 ${depth > 0 ? 'ml-8 mt-2' : 'mt-3'}`}>
            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: BROWN, color: CREAM }}>{comment.authorName[0]}</div>
            <div className="flex-1 min-w-0">
                <div className="rounded-xl px-3 py-2" style={{ background: CREAM }}>
                    <p className="text-xs font-bold" style={{ color: BROWN }}>{comment.authorName}</p>
                    <p className="text-sm mt-0.5" style={{ color: CHARCOAL }}>{comment.content}</p>
                </div>
                <div className="flex items-center gap-3 mt-1 px-1">
                    <span className="text-[10px]" style={{ color: '#bbb' }}>{timeAgo(comment.createdAt)}</span>
                    <button onClick={() => setShowReply(!showReply)} className="text-[10px] font-bold" style={{ color: BROWN }}>Reply</button>
                    {comment.replies.length > 0 && (
                        <button onClick={() => setShowReplies(!showReplies)} className="text-[10px] font-semibold" style={{ color: '#888' }}>
                            {showReplies ? 'Hide' : `${comment.replies.length} repl${comment.replies.length > 1 ? 'ies' : 'y'}`}
                        </button>
                    )}
                </div>
                {showReply && (
                    <div className="flex gap-2 mt-2">
                        <input value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}
                            className="input-field flex-1 text-xs py-2" placeholder={`Reply to ${comment.authorName}...`} autoFocus />
                        <button onClick={submit} disabled={!replyText.trim()} className="px-3 py-1 rounded-lg text-xs font-bold disabled:opacity-40" style={{ background: GOLD, color: CHARCOAL }}>Send</button>
                    </div>
                )}
                {showReplies && comment.replies.map(r => (
                    <CommentThread key={r.id} comment={r} depth={depth + 1} onReply={onReply} currentUserId={currentUserId} />
                ))}
            </div>
        </div>
    );
}

function PostCard({ post, lang }: { post: Post; lang: string }) {
    const { currentUser, likePost, addComment } = useHeritage();
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [showReactions, setShowReactions] = useState(false);
    const [myReaction, setMyReaction] = useState<string | null>(null);
    const [reactions, setReactions] = useState<Record<string, number>>({ '❤️': Math.floor(Math.random() * 8), '👏': Math.floor(Math.random() * 4), '🙏': Math.floor(Math.random() * 3) });
    const [reportOpen, setReportOpen] = useState(false);
    const [followedAuthor, setFollowedAuthor] = useState(false);
    const [threadedComments, setThreadedComments] = useState<ThreadedComment[]>(
        post.comments.map(c => ({ ...c, createdAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(), replies: [], likes: [] }))
    );

    const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;

    const handleReact = (emoji: string) => {
        setReactions(prev => {
            const updated = { ...prev };
            if (myReaction === emoji) { updated[emoji] = Math.max(0, (updated[emoji] || 1) - 1); setMyReaction(null); }
            else {
                if (myReaction) updated[myReaction] = Math.max(0, (updated[myReaction] || 1) - 1);
                updated[emoji] = (updated[emoji] || 0) + 1;
                setMyReaction(emoji);
            }
            return updated;
        });
        setShowReactions(false);
    };

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !currentUser) return;
        const newC: ThreadedComment = { id: `c-${Date.now()}`, authorId: currentUser.id, authorName: currentUser.fullName, authorAvatar: currentUser.avatarUrl, content: commentText.trim(), createdAt: new Date().toISOString(), replies: [], likes: [] };
        setThreadedComments(prev => [newC, ...prev]);
        addComment(post.id, {
            authorId: currentUser.id,
            authorName: currentUser.fullName,
            authorAvatar: currentUser.avatarUrl,
            content: commentText.trim(),
            replies: [],
            likes: []
        } as any);
        setCommentText('');
    };

    const handleReply = (parentId: string, text: string) => {
        if (!currentUser) return;
        const reply: ThreadedComment = { id: `r-${Date.now()}`, authorId: currentUser.id, authorName: currentUser.fullName, authorAvatar: currentUser.avatarUrl, content: text, createdAt: new Date().toISOString(), replies: [], likes: [] };
        setThreadedComments(prev => prev.map(c => c.id === parentId ? { ...c, replies: [...c.replies, reply] } : c));
    };

    const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
    const topReactions = Object.entries(reactions).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 3);

    const T = {
        like: lang === 'fr' ? 'Aimer' : 'Like', comment: lang === 'fr' ? 'Commenter' : 'Comment',
        react: lang === 'fr' ? 'Réagir' : 'React', share: lang === 'fr' ? 'Partager' : 'Share',
        report: lang === 'fr' ? 'Signaler' : 'Report', follow: lang === 'fr' ? 'Suivre' : 'Follow',
        following: lang === 'fr' ? 'Abonné' : 'Following', writeComment: lang === 'fr' ? 'Écrire un commentaire...' : 'Write a comment...',
    };

    return (
        <div className="rounded-2xl overflow-hidden animate-fade-in-up" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            {post.type === 'tribute' && (
                <div className="px-5 py-2.5 flex items-center gap-2" style={{ background: `${GOLD}12`, borderBottom: `1px solid ${GOLD}25` }}>
                    <Icons.Candle /><span className="text-xs font-bold uppercase tracking-wide" style={{ color: GOLD }}>Tribute Post</span>
                    {post.tributeStatus && <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${post.tributeStatus === 'approved' ? 'badge-approved' : post.tributeStatus === 'pending' ? 'badge-pending' : 'badge-rejected'}`}>{post.tributeStatus}</span>}
                </div>
            )}
            <div className="p-5 pb-3">
                <div className="flex items-start gap-3">
                    <Link href={`/profile/${post.authorId}`}><Avatar name={post.authorName} url={post.authorAvatar} size="md" /></Link>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <Link href={`/profile/${post.authorId}`} className="font-bold text-sm hover:underline" style={{ color: CHARCOAL }}>{post.authorName}</Link>
                                <p className="text-xs mt-0.5" style={{ color: '#aaa' }}>{timeAgo(post.createdAt)}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button onClick={() => setFollowedAuthor(!followedAuthor)}
                                    className="text-xs px-2.5 py-1 rounded-full border font-semibold transition-all"
                                    style={followedAuthor ? { background: `${BROWN}10`, borderColor: BROWN, color: BROWN } : { borderColor: 'rgba(92,58,33,0.2)', color: '#888', background: 'transparent' }}>
                                    {followedAuthor ? `✓ ${T.following}` : `+ ${T.follow}`}
                                </button>
                                <button onClick={() => setReportOpen(true)} className="text-xs px-2 py-1 rounded-full border transition-all" style={{ borderColor: 'rgba(92,58,33,0.12)', color: '#ccc' }}>⋯</button>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#333' }}>{post.content}</p>
            </div>

            {post.images.length > 0 && (
                <div className="px-5 pb-3"><div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">{post.images.map((img, i) => <img key={i} src={img} alt="" className="w-full h-48 object-cover" />)}</div></div>
            )}

            {/* Reaction & stats bar */}
            <div className="px-5 py-2 flex items-center justify-between text-xs" style={{ borderTop: '1px solid rgba(92,58,33,0.06)', borderBottom: '1px solid rgba(92,58,33,0.06)', color: '#aaa' }}>
                <div className="flex items-center gap-1">
                    {topReactions.map(([emoji]) => <span key={emoji} className="text-sm">{emoji}</span>)}
                    {totalReactions > 0 && <span className="ml-1">{totalReactions}</span>}
                </div>
                <button onClick={() => setShowComments(!showComments)} style={{ color: '#aaa' }}>
                    {threadedComments.length} {lang === 'fr' ? 'commentaire' : 'comment'}{threadedComments.length !== 1 ? 's' : ''}
                </button>
            </div>

            {/* Action Bar */}
            <div className="px-3 py-1.5 flex items-center gap-1 relative">
                {/* Like */}
                <button onClick={() => currentUser && likePost(post.id, currentUser.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold flex-1 justify-center transition-all"
                    style={isLiked ? { color: '#C62828', background: 'rgba(198,40,40,0.07)' } : { color: '#888', background: 'transparent' }}>
                    {isLiked ? <Icons.HeartFilled /> : <Icons.Heart />}{T.like}
                </button>

                {/* Comment */}
                <button onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold flex-1 justify-center transition-all"
                    style={{ color: showComments ? BROWN : '#888', background: showComments ? `${BROWN}08` : 'transparent' }}>
                    <Icons.Comment />{T.comment}
                </button>

                {/* React */}
                <div className="flex-1 relative">
                    <button onClick={() => setShowReactions(!showReactions)}
                        className="w-full flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold justify-center transition-all"
                        style={{ color: myReaction ? BROWN : '#888', background: myReaction ? `${BROWN}08` : 'transparent' }}>
                        <span>{myReaction || '☺'}</span>{T.react}
                    </button>
                    {showReactions && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-2xl shadow-xl flex gap-2 z-20 animate-fade-in"
                            style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.15)' }}>
                            {REACTIONS.map(e => (
                                <button key={e} onClick={() => handleReact(e)}
                                    className="text-xl hover:scale-125 transition-transform p-1 rounded-full"
                                    style={myReaction === e ? { background: `${GOLD}20` } : {}}>
                                    {e}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="px-5 pb-4" style={{ borderTop: '1px solid rgba(92,58,33,0.06)' }}>
                    <form onSubmit={handleComment} className="flex gap-2 mt-3 mb-2">
                        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: GOLD, color: CHARCOAL }}>{currentUser?.fullName[0]}</div>
                        <input value={commentText} onChange={e => setCommentText(e.target.value)} className="input-field flex-1 py-2 text-sm" placeholder={T.writeComment} />
                        <button type="submit" disabled={!commentText.trim()} className="btn-icon disabled:opacity-40"><Icons.Send /></button>
                    </form>
                    {threadedComments.length === 0 && <p className="text-xs text-center py-3" style={{ color: '#ccc' }}>No comments yet. Be the first!</p>}
                    {threadedComments.map(c => (
                        <CommentThread key={c.id} comment={c} onReply={handleReply} currentUserId={currentUser?.id || ''} />
                    ))}
                </div>
            )}

            <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} contentType="post" contentId={post.id} contentLabel={`Post by ${post.authorName}`} />
        </div>
    );
}

function FamilyDiscussionThread({ lang }: { lang: string }) {
    const { currentUser, getUserFamilies } = useHeritage();
    const families = currentUser ? getUserFamilies(currentUser.id) : [];
    const [selectedFam, setSelectedFam] = useState<string | null>(families[0]?.id || null);
    const [threads, setThreads] = useState([
        { id: 't1', title: 'Planning the 2026 Reunion', author: 'Ambe Nkeng', replies: 7, lastReply: '2h ago', pinned: true },
        { id: 't2', title: 'Family history research — Pa Nkeng documents found', author: 'Ngono Meka', replies: 3, lastReply: '1d ago', pinned: false },
        { id: 't3', title: 'Governance vote reminder — closes Friday', author: 'System', replies: 0, lastReply: 'just now', pinned: true },
    ]);
    const [newThread, setNewThread] = useState('');
    const title = lang === 'fr' ? 'Discussions Familiales' : 'Family Discussions';

    const post = () => {
        if (!newThread.trim() || !currentUser) return;
        setThreads(prev => [{ id: `t-${Date.now()}`, title: newThread.trim(), author: currentUser.fullName, replies: 0, lastReply: 'just now', pinned: false }, ...prev]);
        setNewThread('');
    };

    if (families.length === 0) return null;

    return (
        <div className="rounded-2xl p-5" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm" style={{ color: CHARCOAL }}>💬 {title}</h3>
                {families.length > 1 && (
                    <select value={selectedFam || ''} onChange={e => setSelectedFam(e.target.value)} className="text-xs border rounded-lg px-2 py-1" style={{ borderColor: 'rgba(92,58,33,0.15)', color: BROWN }}>
                        {families.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                )}
            </div>
            <div className="space-y-2 mb-3">
                {threads.map(t => (
                    <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
                        style={{ background: CREAM }}
                        onMouseEnter={e => (e.currentTarget as any).style.background = '#ede7da'}
                        onMouseLeave={e => (e.currentTarget as any).style.background = CREAM}>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                {t.pinned && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${GOLD}20`, color: GOLD }}>📌</span>}
                                <p className="text-xs font-semibold truncate" style={{ color: CHARCOAL }}>{t.title}</p>
                            </div>
                            <p className="text-[10px] mt-0.5" style={{ color: '#aaa' }}>by {t.author} · {t.replies} replies · {t.lastReply}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input value={newThread} onChange={e => setNewThread(e.target.value)} onKeyDown={e => e.key === 'Enter' && post()}
                    className="input-field flex-1 text-xs py-2" placeholder={lang === 'fr' ? 'Nouveau sujet...' : 'Start a new thread...'} />
                <button onClick={post} disabled={!newThread.trim()} className="px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-40" style={{ background: GOLD, color: CHARCOAL }}>+</button>
            </div>
        </div>
    );
}

function SidebarFamilies({ lang }: { lang: string }) {
    const { currentUser, getUserFamilies } = useHeritage();
    const myFamilies = currentUser ? getUserFamilies(currentUser.id) : [];
    const [followed, setFollowed] = useState<Set<string>>(new Set());
    const toggle = (id: string) => setFollowed(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

    return (
        <div className="rounded-2xl p-5" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm" style={{ color: CHARCOAL }}>{lang === 'fr' ? 'Mes Familles' : 'My Families'}</h3>
                <Link href="/families" className="text-xs font-semibold" style={{ color: GOLD }}>{lang === 'fr' ? 'Voir Tout' : 'View All'}</Link>
            </div>
            <div className="space-y-2">
                {myFamilies.map(f => (
                    <div key={f.id} className="flex items-center gap-3">
                        <Link href={`/families/${f.id}`} className="flex items-center gap-3 flex-1 p-2 rounded-xl transition-all group" onMouseEnter={e => (e.currentTarget as any).style.background = CREAM} onMouseLeave={e => (e.currentTarget as any).style.background = ''}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: BROWN }}>{f.name[0]}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate" style={{ color: CHARCOAL }}>{f.name}</p>
                                <p className="text-xs" style={{ color: '#aaa' }}>{f.memberCount} members</p>
                            </div>
                        </Link>
                        <button onClick={() => toggle(f.id)} className="text-xs px-2 py-1 rounded-lg border font-semibold flex-shrink-0 transition-all"
                            style={followed.has(f.id) ? { borderColor: BROWN, color: BROWN, background: `${BROWN}08` } : { borderColor: 'rgba(92,58,33,0.2)', color: '#aaa', background: 'transparent' }}>
                            {followed.has(f.id) ? '✓' : '+'}
                        </button>
                    </div>
                ))}
                {myFamilies.length === 0 && <p className="text-xs text-center py-4" style={{ color: '#aaa' }}>No families yet</p>}
                <Link href="/families/create" className="flex items-center gap-2 p-2 rounded-xl text-sm font-semibold transition-all" style={{ color: GOLD }}
                    onMouseEnter={e => (e.currentTarget as any).style.background = `${GOLD}08`} onMouseLeave={e => (e.currentTarget as any).style.background = ''}>
                    <Icons.Plus /> {lang === 'fr' ? 'Créer une Famille' : 'Create a Family'}
                </Link>
            </div>
        </div>
    );
}

function FriendRecommendations({ lang }: { lang: string }) {
    const { currentUser, users, isFriend, sendFriendRequest, getUserFamilies } = useHeritage();
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());
    const [requested, setRequested] = useState<Set<string>>(new Set());

    const suggestions = users.filter(u =>
        u.id !== currentUser?.id && !u.isDeceased && !isFriend(u.id) && !dismissed.has(u.id)
    ).slice(0, 5).map(u => {
        const reasons = [];
        if (u.tribe && u.tribe === currentUser?.tribe) reasons.push(`Same tribe · ${u.tribe}`);
        else if (u.village && u.village === currentUser?.village) reasons.push(`Same village · ${u.village}`);
        else if (u.region && u.region === currentUser?.region) reasons.push(`Same region · ${u.region}`);
        else reasons.push('May be a relative');
        return { ...u, reason: reasons[0] };
    });

    const handleRequest = (id: string) => { sendFriendRequest(id); setRequested(prev => new Set(prev).add(id)); };

    return (
        <div className="rounded-2xl p-5" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
            <h3 className="font-bold text-sm mb-4" style={{ color: CHARCOAL }}>{lang === 'fr' ? 'Personnes que vous connaissez peut-être' : 'People You May Know'}</h3>
            <div className="space-y-3">
                {suggestions.map(u => (
                    <div key={u.id} className="flex items-center gap-3">
                        <Link href={`/profile/${u.id}`}><Avatar name={u.fullName} url={u.avatarUrl} size="sm" /></Link>
                        <div className="flex-1 min-w-0">
                            <Link href={`/profile/${u.id}`} className="text-sm font-semibold truncate block hover:underline" style={{ color: CHARCOAL }}>{u.fullName}</Link>
                            <p className="text-xs truncate" style={{ color: '#aaa' }}>{u.reason}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                            {requested.has(u.id) ? (
                                <span className="text-xs px-2 py-1 rounded-lg font-semibold" style={{ color: GREEN, background: `${GREEN}10` }}>✓ Sent</span>
                            ) : (
                                <button onClick={() => handleRequest(u.id)} className="text-xs px-2 py-1 rounded-lg font-bold" style={{ background: BROWN, color: CREAM }}>
                                    {lang === 'fr' ? 'Ajouter' : 'Add'}
                                </button>
                            )}
                            <button onClick={() => setDismissed(prev => new Set(prev).add(u.id))} className="text-xs px-1.5 py-1 rounded-lg" style={{ color: '#ccc' }}>✕</button>
                        </div>
                    </div>
                ))}
                {suggestions.length === 0 && <p className="text-xs text-center py-2" style={{ color: '#aaa' }}>No suggestions right now</p>}
            </div>
            <Link href="/discover" className="text-xs font-semibold mt-3 block text-center" style={{ color: GOLD }}>
                {lang === 'fr' ? 'Voir plus de suggestions →' : 'See more suggestions →'}
            </Link>
        </div>
    );
}

function CreatePostBox({ lang }: { lang: string }) {
    const { currentUser, createPost } = useHeritage();
    const [content, setContent] = useState('');
    const [isTribute, setIsTribute] = useState(false);
    const [visibility, setVisibility] = useState<'public' | 'family' | 'friends'>('public');
    const [language, setLanguage] = useState('en');

    const handlePost = () => {
        if (!content.trim() || !currentUser) return;
        createPost({
            authorId: currentUser.id,
            authorName: currentUser.fullName,
            authorAvatar: currentUser.avatarUrl,
            content: content.trim(),
            images: [],
            type: isTribute ? 'tribute' : 'regular',
            tributeStatus: isTribute ? 'pending' : undefined,
            reactions: [],
            visibility: visibility as any,
        });
        setContent(''); setIsTribute(false);
    };

    if (!currentUser) return null;
    const T = { placeholder: lang === 'fr' ? isTribute ? 'Écrivez un hommage...' : 'Partagez votre histoire...' : isTribute ? 'Write a tribute for a loved one...' : 'Share your heritage story...', post: lang === 'fr' ? 'Publier' : 'Post', tribute: lang === 'fr' ? 'Hommage' : 'Tribute' };

    return (
        <div className="rounded-2xl p-5" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
            <div className="flex gap-3">
                <Avatar name={currentUser.fullName} url={currentUser.avatarUrl} size="md" />
                <div className="flex-1">
                    <textarea value={content} onChange={e => setContent(e.target.value)} className="input-field min-h-[80px] resize-none" placeholder={T.placeholder} />
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                                <input type="checkbox" checked={isTribute} onChange={e => setIsTribute(e.target.checked)} className="w-4 h-4" />
                                <span className="font-semibold text-xs" style={{ color: GOLD }}>🕯️ {T.tribute}</span>
                            </label>
                            <select value={visibility} onChange={e => setVisibility(e.target.value as any)} className="text-xs border rounded-lg px-2 py-1" style={{ borderColor: 'rgba(92,58,33,0.2)', color: '#888' }}>
                                <option value="public">🌍 Public</option>
                                <option value="family">👨‍👩‍👧 Family</option>
                                <option value="friends">👥 Friends</option>
                            </select>
                            <select value={language} onChange={e => setLanguage(e.target.value)} className="text-xs border rounded-lg px-2 py-1" style={{ borderColor: 'rgba(92,58,33,0.2)', color: '#888' }}>
                                <option value="en">🇬🇧 EN</option>
                                <option value="fr">🇫🇷 FR</option>
                                <option value="ghomala">Ghomálá'</option>
                                <option value="ewondo">Ewondo</option>
                                <option value="fulfulde">Fulfulde</option>
                            </select>
                        </div>
                        <button onClick={handlePost} disabled={!content.trim()} className="btn-primary btn-sm disabled:opacity-40" style={{ background: GOLD, color: CHARCOAL }}>{T.post}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FeedPage() {
    const { posts } = useHeritage();
    const [lang, setLang] = useState(() => typeof window !== 'undefined' ? (localStorage.getItem('heritage_lang') || 'en') : 'en');
    const [feedFilter, setFeedFilter] = useState<'all' | 'family' | 'tributes'>('all');

    const visiblePosts = posts.filter(p => {
        if (feedFilter === 'tributes') return p.type === 'tribute' && p.tributeStatus === 'approved';
        if (feedFilter === 'family') return p.type === 'regular';
        return p.type === 'regular' || p.tributeStatus === 'approved';
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left sidebar */}
                <aside className="hidden lg:block lg:col-span-3 space-y-4">
                    <SidebarFamilies lang={lang} />
                    <FamilyDiscussionThread lang={lang} />
                </aside>

                {/* Main Feed */}
                <main className="lg:col-span-6 space-y-4">
                    {/* Feed Filter */}
                    <div className="flex gap-1 p-1 rounded-2xl" style={{ background: '#fcfbfa', border: '1px solid rgba(92,58,33,0.1)' }}>
                        {[{ v: 'all', label: lang === 'fr' ? 'Tout' : 'All' }, { v: 'family', label: lang === 'fr' ? 'Famille' : 'Family' }, { v: 'tributes', label: lang === 'fr' ? 'Hommages' : 'Tributes' }].map(f => (
                            <button key={f.v} onClick={() => setFeedFilter(f.v as any)}
                                className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                                style={feedFilter === f.v ? { background: BROWN, color: CREAM } : { color: '#888', background: 'transparent' }}>
                                {f.label}
                            </button>
                        ))}
                    </div>

                    <CreatePostBox lang={lang} />

                    {visiblePosts.length > 0 ? visiblePosts.map(post => <PostCard key={post.id} post={post} lang={lang} />) : (
                        <EmptyState icon={<Icons.Home />} title={lang === 'fr' ? 'Aucune publication' : 'No posts yet'} description={lang === 'fr' ? 'Soyez le premier à partager!' : 'Be the first to share a heritage story!'} />
                    )}
                </main>

                {/* Right sidebar */}
                <aside className="hidden lg:block lg:col-span-3 space-y-4">
                    <FriendRecommendations lang={lang} />
                </aside>
            </div>
        </div>
    );
}
