import { getDb, Post } from '@/lib/db';
import PostCard from '@/components/PostCard';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const db = getDb();
  const posts = db
    .prepare('SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC')
    .all() as Post[];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-[44px] sm:text-[64px] font-semibold tracking-[-0.03em] leading-[1.05] text-apple-text animate-fade-up">
            Thoughts &amp; Stories
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-apple-secondary font-medium animate-fade-up animate-delay-100 text-balance">
            一个简洁的博客，记录值得分享的想法与故事。
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="pb-24 px-5">
        <div className="max-w-4xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/5 mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-apple-secondary">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <p className="text-apple-secondary text-sm">还没有文章。去后台发布你的第一篇文章吧。</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map((post, i) => (
                <div
                  key={post.id}
                  className="opacity-0 animate-fade-up"
                  style={{ animationDelay: `${0.1 + i * 0.08}s`, animationFillMode: 'forwards' }}
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
