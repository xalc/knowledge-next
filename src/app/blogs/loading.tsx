import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col items-center space-y-4 mt-60">



      <Skeleton className="h-16 w-[400px]" />
      <Skeleton className="h-16 w-[400px]" />
      <Skeleton className="h-16 w-[400px]" />


    </div>
  )
}