import { getPostById } from '@/lib/db';
import { notFound } from 'next/navigation';
import PostEditorClient from './PostEditorClient';

export const dynamic = 'force-dynamic';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const post = getPostById(parseInt(params.id));

  if (!post) notFound();

  return <PostEditorClient post={post} />;
}
