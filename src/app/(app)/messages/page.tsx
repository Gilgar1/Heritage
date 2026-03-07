'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { Avatar, Icons, EmptyState, Modal } from '@/components/shared';

const BROWN = '#5C3A21'; const GOLD = '#C6A75E'; const CREAM = '#F4EFE6'; const CHARCOAL = '#1F1F1F'; const GREEN = '#2F5D50';

const MEDIA_EMOJIS = ['📸', '🎬', '🎙️', '📄', '📎', '🗺️', '🌿'];
const VOICE_DURATIONS = ['0:08', '0:15', '0:23', '0:41', '1:02'];

interface MsgRequest { id: string; from: string; preview: string; timestamp: string; }

function timeAgo(d: string) {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return 'just now'; if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`; return new Date(d).toLocaleDateString('en-GB');
}

export default function MessagesPage() {
    const { currentUser, conversations, messages, sendMessage, users, families, getUserFamilies } = useHeritage();
    const [selectedConv, setSelectedConv] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [tab, setTab] = useState<'direct' | 'groups' | 'requests'>('direct');
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordSeconds, setRecordSeconds] = useState(0);
    const [voiceNotes, setVoiceNotes] = useState<{ id: string; duration: string; convId: string }[]>([]);
    const [replyingTo, setReplyingTo] = useState<{ id: string; text: string } | null>(null);
    const [newGroupModal, setNewGroupModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);
    const [requests] = useState<MsgRequest[]>([
        { id: 'req1', from: 'Tabi Eyong', preview: 'Hello, I think we are related through the Eyong lineage...', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 'req2', from: 'Fien Njoya', preview: 'I found your family on Heritage, our grandparents were siblings!', timestamp: new Date(Date.now() - 86400000).toISOString() },
    ]);
    const [acceptedRequests, setAcceptedRequests] = useState<Set<string>>(new Set());
    const [rejectedRequests, setRejectedRequests] = useState<Set<string>>(new Set());
    const [groupChannels, setGroupChannels] = useState([
        { id: 'group-1', name: 'Nkeng Family Council', members: 12, lastMsg: 'Vote reminder: closes Friday', unread: 3, familyId: 'family-1' },
        { id: 'group-2', name: 'Reunion Planning 2026', members: 5, lastMsg: 'Venue confirmed: Bandjoun Town Hall', unread: 0, familyId: 'family-1' },
    ]);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const msgEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, selectedConv]);

    const currentConv = conversations.find(c => c.id === selectedConv);
    const currentMessages = selectedConv ? (messages[selectedConv] || []) : [];

    const directConvs = conversations.filter(c => !c.isFamilyThread);
    const groupConvs = conversations.filter(c => c.isFamilyThread);

    const getOtherName = (conv: typeof conversations[0]) => {
        if (conv.isFamilyThread) return conv.familyName || 'Family Thread';
        const idx = conv.participantIds.findIndex(id => id !== currentUser?.id);
        return conv.participantNames[idx] || 'Unknown';
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        const text = selectedEmoji ? `${selectedEmoji} ${newMessage}` : newMessage;
        if (!text.trim() || !selectedConv) return;
        sendMessage(selectedConv, text.trim());
        setNewMessage(''); setSelectedEmoji(''); setReplyingTo(null); setMediaPickerOpen(false);
    };

    const startRecording = () => {
        setIsRecording(true); setRecordSeconds(0);
        timerRef.current = setInterval(() => setRecordSeconds(s => s + 1), 1000);
    };

    const stopRecording = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRecording(false);
        if (!selectedConv) return;
        const duration = `${Math.floor(recordSeconds / 60)}:${String(recordSeconds % 60).padStart(2, '0')}`;
        setVoiceNotes(prev => [...prev, { id: `vn-${Date.now()}`, duration, convId: selectedConv }]);
        sendMessage(selectedConv, `🎙️ Voice note (${duration})`);
        setRecordSeconds(0);
    };

    const handleCreateGroup = () => {
        if (!groupName.trim()) return;
        setGroupChannels(prev => [...prev, { id: `group-${Date.now()}`, name: groupName, members: selectedGroupMembers.length + 1, lastMsg: 'Group created', unread: 0, familyId: '' }]);
        setGroupName(''); setSelectedGroupMembers([]); setNewGroupModal(false);
    };

    const pendingRequests = requests.filter(r => !acceptedRequests.has(r.id) && !rejectedRequests.has(r.id));

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold" style={{ color: CHARCOAL }}>Messages</h1>
                <button onClick={() => setNewGroupModal(true)} className="btn-primary btn-sm" style={{ background: GOLD, color: CHARCOAL }}>+ Group Channel</button>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ minHeight: 560, border: '1px solid rgba(92,58,33,0.12)', background: '#fcfbfa' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 h-full" style={{ minHeight: 560 }}>

                    {/* Left: Conversation list */}
                    <div style={{ borderRight: '1px solid rgba(92,58,33,0.08)' }}>
                        {/* Tabs */}
                        <div className="flex border-b" style={{ borderColor: 'rgba(92,58,33,0.08)' }}>
                            {[{ v: 'direct', l: '💬 Direct' }, { v: 'groups', l: '👥 Groups' }, { v: 'requests', l: `📥 Requests${pendingRequests.length > 0 ? ` (${pendingRequests.length})` : ''}` }].map(t => (
                                <button key={t.v} onClick={() => setTab(t.v as any)}
                                    className="flex-1 py-3 text-xs font-bold transition-all"
                                    style={tab === t.v ? { color: BROWN, borderBottom: `2px solid ${BROWN}` } : { color: '#aaa', borderBottom: '2px solid transparent' }}>
                                    {t.l}
                                </button>
                            ))}
                        </div>

                        {/* Direct conversations */}
                        {tab === 'direct' && (
                            <div className="overflow-y-auto" style={{ maxHeight: 490 }}>
                                {directConvs.length === 0 && <div className="p-6 text-center text-sm" style={{ color: '#aaa' }}>No direct messages yet</div>}
                                {directConvs.map(conv => (
                                    <button key={conv.id} onClick={() => setSelectedConv(conv.id)}
                                        className="w-full p-4 flex items-center gap-3 text-left transition-all border-b"
                                        style={{ borderColor: 'rgba(92,58,33,0.06)', background: selectedConv === conv.id ? `${BROWN}08` : 'transparent' }}>
                                        <Avatar name={getOtherName(conv)} size="sm" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-sm truncate" style={{ color: CHARCOAL }}>{getOtherName(conv)}</p>
                                                {conv.unreadCount > 0 && <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold flex-shrink-0" style={{ background: BROWN }}>{conv.unreadCount}</span>}
                                            </div>
                                            {conv.lastMessage && <p className="text-xs truncate mt-0.5" style={{ color: '#aaa' }}>{conv.lastMessage.content}</p>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Group channels */}
                        {tab === 'groups' && (
                            <div className="overflow-y-auto" style={{ maxHeight: 490 }}>
                                {groupChannels.map(g => (
                                    <button key={g.id} onClick={() => setSelectedConv(g.id)}
                                        className="w-full p-4 flex items-center gap-3 text-left transition-all border-b"
                                        style={{ borderColor: 'rgba(92,58,33,0.06)', background: selectedConv === g.id ? `${BROWN}08` : 'transparent' }}>
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: BROWN, color: CREAM }}>{g.name[0]}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-sm truncate" style={{ color: CHARCOAL }}>{g.name}</p>
                                                {g.unread > 0 && <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold flex-shrink-0" style={{ background: BROWN }}>{g.unread}</span>}
                                            </div>
                                            <p className="text-xs truncate mt-0.5" style={{ color: '#aaa' }}>{g.members} members · {g.lastMsg}</p>
                                        </div>
                                    </button>
                                ))}
                                {groupConvs.map(conv => (
                                    <button key={conv.id} onClick={() => setSelectedConv(conv.id)}
                                        className="w-full p-4 flex items-center gap-3 text-left transition-all border-b"
                                        style={{ borderColor: 'rgba(92,58,33,0.06)', background: selectedConv === conv.id ? `${BROWN}08` : 'transparent' }}>
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: GREEN, color: CREAM }}>{(conv.familyName || 'F')[0]}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate" style={{ color: CHARCOAL }}>{conv.familyName || 'Family Thread'}</p>
                                            {conv.lastMessage && <p className="text-xs truncate mt-0.5" style={{ color: '#aaa' }}>{conv.lastMessage.content}</p>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Message requests */}
                        {tab === 'requests' && (
                            <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: 490 }}>
                                {pendingRequests.length === 0 && <div className="text-center py-8"><p className="text-sm" style={{ color: '#aaa' }}>No pending requests</p></div>}
                                {pendingRequests.map(req => (
                                    <div key={req.id} className="p-4 rounded-xl" style={{ background: CREAM, border: '1px solid rgba(92,58,33,0.1)' }}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: BROWN, color: CREAM }}>{req.from[0]}</div>
                                            <div className="flex-1">
                                                <p className="font-bold text-sm" style={{ color: CHARCOAL }}>{req.from}</p>
                                                <p className="text-[10px]" style={{ color: '#aaa' }}>{timeAgo(req.timestamp)}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs mb-3 line-clamp-2" style={{ color: '#555' }}>{req.preview}</p>
                                        <div className="flex gap-2">
                                            <button onClick={() => setAcceptedRequests(prev => new Set(prev).add(req.id))} className="flex-1 py-2 rounded-xl text-xs font-bold" style={{ background: BROWN, color: CREAM }}>✓ Accept</button>
                                            <button onClick={() => setRejectedRequests(prev => new Set(prev).add(req.id))} className="flex-1 py-2 rounded-xl text-xs font-bold border" style={{ borderColor: 'rgba(92,58,33,0.2)', color: '#888' }}>✕ Decline</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Chat area */}
                    <div className="md:col-span-2 flex flex-col" style={{ minHeight: 560 }}>
                        {selectedConv ? (
                            <>
                                {/* Chat header */}
                                <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(92,58,33,0.08)' }}>
                                    {currentConv?.isFamilyThread || groupChannels.find(g => g.id === selectedConv)
                                        ? <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm" style={{ background: BROWN, color: CREAM }}>
                                            {(currentConv?.familyName || groupChannels.find(g => g.id === selectedConv)?.name || 'G')[0]}
                                        </div>
                                        : <Avatar name={currentConv ? getOtherName(currentConv) : ''} size="sm" />
                                    }
                                    <div className="flex-1">
                                        <p className="font-bold text-sm" style={{ color: CHARCOAL }}>
                                            {currentConv ? getOtherName(currentConv) : groupChannels.find(g => g.id === selectedConv)?.name}
                                        </p>
                                        {(currentConv?.isFamilyThread || groupChannels.find(g => g.id === selectedConv)) &&
                                            <p className="text-xs" style={{ color: '#aaa' }}>Group channel · {groupChannels.find(g => g.id === selectedConv)?.members || currentConv?.participantIds.length} members</p>
                                        }
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 370 }}>
                                    {currentMessages.map((msg, i) => {
                                        const isMe = msg.senderId === currentUser?.id;
                                        const isVoice = msg.content.startsWith('🎙️');
                                        return (
                                            <div key={msg.id}>
                                                <div className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    {!isMe && <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: BROWN, color: CREAM }}>{msg.senderName[0]}</div>}
                                                    <div className="max-w-[70%] group relative">
                                                        {!isMe && currentConv?.isFamilyThread && <p className="text-xs font-bold mb-0.5" style={{ color: BROWN }}>{msg.senderName}</p>}
                                                        <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'rounded-br-md' : 'rounded-bl-md'}`}
                                                            style={isMe ? { background: BROWN, color: CREAM } : { background: CREAM, color: CHARCOAL }}>
                                                            {isVoice ? (
                                                                <div className="flex items-center gap-2">
                                                                    <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>▶</button>
                                                                    <div className="flex gap-0.5 items-center">
                                                                        {Array.from({ length: 20 }).map((_, j) => (
                                                                            <div key={j} className="w-0.5 rounded-full" style={{ height: `${8 + Math.random() * 16}px`, background: isMe ? 'rgba(244,239,230,0.6)' : 'rgba(92,58,33,0.4)' }} />
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-xs opacity-70">{msg.content.match(/\((.+)\)/)?.[1] || '0:10'}</span>
                                                                </div>
                                                            ) : <p>{msg.content}</p>}
                                                        </div>
                                                        <button onClick={() => setReplyingTo({ id: msg.id, text: msg.content.slice(0, 60) })}
                                                            className="hidden group-hover:block absolute -bottom-4 left-0 text-[10px] px-2 py-0.5 rounded-full"
                                                            style={{ background: CREAM, color: '#888', border: '1px solid rgba(92,58,33,0.1)' }}>
                                                            ↩ Reply
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {currentMessages.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-40">
                                            <p className="text-4xl mb-2">💬</p>
                                            <p className="text-sm" style={{ color: '#aaa' }}>Start the conversation</p>
                                        </div>
                                    )}
                                    <div ref={msgEndRef} />
                                </div>

                                {/* Reply indicator */}
                                {replyingTo && (
                                    <div className="px-4 py-2 flex items-center gap-3" style={{ background: `${BROWN}05`, borderTop: '1px solid rgba(92,58,33,0.06)' }}>
                                        <div className="flex-1 pl-2 border-l-2" style={{ borderColor: GOLD }}>
                                            <p className="text-[10px] font-bold" style={{ color: BROWN }}>Replying to</p>
                                            <p className="text-xs truncate" style={{ color: '#888' }}>{replyingTo.text}...</p>
                                        </div>
                                        <button onClick={() => setReplyingTo(null)} className="text-xs" style={{ color: '#aaa' }}>✕</button>
                                    </div>
                                )}

                                {/* Media picker */}
                                {mediaPickerOpen && (
                                    <div className="px-4 py-3 flex flex-wrap gap-2" style={{ borderTop: '1px solid rgba(92,58,33,0.06)' }}>
                                        {MEDIA_EMOJIS.map(e => (
                                            <button key={e} onClick={() => { setSelectedEmoji(e); setMediaPickerOpen(false); }}
                                                className="text-2xl p-2 rounded-xl transition-all hover:scale-110" style={{ background: CREAM }}>
                                                {e}
                                            </button>
                                        ))}
                                        <p className="w-full text-xs mt-1" style={{ color: '#aaa' }}>Select media type to attach (demo)</p>
                                    </div>
                                )}

                                {/* Input */}
                                <form onSubmit={handleSend} className="p-4 flex gap-2 items-end" style={{ borderTop: '1px solid rgba(92,58,33,0.08)' }}>
                                    <button type="button" onClick={() => setMediaPickerOpen(!mediaPickerOpen)} className="btn-icon flex-shrink-0" title="Attach media">📎</button>
                                    <div className="flex-1 relative">
                                        {selectedEmoji && (
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">{selectedEmoji}</span>
                                        )}
                                        <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                                            className="input-field w-full pr-3" style={selectedEmoji ? { paddingLeft: '2.5rem' } : {}}
                                            placeholder={isRecording ? `Recording... ${recordSeconds}s` : 'Type a message...'} disabled={isRecording} />
                                    </div>
                                    <button type="button"
                                        onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording}
                                        className="btn-icon flex-shrink-0 transition-all"
                                        style={isRecording ? { background: '#C62828', color: 'white' } : {}} title="Hold to record voice note">
                                        🎙️
                                    </button>
                                    <button type="submit" disabled={!newMessage.trim() && !selectedEmoji} className="btn-icon flex-shrink-0 disabled:opacity-40">
                                        <Icons.Send />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-5xl mb-3">💬</p>
                                    <p className="font-semibold" style={{ color: '#888' }}>Select a conversation</p>
                                    <p className="text-xs mt-1" style={{ color: '#ccc' }}>or start a group channel</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Group Modal */}
            <Modal isOpen={newGroupModal} onClose={() => setNewGroupModal(false)} title="Create Group Channel">
                <div className="space-y-4">
                    <div><label className="input-label">Channel Name *</label>
                        <input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} className="input-field" placeholder="e.g. Nkeng Family Council" /></div>
                    <div>
                        <label className="input-label">Add Members</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {users.filter(u => u.id !== currentUser?.id && !u.isDeceased).slice(0, 10).map(u => (
                                <button key={u.id} onClick={() => setSelectedGroupMembers(prev => prev.includes(u.id) ? prev.filter(x => x !== u.id) : [...prev, u.id])}
                                    className="text-xs px-3 py-1.5 rounded-full border font-semibold transition-all"
                                    style={selectedGroupMembers.includes(u.id) ? { background: BROWN, color: CREAM, borderColor: BROWN } : { borderColor: 'rgba(92,58,33,0.2)', color: '#888', background: 'transparent' }}>
                                    {u.fullName.split(' ')[0]}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleCreateGroup} disabled={!groupName.trim()} className="btn-primary w-full disabled:opacity-40" style={{ background: GOLD, color: CHARCOAL }}>
                        Create Channel ({selectedGroupMembers.length + 1} members)
                    </button>
                </div>
            </Modal>
        </div>
    );
}
