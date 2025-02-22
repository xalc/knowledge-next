interface Tag {
  tag: string;
  count: number;
}

export class TagMerger {
  // 预定义的同义标签映射
  private static synonyms = {
    React: ["React", "react.js", "reactjs"],
    Nextjs: ["next.js", "next", "nextjs"],
    Frontend: ["前端", "front-end", "frontend"],
    AI: ["AI", "artificial intelligence", "人工智能"],
    Thoughts: ["思考", "感悟", "thinking"],
    Life: ["生活", "lifestyle", "日常"],
  };

  // 合并相似标签
  static mergeSimilarTags(tags: Tag[]): Tag[] {
    const mergedTags = new Map<string, number>();

    tags.forEach(tag => {
      // 1. 检查预定义同义词
      const normalizedName = this.getNormalizedTagName(tag.tag);

      // 2. 如果已存在，累加计数
      if (mergedTags.has(normalizedName)) {
        mergedTags.set(normalizedName, mergedTags.get(normalizedName)! + tag.count);
      } else {
        mergedTags.set(normalizedName, tag.count);
      }
    });

    // 转换回数组格式
    return Array.from(mergedTags.entries()).map(([tag, count]) => ({
      tag,
      count,
    }));
  }

  // 获取标准化的标签名
  static getNormalizedTagName(tagName: string): string {
    // 检查是否在同义词表中
    for (const [primary, alternatives] of Object.entries(this.synonyms)) {
      if (alternatives.includes(tagName.toLowerCase()) || alternatives.includes(tagName)) {
        return primary;
      }
    }

    // 如果不在预定义同义词中，返回原标签
    return tagName;
  }
}
