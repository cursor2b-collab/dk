import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '分期付',
  description: '金融服务平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes" />
        {/* LayUI 图标字体 - 使用 CDN */}
        <link rel="stylesheet" href="https://unpkg.com/layui@2.8.0/dist/css/layui.css" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

