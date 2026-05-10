import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure directories
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  tags: string;
  published: number; // 0 or 1
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

// ---- JSON Helpers ----
function readJSON<T>(filePath: string, fallback: T): T {
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch { /* corrupt file, use fallback */ }
  }
  return fallback;
}

function writeJSON<T>(filePath: string, data: T): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function now(): string {
  return new Date().toISOString();
}

// ---- Post Operations ----
export function getPublishedPosts(): Post[] {
  return readJSON<Post[]>(POSTS_FILE, [])
    .filter((p) => p.published === 1)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getAllPosts(): Post[] {
  return readJSON<Post[]>(POSTS_FILE, [])
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export function getPostById(id: number): Post | undefined {
  return readJSON<Post[]>(POSTS_FILE, []).find((p) => p.id === id);
}

export function getPublishedPostBySlug(slug: string): Post | undefined {
  return readJSON<Post[]>(POSTS_FILE, []).find((p) => p.slug === slug && p.published === 1);
}

function getNextPostId(posts: Post[]): number {
  return posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1;
}

export function slugExists(slug: string, excludeId?: number): boolean {
  return readJSON<Post[]>(POSTS_FILE, []).some((p) => p.slug === slug && p.id !== excludeId);
}

export function createPost(data: {
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  cover_image?: string;
  tags?: string;
  published?: number;
}): Post {
  const posts = readJSON<Post[]>(POSTS_FILE, []);
  const id = getNextPostId(posts);
  const post: Post = {
    id,
    title: data.title,
    slug: data.slug,
    content: data.content || '',
    excerpt: data.excerpt || '',
    cover_image: data.cover_image || '',
    tags: data.tags || '',
    published: data.published || 0,
    created_at: now(),
    updated_at: now(),
  };
  posts.push(post);
  writeJSON(POSTS_FILE, posts);
  return post;
}

export function updatePost(
  id: number,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    cover_image?: string;
    tags?: string;
    published?: number;
  }
): Post | null {
  const posts = readJSON<Post[]>(POSTS_FILE, []);
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  posts[idx] = {
    ...posts[idx],
    ...data,
    updated_at: now(),
  };
  writeJSON(POSTS_FILE, posts);
  return posts[idx];
}

export function deletePost(id: number): boolean {
  const posts = readJSON<Post[]>(POSTS_FILE, []);
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  posts.splice(idx, 1);
  writeJSON(POSTS_FILE, posts);
  return true;
}

// ---- User Operations ----
export function getUserByUsername(username: string): User | undefined {
  return readJSON<User[]>(USERS_FILE, []).find((u) => u.username === username);
}

export function createUser(username: string, passwordHash: string): User {
  const users = readJSON<User[]>(USERS_FILE, []);
  const id = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const user: User = {
    id,
    username,
    password_hash: passwordHash,
    created_at: now(),
  };
  users.push(user);
  writeJSON(USERS_FILE, users);
  return user;
}
