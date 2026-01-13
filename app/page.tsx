'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loadPageData, checkLoginStatus, syncLoginWithServer } from '@/lib/api'
import FooterNav from '@/components/FooterNav'
import LoadingOverlay from '@/components/LoadingOverlay'

interface PageData {
  title?: string
  page_title?: string
  subtitle?: string
  welcome_text?: string
  amount_label?: string
  amount_value?: string
  rate_label?: string
  login_btn_text?: string
  tip_text?: string
  marquee_text?: string
  step1_text?: string
  step2_text?: string
  step3_text?: string
  product_title?: string
  rate_info?: string
  max_amount?: string
  payment_method?: string
  process_method?: string
  cooperation_title?: string
  bank_count?: string
  insurance_count?: string
  finance_count?: string
}

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [pageData, setPageData] = useState<PageData>({})
  const [marqueeText, setMarqueeText] = useState('加载中...')

  useEffect(() => {
    // 检查登录状态
    if (checkLoginStatus(false)) {
      syncLoginWithServer().then((loggedIn) => {
        if (loggedIn) {
          router.push('/user')
          return
        }
      }).catch(() => {
        // 检查失败不影响页面加载
      })
    }

    // 加载页面数据
    loadPageData('index')
      .then((data) => {
        setPageData(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('加载数据失败:', error)
        setLoading(false)
      })
  }, [router])

  useEffect(() => {
    // 初始化轮播消息
    const messages = [
      '07-07 用户尾号4826 成功申请服务 78800元',
      '07-07 用户尾号1234 成功申请服务 50000元',
      '07-07 用户尾号5678 成功申请服务 30000元'
    ]
    
    let index = 0
    const updateMarquee = () => {
      setMarqueeText(messages[index])
      index = (index + 1) % messages.length
    }
    
    updateMarquee()
    const interval = setInterval(updateMarquee, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className={`main-content ${!loading ? 'loaded' : ''}`}>
        <div className="layui-container" style={{ textAlign: 'center', padding: '5vw 0 3vw' }}>
          <h2 style={{ fontSize: '1.5rem' }} id="page_title">{pageData.page_title || '加载中...'}</h2>
          <p className="layui-text" id="subtitle">{pageData.subtitle || '加载中...'}</p>
        </div>

        <div className="hero-box">
          <img 
            src="/resources/images/cute.webp" 
            alt="企鹅图" 
            style={{ maxWidth: '100%', maxHeight: '160px', margin: '0 auto', display: 'block' }}
          />
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }} id="welcome_text">
            {pageData.welcome_text || '加载中...'}
          </div>
          <div style={{ marginTop: '5px', fontSize: '0.9rem', color: 'white' }} id="amount_label">
            {pageData.amount_label || '加载中...'}
          </div>
          <div className="limit" style={{ color: 'white' }} id="amount_value">{pageData.amount_value || '加载中...'}</div>
          <div style={{ fontSize: '0.9rem', color: 'white' }} id="rate_label">{pageData.rate_label || '加载中...'}</div>
          <Link href="/login" className="login-button" id="login_btn_text">
            {pageData.login_btn_text || '加载中...'}
          </Link>
          <p style={{ marginTop: '10px', fontSize: '0.75rem', color: 'white' }} id="tip_text">
            {pageData.tip_text || '加载中...'}
          </p>
        </div>

        <div className="marquee-box" id="marquee">
          <span id="marquee_text">{marqueeText}</span>
        </div>

        <div className="layui-row layui-col-space10 step-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
          <div style={{ textAlign: 'center' }}>
            <img 
              src="/resources/images/step-1.webp" 
              alt="申请服务" 
              style={{ width: '48px', height: '48px', margin: 'auto' }}
            />
            <p id="step1_text">{pageData.step1_text || '加载中...'}</p>
          </div>

          <div style={{ padding: '0 5px' }}>
            <img 
              src="/resources/images/zb.png" 
              alt="箭头" 
              style={{ width: '24px', height: 'auto' }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <img 
              src="/resources/images/step-2.webp" 
              alt="最快审批" 
              style={{ width: '48px', height: '48px', margin: 'auto' }}
            />
            <p id="step2_text">{pageData.step2_text || '加载中...'}</p>
          </div>

          <div style={{ padding: '0 5px' }}>
            <img 
              src="/resources/images/zb.png" 
              alt="箭头" 
              style={{ width: '24px', height: 'auto' }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <img 
              src="/resources/images/step-3.webp" 
              alt="最快处理" 
              style={{ width: '48px', height: '48px', margin: 'auto' }}
            />
            <p id="step3_text">{pageData.step3_text || '加载中...'}</p>
          </div>
        </div>

        <div className="layui-card product-card layui-container">
          <div className="layui-card-header" id="product_title">{pageData.product_title || '加载中...'}</div>
          <div className="layui-card-body">
            <table className="layui-table" style={{ fontSize: 'small' }} data-lay-size="sm">
              <tbody>
                <tr>
                  <td>服务费率</td>
                  <td id="rate_info">{pageData.rate_info || '加载中...'}</td>
                </tr>
                <tr>
                  <td>最高额度</td>
                  <td id="max_amount">{pageData.max_amount || '加载中...'}</td>
                </tr>
                <tr>
                  <td>计费方式</td>
                  <td id="payment_method">{pageData.payment_method || '加载中...'}</td>
                </tr>
                <tr>
                  <td>处理方式</td>
                  <td id="process_method">{pageData.process_method || '加载中...'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="layui-container" style={{ marginTop: '20px' }}>
          <div className="layui-card">
            <div className="layui-card-header" style={{ textAlign: 'center', fontSize: '1.1rem' }} id="cooperation_title">
              {pageData.cooperation_title || '加载中...'}
            </div>
            <div className="layui-card-body" style={{ textAlign: 'center' }}>
              <div style={{ marginTop: '15px' }}>
                <img src="/resources/images/cooperation.webp" alt="合作机构" style={{ width: '100%', height: 'auto' }} />
              </div>
            </div>
          </div>
        </div>

        <FooterNav />
      </div>
    </>
  )
}
