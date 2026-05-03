'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 首页且未滚动时，使用透明风格
  const transparent = isHome && !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${
        transparent
          ? 'bg-transparent border-b border-white/10'
          : 'bg-apple-bg/80 border-b border-black/5'
      }`}
    >
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link
          href="/"
          className={`text-lg font-semibold tracking-tight transition-colors duration-200 ${
            transparent
              ? 'text-white hover:text-white/80'
              : 'text-apple-text hover:text-apple-accent'
          }`}
        >
          MLZB Blog
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          <Link
            href="/"
            className={`btn-ghost text-xs transition-colors ${
              transparent ? 'text-white/80 hover:text-white hover:bg-white/10' : ''
            }`}
          >
            首页
          </Link>
          <Link
            href="/admin/login"
            className={`btn-ghost text-xs transition-colors ${
              transparent ? 'text-white/80 hover:text-white hover:bg-white/10' : ''
            }`}
          >
            管理
          </Link>
        </nav>

        <button
          className={`sm:hidden p-2 -mr-2 transition-colors ${
            transparent ? 'text-white/80 hover:text-white' : 'text-apple-secondary hover:text-apple-text'
          }`}
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

      {menuOpen && (
        <div className={`sm:hidden border-t animate-fade-in ${
          transparent ? 'border-white/10 bg-black/20 backdrop-blur-xl' : 'border-black/5 bg-white'
        }`}>
          <div className="max-w-5xl mx-auto px-5 py-4 flex flex-col gap-1">
            <Link
              href="/"
              className={`block px-4 py-3 rounded-apple-sm text-sm font-medium transition-colors ${
                transparent ? 'text-white hover:bg-white/10' : 'hover:bg-black/5'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              首页
            </Link>
            <Link
              href="/admin/login"
              className={`block px-4 py-3 rounded-apple-sm text-sm font-medium transition-colors ${
                transparent ? 'text-white hover:bg-white/10' : 'hover:bg-black/5'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              管理
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
