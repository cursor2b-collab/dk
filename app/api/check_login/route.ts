import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const phone = formData.get('phone') as string
    const code = formData.get('code') as string

    if (!phone || !/^1\d{10}$/.test(phone)) {
      return NextResponse.json(
        { code: 400, msg: '请输入有效的11位手机号' },
        { status: 400 }
      )
    }

    if (!code || !/^\d{4,6}$/.test(code)) {
      return NextResponse.json(
        { code: 400, msg: '请输入有效验证码' },
        { status: 400 }
      )
    }

    // 规范化手机号（去除空格）
    const normalizedPhone = phone.trim()

    // 从数据库验证验证码
    const { data: verificationCodes, error: codeError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('phone', normalizedPhone)
      .eq('code', code.trim())
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)

    // 如果查询出错，记录错误信息
    if (codeError) {
      console.error('验证码查询错误:', codeError)
    }

    // 开发环境允许使用固定验证码 '1234' 或 '123456' 作为备用
    const isDevCode = process.env.NODE_ENV === 'development' && (code === '1234' || code === '123456')

    const verificationCode = verificationCodes && verificationCodes.length > 0 ? verificationCodes[0] : null

    if (!verificationCode && !isDevCode) {
      return NextResponse.json(
        { code: 400, msg: '验证码错误或已过期' },
        { status: 400 }
      )
    }

    // 如果找到了验证码，标记为已使用
    if (verificationCode) {
      await supabase
        .from('verification_codes')
        .update({ used: true })
        .eq('id', verificationCode.id)
    }

    // 从数据库获取用户信息
    let userData: any = {
      user_id: Date.now().toString(),
      phone,
      name: '用户',
      login_time: new Date().toISOString()
    }

    // 尝试从users表获取用户信息
    if (verificationCode?.user_id) {
      const { data: user } = await supabase
        .from('users')
        .select('id, name, phone')
        .eq('id', verificationCode.user_id)
        .single()

      if (user) {
        userData = {
          user_id: user.id.toString(),
          phone: user.phone || phone,
          name: user.name || '用户',
          login_time: new Date().toISOString()
        }
      }
    } else {
      // 如果没有user_id，尝试通过手机号查找用户
      const { data: users } = await supabase
        .from('users')
        .select('id, name, phone')
        .eq('phone', phone)
        .limit(1)

      if (users && users.length > 0) {
        const user = users[0]
        userData = {
          user_id: user.id.toString(),
          phone: user.phone || phone,
          name: user.name || '用户',
          login_time: new Date().toISOString()
        }
      }
    }

    // 设置 cookie（实际应该使用 JWT 或 session）
    const cookieStore = await cookies()
    cookieStore.set('user_session', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7天
    })

    return NextResponse.json({
      code: 200,
      msg: '登录成功',
      data: userData
    })
  } catch (error) {
    return NextResponse.json(
      { code: 500, msg: '登录失败，请重试' },
      { status: 500 }
    )
  }
}

