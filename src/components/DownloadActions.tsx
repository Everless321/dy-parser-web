'use client'

interface DownloadActionsProps {
  downloads: Array<{
    type: 'video' | 'image'
    url: string
  }>
}

export function DownloadActions({ downloads }: DownloadActionsProps) {
  const videoDownloads = downloads.filter((d) => d.type === 'video')
  const imageDownloads = downloads.filter((d) => d.type === 'image')

  const download = (url: string, type: 'video' | 'image', filename?: string) => {
    const proxyUrl = `/api/download?type=${type}&url=${encodeURIComponent(url)}`
    const a = document.createElement('a')
    a.href = proxyUrl
    a.download = filename || `douyin_${Date.now()}.${type === 'video' ? 'mp4' : 'jpg'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const downloadAllImages = () => {
    imageDownloads.forEach((d, i) => {
      setTimeout(() => {
        download(d.url, 'image', `douyin_${Date.now()}_${i + 1}.jpg`)
      }, i * 500)
    })
  }

  return (
    <div className="border-t border-gray-700/50 pt-4 flex flex-col gap-3">
      {videoDownloads.length > 0 && (
        <button
          onClick={() => download(videoDownloads[0].url, 'video')}
          className="w-full bg-green-600 hover:bg-green-700 font-bold py-3 px-4
                     rounded-lg transition-all transform active:scale-95
                     flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          下载视频
        </button>
      )}

      {imageDownloads.length > 0 && (
        <>
          <button
            onClick={downloadAllImages}
            className="w-full bg-purple-600 hover:bg-purple-700 font-bold py-3 px-4
                       rounded-lg transition-all transform active:scale-95
                       flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            下载全部图片 ({imageDownloads.length} 张)
          </button>
          {imageDownloads.length > 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {imageDownloads.map((d, i) => (
                <button
                  key={i}
                  onClick={() => download(d.url, 'image', `douyin_${Date.now()}_${i + 1}.jpg`)}
                  className="bg-gray-700 hover:bg-gray-600 text-sm py-2 px-3
                             rounded-lg transition-colors"
                >
                  图片 {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
