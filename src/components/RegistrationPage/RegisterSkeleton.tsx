import { Skeleton } from '@/components/ui/skeleton'

const RegisterSkeleton = () => {
  return (
    <div className="relative z-10 flex w-full max-w-4xl min-h-dvh flex-col justify-center border-0 bg-card p-6 lg:min-h-fit lg:rounded-xl lg:border lg:p-10 lg:shadow-lg">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-16">
        <div className="flex flex-col gap-2 sm:max-w-xs w-full">
          <Skeleton className="h-10 w-full" />

          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="flex w-full flex-col gap-8 lg:w-2/3">
          <div>
            <div className="flex flex-col gap-5">
              {Array.from({ length: 2 }, (_, index) => (
                <div key={index} className="flex flex-col gap-2 md:grid-cols-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {Array.from({ length: 2 }, (_, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 md:grid-cols-2"
                  >
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterSkeleton
