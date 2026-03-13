'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
    User, Family, Post, FriendRequest, Friendship, Conversation, Message,
    Notification, SearchResult, FamilyTreeNode, Comment, ProfileClaim,
    DeletionRequest, FamilyRole, FamilyMembership
} from '@/types';
import {
    mockUsers, mockFamilies, mockPosts, mockFriendRequests, mockFriendships,
    mockConversations, mockMessages, mockNotifications, mockSearchResults,
    mockFamilyTreeNodes, mockProfileClaims, mockDeletionRequests
} from '@/data/mockData';

interface HeritageContextType {
    // Auth
    currentUser: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    register: (data: Partial<User> & { password: string }) => boolean;

    // Users
    users: User[];
    getUserById: (id: string) => User | undefined;
    updateUserProfile: (id: string, data: Partial<User>) => void;

    // Families
    families: Family[];
    getFamilyById: (id: string) => Family | undefined;
    getUserFamilies: (userId: string) => Family[];
    getUserRoleInFamily: (userId: string, familyId: string) => FamilyRole | null;
    createFamily: (data: Partial<Family>) => Family;
    updateFamily: (id: string, data: Partial<Family>) => void;
    joinFamily: (familyId: string, userId: string) => void;
    leaveFamily: (familyId: string, userId: string) => void;
    assignEditor: (familyId: string, userId: string) => void;
    removeEditor: (familyId: string, userId: string) => void;

    // Family Tree
    familyTreeNodes: Record<string, FamilyTreeNode[]>;
    getFamilyTreeNodes: (familyId: string) => FamilyTreeNode[];
    addFamilyTreeNode: (familyId: string, node: FamilyTreeNode) => void;

    // Posts
    posts: Post[];
    createPost: (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>) => void;
    likePost: (postId: string, userId: string) => void;
    addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
    approveTribute: (postId: string) => void;
    rejectTribute: (postId: string) => void;

    // Friends
    friendRequests: FriendRequest[];
    friendships: Friendship[];
    sendFriendRequest: (toUserId: string) => void;
    acceptFriendRequest: (requestId: string) => void;
    rejectFriendRequest: (requestId: string) => void;
    unfriend: (friendId: string) => void;
    isFriend: (userId: string) => boolean;

    // Messages
    conversations: Conversation[];
    messages: Record<string, Message[]>;
    sendMessage: (conversationId: string, content: string) => void;
    getOrCreateConversation: (otherUserId: string) => string;

    // Notifications
    notifications: Notification[];
    markNotificationRead: (id: string) => void;
    markAllNotificationsRead: () => void;
    unreadNotificationCount: number;

    // Search
    search: (query: string, type?: string) => SearchResult[];

    // Admin
    profileClaims: ProfileClaim[];
    deletionRequests: DeletionRequest[];
    freezeFamily: (familyId: string) => void;
    suspendUser: (userId: string) => void;
    approveProfileClaim: (claimId: string) => void;
    rejectProfileClaim: (claimId: string) => void;
    requestFamilyDeletion: (familyId: string) => void;
    approveFamilyDeletion: (requestId: string) => void;
}

const HeritageContext = createContext<HeritageContextType | undefined>(undefined);

export function HeritageProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [families, setFamilies] = useState<Family[]>(mockFamilies);
    const [familyTreeNodes, setFamilyTreeNodes] = useState<Record<string, FamilyTreeNode[]>>(mockFamilyTreeNodes);
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(mockFriendRequests);
    const [friendships, setFriendships] = useState<Friendship[]>(mockFriendships);
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
    const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [profileClaims, setProfileClaims] = useState<ProfileClaim[]>(mockProfileClaims);
    const [deletionRequests, setDeletionRequests] = useState<DeletionRequest[]>(mockDeletionRequests);

    // AUTH
    const login = useCallback((email: string, _password: string) => {
        if (email === 'admin@heritage.cm') {
            setCurrentUser(mockUsers[0]);
            setIsAdmin(true);
            return true;
        }
        const user = users.find(u => u.email === email);
        if (user) {
            setCurrentUser(user);
            setIsAdmin(false);
            return true;
        }
        return false;
    }, [users]);

    const logout = useCallback(() => {
        setCurrentUser(null);
        setIsAdmin(false);
    }, []);

    const register = useCallback((data: Partial<User> & { password: string }) => {
        const newUser: User = {
            id: `user-${Date.now()}`,
            email: data.email || '',
            fullName: data.fullName || '',
            username: data.username || '',
            avatarUrl: '',
            bio: data.bio || '',
            birthDate: data.birthDate,
            birthDateVisible: true,
            nativeLanguage: data.nativeLanguage,
            village: data.village,
            region: data.region,
            tribe: data.tribe,
            photos: [],
            videos: [],
            audioClips: [],
            isDeceased: false,
            createdAt: new Date().toISOString(),
            friendListVisible: true,
            connectionsVisible: true,
            profileVisible: true,
            coverPhotoUrl: '',
            verificationStatus: 'unverified',
            profileVisibility: 'public',
            blockedUserIds: [],
            notifyFriendRequests: true,
            notifyTributes: true,
            notifyFamilyEvents: true,
            notifyTreeEdits: true,
            notifyMessages: true,
            notifyGovernance: true,
        };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        return true;
    }, []);

    // USERS
    const getUserById = useCallback((id: string) => users.find(u => u.id === id), [users]);

    const updateUserProfile = useCallback((id: string, data: Partial<User>) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
        if (currentUser?.id === id) {
            setCurrentUser(prev => prev ? { ...prev, ...data } : prev);
        }
    }, [currentUser]);

    // FAMILIES
    const getFamilyById = useCallback((id: string) => families.find(f => f.id === id), [families]);

    const getUserFamilies = useCallback((userId: string) => {
        return families.filter(f => f.members.some(m => m.userId === userId));
    }, [families]);

    const getUserRoleInFamily = useCallback((userId: string, familyId: string): FamilyRole | null => {
        const family = families.find(f => f.id === familyId);
        if (!family) return null;
        const membership = family.members.find(m => m.userId === userId);
        return membership?.role || null;
    }, [families]);

    const createFamily = useCallback((data: Partial<Family>): Family => {
        const newFamily: Family = {
            id: `family-${Date.now()}`,
            name: data.name || 'New Family',
            description: data.description || '',
            privacy: data.privacy || 'public',
            status: 'active',
            createdBy: currentUser?.id || '',
            createdAt: new Date().toISOString(),
            memberCount: 1,
            members: [{
                userId: currentUser?.id || '',
                familyId: `family-${Date.now()}`,
                role: 'creator',
                joinedAt: new Date().toISOString(),
                canApproveTributes: true,
            }],
            coverPhotoUrl: data.coverPhotoUrl || '',
            custodians: [currentUser?.id || ''],
            treeVisibility: 'public',
        };
        setFamilies(prev => [...prev, newFamily]);
        return newFamily;
    }, [currentUser]);

    const updateFamily = useCallback((id: string, data: Partial<Family>) => {
        setFamilies(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
    }, []);

    const joinFamily = useCallback((familyId: string, userId: string) => {
        setFamilies(prev => prev.map(f => {
            if (f.id !== familyId) return f;
            if (f.members.some(m => m.userId === userId)) return f;
            const newMember: FamilyMembership = {
                userId, familyId, role: 'member', joinedAt: new Date().toISOString(),
            };
            return { ...f, members: [...f.members, newMember], memberCount: f.memberCount + 1 };
        }));
    }, []);

    const leaveFamily = useCallback((familyId: string, userId: string) => {
        setFamilies(prev => prev.map(f => {
            if (f.id !== familyId) return f;
            return { ...f, members: f.members.filter(m => m.userId !== userId), memberCount: f.memberCount - 1 };
        }));
    }, []);

    const assignEditor = useCallback((familyId: string, userId: string) => {
        setFamilies(prev => prev.map(f => {
            if (f.id !== familyId) return f;
            return {
                ...f,
                members: f.members.map(m => m.userId === userId ? { ...m, role: 'editor' as FamilyRole } : m),
            };
        }));
    }, []);

    const removeEditor = useCallback((familyId: string, userId: string) => {
        setFamilies(prev => prev.map(f => {
            if (f.id !== familyId) return f;
            return {
                ...f,
                members: f.members.map(m => m.userId === userId ? { ...m, role: 'member' as FamilyRole } : m),
            };
        }));
    }, []);

    // FAMILY TREE
    const getFamilyTreeNodes = useCallback((familyId: string) => familyTreeNodes[familyId] || [], [familyTreeNodes]);

    const addFamilyTreeNode = useCallback((familyId: string, node: FamilyTreeNode) => {
        setFamilyTreeNodes(prev => ({
            ...prev,
            [familyId]: [...(prev[familyId] || []), node],
        }));
    }, []);

    // POSTS
    const createPost = useCallback((post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
        const newPost: Post = {
            ...post,
            id: `post-${Date.now()}`,
            likes: [],
            comments: [],
            createdAt: new Date().toISOString(),
        };
        setPosts(prev => [newPost, ...prev]);
    }, []);

    const likePost = useCallback((postId: string, userId: string) => {
        setPosts(prev => prev.map(p => {
            if (p.id !== postId) return p;
            const isLiked = p.likes.includes(userId);
            return { ...p, likes: isLiked ? p.likes.filter(id => id !== userId) : [...p.likes, userId] };
        }));
    }, []);

    const addComment = useCallback((postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
        const newComment: Comment = {
            ...comment,
            id: `comment-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
    }, []);

    const approveTribute = useCallback((postId: string) => {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, tributeStatus: 'approved' } : p));
    }, []);

    const rejectTribute = useCallback((postId: string) => {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, tributeStatus: 'rejected' } : p));
    }, []);

    // FRIENDS
    const sendFriendRequest = useCallback((toUserId: string) => {
        if (!currentUser) return;
        const newRequest: FriendRequest = {
            id: `fr-${Date.now()}`,
            fromUserId: currentUser.id,
            fromUserName: currentUser.fullName,
            fromUserAvatar: currentUser.avatarUrl,
            toUserId,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        setFriendRequests(prev => [...prev, newRequest]);
    }, [currentUser]);

    const acceptFriendRequest = useCallback((requestId: string) => {
        setFriendRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'accepted' } : r));
        const request = friendRequests.find(r => r.id === requestId);
        if (request) {
            const newFriendship: Friendship = {
                id: `fs-${Date.now()}`,
                userId: request.fromUserId,
                friendId: request.toUserId,
                createdAt: new Date().toISOString(),
            };
            setFriendships(prev => [...prev, newFriendship]);
        }
    }, [friendRequests]);

    const rejectFriendRequest = useCallback((requestId: string) => {
        setFriendRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
    }, []);

    const unfriend = useCallback((friendId: string) => {
        if (!currentUser) return;
        setFriendships(prev => prev.filter(f =>
            !((f.userId === currentUser.id && f.friendId === friendId) ||
                (f.userId === friendId && f.friendId === currentUser.id))
        ));
    }, [currentUser]);

    const isFriend = useCallback((userId: string) => {
        if (!currentUser) return false;
        return friendships.some(f =>
            (f.userId === currentUser.id && f.friendId === userId) ||
            (f.userId === userId && f.friendId === currentUser.id)
        );
    }, [currentUser, friendships]);

    // MESSAGES
    const sendMessage = useCallback((conversationId: string, content: string) => {
        if (!currentUser) return;
        const newMsg: Message = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.fullName,
            senderAvatar: currentUser.avatarUrl,
            content,
            messageType: 'text',
            read: false,
            createdAt: new Date().toISOString(),
        };
        setMessages(prev => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), newMsg],
        }));
        setConversations(prev => prev.map(c =>
            c.id === conversationId ? { ...c, lastMessage: newMsg } : c
        ));
    }, [currentUser]);

    const getOrCreateConversation = useCallback((otherUserId: string): string => {
        if (!currentUser) return '';
        const existing = conversations.find(c =>
            !c.isFamilyThread &&
            c.participantIds.includes(currentUser.id) &&
            c.participantIds.includes(otherUserId)
        );
        if (existing) return existing.id;
        const otherUser = users.find(u => u.id === otherUserId);
        const newConv: Conversation = {
            id: `conv-${Date.now()}`,
            participantIds: [currentUser.id, otherUserId],
            participantNames: [currentUser.fullName, otherUser?.fullName || ''],
            participantAvatars: [currentUser.avatarUrl || '', otherUser?.avatarUrl || ''],
            unreadCount: 0,
            isFamilyThread: false,
        };
        setConversations(prev => [...prev, newConv]);
        return newConv.id;
    }, [currentUser, conversations, users]);

    // NOTIFICATIONS
    const markNotificationRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const markAllNotificationsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const unreadNotificationCount = notifications.filter(n => !n.read && n.userId === currentUser?.id).length;

    // SEARCH
    const searchFn = useCallback((query: string, type?: string): SearchResult[] => {
        const q = query.toLowerCase();
        return mockSearchResults.filter(r => {
            if (type && type !== 'all' && r.type !== type.replace(/s$/, '')) return false;
            return (
                r.name.toLowerCase().includes(q) ||
                r.subtitle?.toLowerCase().includes(q) ||
                Object.values(r.metadata || {}).some(v => v.toLowerCase().includes(q))
            );
        });
    }, []);

    // ADMIN
    const freezeFamily = useCallback((familyId: string) => {
        setFamilies(prev => prev.map(f => f.id === familyId ? { ...f, status: 'frozen' } : f));
    }, []);

    const suspendUser = useCallback((_userId: string) => {
        // In real app, this would set user status to suspended
    }, []);

    const approveProfileClaim = useCallback((claimId: string) => {
        setProfileClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'approved' } : c));
    }, []);

    const rejectProfileClaim = useCallback((claimId: string) => {
        setProfileClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'rejected' } : c));
    }, []);

    const requestFamilyDeletion = useCallback((familyId: string) => {
        if (!currentUser) return;
        const family = families.find(f => f.id === familyId);
        if (!family) return;
        const newRequest: DeletionRequest = {
            id: `del-${Date.now()}`,
            familyId,
            familyName: family.name,
            requestedBy: currentUser.id,
            requestedByName: currentUser.fullName,
            status: 'pending',
            freezeExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString(),
        };
        setDeletionRequests(prev => [...prev, newRequest]);
        freezeFamily(familyId);
    }, [currentUser, families, freezeFamily]);

    const approveFamilyDeletion = useCallback((requestId: string) => {
        setDeletionRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
        const request = deletionRequests.find(r => r.id === requestId);
        if (request) {
            setFamilies(prev => prev.filter(f => f.id !== request.familyId));
        }
    }, [deletionRequests]);

    const value: HeritageContextType = {
        currentUser, isAuthenticated: !!currentUser, isAdmin,
        login, logout, register,
        users, getUserById, updateUserProfile,
        families, getFamilyById, getUserFamilies, getUserRoleInFamily,
        createFamily, updateFamily, joinFamily, leaveFamily, assignEditor, removeEditor,
        familyTreeNodes, getFamilyTreeNodes, addFamilyTreeNode,
        posts, createPost, likePost, addComment, approveTribute, rejectTribute,
        friendRequests, friendships, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, unfriend, isFriend,
        conversations, messages, sendMessage, getOrCreateConversation,
        notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationCount,
        search: searchFn,
        profileClaims, deletionRequests, freezeFamily, suspendUser,
        approveProfileClaim, rejectProfileClaim, requestFamilyDeletion, approveFamilyDeletion,
    };

    return <HeritageContext.Provider value={value}>{children}</HeritageContext.Provider>;
}

export function useHeritage() {
    const context = useContext(HeritageContext);
    if (!context) throw new Error('useHeritage must be used within HeritageProvider');
    return context;
}
