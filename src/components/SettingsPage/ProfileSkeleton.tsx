import { Skeleton } from '@/components/ui/skeleton'

const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:grid-cols-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-18 w-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 md:grid-cols-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-full" />
          </div>

          <div className="flex flex-col gap-2 md:grid-cols-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 md:grid-cols-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-full" />
          </div>

          <div className="flex flex-col gap-2 md:grid-cols-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>

        <div className="flex flex-col gap-2 md:grid-cols-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-full" />
        </div>

        <div className="flex flex-col gap-2 md:grid-cols-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-full" />
        </div>

        <div className="mt-4 flex justify-end">
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  )
}

export default ProfileSkeleton
