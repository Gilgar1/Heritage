// ==========================================
// HERITAGE MVP - Core Type Definitions
// ==========================================

// --- User & Auth ---
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type ProfileVisibility = 'public' | 'family' | 'friends' | 'private';

export interface User {
    id: string;
    email: string;
    fullName: string;
    username: string;
    avatarUrl?: string;
    coverPhotoUrl?: string;
    bio?: string;
    birthDate?: string;
    birthDateVisible: boolean;
    nativeLanguage?: string;
    village?: string;
    region?: string;
    tribe?: string;
    clan?: string;
    traditionalTitle?: string;
    photos: string[];
    videos: string[];
    audioClips: string[];
    isDeceased: boolean;
    deathDate?: string;
    createdAt: string;
    friendListVisible: boolean;
    connectionsVisible: boolean;
    profileVisible: boolean;
    // Verification
    verificationStatus: VerificationStatus;
    verifiedAt?: string;
    // Privacy
    profileVisibility: ProfileVisibility;
    // Privacy expanded
    blockedUserIds: string[];
    // Notification prefs
    notifyFriendRequests: boolean;
    notifyTributes: boolean;
    notifyFamilyEvents: boolean;
    notifyTreeEdits: boolean;
    notifyMessages: boolean;
    notifyGovernance: boolean;
}

// --- Family Roles ---
export type FamilyRole = 'creator' | 'editor' | 'member';

export interface FamilyMembership {
    userId: string;
    familyId: string;
    role: FamilyRole;
    joinedAt: string;
    canApproveTributes?: boolean;
}

// --- Family ---
export type FamilyPrivacy = 'public' | 'private' | 'unlisted';
export type FamilyStatus = 'active' | 'frozen' | 'pending_deletion';

export interface Family {
    id: string;
    name: string;
    description?: string;
    coverPhotoUrl?: string;
    privacy: FamilyPrivacy;
    status: FamilyStatus;
    createdBy: string;
    createdAt: string;
    memberCount: number;
    members: FamilyMembership[];
    // Governance
    constitution?: string;
    custodians: string[]; // userIds of governance council
    treeVisibility: 'public' | 'request' | 'private';
}

// --- Family Tree ---
export type RelationshipType = 'parent' | 'child' | 'spouse' | 'sibling' | 'adopted' | 'divorced';

export interface MarriageRecord {
    id: string;
    spouseAId: string;
    spouseBId: string;
    marriageDate?: string;
    divorceDate?: string;
    location?: string;
    isDivorced: boolean;
}

export interface FamilyTreeNode {
    id: string;
    userId: string;
    name: string;
    avatarUrl?: string;
    birthDate?: string;
    deathDate?: string;
    isDeceased: boolean;
    isAdopted?: boolean;
    gender: 'male' | 'female' | 'other';
    parentIds: string[];
    spouseIds: string[];
    childIds: string[];
    generation: number;
    nodePrivacy: 'visible' | 'hidden_living' | 'private';
    x?: number;
    y?: number;
}

export interface FamilyTreeEdge {
    id: string;
    sourceId: string;
    targetId: string;
    type: RelationshipType;
}

export interface FamilyTree {
    familyId: string;
    nodes: FamilyTreeNode[];
    edges: FamilyTreeEdge[];
    marriages: MarriageRecord[];
    editHistory: TreeEditLog[];
}

export interface TreeEditLog {
    id: string;
    familyId: string;
    editorId: string;
    editorName: string;
    action: 'add_node' | 'edit_node' | 'remove_node' | 'add_edge' | 'remove_edge';
    description: string;
    createdAt: string;
}

// --- Posts & Social ---
export type PostType = 'regular' | 'tribute' | 'story' | 'event_update';
export type TributeStatus = 'pending' | 'approved' | 'rejected';
export type ReactionType = '❤️' | '😢' | '🙏' | '👏' | '🕊️';
export type PostVisibility = 'public' | 'family' | 'friends' | 'private';

export interface Reaction {
    userId: string;
    userName: string;
    type: ReactionType;
}

export interface CommentReply {
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: string;
}

export interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    createdAt: string;
    replies: CommentReply[];
}

export interface Post {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    images: string[];
    type: PostType;
    tributeStatus?: TributeStatus;
    familyId?: string;
    targetDeceasedId?: string;
    likes: string[];
    reactions: Reaction[];
    comments: Comment[];
    visibility: PostVisibility;
    createdAt: string;
}

// --- Friendship ---
export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface FriendRequest {
    id: string;
    fromUserId: string;
    fromUserName: string;
    fromUserAvatar?: string;
    toUserId: string;
    status: FriendRequestStatus;
    createdAt: string;
}

export interface Friendship {
    id: string;
    userId: string;
    friendId: string;
    createdAt: string;
}

// --- Following ---
export interface Follow {
    id: string;
    followerId: string;
    followingId: string;
    createdAt: string;
    followType: 'user' | 'family';
}

// --- Messaging ---
export type MessageType = 'text' | 'media' | 'voice';

export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    recipientId?: string;
    familyId?: string;
    content: string;
    messageType: MessageType;
    mediaUrl?: string;
    read: boolean;
    createdAt: string;
    parentMessageId?: string; // for threading
}

export interface Conversation {
    id: string;
    participantIds: string[];
    participantNames: string[];
    participantAvatars: string[];
    lastMessage?: Message;
    unreadCount: number;
    isFamilyThread: boolean;
    familyId?: string;
    familyName?: string;
}

// --- Notifications ---
export type NotificationType =
    | 'friend_request'
    | 'friend_accepted'
    | 'family_invite'
    | 'tribute_pending'
    | 'tribute_approved'
    | 'tribute_rejected'
    | 'comment'
    | 'like'
    | 'reaction'
    | 'message'
    | 'family_frozen'
    | 'profile_claim'
    | 'role_change'
    | 'tree_edit'
    | 'media_tag'
    | 'event_reminder'
    | 'tribute_anniversary'
    | 'governance_vote'
    | 'verification_update';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    linkTo?: string;
    metadata?: Record<string, string>;
    createdAt: string;
}

// --- Search ---
export interface SearchFilters {
    query: string;
    type: 'all' | 'users' | 'families';
    village?: string;
    region?: string;
    tribe?: string;
    nativeLanguage?: string;
    generation?: number;
}

export interface SearchResult {
    type: 'user' | 'family';
    id: string;
    name: string;
    avatarUrl?: string;
    subtitle?: string;
    metadata?: Record<string, string>;
}

// --- Media ---
export type MediaType = 'photo' | 'video' | 'audio' | 'document';
export type MediaVisibility = 'public' | 'family' | 'friends' | 'private';
export type MediaEvent = 'birth' | 'marriage' | 'funeral' | 'reunion' | 'graduation' | 'celebration' | 'other';

export interface MediaItem {
    id: string;
    uploaderId: string;
    uploaderName: string;
    familyId?: string;
    taggedNodeIds: string[];   // family tree node IDs
    taggedUserIds: string[];   // user IDs
    url: string;
    thumbnailUrl?: string;
    caption?: string;
    type: MediaType;
    event?: MediaEvent;
    albumId?: string;
    visibility: MediaVisibility;
    downloadAllowed: boolean;
    createdAt: string;
}

export interface MediaAlbum {
    id: string;
    familyId?: string;
    userId?: string;
    title: string;
    description?: string;
    event?: MediaEvent;
    coverUrl?: string;
    mediaIds: string[];
    createdAt: string;
}

// --- Family Events ---
export type EventType = 'reunion' | 'funeral' | 'wedding' | 'birth_celebration' | 'cultural' | 'governance' | 'other';
export type RSVPStatus = 'going' | 'maybe' | 'not_going';

export interface FamilyEvent {
    id: string;
    familyId: string;
    createdBy: string;
    title: string;
    description?: string;
    eventType: EventType;
    date: string;
    location?: string;
    rsvps: { userId: string; userName: string; status: RSVPStatus }[];
    createdAt: string;
}

// --- Governance ---
export interface GovernanceVote {
    id: string;
    familyId: string;
    createdBy: string;
    question: string;
    description?: string;
    options: { id: string; label: string; votes: string[] }[]; // votes = userIds
    status: 'active' | 'closed';
    closesAt: string;
    createdAt: string;
}

// --- Memorial ---
export interface MemorialCandle {
    id: string;
    userId: string;    // person lighting candle
    userName: string;
    targetProfileId: string;  // deceased user or node
    message?: string;
    createdAt: string;
}

// --- Content Reporting ---
export interface ContentReport {
    id: string;
    reporterId: string;
    contentType: 'post' | 'comment' | 'profile' | 'family' | 'media';
    contentId: string;
    reason: 'harassment' | 'spam' | 'misinformation' | 'inappropriate' | 'impersonation' | 'other';
    description?: string;
    status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
    createdAt: string;
}

// --- Tribe & Village Knowledge ---
export interface TribeInfo {
    id: string;
    name: string;
    region: string;
    language: string;
    description: string;
    traditions: string[];
    familyCount: number;
    memberCount: number;
}

export interface VillageInfo {
    id: string;
    name: string;
    region: string;
    tribe: string;
    description: string;
    familyCount: number;
    population?: number;
    coordinates?: { lat: number; lng: number };
}

// --- Admin ---
export interface AdminAction {
    id: string;
    adminId: string;
    actionType: 'freeze_family' | 'suspend_user' | 'override_edit' | 'approve_claim' | 'approve_deletion' | 'resolve_report';
    targetId: string;
    reason: string;
    createdAt: string;
}

export interface ProfileClaim {
    id: string;
    claimantId: string;
    claimantName: string;
    targetProfileId: string;
    targetProfileName: string;
    familyId: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export interface DeletionRequest {
    id: string;
    familyId: string;
    familyName: string;
    requestedBy: string;
    requestedByName: string;
    status: 'pending' | 'approved' | 'rejected';
    freezeExpiresAt: string;
    createdAt: string;
}
