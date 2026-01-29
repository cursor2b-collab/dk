import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // 从数据库获取欢迎文本配置
    const { data, error } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', 'welcome_text')
      .single()

    if (error || !data) {
      // 如果获取失败，返回默认值
      return NextResponse.json({
        code: 200,
        data: {
          welcome_text: '分期付 欢迎您'
        }
      })
    }

    const welcomeText = typeof data.setting_value === 'string' 
      ? data.setting_value 
      : '分期付 欢迎您'

    return NextResponse.json({
      code: 200,
      data: {
        welcome_text: welcomeText
      }
    })
  } catch (error) {
    console.error('Get welcome text error:', error)
    // 出错时返回默认值
    return NextResponse.json({
      code: 200,
      data: {
        welcome_text: '分期付 欢迎您'
      }
    })
  }
}
