import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { getPublishedDevelopments } from '../../data/developments'
import { salesPhoneDisplayList } from '../contact/SalesContactBlock'
import { submitInquiry } from '../../lib/inquiries'
import { Button } from '../ui/Button'

const schema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Enter a valid mobile number'),
  development: z.string().optional(),
  message: z.string().min(10, 'Please include a brief message'),
  viewingDate: z.string().optional(),
  privacy: z.boolean().refine((v) => v === true, {
    message: 'Please acknowledge the privacy notice',
  }),
})

type FormValues = z.infer<typeof schema>

type InquiryFormProps = {
  source: string
  className?: string
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0]!, lastName: '-' }
  return {
    firstName: parts[0]!,
    lastName: parts.slice(1).join(' '),
  }
}

export function InquiryForm({ source, className = '' }: InquiryFormProps) {
  const developments = getPublishedDevelopments()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful, submitCount },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { privacy: false },
  })

  const [submitError, setSubmitError] = useState<string | null>(null)

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null)
    try {
      const { firstName, lastName } = splitName(values.fullName)
      const message = values.viewingDate
        ? `${values.message}\n\nPreferred viewing date: ${values.viewingDate}`
        : values.message
      await submitInquiry({
        firstName,
        lastName,
        email: values.email,
        phone: values.phone,
        development: values.development,
        message,
        viewing: Boolean(values.viewingDate),
        source,
      })
      reset({ privacy: false })
    } catch {
      setSubmitError(
        `We could not send your inquiry. Please try again or call ${salesPhoneDisplayList()}.`,
      )
    }
  }

  if (isSubmitSuccessful && submitCount > 0 && !submitError) {
    return (
      <div
        className={`border border-accent/40 bg-surface p-8 md:p-10 ${className}`}
        role="status"
      >
        <p className="text-heading-3">Thank you</p>
        <p className="mt-3 text-title-muted">
          Your inquiry was received. Our sales team will respond using the contact
          details you provided.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-5 border border-border bg-surface p-6 md:p-8 ${className}`}
      noValidate
    >
      <div>
        <label className="text-sm font-medium" htmlFor={`${source}-fullName`}>
          Full name
        </label>
        <input
          id={`${source}-fullName`}
          autoComplete="name"
          className="mt-1.5 min-h-[48px] w-full border border-border bg-surface px-3 py-2 outline-none focus:border-ink"
          {...register('fullName')}
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium" htmlFor={`${source}-email`}>
            Email address
          </label>
          <input
            id={`${source}-email`}
            type="email"
            autoComplete="email"
            className="mt-1.5 min-h-[48px] w-full border border-border bg-surface px-3 py-2 outline-none focus:border-ink"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor={`${source}-phone`}>
            Mobile number
          </label>
          <input
            id={`${source}-phone`}
            type="tel"
            autoComplete="tel"
            className="mt-1.5 min-h-[48px] w-full border border-border bg-surface px-3 py-2 outline-none focus:border-ink"
            {...register('phone')}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor={`${source}-development`}>
          Property of interest
        </label>
        <select
          id={`${source}-development`}
          className="mt-1.5 min-h-[48px] w-full border border-border bg-surface px-3 py-2 outline-none focus:border-ink"
          {...register('development')}
        >
          <option value="">Select a development (optional)</option>
          {developments.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor={`${source}-viewingDate`}>
          Preferred viewing date (optional)
        </label>
        <input
          id={`${source}-viewingDate`}
          type="date"
          className="mt-1.5 min-h-[48px] w-full border border-border bg-surface px-3 py-2 outline-none focus:border-ink"
          {...register('viewingDate')}
        />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor={`${source}-message`}>
          Message
        </label>
        <textarea
          id={`${source}-message`}
          rows={4}
          className="mt-1.5 w-full border border-border bg-surface px-3 py-2 outline-none focus:border-ink"
          {...register('message')}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      <label className="flex gap-3 text-sm text-title-muted">
        <input type="checkbox" className="mt-1 size-4" {...register('privacy')} />
        <span>
          I agree that my details will be used to respond to this inquiry. See{' '}
          <a href="/privacy" className="underline">
            Privacy
          </a>{' '}
          and the official ARTHALAND site for corporate policies.
        </span>
      </label>
      {errors.privacy && (
        <p className="text-xs text-red-600">{errors.privacy.message}</p>
      )}

      {submitError && (
        <p className="text-sm text-red-600" role="alert">
          {submitError}
        </p>
      )}

      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Submit inquiry'}
      </Button>
    </form>
  )
}
