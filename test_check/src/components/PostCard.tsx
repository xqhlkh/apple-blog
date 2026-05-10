import Link from 'next/link';
import type { Post } from '@/lib/db';

export default function PostCard({ post }: { post: Post }) {
  const tags: string[] = post.tags ? post.tags.split(',').filter(Boolean) : [];

  return (
    <Link href={`/posts/${post.slug}`} className="card block group">
      {post.cover_image && (
        <div className="overflow-hidden rounded-t-apple">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-56 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6 sm:p-8">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag: string) => (
              <span key={tag} className="tag">{tag.trim()}</span>
            ))}
          </div>
        )}
        <h2 className="text-xl sm:text-2xl font-semibold tracking-[-0.01em] text-apple-text dark:text-dark-text mb-2 group-hover:text-apple-accent transition-colors duration-200 text-balance">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-sm text-apple-secondary dark:text-dark-secondary leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <p className="mt-4 text-xs text-apple-secondary dark:text-dark-secondary">
          {new Date(post.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </Link>
  );
}
