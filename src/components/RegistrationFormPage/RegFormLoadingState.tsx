import { A4_WIDTH_PX, A4_HEIGHT_PX, PAGE_PADDING_PX } from './layout-constants'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'

const RegFormLoadingState = () => {
  return (
    <div
      className="bg-white shadow-sm mx-auto flex justify-center items-center"
      style={{
        width: A4_WIDTH_PX,
        minHeight: A4_HEIGHT_PX,
        padding: PAGE_PADDING_PX,
        boxSizing: 'border-box',
      }}
    >
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia className="size-14" variant="icon">
            <Spinner className="size-8" />
          </EmptyMedia>
          <EmptyTitle className="text-black">
            Loading your registration form
          </EmptyTitle>
          <EmptyDescription className="text-black">
            This usually takes a few seconds
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

export default RegFormLoadingState
