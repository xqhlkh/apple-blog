'use client';

import { useState, useMemo } from 'react';
import PostCard from '@/components/PostCard';
import SearchBar from '@/components/SearchBar';
import type { Post } from '@/lib/db';

// 风景背景图
const LANDSCAPES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80',
  'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1600&q=80',
];

export default function HomeClient({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState('');

  // 随机选一张风景图（组件挂载时确定，不会随状态变化）
  const [bgImage] = useState(() => LANDSCAPES[Math.floor(Math.random() * LANDSCAPES.length)]);

  const filtered = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        (p.tags && p.tags.toLowerCase().includes(q))
    );
  }, [posts, query]);

  return (
    <div>
      {/* Hero — 风景背景 */}
      <section
        className="relative flex flex-col items-center justify-center min-h-[70vh] sm:min-h-[80vh] overflow-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/65" />

        <div className="relative z-10 max-w-3xl mx-auto text-center px-6 pt-20 pb-12">
          <h1 className="text-[48px] sm:text-[72px] font-semibold tracking-[-0.03em] leading-[1.05] text-white drop-shadow-lg animate-fade-up">
            Thoughts &amp; Stories
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/80 font-medium animate-fade-up animate-delay-100 text-balance drop-shadow">
            一个简洁的博客，记录值得分享的想法与故事。
          </p>
        </div>

        {/* 搜索栏 — 放在 hero 底部 */}
        <div className="relative z-10 w-full max-w-xl px-6 pb-10 animate-fade-up animate-delay-200">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="搜索文章..."
          />
        </div>

        {/* 底部渐变过渡 */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-apple-bg dark:to-dark-bg" />
      </section>

      {/* 文章列表 */}
      <section className="pb-24 px-5 -mt-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* 搜索结果提示 */}
          {query.trim() && (
            <p className="text-sm text-apple-secondary dark:text-dark-secondary mb-6 text-center">
              找到 {filtered.length} 篇与「{query}」相关的文章
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-dark-card shadow-apple dark:shadow-dark-card mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-apple-secondary dark:text-dark-secondary">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <p className="text-apple-secondary dark:text-dark-secondary text-sm">
                {query.trim() ? '没有找到相关文章' : '还没有文章。去后台发布你的第一篇文章吧。'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filtered.map((post, i) => (
                <div
                  key={post.id}
                  className="opacity-0 animate-fade-up"
                  style={{ animationDelay: `${0.1 + i * 0.06}s`, animationFillMode: 'forwards' }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
