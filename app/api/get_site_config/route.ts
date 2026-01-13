import { NextResponse } from 'next/server'

export async function GET() {
  // 模拟数据 - 实际应该从数据库获取
  return NextResponse.json({
    code: 200,
    data: {
      site_name: '好享贷'
    }
  })
}

