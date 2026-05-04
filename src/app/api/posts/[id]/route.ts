import { NextRequest, NextResponse } from 'next/server';
import { getDb, Post } from '@/lib/db';
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

    const db = getDb();

    // Check slug uniqueness (excluding current post)
    const existing = db.prepare('SELECT id FROM posts WHERE slug = ? AND id != ?').get(slug, id);
    if (existing) {
      return NextResponse.json({ error: '该链接已被使用' }, { status: 409 });
    }

    db.prepare(
      `UPDATE posts SET title = ?, slug = ?, content = ?, excerpt = ?,
       cover_image = ?, tags = ?, published = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).run(title, slug, content || '', excerpt || '', cover_image || '', tags || '', published ? 1 : 0, id);

    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post;
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
    const db = getDb();
    const id = parseInt(params.id);

    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post;
    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    db.prepare('DELETE FROM posts WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '删除失败' }, { status: 500 });
  }
}
