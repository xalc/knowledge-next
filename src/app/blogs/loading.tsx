import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (

    <div className='flex flex-col items-center gap-8  '>
      <h1>Blogs</h1>
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  )
}