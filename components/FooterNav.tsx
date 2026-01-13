'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface NavItem {
  path: string
  icon: string
  label: string
  external?: boolean
}

export default function FooterNav() {
  const pathname = usePathname()
  const [customerServiceUrl, setCustomerServiceUrl] = useState('https://kefu-seven.vercel.app/')

  useEffect(() => {
    // 获取客服链接
    fetch('/api/get_customer_service_url')
      .then(res => res.json())
      .then(result => {
        if (result.code === 200 && result.data?.url) {
          setCustomerServiceUrl(result.data.url)
        }
      })
      .catch(() => {
        // 使用默认值
      })
  }, [])

  const navItems: NavItem[] = [
    { path: '/', icon: 'layui-icon-home', label: '首页' },
    { path: customerServiceUrl, icon: 'layui-icon-dialogue', label: '客服', external: true },
    { path: '/repayment', icon: 'layui-icon-rmb', label: '欠款' },
    { path: '/profile', icon: 'layui-icon-username', label: '我的' },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(path)
  }

  return (
    <div className="footer-nav">
      {navItems.map((item) => {
        if (item.external) {
          return (
            <a
              key={item.path}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-item"
            >
              <i className={`layui-icon ${item.icon}`}></i>
              <div>{item.label}</div>
            </a>
          )
        }
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <i className={`layui-icon ${item.icon}`}></i>
            <div>{item.label}</div>
          </Link>
        )
      })}
    </div>
  )
}
