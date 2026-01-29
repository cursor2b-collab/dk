import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

async function checkAdminAuth() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('admin_session')
  
  if (!sessionCookie?.value) {
    return null
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value)
    const { data: admin } = await supabase
      .from('admin_users')
      .select('id, username, status')
      .eq('id', sessionData.admin_id)
      .eq('status', 1)
      .single()
    
    return admin
  } catch {
    return null
  }
}

// 更新指定手机号的验证码
export async function PUT(
  request: NextRequest,
  { params }: { params: { phone: string } }
) {
  try {
    const admin = await checkAdminAuth()
    if (!admin) {
      return NextResponse.json({ code: 401, msg: '未授权' }, { status: 401 })
    }

    const phone = decodeURIComponent(params.phone)
    const body = await request.json()
    const { code: newCode } = body

    // 验证手机号格式
    if (!phone || !/^1\d{10}$/.test(phone)) {
      return NextResponse.json(
        { code: 400, msg: '无效的手机号格式' },
        { status: 400 }
      )
    }

    // 如果提供了新验证码，验证格式
    if (newCode && !/^\d{4,6}$/.test(newCode)) {
      return NextResponse.json(
        { code: 400, msg: '验证码必须是4-6位数字' },
        { status: 400 }
      )
    }

    // 生成新的验证码（如果没有提供）
    const code = newCode || Math.floor(100000 + Math.random() * 900000).toString()
    
    // 管理后台生成的验证码永久有效，设置为2099年12月31日
    const expiresAt = new Date('2099-12-31T23:59:59')

    // 查找该手机号对应的用户ID（如果有）
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .limit(1)
      .single()

    // 查找该手机号现有的验证码
    const { data: existingCodes } = await supabase
      .from('verification_codes')
      .select('id, user_id')
      .eq('phone', phone)
      .order('created_at', { ascending: false })
      .limit(1)

    if (existingCodes && existingCodes.length > 0) {
      // 更新现有验证码
      const { error: updateError } = await supabase
        .from('verification_codes')
        .update({
          code: code,
          used: false,
          expires_at: expiresAt.toISOString(),
          user_id: user?.id || existingCodes[0].user_id || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCodes[0].id)

      if (updateError) {
        throw updateError
      }

      return NextResponse.json({
        code: 200,
        msg: '验证码更新成功',
        data: {
          phone,
          code,
          expires_at: expiresAt.toISOString()
        }
      })
    } else {
      // 创建新验证码
      const { error: insertError } = await supabase
        .from('verification_codes')
        .insert({
          phone: phone,
          code: code,
          used: false,
          expires_at: expiresAt.toISOString(),
          user_id: user?.id || null
        })

      if (insertError) {
        throw insertError
      }

      return NextResponse.json({
        code: 200,
        msg: '验证码创建成功',
        data: {
          phone,
          code,
          expires_at: expiresAt.toISOString()
        }
      })
    }
  } catch (error: any) {
    console.error('Update code error:', error)
    return NextResponse.json(
      { code: 500, msg: error.message || '更新验证码失败' },
      { status: 500 }
    )
  }
}
