export type Meta = {
  tags: string[];
  author: string;
};
export type BlogStats = {
  likes: number;
  views: number;
};
export type Blog = {
  title: string;
  description: string;
  slug: string;
  metadata: Meta;
  stats: BlogStats;
  createdAt: Date;
  updatedAt: Date;
  cover?: string;
};
