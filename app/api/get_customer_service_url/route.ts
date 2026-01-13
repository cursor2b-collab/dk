import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // 从系统设置获取在线客服链接
    const { data: settings, error } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', 'customer_service_url')
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    // 如果没有设置，返回默认值
    const customerServiceUrl = settings?.setting_value || 'https://kefu-seven.vercel.app/'

    return NextResponse.json({
      code: 200,
      msg: '获取成功',
      data: {
        url: customerServiceUrl
      }
    })
  } catch (error: any) {
    console.error('Get customer service URL error:', error)
    return NextResponse.json(
      { code: 500, msg: error.message || '获取客服链接失败' },
      { status: 500 }
    )
  }
}
