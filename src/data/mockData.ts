import { User, Family, FamilyMembership, FamilyTreeNode, Post, FriendRequest, Friendship, Conversation, Message, Notification, SearchResult, ProfileClaim, DeletionRequest } from '@/types';

// ==========================================
// MOCK USERS
// ==========================================
const defaultUserFlags = {
    verificationStatus: 'unverified' as const,
    profileVisibility: 'public' as const,
    blockedUserIds: [] as string[],
    notifyFriendRequests: true,
    notifyTributes: true,
    notifyFamilyEvents: true,
    notifyTreeEdits: true,
    notifyMessages: true,
    notifyGovernance: true,
};

export const mockUsers: User[] = [
    {
        ...defaultUserFlags,
        id: 'user-1',
        email: 'ambe.nkeng@heritage.cm',
        fullName: 'Ambe Nkeng',
        username: 'ambe_nkeng',
        avatarUrl: '',
        bio: 'Proud Bamiléké descendant. Preserving our roots for the next generation.',
        birthDate: '1985-03-15',
        birthDateVisible: true,
        nativeLanguage: 'Ghomálá\'',
        village: 'Bandjoun',
        region: 'West',
        tribe: 'Bamiléké',
        traditionalTitle: 'Fo\'o',
        photos: [],
        videos: [],
        audioClips: [],
        isDeceased: false,
        createdAt: '2026-01-10T08:00:00Z',
        friendListVisible: true,
        connectionsVisible: true,
        profileVisible: true,
        coverPhotoUrl: '',
    },
    {
        ...defaultUserFlags,
        id: 'user-2',
        email: 'ngono.meka@heritage.cm',
        fullName: 'Ngono Meka',
        username: 'ngono_meka',
        avatarUrl: '',
        bio: 'Ewondo by blood. Family is everything. 🌍',
        birthDate: '1990-07-22',
        birthDateVisible: true,
        nativeLanguage: 'Ewondo',
        village: 'Nkolbisson',
        region: 'Centre',
        tribe: 'Ewondo',
        photos: [],
        videos: [],
        audioClips: [],
        isDeceased: false,
        createdAt: '2026-01-12T10:30:00Z',
        friendListVisible: true,
        connectionsVisible: true,
        profileVisible: true,
        coverPhotoUrl: '',
    },
    {
        ...defaultUserFlags,
        id: 'user-3',
        email: 'tabi.eyong@heritage.cm',
        fullName: 'Tabi Eyong',
        username: 'tabi_eyong',
        avatarUrl: '',
        bio: 'Connecting the Eyong lineage across Manyu Division.',
        birthDate: '1978-11-05',
        birthDateVisible: false,
        nativeLanguage: 'Ejagham',
        village: 'Mamfe',
        region: 'South-West',
        tribe: 'Ejagham',
        traditionalTitle: 'Chief',
        photos: [],
        videos: [],
        audioClips: [],
        isDeceased: false,
        createdAt: '2026-01-15T14:00:00Z',
        friendListVisible: true,
        connectionsVisible: false,
        profileVisible: true,
        coverPhotoUrl: '',
    },
    {
        ...defaultUserFlags,
        id: 'user-4',
        email: 'deceased@heritage.cm',
        fullName: 'Pa Nkeng Fomonyuy',
        username: 'pa_nkeng',
        avatarUrl: '',
        bio: 'Patriarch of the Nkeng family. 1935-2018.',
        birthDate: '1935-04-10',
        birthDateVisible: true,
        nativeLanguage: 'Ghomálá\'',
        village: 'Bandjoun',
        region: 'West',
        tribe: 'Bamiléké',
        traditionalTitle: 'Notable',
        photos: [],
        videos: [],
        audioClips: [],
        isDeceased: true,
        deathDate: '2018-12-01',
        createdAt: '2026-01-10T08:00:00Z',
        friendListVisible: false,
        connectionsVisible: false,
        profileVisible: true,
        coverPhotoUrl: '',
    },
    {
        ...defaultUserFlags,
        id: 'user-5',
        email: 'fien.njoya@heritage.cm',
        fullName: 'Fien Njoya',
        username: 'fien_njoya',
        avatarUrl: '',
        bio: 'Bamoun heritage keeper. Historian at heart.',
        birthDate: '1992-01-18',
        birthDateVisible: true,
        nativeLanguage: 'Bamoun',
        village: 'Foumban',
        region: 'West',
        tribe: 'Bamoun',
        photos: [],
        videos: [],
        audioClips: [],
        isDeceased: false,
        createdAt: '2026-01-20T09:00:00Z',
        friendListVisible: true,
        connectionsVisible: true,
        profileVisible: true,
        coverPhotoUrl: '',
    },
];

// ==========================================
// MOCK FAMILIES
// ==========================================
export const mockFamilies: Family[] = [
    {
        id: 'family-1',
        name: 'The Nkeng Dynasty',
        description: 'The royal Nkeng lineage from Bandjoun, West Region. Preserving nearly a century of heritage.',
        privacy: 'public',
        status: 'active',
        createdBy: 'user-1',
        createdAt: '2026-01-10T09:00:00Z',
        memberCount: 4,
        members: [
            { userId: 'user-1', familyId: 'family-1', role: 'creator', joinedAt: '2026-01-10T09:00:00Z', canApproveTributes: true },
            { userId: 'user-2', familyId: 'family-1', role: 'editor', joinedAt: '2026-01-12T11:00:00Z', canApproveTributes: true },
            { userId: 'user-4', familyId: 'family-1', role: 'member', joinedAt: '2026-01-10T09:00:00Z' },
            { userId: 'user-5', familyId: 'family-1', role: 'member', joinedAt: '2026-02-01T10:00:00Z' },
        ],
        coverPhotoUrl: '',
        custodians: ['user-1'],
        treeVisibility: 'public',
    },
    {
        id: 'family-2',
        name: 'Eyong Heritage',
        description: 'The Eyong clan from Manyu Division. Ejagham roots running deep.',
        privacy: 'private',
        status: 'active',
        createdBy: 'user-3',
        createdAt: '2026-01-15T15:00:00Z',
        memberCount: 2,
        members: [
            { userId: 'user-3', familyId: 'family-2', role: 'creator', joinedAt: '2026-01-15T15:00:00Z', canApproveTributes: true },
            { userId: 'user-1', familyId: 'family-2', role: 'member', joinedAt: '2026-02-05T10:00:00Z' },
        ],
        coverPhotoUrl: '',
        custodians: ['user-3'],
        treeVisibility: 'private',
    },
    {
        id: 'family-3',
        name: 'Njoya Royal House',
        description: 'Descendants of the great Bamoun Sultan. Foumban forever.',
        privacy: 'public',
        status: 'active',
        createdBy: 'user-5',
        createdAt: '2026-01-20T10:00:00Z',
        memberCount: 1,
        members: [
            { userId: 'user-5', familyId: 'family-3', role: 'creator', joinedAt: '2026-01-20T10:00:00Z', canApproveTributes: true },
        ],
        coverPhotoUrl: '',
        custodians: ['user-5'],
        treeVisibility: 'public',
    },
];

// ==========================================
// MOCK FAMILY TREE NODES
// ==========================================
export const mockFamilyTreeNodes: Record<string, FamilyTreeNode[]> = {
    'family-1': [
        {
            id: 'node-1',
            userId: 'user-4',
            name: 'Pa Nkeng Fomonyuy',
            birthDate: '1935-04-10',
            deathDate: '2018-12-01',
            isDeceased: true,
            gender: 'male',
            parentIds: [],
            spouseIds: ['node-2'],
            childIds: ['node-3', 'node-4'],
            generation: 0,
            nodePrivacy: 'visible',
        },
        {
            id: 'node-2',
            userId: '',
            name: 'Ma Nkeng Rose',
            birthDate: '1940-06-20',
            deathDate: '2020-03-15',
            isDeceased: true,
            gender: 'female',
            parentIds: [],
            spouseIds: ['node-1'],
            childIds: ['node-3', 'node-4'],
            generation: 0,
            nodePrivacy: 'visible',
        },
        {
            id: 'node-3',
            userId: 'user-1',
            name: 'Ambe Nkeng',
            birthDate: '1985-03-15',
            isDeceased: false,
            gender: 'male',
            parentIds: ['node-1', 'node-2'],
            spouseIds: ['node-5'],
            childIds: ['node-6'],
            generation: 1,
            nodePrivacy: 'visible',
        },
        {
            id: 'node-4',
            userId: '',
            name: 'Nkeng Sandrine',
            birthDate: '1988-09-12',
            isDeceased: false,
            gender: 'female',
            parentIds: ['node-1', 'node-2'],
            spouseIds: [],
            childIds: [],
            generation: 1,
            nodePrivacy: 'visible',
        },
        {
            id: 'node-5',
            userId: '',
            name: 'Ambe Clarisse',
            birthDate: '1990-01-08',
            isDeceased: false,
            gender: 'female',
            parentIds: [],
            spouseIds: ['node-3'],
            childIds: ['node-6'],
            generation: 1,
            nodePrivacy: 'visible',
        },
        {
            id: 'node-6',
            userId: '',
            name: 'Nkeng Jr.',
            birthDate: '2015-05-20',
            isDeceased: false,
            gender: 'male',
            parentIds: ['node-3', 'node-5'],
            spouseIds: [],
            childIds: [],
            generation: 2,
            nodePrivacy: 'visible',
        },
    ],
};

// ==========================================
// MOCK POSTS
// ==========================================
export const mockPosts: Post[] = [
    {
        id: 'post-1',
        authorId: 'user-1',
        authorName: 'Ambe Nkeng',
        content: 'Just connected with my cousin in Douala through Heritage! Our family tree is growing. 🌳 The Nkeng dynasty stands strong!',
        images: [],
        type: 'regular',
        likes: ['user-2', 'user-3', 'user-5'],
        reactions: [],
        visibility: 'public',
        comments: [
            {
                id: 'comment-1',
                authorId: 'user-2',
                authorName: 'Ngono Meka',
                content: 'This is beautiful! Heritage is connecting us all. 🙌',
                createdAt: '2026-02-15T10:30:00Z',
                replies: [],
            },
        ],
        createdAt: '2026-02-15T09:00:00Z',
    },
    {
        id: 'post-2',
        authorId: 'user-3',
        authorName: 'Tabi Eyong',
        content: 'Documenting the Eyong lineage one generation at a time. If you are from Manyu Division and know an Eyong, connect them to our family!',
        images: [],
        type: 'regular',
        likes: ['user-1'],
        reactions: [],
        visibility: 'public',
        comments: [],
        createdAt: '2026-02-14T15:00:00Z',
    },
    {
        id: 'post-3',
        authorId: 'user-1',
        authorName: 'Ambe Nkeng',
        content: 'In loving memory of Pa Nkeng Fomonyuy (1935-2018). A man of honor, wisdom, and unshakeable resolve. Your legacy lives in every branch of this tree. Rest in power, Papa. 🕊️',
        images: [],
        type: 'tribute',
        tributeStatus: 'approved',
        familyId: 'family-1',
        targetDeceasedId: 'user-4',
        likes: ['user-2', 'user-3', 'user-5'],
        reactions: [],
        visibility: 'public',
        comments: [
            {
                id: 'comment-2',
                authorId: 'user-5',
                authorName: 'Fien Njoya',
                content: 'May his memory be eternal. Beautiful tribute. 🙏',
                createdAt: '2026-02-13T12:00:00Z',
                replies: [],
            },
        ],
        createdAt: '2026-02-13T08:00:00Z',
    },
    {
        id: 'post-4',
        authorId: 'user-5',
        authorName: 'Fien Njoya',
        content: 'Started building the Njoya Royal House tree on Heritage. Our Bamoun heritage stretches back generations. Let\'s document it all!',
        images: [],
        type: 'regular',
        likes: ['user-1', 'user-2'],
        reactions: [],
        visibility: 'public',
        comments: [],
        createdAt: '2026-02-12T18:00:00Z',
    },
    {
        id: 'post-5',
        authorId: 'user-2',
        authorName: 'Ngono Meka',
        content: 'Heritage: the tribute post feature is incredible. Being able to honor our ancestors with community-approved memorials gives them the dignity they deserve.',
        images: [],
        type: 'regular',
        likes: ['user-1', 'user-3', 'user-5'],
        reactions: [],
        visibility: 'public',
        comments: [
            {
                id: 'comment-3',
                authorId: 'user-1',
                authorName: 'Ambe Nkeng',
                content: 'Exactly! Governance-protected tributes ensure respect. 💯',
                createdAt: '2026-02-11T09:30:00Z',
                replies: [],
            },
        ],
        createdAt: '2026-02-11T08:00:00Z',
    },
];

// ==========================================
// MOCK FRIEND REQUESTS
// ==========================================
export const mockFriendRequests: FriendRequest[] = [
    {
        id: 'fr-1',
        fromUserId: 'user-5',
        fromUserName: 'Fien Njoya',
        toUserId: 'user-1',
        status: 'pending',
        createdAt: '2026-02-20T10:00:00Z',
    },
];

// ==========================================
// MOCK FRIENDSHIPS
// ==========================================
export const mockFriendships: Friendship[] = [
    { id: 'fs-1', userId: 'user-1', friendId: 'user-2', createdAt: '2026-01-15T10:00:00Z' },
    { id: 'fs-2', userId: 'user-1', friendId: 'user-3', createdAt: '2026-01-18T10:00:00Z' },
    { id: 'fs-3', userId: 'user-2', friendId: 'user-3', createdAt: '2026-01-20T10:00:00Z' },
];

// ==========================================
// MOCK CONVERSATIONS
// ==========================================
export const mockConversations: Conversation[] = [
    {
        id: 'conv-1',
        participantIds: ['user-1', 'user-2'],
        participantNames: ['Ambe Nkeng', 'Ngono Meka'],
        participantAvatars: ['', ''],
        lastMessage: {
            id: 'msg-1',
            senderId: 'user-2',
            senderName: 'Ngono Meka',
            content: 'Have you added the new branch to the Nkeng tree yet?',
            messageType: 'text',
            read: false,
            createdAt: '2026-02-20T14:00:00Z',
        },
        unreadCount: 1,
        isFamilyThread: false,
    },
    {
        id: 'conv-2',
        participantIds: ['user-1', 'user-2', 'user-4', 'user-5'],
        participantNames: ['Ambe Nkeng', 'Ngono Meka', 'Pa Nkeng', 'Fien Njoya'],
        participantAvatars: ['', '', '', ''],
        lastMessage: {
            id: 'msg-2',
            senderId: 'user-1',
            senderName: 'Ambe Nkeng',
            content: 'Welcome to the Nkeng Dynasty family thread! 🎉',
            messageType: 'text',
            read: true,
            createdAt: '2026-02-18T10:00:00Z',
        },
        unreadCount: 0,
        isFamilyThread: true,
        familyId: 'family-1',
        familyName: 'The Nkeng Dynasty',
    },
];

// ==========================================
// MOCK MESSAGES
// ==========================================
export const mockMessages: Record<string, Message[]> = {
    'conv-1': [
        { id: 'msg-1a', senderId: 'user-1', senderName: 'Ambe Nkeng', content: 'Hey Ngono! Thanks for editing the family tree.', messageType: 'text', read: true, createdAt: '2026-02-20T13:00:00Z' },
        { id: 'msg-1b', senderId: 'user-2', senderName: 'Ngono Meka', content: 'No problem! Happy to help preserve the Nkeng legacy.', messageType: 'text', read: true, createdAt: '2026-02-20T13:15:00Z' },
        { id: 'msg-1c', senderId: 'user-2', senderName: 'Ngono Meka', content: 'Have you added the new branch to the Nkeng tree yet?', messageType: 'text', read: false, createdAt: '2026-02-20T14:00:00Z' },
    ],
    'conv-2': [
        { id: 'msg-2a', senderId: 'user-1', senderName: 'Ambe Nkeng', content: 'Welcome to the Nkeng Dynasty family thread! 🎉', messageType: 'text', read: true, createdAt: '2026-02-18T10:00:00Z' },
        { id: 'msg-2b', senderId: 'user-5', senderName: 'Fien Njoya', content: 'Honoured to be part of this family. Looking forward to contributing!', messageType: 'text', read: true, createdAt: '2026-02-18T11:00:00Z' },
    ],
};

// ==========================================
// MOCK NOTIFICATIONS
// ==========================================
export const mockNotifications: Notification[] = [
    {
        id: 'notif-1',
        userId: 'user-1',
        type: 'friend_request',
        title: 'Friend Request',
        message: 'Fien Njoya sent you a friend request.',
        read: false,
        createdAt: '2026-02-20T10:00:00Z',
    },
    {
        id: 'notif-2',
        userId: 'user-1',
        type: 'tribute_pending',
        title: 'Tribute Pending',
        message: 'A new tribute for Pa Nkeng Fomonyuy is awaiting your approval.',
        read: false,
        createdAt: '2026-02-19T16:00:00Z',
    },
    {
        id: 'notif-3',
        userId: 'user-1',
        type: 'like',
        title: 'New Like',
        message: 'Ngono Meka liked your post.',
        read: true,
        createdAt: '2026-02-18T12:00:00Z',
    },
    {
        id: 'notif-4',
        userId: 'user-1',
        type: 'comment',
        title: 'New Comment',
        message: 'Fien Njoya commented on your tribute post.',
        read: true,
        createdAt: '2026-02-17T10:00:00Z',
    },
];

// ==========================================
// MOCK SEARCH RESULTS
// ==========================================
export const mockSearchResults: SearchResult[] = [
    ...mockUsers.map(u => ({
        type: 'user' as const,
        id: u.id,
        name: u.fullName,
        avatarUrl: u.avatarUrl,
        subtitle: `${u.tribe || ''} · ${u.village || ''}`,
        metadata: { region: u.region || '', tribe: u.tribe || '', village: u.village || '', birthDate: u.birthDate || '' },
    })),
    ...mockFamilies.map(f => ({
        type: 'family' as const,
        id: f.id,
        name: f.name,
        avatarUrl: f.coverPhotoUrl,
        subtitle: `${f.memberCount} members · ${f.privacy}`,
        metadata: { privacy: f.privacy, memberCount: String(f.memberCount) },
    })),
];

// ==========================================
// MOCK PROFILE CLAIMS & DELETION REQUESTS (Admin)
// ==========================================
export const mockProfileClaims: ProfileClaim[] = [
    {
        id: 'claim-1',
        claimantId: 'user-5',
        claimantName: 'Fien Njoya',
        targetProfileId: 'user-4',
        targetProfileName: 'Pa Nkeng Fomonyuy',
        familyId: 'family-1',
        status: 'pending',
        createdAt: '2026-02-19T10:00:00Z',
    },
];

export const mockDeletionRequests: DeletionRequest[] = [];
