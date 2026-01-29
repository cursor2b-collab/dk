import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // 从数据库获取周期文本配置
    const { data, error } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', 'cycle_text')
      .single()

    if (error || !data) {
      // 如果获取失败，返回默认值
      return NextResponse.json({
        code: 200,
        data: {
          cycle_text: '随借随还'
        }
      })
    }

    const cycleText = typeof data.setting_value === 'string' 
      ? data.setting_value 
      : '随借随还'

    return NextResponse.json({
      code: 200,
      data: {
        cycle_text: cycleText
      }
    })
  } catch (error) {
    console.error('Get cycle text error:', error)
    // 出错时返回默认值
    return NextResponse.json({
      code: 200,
      data: {
        cycle_text: '随借随还'
      }
    })
  }
}
