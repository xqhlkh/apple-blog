import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername } from '@/lib/db';
import { verifyPassword, signToken, createSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: '请输入用户名和密码' }, { status: 400 });
    }

    const user = getUserByUsername(username);

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }

    const token = signToken({ userId: user.id, username: user.username });
    const response = NextResponse.json({ success: true, username: user.username });
    response.headers.set('Set-Cookie', createSessionCookie(token));

    return response;
  } catch {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
