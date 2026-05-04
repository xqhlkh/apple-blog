import { NextRequest, NextResponse } from 'next/server';
import { getDb, Post } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET /api/posts — list all posts (admin only, including unpublished)
export async function GET(request: NextRequest) {
  const token = request.cookies.get('blog_admin_token')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const db = getDb();
  const posts = db
    .prepare('SELECT * FROM posts ORDER BY updated_at DESC')
    .all() as Post[];

  return NextResponse.json(posts);
}

// POST /api/posts — create a new post
export async function POST(request: NextRequest) {
  const token = request.cookies.get('blog_admin_token')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    const { title, slug, content, excerpt, cover_image, tags, published } = await request.json();

    if (!title || !slug) {
      return NextResponse.json({ error: '标题和链接不能为空' }, { status: 400 });
    }

    const db = getDb();

    // Check slug uniqueness
    const existing = db.prepare('SELECT id FROM posts WHERE slug = ?').get(slug);
    if (existing) {
      return NextResponse.json({ error: '该链接已被使用' }, { status: 409 });
    }

    const result = db
      .prepare(
        `INSERT INTO posts (title, slug, content, excerpt, cover_image, tags, published)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(title, slug, content || '', excerpt || '', cover_image || '', tags || '', published ? 1 : 0);

    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid) as Post;

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  }
}
