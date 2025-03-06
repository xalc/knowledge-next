"use client";

import TimelineCanvas from "@/components/threejs/timeline-canvas";

export default function TimelinePage() {
  return (
    <div className="flex h-[calc(100vh-100px)] w-full overflow-hidden">
      <TimelineCanvas />
    </div>
  );
}
