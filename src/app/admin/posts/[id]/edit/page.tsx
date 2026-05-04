import { getDb, Post } from '@/lib/db';
import { notFound } from 'next/navigation';
import PostEditorClient from './PostEditorClient';

export const dynamic = 'force-dynamic';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const db = getDb();
  const post = db
    .prepare('SELECT * FROM posts WHERE id = ?')
    .get(parseInt(params.id)) as Post | undefined;

  if (!post) {
    notFound();
  }

  return <PostEditorClient post={post} />;
}
