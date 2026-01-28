'use client'

interface AuthorInfoProps {
  author: {
    uid: string
    secUid: string
    nickname: string
    avatarThumb?: string
  }
}

function proxyUrl(url: string): string {
  return `/api/download?mode=preview&type=image&url=${encodeURIComponent(url)}`
}

export function AuthorInfo({ author }: AuthorInfoProps) {
  return (
    <div className="flex items-center gap-3">
      {author.avatarThumb ? (
        <img
          src={proxyUrl(author.avatarThumb)}
          alt={author.nickname}
          className="w-12 h-12 rounded-full border-2 border-gray-600 object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-full border-2 border-gray-600 bg-gray-700
                        flex items-center justify-center text-gray-400">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      <div>
        <h2 className="font-bold text-lg text-white">{author.nickname}</h2>
        <p className="text-sm text-gray-400">UID: {author.uid}</p>
      </div>
    </div>
  )
}
