import { AspectRatio } from '@/components/ui/aspect-ratio'
import { ChevronLeft, ChevronRight, ImagePlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AssetType } from '@/lib/bindings'
import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { useSquareImage } from './hook'
import { DisplayPanel } from './DisplayPanel'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
  assetType: AssetType
  className?: string
  selectable?: boolean
  filename?: string
  setFilename?: (filename: string | null) => void
  imageUrls?: string[]
  urlImageIndex?: number
  setUrlImageIndex?: (index: number) => void
}

export const SquareImage = memo(function SquareImage({
  assetType,
  className,
  selectable = false,
  filename,
  setFilename,
  imageUrls = [],
  urlImageIndex = 0,
  setUrlImageIndex = () => {},
}: Props) {
  const { selectImage, loading, resolveNextUrl, resolvePreviousUrl } =
    useSquareImage({
      setFilename,
      imageUrls,
      urlImageIndex,
      setUrlImageIndex,
    })

  return (
    <div>
      <AspectRatio
        ratio={1}
        className={cn(
          'w-full h-full flex items-center rounded-lg overflow-hidden select-none',
          className,
        )}
      >
        {!loading && (
          <DisplayPanel
            assetType={assetType}
            filename={filename}
            onError={() => {
              setFilename?.(null)
            }}
          />
        )}
        {loading && <Skeleton className="w-full h-full" />}
        {selectable && (
          <div
            className="absolute top-0 left-0 h-full w-full rounded-lg flex justify-center items-center opacity-0 bg-black text-white transition-all cursor-pointer hover:opacity-35 dark:hover:opacity-50"
            onClick={selectImage}
          >
            <ImagePlus size={50} />
          </div>
        )}
      </AspectRatio>
      {selectable && (
        <div className="w-32 flex justify-between mx-auto mt-2">
          <Button
            variant="outline"
            className="h-8 w-4"
            type="button"
            disabled={imageUrls.length <= 0 || urlImageIndex <= 0}
            onClick={resolvePreviousUrl}
          >
            <ChevronLeft size={16} />
          </Button>
          <p className="text-muted-foreground flex items-center">
            {imageUrls.length > 0 &&
              urlImageIndex >= 0 &&
              `${urlImageIndex + 1}/${imageUrls.length}`}
            {(imageUrls.length <= 0 || urlImageIndex < 0) && `---`}
          </p>
          <Button
            variant="outline"
            className="h-8 w-4"
            type="button"
            disabled={
              imageUrls.length <= 0 || urlImageIndex === imageUrls.length - 1
            }
            onClick={resolveNextUrl}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  )
})
