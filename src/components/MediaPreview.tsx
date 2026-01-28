'use client'

import { useState } from 'react'

interface MediaPreviewProps {
  video?: {
    duration: number
    playAddr: string[]
    cover: string[]
  }
  images?: Array<{
    urlList: string[]
  }>
}

function proxyUrl(url: string, type: 'video' | 'image'): string {
  return `/api/download?mode=preview&type=${type}&url=${encodeURIComponent(url)}`
}

export function MediaPreview({ video, images }: MediaPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (video && video.playAddr.length > 0) {
    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
        <video
          src={proxyUrl(video.playAddr[0], 'video')}
          poster={video.cover?.[0] ? proxyUrl(video.cover[0], 'image') : undefined}
          controls
          className="w-full h-full object-contain"
          playsInline
        />
      </div>
    )
  }

  if (images && images.length > 0) {
    const imageUrls = images
      .map((img) => img.urlList?.[0])
      .filter(Boolean) as string[]

    if (imageUrls.length === 0) return null

    return (
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-black">
        <img
          src={proxyUrl(imageUrls[currentIndex], 'image')}
          alt={`图片 ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />

        {imageUrls.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex((i) => (i - 1 + imageUrls.length) % imageUrls.length)
              }
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50
                         hover:bg-black/70 p-2 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex((i) => (i + 1) % imageUrls.length)}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50
                         hover:bg-black/70 p-2 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2
                            bg-black/50 px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {imageUrls.length}
            </div>
          </>
        )}
      </div>
    )
  }

  return null
}
