"use client";

import { useState } from "react";
import { TagFilter } from "./tag-filter";
import BlogItem from "./blog-item";
import { Blog } from "@/types/blogs";

interface ClientTagFilterProps {
  initialPosts: Blog[];
  tags: { tag: string; count: number }[];
}

export default function ClientTagFilter({ initialPosts, tags }: ClientTagFilterProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = selectedTag
    ? initialPosts.filter(post => post.metadata?.tags?.includes(selectedTag))
    : initialPosts;

  return (
    <>
      <TagFilter tags={tags} selectedTag={selectedTag} onTagSelect={setSelectedTag} />

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
