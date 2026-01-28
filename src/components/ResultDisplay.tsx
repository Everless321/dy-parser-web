'use client'

import { ParsedData } from '@/lib/types'
import { AuthorInfo } from './AuthorInfo'
import { MediaPreview } from './MediaPreview'
import { PostDetails } from './PostDetails'
import { DownloadActions } from './DownloadActions'

interface ResultDisplayProps {
  data: ParsedData
}

export function ResultDisplay({ data }: ResultDisplayProps) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg w-full flex flex-col gap-4 p-4
                    animate-fade-in">
      <AuthorInfo author={data.author} />
      <MediaPreview video={data.video} images={data.images} />
      <PostDetails
        desc={data.desc}
        createTime={data.createTime}
        statistics={data.statistics}
        music={data.music}
      />
      <DownloadActions downloads={data.downloads} />
    </div>
  )
}
