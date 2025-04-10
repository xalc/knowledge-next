import TimelineCanvas from "@/components/threejs/timeline-canvas";
import { getTimelines } from "@/lib/timeline";
import { Suspense } from "react";

export default async function TimelinePage() {
  // 从数据库获取时间轴数据
  const timelineEvents = await getTimelines();

  return (
    <div className="flex h-[calc(100vh-100px)] w-full overflow-hidden">
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">加载时间轴数据中...</div>
        }
      >
        <TimelineCanvas timelineEvents={timelineEvents} />
      </Suspense>
    </div>
  );
}
