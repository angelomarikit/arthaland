import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { submitInquiry } from '../../lib/inquiries'
import { useInquiryDevelopments } from '../../hooks/usePublicDevelopments'
import { Button } from '../ui/Button'
import {
  formErrorClass,
  formInputClass,
  formLabelClass,
  formSuccessClass,
} from '../forms/formStyles'

const schema = z.object({
  fullName: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  message: z.string().min(10, 'Please add a brief message'),
  development: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0]!, lastName: '-' }
  return { firstName: parts[0]!, lastName: parts.slice(1).join(' ') }
}

export function SupportWidgetForm({ onSuccess }: { onSuccess?: () => void }) {
  const { items: developments, state: devsState } = useInquiryDevelopments()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    const { firstName, lastName } = splitName(values.fullName)
    await submitInquiry({
      firstName,
      lastName,
      email: values.email,
      phone: values.phone,
      development: values.development,
      message: values.message,
      source: 'support-widget',
    })
    reset()
    onSuccess?.()
  }

  if (isSubmitSuccessful) {
    return (
      <div className={formSuccessClass} role="status">
        Thank you — your message was sent. Our team will follow up soon.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label className={formLabelClass} htmlFor="widget-fullName">
          Full name
        </label>
        <input
          id="widget-fullName"
          className={formInputClass}
          autoComplete="name"
          {...register('fullName')}
        />
        {errors.fullName && (
          <p className={formErrorClass}>{errors.fullName.message}</p>
        )}
      </div>
      <div>
        <label className={formLabelClass} htmlFor="widget-email">
          Email
        </label>
        <input
          id="widget-email"
          type="email"
          className={formInputClass}
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && <p className={formErrorClass}>{errors.email.message}</p>}
      </div>
      <div>
        <label className={formLabelClass} htmlFor="widget-phone">
          Phone
        </label>
        <input
          id="widget-phone"
          type="tel"
          className={formInputClass}
          autoComplete="tel"
          {...register('phone')}
        />
        {errors.phone && <p className={formErrorClass}>{errors.phone.message}</p>}
      </div>
      <div>
        <label className={formLabelClass} htmlFor="widget-development">
          Development (optional)
        </label>
        <select
          id="widget-development"
          className={formInputClass}
          disabled={devsState === 'loading'}
          {...register('development')}
        >
          <option value="">
            {devsState === 'loading' ? 'Loading…' : 'Select…'}
          </option>
          {developments.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={formLabelClass} htmlFor="widget-message">
          Message
        </label>
        <textarea
          id="widget-message"
          rows={3}
          className={`${formInputClass} min-h-[88px] resize-y`}
          {...register('message')}
        />
        {errors.message && (
          <p className={formErrorClass}>{errors.message.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" size="compact" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}
