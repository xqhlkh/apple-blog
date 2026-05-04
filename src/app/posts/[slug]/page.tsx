import { getDb, Post } from '@/lib/db';
import { notFound } from 'next/navigation';
import MarkdownIt from 'markdown-it';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export default function PostPage({ params }: { params: { slug: string } }) {
  const db = getDb();
  const post = db
    .prepare('SELECT * FROM posts WHERE slug = ? AND published = 1')
    .get(params.slug) as Post | undefined;

  if (!post) {
    notFound();
  }

  const tags: string[] = post.tags ? post.tags.split(',').filter(Boolean) : [];
  const htmlContent = md.render(post.content || '');

  return (
    <article className="py-12 sm:py-20 px-5 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-apple-secondary hover:text-apple-text transition-colors mb-8"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-px">
            <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          返回首页
        </Link>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="mb-10 overflow-hidden rounded-apple">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full object-cover max-h-[480px]"
            />
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.map((tag: string) => (
              <span key={tag} className="tag">{tag.trim()}</span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-[36px] sm:text-[48px] font-semibold tracking-[-0.03em] leading-[1.1] text-apple-text text-balance mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-apple-secondary mb-12 pb-8 border-b border-black/5">
          <time dateTime={post.created_at}>
            {formatDate(post.created_at)}
          </time>
          {post.excerpt && (
            <>
              <span className="text-black/20">|</span>
              <span>{post.excerpt}</span>
            </>
          )}
        </div>

        {/* Content */}
        <div
          className="prose-apple"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </article>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
