import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';
export async function POST(request: NextRequest) {
  const token = request.cookies.get('blog_admin_token')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ error: '未选择文件' }, { status: 400 });

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '仅支持 JPG、PNG、GIF、WebP、SVG 格式' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: '文件大小不能超过 10MB' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const filename = `${uniqueId}.${ext}`;
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename);

    const bytes = await file.arrayBuffer();
    await writeFile(uploadPath, Buffer.from(bytes));

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url, filename });
  } catch (e) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
}
