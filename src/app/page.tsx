import { getPublishedPosts } from '@/lib/db';
import PostCard from '@/components/PostCard';

export const dynamic = 'force-dynamic';

// 风景背景图 — 每次刷新随机选一张（来自 Unsplash，免费使用）
const LANDSCAPES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80', // 山峦日出
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600&q=80', // 秋日山谷
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80', // 森林小径
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80', // 林间光影
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80', // 湖边远山
  'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1600&q=80', // 海岸悬崖
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80', // 雪山星空
];

function getRandomLandscape(): string {
  return LANDSCAPES[Math.floor(Math.random() * LANDSCAPES.length)];
}

export default function HomePage() {
  const posts = getPublishedPosts();
  const bgImage = getRandomLandscape();

  return (
    <div>
      {/* Hero — 风景背景 */}
      <section
        className="relative flex items-center justify-center min-h-[70vh] sm:min-h-[80vh] overflow-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* 暗色遮罩，让白色文字可读 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

        <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-20">
          <h1 className="text-[48px] sm:text-[72px] font-semibold tracking-[-0.03em] leading-[1.05] text-white drop-shadow-lg animate-fade-up">
            Thoughts &amp; Stories
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/80 font-medium animate-fade-up animate-delay-100 text-balance drop-shadow">
            一个简洁的博客，记录值得分享的想法与故事。
          </p>
        </div>

        {/* 底部渐变过渡到文章列表 */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-apple-bg" />
      </section>

      {/* 文章列表 */}
      <section className="pb-24 px-5 -mt-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-apple mb-6">
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
