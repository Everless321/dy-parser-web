import { getAwemeId } from 'dy-downloader'

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
const MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'

export function extractDouyinUrl(text: string): string | null {
  const match = text.match(DOUYIN_URL_REGEX)
  return match ? match[0] : null
}

export function isValidShareUrl(url: string): boolean {
  return DOUYIN_URL_REGEX.test(url.trim())
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function extractNoWatermarkUrl(video: any): string[] {
  const bitRate = video.bit_rate || video.bitRate
  if (Array.isArray(bitRate) && bitRate.length > 0) {
    const best = bitRate[0]
    const addr = best.play_addr || best.playAddr
    if (addr?.url_list?.length) return addr.url_list
    if (addr?.urlList?.length) return addr.urlList
  }

  const playAddr = video.playAddr || video.play_addr
  if (!playAddr) return []
  if (Array.isArray(playAddr) && playAddr[0]?.src) return playAddr.map((p: any) => p.src)
  return playAddr.url_list || playAddr.urlList || []
}

async function fetchSharePageDetail(awemeId: string) {
  const shareUrl = `https://www.iesdouyin.com/share/video/${awemeId}/`
  const response = await fetch(shareUrl, {
    headers: {
      'User-Agent': MOBILE_UA,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9',
    },
  })

  const html = await response.text()
  const routerMatch = html.match(/<script[^>]*>window\._ROUTER_DATA\s*=\s*([\s\S]*?)<\/script>/i)
  if (!routerMatch) return null

  const jsonStr = routerMatch[1].trim().replace(/;$/, '')
  const routerData = JSON.parse(jsonStr)
  const loaderData = routerData.loaderData

  for (const key of Object.keys(loaderData)) {
    const data = loaderData[key]
    let detail = data?.aweme?.detail
    if (!detail && data?.videoInfoRes?.item_list?.length > 0) {
      detail = data.videoInfoRes.item_list[0]
    }
    if (!detail) continue

    const result: ParsedResult = {
      awemeId: detail.awemeId || detail.aweme_id,
      desc: detail.desc || '',
      createTime: detail.createTime || detail.create_time || 0,
      author: {
        uid: detail.author?.uid || '',
        secUid: detail.author?.secUid || detail.author?.sec_uid || '',
        nickname: detail.author?.nickname || '',
        avatarThumb: detail.author?.avatarThumb?.urlList?.[0] || detail.author?.avatar_thumb?.url_list?.[0],
      },
      statistics: {
        diggCount: detail.statistics?.diggCount || detail.statistics?.digg_count || 0,
        commentCount: detail.statistics?.commentCount || detail.statistics?.comment_count || 0,
        shareCount: detail.statistics?.shareCount || detail.statistics?.share_count || 0,
        collectCount: detail.statistics?.collectCount || detail.statistics?.collect_count || 0,
      },
      downloads: [],
    }

    if (detail.video && !detail.images) {
      const cover = detail.video.cover || detail.video.origin_cover
      result.video = {
        duration: detail.video.duration || 0,
        playAddr: extractNoWatermarkUrl(detail.video),
        cover: cover?.urlList || cover?.url_list || [],
      }
    }

    if (detail.images && detail.images.length > 0) {
      result.images = detail.images.map((img: any) => ({
        urlList: img.urlList || img.url_list || [],
      }))
    }

    if (detail.music) {
      result.music = {
        id: detail.music.id || detail.music.mid || '',
        title: detail.music.title || '',
        author: detail.music.author || '',
        playUrl: detail.music.playUrl?.uri || detail.music.play_url?.uri,
      }
    }

    if (result.video?.playAddr?.length) {
      result.downloads.push({ type: 'video', url: result.video.playAddr[0] })
    }

    if (result.images?.length) {
      for (const img of result.images) {
        const imageUrl = img.urlList?.[0]
        if (imageUrl) {
          result.downloads.push({ type: 'image', url: imageUrl })
        }
      }
    }

    return result
  }

  return null
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function parseDouyinUrl(input: string): Promise<ParsedResult> {
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

  const result = await fetchSharePageDetail(awemeId)
  if (!result) {
    throw new Error('无法获取作品信息，可能是私密作品或已删除')
  }

  return result
}
