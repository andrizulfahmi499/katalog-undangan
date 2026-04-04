import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const result = await zai.functions.invoke('page_reader', {
      url: url
    })

    return NextResponse.json({
      success: true,
      data: {
        title: result.data.title,
        url: result.data.url,
        content: result.data.html,
        text: result.data.html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
        publishedTime: result.data.publishedTime
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
