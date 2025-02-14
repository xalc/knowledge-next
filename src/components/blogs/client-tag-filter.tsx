"use client";

import { useState, useMemo } from "react";
import { TagFilter } from "./tag-filter";
import BlogItem from "./blog-item";
import { Blog } from "@/types/blogs";
import { TagMerger } from "@/lib/utils/tag-merger";

interface ClientTagFilterProps {
  initialPosts: Blog[];
  tags: { tag: string; count: number }[];
}

export default function ClientTagFilter({ initialPosts, tags }: ClientTagFilterProps) {
  // 使用 TagMerger 合并相似标签
  const mergedTags = useMemo(() => {
    return TagMerger.mergeSimilarTags(tags);
  }, [tags]);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = selectedTag
    ? initialPosts.filter(post => {
        // 使用标准化的标签名进行匹配
        const normalizedSelectedTag = TagMerger.getNormalizedTagName(selectedTag);
        return post.metadata?.tags?.some(
          tag => TagMerger.getNormalizedTagName(tag) === normalizedSelectedTag,
        );
      })
    : initialPosts;

  return (
    <>
      <TagFilter tags={mergedTags} selectedTag={selectedTag} onTagSelect={setSelectedTag} />

      <section className="container mx-auto p-4">
        <div className="space-y-12">
          <div className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3 [&>*]:break-inside-avoid-column">
            {filteredPosts.map(post => (
              <BlogItem
                key={post.slug}
                blog={post}
                className="duration-1000 animate-in fade-in slide-in-from-bottom-6"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
