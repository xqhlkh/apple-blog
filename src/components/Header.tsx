'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === '/';
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  function cycleTheme() {
    const order: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % 3]);
  }

  const themeIcon = theme === 'dark' ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
  ) : theme === 'light' ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="3" /><line x1="12" y1="1" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="1" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="23" y2="12" /></svg>
  );

  const themeLabel = theme === 'dark' ? '深色' : theme === 'light' ? '浅色' : '自动';

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${
        transparent
          ? 'bg-black/20 border-b border-white/10'
          : 'bg-apple-bg/80 dark:bg-dark-bg/80 border-b border-black/5 dark:border-white/5'
      }`}
    >
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link
          href="/"
          className={`text-lg font-semibold tracking-tight transition-colors duration-200 ${
            transparent
              ? 'text-white hover:text-white/80'
              : 'text-apple-text dark:text-dark-text hover:text-apple-accent'
          }`}
        >
          MLZB Blog
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          <Link
            href="/"
            className={`btn-ghost text-xs transition-colors ${
              transparent ? 'text-white/90 hover:text-white hover:bg-white/15' : ''
            }`}
          >
            首页
          </Link>
          <Link
            href="/admin/login"
            className={`btn-ghost text-xs transition-colors ${
              transparent ? 'text-white/90 hover:text-white hover:bg-white/15' : ''
            }`}
          >
            管理
          </Link>
          <a
            href="/aichat"
            className={`btn-ghost text-xs transition-colors ${
              transparent ? 'text-white/90 hover:text-white hover:bg-white/15' : ''
            }`}
          >
            AI Chat
          </a>
          <a
            href="/yt/"
            className={`btn-ghost text-xs transition-colors ${
              transparent ? 'text-white/90 hover:text-white hover:bg-white/15' : ''
            }`}
          >
            YT 视频
          </a>

          {/* 主题切换按钮 */}
          <button
            onClick={cycleTheme}
            className={`btn-ghost text-xs !px-2 !py-1.5 transition-colors ${
              transparent ? 'text-white/90 hover:text-white hover:bg-white/15' : ''
            }`}
            title={`主题：${themeLabel}（点击切换）`}
          >
            {themeIcon}
          </button>
        </nav>

        {/* 移动端 — 汉堡菜单 + 主题 */}
        <div className="sm:hidden flex items-center gap-1">
          <button
            onClick={cycleTheme}
            className={`p-2 transition-colors ${
              transparent ? 'text-white/90 hover:text-white' : 'text-apple-secondary dark:text-dark-secondary hover:text-apple-text dark:hover:text-dark-text'
            }`}
            title={themeLabel}
          >
            {themeIcon}
          </button>
          <button
            className={`p-2 -mr-2 transition-colors ${
              transparent ? 'text-white/90 hover:text-white' : 'text-apple-secondary dark:text-dark-secondary hover:text-apple-text dark:hover:text-dark-text'
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
      </div>

      {menuOpen && (
        <div className={`sm:hidden border-t animate-fade-in ${
          transparent ? 'border-white/10 bg-black/30 backdrop-blur-xl' : 'border-black/5 dark:border-white/5 bg-white dark:bg-dark-card'
        }`}>
          <div className="max-w-5xl mx-auto px-5 py-4 flex flex-col gap-1">
            <Link href="/" className={`block px-4 py-3 rounded-apple-sm text-sm font-medium transition-colors ${transparent ? 'text-white hover:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5 text-apple-text dark:text-dark-text'}`} onClick={() => setMenuOpen(false)}>首页</Link>
            <Link href="/admin/login" className={`block px-4 py-3 rounded-apple-sm text-sm font-medium transition-colors ${transparent ? 'text-white hover:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5 text-apple-text dark:text-dark-text'}`} onClick={() => setMenuOpen(false)}>管理</Link>
            <a href="/aichat/" className={`block px-4 py-3 rounded-apple-sm text-sm font-medium transition-colors ${transparent ? 'text-white hover:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5 text-apple-text dark:text-dark-text'}`} onClick={() => setMenuOpen(false)}>YT 视频</a>
          </div>
        </div>
      )}
    </header>
  );
}
