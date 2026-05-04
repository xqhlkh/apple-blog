'use client';

import PostEditor from '@/components/PostEditor';
import type { Post } from '@/lib/db';

export default function PostEditorClient({ post }: { post: Post }) {
  return <PostEditor post={post} />;
}
