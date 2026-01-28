export interface ParsedData {
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

export type AppStatus = 'idle' | 'loading' | 'success' | 'error'

export interface AppState {
  status: AppStatus
  data: ParsedData | null
  error: string | null
}
