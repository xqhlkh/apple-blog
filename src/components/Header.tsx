'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-apple-bg/80 backdrop-blur-xl border-b border-black/5">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-apple-text hover:text-apple-accent transition-colors duration-200"
        >
          My Blog
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link href="/" className="btn-ghost text-xs">
            首页
          </Link>
          <Link href="/admin/login" className="btn-ghost text-xs">
            管理
          </Link>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="sm:hidden p-2 -mr-2 text-apple-secondary hover:text-apple-text transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {menuOpen ? (
              <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M2.25 4.5H15.75M2.25 9H15.75M2.25 13.5H15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-black/5 bg-white animate-fade-in">
          <div className="max-w-5xl mx-auto px-5 py-4 flex flex-col gap-1">
            <Link href="/" className="block px-4 py-3 rounded-apple-sm hover:bg-black/5 text-sm font-medium transition-colors" onClick={() => setMenuOpen(false)}>
              首页
            </Link>
            <Link href="/admin/login" className="block px-4 py-3 rounded-apple-sm hover:bg-black/5 text-sm font-medium transition-colors" onClick={() => setMenuOpen(false)}>
              管理
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
