import { getSupabaseClient } from './supabase/client'

export type InquiryPayload = {
  firstName: string
  lastName: string
  email: string
  phone: string
  development?: string
  message: string
  viewing?: boolean
  source?: string
  unitTypeId?: string
  unitTypeName?: string
}

/** Inserts inquiry when Supabase is configured; otherwise logs in dev. */
export async function submitInquiry(payload: InquiryPayload): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    if (import.meta.env.DEV) {
      console.info('[inquiry:local]', payload)
    }
    await new Promise((r) => setTimeout(r, 400))
    return
  }

  const { error } = await supabase.from('inquiries').insert({
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    development_slug: payload.development || null,
    message: payload.message,
    viewing_requested: payload.viewing ?? false,
    source: payload.source ?? 'website',
    unit_type_id: payload.unitTypeId ?? null,
    unit_type_name: payload.unitTypeName ?? null,
  })

  if (error) throw error
}
