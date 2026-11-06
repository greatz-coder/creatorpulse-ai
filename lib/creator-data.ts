export type Platform = 'TikTok' | 'YouTube Shorts' | 'Instagram Reels' | 'Other';

export type PostEntry = {
  id: string;
  title: string;
  platform: Platform;
  postedAt: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
};

const STORAGE_KEY = 'creatorpulse.posts.v1';

export function readPosts(): PostEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is PostEntry =>
      item && typeof item.id === 'string' && typeof item.title === 'string' &&
      typeof item.platform === 'string' && typeof item.postedAt === 'string' &&
      ['views', 'likes', 'comments', 'shares', 'saves'].every((key) =>
        typeof item[key] === 'number' && Number.isFinite(item[key]) && item[key] >= 0,
      ),
    );
  } catch {
    return [];
  }
}

export function writePosts(posts: PostEntry[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function interactionRate(posts: PostEntry[]) {
  const views = posts.reduce((sum, post) => sum + post.views, 0);
  const interactions = posts.reduce(
    (sum, post) => sum + post.likes + post.comments + post.shares + post.saves,
    0,
  );
  return views ? (interactions / views) * 100 : 0;
}

export function formatCount(value: number) {
  return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}
