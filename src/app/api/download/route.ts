import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_DOMAINS = [
  'douyinvod.com',
  'zjcdn.com',
  'snssdk.com',
  'amemv.com',
  'ixigua.com',
  'douyinpic.com',
  'byteimg.com',
]

function isAllowedDomain(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return ALLOWED_DOMAINS.some((d) => hostname.endsWith(d))
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  const type = request.nextUrl.searchParams.get('type') || 'video'
  const mode = request.nextUrl.searchParams.get('mode') || 'download' // download | preview

  if (!url) {
    return NextResponse.json({ error: '缺少 url 参数' }, { status: 400 })
  }

  if (!isAllowedDomain(url)) {
    return NextResponse.json({ error: '不允许的资源域名' }, { status: 403 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
        'Referer': 'https://www.douyin.com/',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: '资源获取失败' }, { status: response.status })
    }

    const contentType = response.headers.get('Content-Type') || (type === 'video' ? 'video/mp4' : 'image/jpeg')
    const contentLength = response.headers.get('Content-Length')

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    }

    if (contentLength) {
      headers['Content-Length'] = contentLength
    }

    // 下载模式添加 attachment 头
    if (mode === 'download') {
      const ext = type === 'video' ? 'mp4' : 'jpg'
      headers['Content-Disposition'] = `attachment; filename="douyin_${Date.now()}.${ext}"`
      const buffer = await response.arrayBuffer()
      return new NextResponse(buffer, { headers })
    }

    // 预览模式使用流式传输
    return new NextResponse(response.body, { headers })
  } catch {
    return NextResponse.json({ error: '下载失败' }, { status: 500 })
  }
}
