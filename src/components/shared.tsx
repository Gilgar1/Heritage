'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHeritage } from '@/context/HeritageContext';

// ==============================
// ICONS (inline SVG)
// ==============================
const Icons = {
    Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    Bell: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    Message: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
    X: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    Shield: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    Heart: () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
    HeartFilled: () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="#C62828" stroke="#C62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
    Comment: () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>,
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    Lock: () => <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
    Globe: () => <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
    Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    Logout: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
    Send: () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
    ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
    UserPlus: () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>,
    Candle: () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="8" width="8" height="14" rx="1" /><path d="M12 2c1 1 2 3 0 6" /></svg>,
    Tree: () => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V8" /><path d="M5 12H2a10 10 0 0 0 20 0h-3" /><path d="M12 2a5 5 0 0 1 5 5v1H7V7a5 5 0 0 1 5-5z" /></svg>,
    TreeSmall: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V8" /><path d="M5 12H2a10 10 0 0 0 20 0h-3" /><path d="M12 2a5 5 0 0 1 5 5v1H7V7a5 5 0 0 1 5-5z" /></svg>,
    ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>,
    Map: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>,
    Star: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    BarChart: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>,
    Image: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>,
    Book: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
    Rocket: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74.5 5 2c1.26-1.5 2-5 2-5s-3.74-.5-5-2z" /><path d="M13.5 15.5c1.5 1.26 2 5 2 5s-3.74.5-5 2c-1.26-1.5-2-5-2-5s3.74-.5 5-2z" /><path d="M17.5 12.5c1.5 1.26 2 5 2 5s-3.74.5-5 2c-1.26-1.5-2-5-2-5s3.74-.5 5-2z" /><path d="M19 14V7c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v7" /><path d="M10 9h4" /><path d="M12 12V5" /></svg>,
};

export { Icons };

// ==============================
// HEADER (Authenticated)
// ==============================
export function Header() {
    const { currentUser, logout, unreadNotificationCount, isAdmin } = useHeritage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
    const pathname = usePathname();

    const handleCloseDropdowns = () => {
        setMobileMenuOpen(false);
        setMoreDropdownOpen(false);
    };

    // Close dropdowns when clicking outside
    React.useEffect(() => {
        if (mobileMenuOpen || moreDropdownOpen) {
            document.addEventListener('click', handleCloseDropdowns);
        }
        return () => {
            document.removeEventListener('click', handleCloseDropdowns);
        };
    }, [mobileMenuOpen, moreDropdownOpen]);

    if (!currentUser) return null;

    const navItems = [
        { href: '/feed', label: 'Feed', icon: Icons.Home },
        { href: '/families', label: 'Families', icon: Icons.Users },
        { href: '/search', label: 'Search', icon: Icons.Search },
        { href: '/messages', label: 'Messages', icon: Icons.Message },
    ];

    const moreItems = [
        { href: '/discover', label: 'Discover', icon: Icons.Map },
        { href: '/activity', label: 'Activity', icon: Icons.Bell },
        { href: '/analytics', label: 'Analytics', icon: Icons.BarChart },
        { href: '/invite', label: 'Invite', icon: Icons.UserPlus },
        { href: '/cultural-archive', label: 'Cultural Archive', icon: Icons.Book },
        { href: '/trust', label: 'Trust Score', icon: Icons.Star },
        { href: '/archive', label: 'Family Archive', icon: Icons.Image },
        { href: '/transparency', label: 'Transparency', icon: Icons.Eye },
        { href: '/guidelines', label: 'Guidelines', icon: Icons.Book },
        { href: '/settings', label: 'Settings', icon: Icons.Settings },
        { href: '/admin/moderation', label: 'Moderation', icon: Icons.Shield },
    ];

    const allNavItems = [...navItems, ...moreItems]; // For mobile menu

    const handleMoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setMoreDropdownOpen(prev => !prev);
    };


    return (
        <>
            {/* ── TOP HEADER ── */}
            <header style={{ background: '#5C3A21' }} className="fixed top-0 left-0 right-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/feed" className="flex items-center gap-2 group" onClick={handleCloseDropdowns}>
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform"
                            style={{ background: '#C6A75E', color: '#1F1F1F' }}
                        >H</div>
                        <span className="text-xl font-bold hidden sm:block" style={{ color: '#F4EFE6' }}>Heritage</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map(item => {
                            const active = pathname === item.href || pathname?.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                    style={active
                                        ? { color: '#C6A75E', background: 'rgba(198,167,94,0.15)' }
                                        : { color: 'rgba(244,239,230,0.7)' }}
                                    onClick={handleCloseDropdowns}
                                >
                                    <item.icon />{item.label}
                                </Link>
                            );
                        })}
                        {/* More dropdown */}
                        <div className="relative">
                            <button
                                onClick={handleMoreClick}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                style={moreDropdownOpen
                                    ? { color: '#C6A75E', background: 'rgba(198,167,94,0.15)' }
                                    : { color: 'rgba(244,239,230,0.7)' }}
                            >
                                More <Icons.ChevronDown />
                            </button>
                            {moreDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10 animate-fade-in"
                                    style={{ background: '#422917', border: '1px solid rgba(244,239,230,0.1)' }}>
                                    {moreItems.map(item => {
                                        const active = pathname === item.href || pathname?.startsWith(item.href + '/');
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all hover:bg-white/10"
                                                style={active
                                                    ? { color: '#C6A75E' }
                                                    : { color: 'rgba(244,239,230,0.8)' }}
                                                onClick={handleCloseDropdowns}
                                            >
                                                <item.icon />{item.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <Link href="/notifications" className="relative p-2 rounded-xl transition-all" style={{ color: '#F4EFE6' }} onClick={handleCloseDropdowns}>
                            <Icons.Bell />
                            {unreadNotificationCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: '#C62828' }}>
                                    {unreadNotificationCount}
                                </span>
                            )}
                        </Link>

                        {/* Avatar */}
                        <Link href="/profile" className="flex items-center gap-2 hover:opacity-90 transition-opacity ml-1" onClick={handleCloseDropdowns}>
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2"
                                style={{ background: '#C6A75E', color: '#1F1F1F', borderColor: 'rgba(244,239,230,0.3)' }}
                            >
                                {currentUser.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <span className="text-sm font-medium hidden lg:block" style={{ color: '#F4EFE6' }}>
                                {currentUser.fullName.split(' ')[0]}
                            </span>
                        </Link>

                        {isAdmin && (
                            <Link href="/admin" className="p-2 rounded-xl transition-all" style={{ color: '#C6A75E' }} title="Admin Panel" onClick={handleCloseDropdowns}>
                                <Icons.Shield />
                            </Link>
                        )}

                        <button onClick={() => { logout(); handleCloseDropdowns(); }} className="hidden md:flex p-2 rounded-xl transition-all" style={{ color: 'rgba(244,239,230,0.7)' }} title="Logout">
                            <Icons.Logout />
                        </button>

                        {/* Hamburger */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); setMoreDropdownOpen(false); }}
                            className="md:hidden p-2 rounded-xl"
                            style={{ color: '#F4EFE6' }}
                        >
                            {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown */}
                {mobileMenuOpen && (
                    <div style={{ background: '#422917' }} className="md:hidden border-t border-white/10 animate-fade-in">
                        <nav className="px-4 py-3 flex flex-col gap-1">
                            {allNavItems.map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={handleCloseDropdowns}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                                    style={pathname === item.href || pathname?.startsWith(item.href + '/')
                                        ? { color: '#C6A75E', background: 'rgba(198,167,94,0.1)' }
                                        : { color: 'rgba(244,239,230,0.8)' }}
                                >
                                    <item.icon />{item.label}
                                </Link>
                            ))}
                            {isAdmin && (
                                <Link href="/admin" onClick={handleCloseDropdowns}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
                                    style={{ color: '#C6A75E' }}>
                                    <Icons.Shield />Admin Panel
                                </Link>
                            )}
                            <button onClick={() => { logout(); handleCloseDropdowns(); }}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left"
                                style={{ color: '#f87171' }}>
                                <Icons.Logout />Logout
                            </button>
                        </nav>
                    </div>
                )}
            </header>

            {/* ── BOTTOM NAV (Mobile) ── */}
            <div className="bottom-nav md:hidden flex items-center justify-around">
                {navItems.map(item => {
                    const active = pathname === item.href || pathname?.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all"
                            style={{ color: active ? '#5C3A21' : '#666666' }}
                        >
                            <item.icon />
                            <span className="text-[10px] font-semibold">{item.label}</span>
                        </Link>
                    );
                })}
                <Link
                    href="/profile"
                    className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all"
                    style={{ color: pathname?.startsWith('/profile') ? '#5C3A21' : '#666666' }}
                >
                    <Icons.User />
                    <span className="text-[10px] font-semibold">Profile</span>
                </Link>
            </div>
        </>
    );
}

// ==============================
// AVATAR COMPONENT
// ==============================
export function Avatar({ name, url, size = 'md', isDeceased = false, className = '' }: {
    name: string; url?: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; isDeceased?: boolean; className?: string;
}) {
    const sizeMap: Record<string, string> = {
        xs: 'w-7 h-7 text-xs', sm: 'w-9 h-9 text-sm',
        md: 'w-12 h-12 text-base', lg: 'w-16 h-16 text-xl', xl: 'w-24 h-24 text-3xl',
    };
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className={`relative inline-flex flex-shrink-0 ${className}`}>
            <div
                className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold border-2`}
                style={isDeceased
                    ? { background: '#e5dac9', color: '#a98d4d', borderColor: '#C6A75E' }
                    : { background: '#5C3A21', color: '#F4EFE6', borderColor: 'rgba(92,58,33,0.15)' }}
            >
                {url ? <img src={url} alt={name} className="w-full h-full rounded-full object-cover" /> : initials}
            </div>
            {isDeceased && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: '#fcfbfa', border: '1px solid #C6A75E' }}>
                    <span className="text-[10px]">🕊️</span>
                </div>
            )}
        </div>
    );
}

// ==============================
// PRIVACY BADGE
// ==============================
export function PrivacyBadge({ privacy }: { privacy: 'public' | 'private' | 'unlisted' }) {
    const config = {
        public: { label: 'Public', icon: Icons.Globe, className: 'privacy-public' },
        private: { label: 'Private', icon: Icons.Lock, className: 'privacy-private' },
        unlisted: { label: 'Unlisted', icon: Icons.Eye, className: 'privacy-unlisted' },
    };
    const c = config[privacy];
    return (
        <span className={`privacy-indicator ${c.className}`}>
            <c.icon /> {c.label}
        </span>
    );
}

// ==============================
// EMPTY STATE
// ==============================
export function EmptyState({ icon, title, description, action }: {
    icon?: React.ReactNode; title: string; description: string; action?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
            {icon && <div className="mb-4" style={{ color: '#c4a070' }}>{icon}</div>}
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#3b3b3b' }}>{title}</h3>
            <p className="text-sm max-w-sm mb-6" style={{ color: '#666666' }}>{description}</p>
            {action}
        </div>
    );
}

// ==============================
// MODAL
// ==============================
export function Modal({ isOpen, onClose, title, children }: {
    isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(92,58,33,0.1)' }}>
                    <h2 className="text-lg font-bold" style={{ color: '#1F1F1F' }}>{title}</h2>
                    <button onClick={onClose} className="btn-icon"><Icons.X /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

// ==============================
// TABS COMPONENT
// ==============================
export function Tabs({ tabs, activeTab, onChange }: {
    tabs: { id: string; label: string; count?: number }[];
    activeTab: string;
    onChange: (id: string) => void;
}) {
    return (
        <div className="flex gap-0 overflow-x-auto" style={{ borderBottom: '2px solid rgba(92,58,33,0.1)' }}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
                            style={{ background: 'rgba(92,58,33,0.1)', color: '#5C3A21' }}>
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}
