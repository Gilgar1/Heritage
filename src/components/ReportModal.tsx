'use client';

import React, { useState } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { Modal } from '@/components/shared';

const BROWN = '#5C3A21';
const GOLD = '#C6A75E';
const CREAM = '#F4EFE6';
const CHARCOAL = '#1F1F1F';

type ContentType = 'post' | 'comment' | 'profile' | 'family' | 'media';
type ReportReason = 'harassment' | 'spam' | 'misinformation' | 'inappropriate' | 'impersonation' | 'other';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    contentType: ContentType;
    contentId: string;
    contentLabel?: string;
}

const REASON_LABELS: Record<ReportReason, string> = {
    harassment: '🚫 Harassment or Bullying',
    spam: '📧 Spam or Unwanted Content',
    misinformation: '❌ False Information',
    inappropriate: '⚠️ Inappropriate Content',
    impersonation: '👤 Impersonation',
    other: '📝 Other',
};

export function ReportModal({ isOpen, onClose, contentType, contentId, contentLabel }: ReportModalProps) {
    const [reason, setReason] = useState<ReportReason | ''>('');
    const [description, setDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (!reason) return;
        // In real app: POST to backend
        console.log('Report submitted:', { contentType, contentId, reason, description });
        setSubmitted(true);
    };

    const handleClose = () => {
        setSubmitted(false);
        setReason('');
        setDescription('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Report Content">
            {submitted ? (
                <div className="text-center py-6">
                    <p className="text-4xl mb-3">✅</p>
                    <h3 className="font-bold text-base mb-2" style={{ color: CHARCOAL }}>Report Submitted</h3>
                    <p className="text-sm" style={{ color: '#666' }}>
                        Thank you for helping keep Heritage safe. Our moderation team will review this within 24–48 hours.
                    </p>
                    <button onClick={handleClose} className="btn-primary mt-6"
                        style={{ background: GOLD, color: CHARCOAL }}>Close</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {contentLabel && (
                        <div className="p-3 rounded-xl text-sm" style={{ background: CREAM, color: CHARCOAL }}>
                            Reporting: <strong>{contentLabel}</strong>
                        </div>
                    )}
                    <div>
                        <label className="input-label">Reason for Reporting *</label>
                        <div className="space-y-2 mt-2">
                            {(Object.entries(REASON_LABELS) as [ReportReason, string][]).map(([key, label]) => (
                                <button key={key} onClick={() => setReason(key)}
                                    className="w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all"
                                    style={reason === key
                                        ? { borderColor: BROWN, background: `${BROWN}08`, color: BROWN }
                                        : { borderColor: 'rgba(92,58,33,0.15)', color: '#555', background: 'transparent' }}>
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="input-label">Additional Details (optional)</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)}
                            className="input-field min-h-[80px] resize-none"
                            placeholder="Tell us more about what happened..." />
                    </div>
                    <button onClick={handleSubmit} disabled={!reason}
                        className="btn-danger w-full disabled:opacity-30">
                        Submit Report
                    </button>
                    <p className="text-xs text-center" style={{ color: '#aaa' }}>
                        Reports are confidential. We will not share your identity with the reported user.
                    </p>
                </div>
            )}
        </Modal>
    );
}

// Default export for direct page access
export default function ReportPage() {
    const [open, setOpen] = useState(true);
    return (
        <div className="max-w-md mx-auto px-4 py-12">
            <ReportModal isOpen={open} onClose={() => setOpen(false)} contentType="post" contentId="demo" contentLabel="Demo content" />
        </div>
    );
}
