'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Post } from '@/lib/db';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/posts');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (!res.ok) throw new Error('获取文章失败');
      const data = await res.json();
      setPosts(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) return;

    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || '删除失败');
        return;
      }
      setPosts(posts.filter((p) => p.id !== id));
    } catch {
      alert('删除失败');
    }
  }

  async function handleTogglePublished(post: Post) {
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          cover_image: post.cover_image,
          tags: post.tags,
          published: post.published ? 0 : 1,
        }),
      });
      if (!res.ok) throw new Error('更新失败');
      setPosts(posts.map((p) =>
        p.id === post.id ? { ...p, published: post.published ? 0 : 1 } : p
      ));
    } catch {
      alert('更新失败');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-apple-text">文章管理</h1>
          <p className="mt-1 text-sm text-apple-secondary">
            共 {posts.length} 篇文章
          </p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">
          写新文章
        </Link>
      </div>

      {/* Loading & Error */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block w-6 h-6 border-2 border-apple-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="card p-8 text-center text-red-500 text-sm">{error}</div>
      )}

      {/* Posts List */}
      {!loading && !error && posts.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-apple-secondary text-sm mb-4">还没有文章</p>
          <Link href="/admin/posts/new" className="btn-primary inline-flex">
            写第一篇文章
          </Link>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="card p-5 flex items-center gap-4 group">
              {/* Cover thumbnail */}
              {post.cover_image ? (
                <img
                  src={post.cover_image}
                  alt=""
                  className="w-14 h-14 rounded-apple-sm object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-apple-sm bg-apple-bg flex-shrink-0 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-apple-secondary">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-apple-text truncate">
                  {post.title || '无标题'}
                </h3>
                <p className="text-xs text-apple-secondary mt-0.5">
                  {post.slug} &middot; {formatDate(post.created_at)}
                </p>
              </div>

              {/* Status */}
              <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                post.published
                  ? 'bg-green-50 text-green-600'
                  : 'bg-amber-50 text-amber-600'
              }`}>
                {post.published ? '已发布' : '草稿'}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleTogglePublished(post)}
                  className="btn-ghost text-xs !px-3 !py-1.5"
                  title={post.published ? '撤回' : '发布'}
                >
                  {post.published ? '撤回' : '发布'}
                </button>
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="btn-ghost text-xs !px-3 !py-1.5"
                >
                  编辑
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="btn-ghost text-xs !px-3 !py-1.5 !text-red-500 hover:!bg-red-50"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
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
