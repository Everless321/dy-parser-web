import { NextRequest, NextResponse } from 'next/server'
import { parseDouyinUrl, isValidShareUrl } from '@/lib/parser'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { ok: false, error: '请提供分享链接' },
        { status: 400 }
      )
    }

    if (!isValidShareUrl(url)) {
      return NextResponse.json(
        { ok: false, error: '不支持的分享链接格式，请使用抖音分享链接' },
        { status: 400 }
      )
    }

    const result = await parseDouyinUrl(url)

    return NextResponse.json({
      ok: true,
      data: result,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '解析失败'
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    )
  }
}
