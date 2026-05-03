'use client';

import { useState, FormEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Post } from '@/lib/db';

interface Props {
  post?: Post;
}

export default function PostEditor({ post }: Props) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [coverImage, setCoverImage] = useState(post?.cover_image || '');
  const [tags, setTags] = useState(post?.tags || '');
  const [published, setPublished] = useState(post ? !!post.published : false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleTitleChange = useCallback((val: string) => {
    setTitle(val);
    if (!isEdit || !slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, '-').replace(/^-|-$/g, '').replace(/-+/g, '-').slice(0, 80));
    }
  }, [isEdit, slug]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) { const data = await res.json(); alert(data.error || '上传失败'); setUploading(false); return; }
      const data = await res.json();
      setContent((prev) => prev + `\n![${file.name}](${data.url})\n`);
    } catch { alert('上传失败'); }
    finally { setUploading(false); e.target.value = ''; }
  }, []);

  const handleCoverUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) { const data = await res.json(); alert(data.error || '上传失败'); setUploading(false); return; }
      const data = await res.json();
      setCoverImage(data.url);
    } catch { alert('上传失败'); }
    finally { setUploading(false); e.target.value = ''; }
  }, []);

  async function handleSave(e: FormEvent, saveAsPublished: boolean) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const url = isEdit ? `/api/posts/${post!.id}` : '/api/posts';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, content, excerpt, cover_image: coverImage, tags, published: saveAsPublished ? 1 : 0 }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || '保存失败'); return; }
      router.push('/admin/dashboard');
    } catch { setError('保存失败'); }
    finally { setSaving(false); }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-apple-text">{isEdit ? '编辑文章' : '写新文章'}</h1>
        <div className="flex items-center gap-3">
          <button type="button" onClick={(e) => handleSave(e, false)} disabled={saving} className="btn-secondary text-xs !px-5 !py-2">{saving ? '保存中...' : '存为草稿'}</button>
          <button type="button" onClick={(e) => handleSave(e, true)} disabled={saving} className="btn-primary text-xs !px-5 !py-2">{saving ? '发布中...' : '发布'}</button>
        </div>
      </div>

      {error && <div className="mb-6 text-sm text-red-500 bg-red-50 px-4 py-3 rounded-apple-sm">{error}</div>}

      <form className="space-y-6 card p-6 sm:p-8">
        <div>
          <label className="block text-xs font-medium text-apple-secondary mb-2">标题</label>
          <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} className="input-apple text-lg font-semibold" placeholder="输入文章标题..." required />
        </div>
        <div>
          <label className="block text-xs font-medium text-apple-secondary mb-2">链接</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="input-apple font-mono text-sm" placeholder="article-slug" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-apple-secondary mb-2">摘要</label>
          <input type="text" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="input-apple" placeholder="简短描述这篇文章..." />
        </div>
        <div>
          <label className="block text-xs font-medium text-apple-secondary mb-2">封面图片</label>
          <div className="flex items-center gap-3">
            <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="input-apple flex-1 font-mono text-sm" placeholder="/uploads/example.jpg 或 https://..." />
            <label className={`btn-secondary text-xs !px-4 !py-2.5 cursor-pointer flex-shrink-0 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {uploading ? '上传中...' : '上传'}
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
          {coverImage && <img src={coverImage} alt="Cover preview" className="mt-3 w-full h-40 object-cover rounded-apple-sm" />}
        </div>
        <div>
          <label className="block text-xs font-medium text-apple-secondary mb-2">标签（用逗号分隔）</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="input-apple" placeholder="技术, 生活, 设计" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-apple-secondary">正文（支持 Markdown）</label>
            <label className="text-xs text-apple-accent hover:text-apple-accent-hover cursor-pointer font-medium flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              {uploading ? '上传中...' : '插入图片'}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className="input-apple font-mono text-sm min-h-[400px] resize-y" placeholder="开始写作... 支持 Markdown 语法" />
        </div>
      </form>

      <div className="mt-8 flex items-center justify-between">
        <button type="button" onClick={() => router.push('/admin/dashboard')} className="btn-ghost text-xs">取消</button>
        <div className="flex items-center gap-3">
          <button type="button" onClick={(e) => handleSave(e, false)} disabled={saving} className="btn-secondary text-xs">保存草稿</button>
          <button type="button" onClick={(e) => handleSave(e, true)} disabled={saving} className="btn-primary text-xs">发布文章</button>
        </div>
      </div>
    </div>
  );
}
