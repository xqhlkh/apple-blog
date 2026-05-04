import { NextRequest, NextResponse } from 'next/server';
import { getPostById, slugExists, updatePost, deletePost } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// PUT /api/posts/[id] — update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.cookies.get('blog_admin_token')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    const { title, slug, content, excerpt, cover_image, tags, published } = await request.json();
    const id = parseInt(params.id);

    if (!title || !slug) {
      return NextResponse.json({ error: '标题和链接不能为空' }, { status: 400 });
    }

    if (slugExists(slug, id)) {
      return NextResponse.json({ error: '该链接已被使用' }, { status: 409 });
    }

    const post = updatePost(id, {
      title,
      slug,
      content: content || '',
      excerpt: excerpt || '',
      cover_image: cover_image || '',
      tags: tags || '',
      published: published || 0,
    });

    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}

// DELETE /api/posts/[id] — delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.cookies.get('blog_admin_token')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    const success = deletePost(id);

    if (!success) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '删除失败' }, { status: 500 });
  }
}
