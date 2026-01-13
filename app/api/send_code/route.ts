import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const phone = formData.get('phone') as string

    if (!phone || !/^1\d{10}$/.test(phone)) {
      return NextResponse.json(
        { code: 400, msg: '请输入有效手机号' },
        { status: 400 }
      )
    }

    // TODO: 实际应该调用短信服务发送验证码
    // 这里模拟发送成功，验证码可以设置为固定值用于测试，如 '123456'
    console.log(`发送验证码到: ${phone}`)

    return NextResponse.json({
      code: 200,
      msg: '验证码发送成功',
      data: {
        phone,
        // 开发环境可以返回验证码，生产环境不应该返回
        code: process.env.NODE_ENV === 'development' ? '123456' : undefined
      }
    })
  } catch (error) {
    return NextResponse.json(
      { code: 500, msg: '发送失败，请重试' },
      { status: 500 }
    )
  }
}

