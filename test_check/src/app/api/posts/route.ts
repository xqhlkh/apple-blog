import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, slugExists, createPost } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET /api/posts — list all posts (admin only)
export async function GET(request: NextRequest) {
  const token = request.cookies.get('blog_admin_token')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const posts = getAllPosts();
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

    if (slugExists(slug)) {
      return NextResponse.json({ error: '该链接已被使用' }, { status: 409 });
    }

    const post = createPost({
      title,
      slug,
      content: content || '',
      excerpt: excerpt || '',
      cover_image: cover_image || '',
      tags: tags || '',
      published: published || 0,
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  }
}
