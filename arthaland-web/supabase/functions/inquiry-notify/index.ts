/**
 * Sends email when a row is inserted into public.inquiries.
 * Deploy: supabase functions deploy inquiry-notify
 * Secrets: RESEND_API_KEY, INQUIRY_NOTIFY_EMAIL (default gelee@partners.arthaland.com)
 * Hook: Database Webhook on inquiries INSERT → this function URL
 */
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const NOTIFY_TO =
  Deno.env.get('INQUIRY_NOTIFY_EMAIL') ?? 'gelee@partners.arthaland.com'
const FROM =
  Deno.env.get('INQUIRY_FROM_EMAIL') ?? 'ARTHALAND Website <onboarding@resend.dev>'
const RESEND_KEY = Deno.env.get('RESEND_API_KEY')

type InquiryRecord = {
  id?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  development_slug: string | null
  message: string
  viewing_requested: boolean | null
  source: string | null
  created_at?: string
}

function parseRecord(body: unknown): InquiryRecord | null {
  if (!body || typeof body !== 'object') return null
  const b = body as Record<string, unknown>
  const record = (b.record ?? b) as Record<string, unknown>
  if (!record.first_name || !record.email) return null
  return record as unknown as InquiryRecord
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    })
  }

  try {
    const body = await req.json()
    const record = parseRecord(body)
    if (!record) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
      })
    }

    if (!RESEND_KEY) {
      console.error('RESEND_API_KEY is not set — inquiry saved but email not sent')
      return new Response(
        JSON.stringify({ ok: false, reason: 'Email not configured' }),
        { status: 503 },
      )
    }

    const name = `${record.first_name} ${record.last_name}`.trim()
    const subject = `New inquiry — ${name}${record.development_slug ? ` · ${record.development_slug}` : ''}`
    const html = `
      <h2>New website inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${record.email}">${record.email}</a></p>
      <p><strong>Phone:</strong> ${record.phone}</p>
      <p><strong>Property:</strong> ${record.development_slug ?? 'Not specified'}</p>
      <p><strong>Viewing requested:</strong> ${record.viewing_requested ? 'Yes' : 'No'}</p>
      <p><strong>Source:</strong> ${record.source ?? 'website'}</p>
      <p><strong>Message:</strong></p>
      <p>${String(record.message).replace(/\n/g, '<br>')}</p>
      <hr>
      <p style="color:#666;font-size:12px">Reply directly to the visitor at ${record.email}</p>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [NOTIFY_TO],
        reply_to: record.email,
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Resend error', errText)
      return new Response(JSON.stringify({ error: errText }), { status: 502 })
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
})
