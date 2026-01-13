import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = searchParams.get('page') || 'index'
  const phone = searchParams.get('phone') || ''

  // 模拟数据 - 实际应该从数据库获取
  // 根据 phone 参数可以返回不同用户的数据
  const pageData: Record<string, any> = {
    index: {
      title: '金融服务平台',
      page_title: '分期付',
      subtitle: '快速服务 优惠价格',
      welcome_text: '欢迎使用我们的服务',
      amount_label: '最高额度',
      amount_value: '500,000元',
      rate_label: '日利率',
      login_btn_text: '立即申请',
      tip_text: '快速审批，安全可靠',
      step1_text: '3分钟申请服务',
      step2_text: '30秒最快审批',
      step3_text: '1分钟最快详情',
      product_title: '产品详情',
      rate_info: '年化费率（单利）7.2%~34%',
      max_amount: '最高可申请200,000元',
      payment_method: '等额本息、等额本金、本息同还',
      process_method: '快1分钟，详情至本人银行卡',
      cooperation_title: '合作机构',
    },
    login: {
      code_placeholder: '请输入验证码',
      get_code_btn: '获取验证码',
      login_auth_type: '1', // 1: 正常模式, 2: 催收员工号模式
    },
    user: {
      welcome_text: '分期付 欢迎您',
      subtitle: '超快下款 超低利率',
      amount_label: '欠款金额',
      amount_value: '0元',
      user_name: phone === '15263182283' ? '谭晓敏' : phone === '13879816846' ? '谭晓敏' : '用户',
      menu1_text: '申请服务',
      menu2_text: '我的服务',
      menu3_text: '我的欠款',
      menu4_text: '在线客服',
      menu5_text: '我的资料',
      menu6_text: '个人中心',
      impact_title: '逾期影响',
      penalty_text: '延迟费用/延迟费',
      credit_text: '上报征信',
      legal_text: '出行受限',
      cooperation_title: '合作机构',
    },
    repayment: {
      welcome_text: '分期付 欢迎您',
      amount_label: '借款金额',
      amount: '6000元',
      paid_amount: '0.00元',
      rate_label: '年化利率',
      interest_rate: '10.88%',
      process_time_label: '放款时间',
      loan_date: '2024-07-28',
      cycle_label: '周期',
      due_date_label: '到期日期',
      due_date: '2024-12-01',
      total_fee_label: '总利息',
      total_interest: '652.80',
      status_label: '借款状态',
      penalty_label: '逾期金额',
      amount_end_amount: '1200.00',
      amount_end_day: '30',
      total_amount_label: '总还款金额',
      total_amount: '7852.80',
      contract_btn_text: '贷款合同',
      upload_title: '上传凭证图片',
      select_btn_text: '选择图片并自动上传',
      repayment_periods: '全额还款',
      repayment_months: '0',
      is_repaid: '0',
      is_free_interest: '0',
      loan_no: 'DHT2024110100-4374-024',
    },
    contract: {
      contract_title: '借款合同',
      lender_name: '分期付企业管理有限公司云南分公司',
      borrower_name: '张三',
      company_license: '530100500447129',
      id_card_value: '110101199001011234',
      company_address: '云南省昆明市',
      service_amount_value: '6000元',
      establish_date: '2020-01-01',
      legal_rep: '李君龙',
      bank_card_value: '6222****1234',
      contract_no: 'XA-56PR36647',
      phone_value: phone || '138****8888',
      service_amount_value_2: '6000元',
      company_seal_name: '分期付企业管理有限公司云南分公司',
      date_text: new Date().toLocaleDateString('zh-CN'),
    },
    // 可以添加其他页面的数据
  }

  const data = pageData[page] || pageData.index

  return NextResponse.json(data)
}

