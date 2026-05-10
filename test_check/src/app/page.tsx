import { getPublishedPosts } from '@/lib/db';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const posts = getPublishedPosts();

  // 序列化给客户端组件
  const plainPosts = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    content: p.content,
    excerpt: p.excerpt,
    cover_image: p.cover_image,
    tags: p.tags,
    published: p.published,
    created_at: p.created_at,
    updated_at: p.updated_at,
  }));

  return <HomeClient posts={plainPosts} />;
}
