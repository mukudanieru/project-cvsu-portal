import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'

const EncodeLoadingState = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia className="size-14" variant="icon">
            <Spinner className="size-8" />
          </EmptyMedia>
          <EmptyTitle>Loading your subjects</EmptyTitle>
          <EmptyDescription>
            Fetching your enrolled terms and grade status
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

export default EncodeLoadingState
