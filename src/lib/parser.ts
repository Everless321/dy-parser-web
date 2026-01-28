import { getAwemeId, fetchFromSharePage } from 'dy-downloader'

export interface ParsedResult {
  awemeId: string
  desc: string
  createTime: number
  author: {
    uid: string
    secUid: string
    nickname: string
    avatarThumb?: string
  }
  statistics: {
    diggCount: number
    commentCount: number
    shareCount: number
    collectCount: number
  }
  video?: {
    duration: number
    playAddr: string[]
    cover: string[]
  }
  images?: Array<{
    urlList: string[]
  }>
  music?: {
    id: string
    title: string
    author: string
    playUrl?: string
  }
  downloads: Array<{
    type: 'video' | 'image'
    url: string
  }>
}

const DOUYIN_URL_REGEX = /https?:\/\/(v\.douyin\.com|www\.douyin\.com|www\.iesdouyin\.com)\/[^\s]+/i

export function extractDouyinUrl(text: string): string | null {
  const match = text.match(DOUYIN_URL_REGEX)
  return match ? match[0] : null
}

export function isValidShareUrl(url: string): boolean {
  return DOUYIN_URL_REGEX.test(url.trim())
}

export async function parseDouyinUrl(input: string): Promise<ParsedResult> {
  // 从分享文本中提取链接
  let url = input.trim()
  if (!isValidShareUrl(url)) {
    const extracted = extractDouyinUrl(input)
    if (extracted) {
      url = extracted
    } else {
      throw new Error('未找到有效的抖音链接')
    }
  }

  const awemeId = await getAwemeId(url)
  if (!awemeId) {
    throw new Error('无法从链接中提取作品 ID')
  }

  const detail = await fetchFromSharePage(awemeId)
  if (!detail) {
    throw new Error('无法获取作品信息，可能是私密作品或已删除')
  }

  const result: ParsedResult = {
    awemeId: detail.awemeId,
    desc: detail.desc || '',
    createTime: detail.createTime || 0,
    author: {
      uid: detail.author?.uid || '',
      secUid: detail.author?.secUid || '',
      nickname: detail.author?.nickname || '',
      avatarThumb: detail.author?.avatarThumb,
    },
    statistics: {
      diggCount: detail.statistics?.diggCount || 0,
      commentCount: detail.statistics?.commentCount || 0,
      shareCount: detail.statistics?.shareCount || 0,
      collectCount: detail.statistics?.collectCount || 0,
    },
    downloads: [],
  }

  // 视频信息
  if (detail.video) {
    result.video = {
      duration: detail.video.duration || 0,
      playAddr: detail.video.playAddr || [],
      cover: detail.video.cover || [],
    }
  }

  // 图集信息
  if (detail.images && detail.images.length > 0) {
    result.images = detail.images.map((img) => ({
      urlList: img.urlList || [],
    }))
  }

  // 音乐信息
  if (detail.music) {
    result.music = {
      id: detail.music.id || '',
      title: detail.music.title || '',
      author: detail.music.author || '',
      playUrl: detail.music.playUrl,
    }
  }

  // 构建下载链接 - 直接使用原始 URL
  if (result.video?.playAddr?.length) {
    result.downloads.push({
      type: 'video',
      url: result.video.playAddr[0],
    })
  }

  if (result.images?.length) {
    result.images.forEach((img) => {
      const imageUrl = img.urlList?.[0]
      if (imageUrl) {
        result.downloads.push({
          type: 'image',
          url: imageUrl,
        })
      }
    })
  }

  return result
}
