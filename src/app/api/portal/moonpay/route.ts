import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.NEXT_PUBLIC_MOONPAY_API_KEY
  const secretKey = process.env.MOONPAY_SECRET_KEY

  if (!apiKey || !secretKey) {
    return NextResponse.json({ error: 'MoonPay not configured' }, { status: 503 })
  }

  const body = await req.json() as {
    currencyCode: string
    walletAddress: string
    baseCurrencyAmount?: number
  }
  const { currencyCode, walletAddress, baseCurrencyAmount } = body

  if (!currencyCode || !walletAddress) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const params = new URLSearchParams({
    apiKey,
    currencyCode,
    walletAddress,
    colorCode: '%230052FF',
    theme: 'dark',
    ...(user.email ? { email: user.email } : {}),
    ...(baseCurrencyAmount ? { baseCurrencyAmount: String(baseCurrencyAmount) } : {}),
  })

  const queryString = `?${params.toString()}`
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(queryString)
    .digest('base64url')

  const signedUrl = `https://buy.moonpay.com${queryString}&signature=${encodeURIComponent(signature)}`

  return NextResponse.json({ signedUrl })
}
