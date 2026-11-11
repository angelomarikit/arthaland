import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Development } from '../../domain/development/types'
import type { UnitType } from '../../domain/development/types'
import { submitInquiry } from '../../lib/inquiries'
import { salesPhoneDisplayList } from '../contact/SalesContactBlock'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { Button } from '../ui/Button'
import { FadeInWhenVisible } from '../page/FadeInWhenVisible'

const schema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Enter a valid mobile number'),
  unitTypeId: z.string().optional(),
  message: z.string().min(10, 'Please include a brief message'),
  privacy: z.boolean().refine((v) => v === true, {
    message: 'Please acknowledge the privacy notice',
  }),
})

type FormValues = z.infer<typeof schema>

type PropertyInquirySectionProps = {
  development: Development
  units: UnitType[]
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0]!, lastName: '-' }
  return {
    firstName: parts[0]!,
    lastName: parts.slice(1).join(' '),
  }
}

export function PropertyInquirySection({
  development,
  units,
}: PropertyInquirySectionProps) {
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
    const unit = units.find((u) => u.id === values.unitTypeId)
    try {
      const { firstName, lastName } = splitName(values.fullName)
      await submitInquiry({
        firstName,
        lastName,
        email: values.email,
        phone: values.phone,
        development: development.slug,
        message: values.message,
        source: 'property-detail',
        unitTypeId: unit?.id,
        unitTypeName: unit?.name,
      })
      reset({ privacy: false })
    } catch {
      setSubmitError(
        `We could not send your inquiry. Please try again or call ${salesPhoneDisplayList()}.`,
      )
    }
  }

  return (
    <section className="border-t border-border py-16 md:py-24" id="inquiry">
      <Container className="section-x max-w-3xl">
        <FadeInWhenVisible>
          <Eyebrow>Inquire</Eyebrow>
          <h2 className="text-heading-3 mt-4">Request information — {development.name}</h2>
          <p className="mt-3 text-title-muted">
            Share your questions or schedule a consultation. Our sales team responds with
            verified information from ARTHALAND.
          </p>

          {isSubmitSuccessful && submitCount > 0 && !submitError ? (
            <div className="mt-10 border border-accent/40 bg-surface p-8" role="status">
              <p className="text-heading-3">Thank you</p>
              <p className="mt-3 text-title-muted">
                Your inquiry was received. Our sales team will respond using the contact
                details you provided.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-10 space-y-5 border border-border bg-surface p-6 md:p-8"
              noValidate
            >
              <div>
                <label className="text-sm font-medium" htmlFor="inq-fullName">
                  Full name
                </label>
                <input
                  id="inq-fullName"
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-700">{errors.fullName.message}</p>
                )}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium" htmlFor="inq-email">
                    Email
                  </label>
                  <input
                    id="inq-email"
                    type="email"
                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-700">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium" htmlFor="inq-phone">
                    Mobile
                  </label>
                  <input
                    id="inq-phone"
                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-700">{errors.phone.message}</p>
                  )}
                </div>
              </div>
              {units.length > 0 && (
                <div>
                  <label className="text-sm font-medium" htmlFor="inq-unit">
                    Interested unit type (optional)
                  </label>
                  <select
                    id="inq-unit"
                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                    {...register('unitTypeId')}
                  >
                    <option value="">Not sure yet</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="text-sm font-medium" htmlFor="inq-message">
                  Message
                </label>
                <textarea
                  id="inq-message"
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                  {...register('message')}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-700">{errors.message.message}</p>
                )}
              </div>
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" className="mt-1" {...register('privacy')} />
                <span>
                  I acknowledge the privacy notice and consent to ARTHALAND contacting me
                  about this inquiry.
                </span>
              </label>
              {errors.privacy && (
                <p className="text-sm text-red-700">{errors.privacy.message}</p>
              )}
              {submitError && <p className="text-sm text-red-700">{submitError}</p>}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : 'Send inquiry'}
              </Button>
            </form>
          )}
        </FadeInWhenVisible>
      </Container>
    </section>
  )
}
