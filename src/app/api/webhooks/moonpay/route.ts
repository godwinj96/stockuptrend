import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const webhookKey = process.env.MOONPAY_WEBHOOK_KEY
  if (!webhookKey) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const rawBody = await req.text()
  const signature = req.headers.get('moonpay-signature-v2')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  // Verify HMAC-SHA256 signature
  const expectedSig = crypto
    .createHmac('sha256', webhookKey)
    .update(rawBody)
    .digest('hex')

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSig, 'hex')
    )
  ) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody) as {
    type: string
    data: {
      id: string
      externalTransactionId?: string
      cryptoTransactionId?: string
      status: string
      walletAddress?: string
      currencyCode?: string
      quoteCurrencyAmount?: number
      baseCurrencyAmount?: number
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceRoleClient() as any

  if (event.type === 'transaction_completed') {
    const { data: txn } = await db
      .from('transactions')
      .select('id, account_id, amount')
      .eq('reference', event.data.id)
      .eq('method', 'crypto')
      .single()

    if (txn) {
      await db
        .from('transactions')
        .update({ status: 'completed' })
        .eq('id', txn.id)

      await db.rpc('increment_balance', {
        p_account_id: txn.account_id,
        p_amount: txn.amount,
      })
    }
  }

  if (event.type === 'transaction_failed' || event.type === 'transaction_declined') {
    await db
      .from('transactions')
      .update({ status: 'failed' })
      .eq('reference', event.data.id)
      .eq('method', 'crypto')
  }

  return NextResponse.json({ received: true })
}
