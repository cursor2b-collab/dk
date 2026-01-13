'use client'

import { useEffect, useState } from 'react'

interface PaymentMethod {
  type: string
  bank_name: string
  payee_name: string
  card_number: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'basic' | 'payment'>('basic')
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [customerServiceUrl, setCustomerServiceUrl] = useState('https://kefu-seven.vercel.app/')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      // 加载收款方式
      const paymentResponse = await fetch('/api/admin/settings?key=payment_methods')
      const paymentResult = await paymentResponse.json()

      if (paymentResult.code === 200 && paymentResult.data?.setting_value) {
        setPaymentMethods(paymentResult.data.setting_value || [])
      } else {
        // 如果没有数据，初始化默认值
        setPaymentMethods([
          {
            type: '银行卡一',
            bank_name: '联系专员获取',
            payee_name: '联系专员获取',
            card_number: '联系专员获取'
          },
          {
            type: '银行卡二',
            bank_name: '联系专员获取',
            payee_name: '联系专员获取',
            card_number: '联系专员获取'
          }
        ])
      }

      // 加载在线客服链接
      const serviceResponse = await fetch('/api/admin/settings?key=customer_service_url')
      const serviceResult = await serviceResponse.json()

      if (serviceResult.code === 200 && serviceResult.data?.setting_value) {
        setCustomerServiceUrl(serviceResult.data.setting_value || 'https://kefu-seven.vercel.app/')
      }
    } catch (error) {
      console.error('Load settings error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      if (activeTab === 'basic') {
        // 保存在线客服链接
        const response = await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: 'customer_service_url',
            value: customerServiceUrl
          })
        })

        const result = await response.json()

        if (result.code === 200) {
          alert('保存成功')
        } else {
          alert(result.msg || '保存失败')
        }
      } else {
        // 保存收款方式
        const response = await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: 'payment_methods',
            value: paymentMethods
          })
        })

        const result = await response.json()

        if (result.code === 200) {
          alert('保存成功')
        } else {
          alert(result.msg || '保存失败')
        }
      }
    } catch (error) {
      alert('保存失败')
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentMethod = (index: number, field: keyof PaymentMethod, value: string) => {
    const methods = [...paymentMethods]
    methods[index] = { ...methods[index], [field]: value }
    setPaymentMethods(methods)
  }

  return (
    <div style={{
      background: '#2d2d2d',
      borderRadius: '4px',
      overflow: 'hidden',
      fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* 标签页 */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #404040'
      }}>
        <button
          onClick={() => setActiveTab('basic')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'basic' ? '#667eea' : 'transparent',
            color: activeTab === 'basic' ? '#fff' : '#b0b0b0',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 'bold'
          }}
        >
          基本设置
        </button>
        <button
          onClick={() => setActiveTab('payment')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'payment' ? '#667eea' : 'transparent',
            color: activeTab === 'payment' ? '#fff' : '#b0b0b0',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 'bold'
          }}
        >
          收款方式
        </button>
      </div>

      {/* 内容区域 */}
      <div style={{ padding: '30px' }}>
        {activeTab === 'basic' ? (
          <div>
            <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              基本设置
            </h2>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  在线客服链接
                </label>
                <input
                  type="text"
                  value={customerServiceUrl}
                  onChange={(e) => setCustomerServiceUrl(e.target.value)}
                  placeholder="请输入在线客服链接，例如：https://kefu-seven.vercel.app/"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #404040',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    background: '#1a1a1a',
                    color: '#ffffff',
                    fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: 'bold'
                  }}
                />
                <p style={{ marginTop: '8px', fontSize: '12px', color: '#b0b0b0', fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  用户端点击"在线客服"时将跳转到此链接
                </p>
              </div>
            </div>

            {/* 保存按钮 */}
            <div style={{
              marginTop: '30px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  padding: '10px 30px',
                  background: loading ? '#3d3d3d' : '#667eea',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif'
                }}
              >
                {loading ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              收款方式配置
            </h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#ffffff', fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 'bold' }}>
                加载中...
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '30px' }}>
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '20px',
                      border: '1px solid #404040',
                      borderRadius: '4px',
                      background: '#3d3d3d'
                    }}
                  >
                    <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      收款方式
                    </h3>

                    <div style={{ display: 'grid', gap: '15px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                          *收款类型
                        </label>
                        <select
                          value={method.type}
                          onChange={(e) => updatePaymentMethod(index, 'type', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #404040',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            background: '#1a1a1a',
                            color: '#ffffff',
                            fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif',
                            fontWeight: 'bold'
                          }}
                        >
                          <option value="银行卡一" style={{ background: '#1a1a1a', color: '#ffffff' }}>银行卡一</option>
                          <option value="银行卡二" style={{ background: '#1a1a1a', color: '#ffffff' }}>银行卡二</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                          银行卡名称
                        </label>
                        <input
                          type="text"
                          value={method.bank_name}
                          onChange={(e) => updatePaymentMethod(index, 'bank_name', e.target.value)}
                          placeholder="请输入银行卡名称"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #404040',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            background: '#1a1a1a',
                            color: '#ffffff',
                            fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif',
                            fontWeight: 'bold'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                          收款人姓名
                        </label>
                        <input
                          type="text"
                          value={method.payee_name}
                          onChange={(e) => updatePaymentMethod(index, 'payee_name', e.target.value)}
                          placeholder="请输入收款人姓名"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #404040',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            background: '#1a1a1a',
                            color: '#ffffff',
                            fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif',
                            fontWeight: 'bold'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                          银行卡号
                        </label>
                        <input
                          type="text"
                          value={method.card_number}
                          onChange={(e) => updatePaymentMethod(index, 'card_number', e.target.value)}
                          placeholder="请输入银行卡号"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #404040',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            background: '#1a1a1a',
                            color: '#ffffff',
                            fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif',
                            fontWeight: 'bold'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 保存按钮 */}
            <div style={{
              marginTop: '30px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  padding: '10px 30px',
                  background: loading ? '#3d3d3d' : '#667eea',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif'
                }}
              >
                {loading ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
