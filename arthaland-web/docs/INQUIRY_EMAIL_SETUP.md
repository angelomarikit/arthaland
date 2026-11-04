# Inquiry email notifications (optional — not used)

This project handles inquiries **in the admin CMS only** (`/admin/inquiries`). You do **not** need Resend or the steps below unless you add email later.

When someone submits the contact form or help widget, the inquiry is saved in Supabase **`inquiries`**. To email a sales address automatically (optional):

## 1. Resend (recommended)

1. Create a free account at [resend.com](https://resend.com).
2. Verify sending domain (e.g. `partners.arthaland.com`) or use Resend’s test sender until DNS is ready.
3. Create an API key.

## 2. Deploy the Edge Function

From the project (with [Supabase CLI](https://supabase.com/docs/guides/cli) linked to your project):

```bash
cd arthaland-web
supabase secrets set RESEND_API_KEY=re_xxxx
supabase secrets set INQUIRY_NOTIFY_EMAIL=gelee@partners.arthaland.com
supabase secrets set INQUIRY_FROM_EMAIL="ARTHALAND Inquiries <inquiries@partners.arthaland.com>"
supabase functions deploy inquiry-notify
```

Function source: `supabase/functions/inquiry-notify/index.ts`

## 3. Database Webhook (Supabase Dashboard)

1. **Database → Webhooks → Create a new hook**
2. **Table:** `inquiries`  
3. **Events:** Insert  
4. **Type:** Supabase Edge Function → `inquiry-notify`  
5. Save

Each new inquiry row triggers one email to `INQUIRY_NOTIFY_EMAIL`.

## 4. Test

Submit the contact form on the live site. Check **gelee@partners.arthaland.com** and Supabase **Edge Functions → Logs**.

## Notes

- Email is **not** sent from the React app (no secrets in the browser).
- If Resend is not configured, inquiries still save; only the notification email is skipped.
- Set **Reply-To** to the visitor’s email so Gelee can reply directly from the inbox.
