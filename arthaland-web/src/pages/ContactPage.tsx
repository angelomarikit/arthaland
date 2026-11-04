import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SiteHeader } from '../components/layout/SiteHeader'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { FacebookIcon } from '../components/icons/FacebookIcon'
import { siteConfig } from '../config/site'
import { sectionImages } from '../config/sectionImages'
import { getPublishedDevelopments } from '../data/developments'
import { submitInquiry } from '../lib/inquiries'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email(),
  phone: z.string().min(7, 'Enter a valid phone number'),
  development: z.string().optional(),
  message: z.string().min(10, 'Please include a brief message'),
  viewing: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

export function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { viewing: false },
  })

  const onSubmit = async (values: FormValues) => {
    await submitInquiry({ ...values, source: 'contact-page' })
    reset()
  }

  return (
    <>
      <SiteHeader />
      <section className="relative bg-ink text-surface">
        <img
          src={sectionImages.contactBg}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-30"
        />
        <Container className="section-x relative py-20 md:py-28">
          <Eyebrow dark>Contact</Eyebrow>
          <h1 className="text-heading-2 mt-4">Speak with our sales team</h1>
        </Container>
      </section>

      <Container className="section-x grid gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <h2 className="text-heading-3">Office</h2>
          <p className="mt-4 text-title-muted">
            Arthaland Century Pacific Tower
            <br />
            5th Avenue corner 30th Street
            <br />
            Taguig City, 1634 Metro Manila
          </p>
          <p className="mt-6">
            <a href="tel:+63284036910" className="text-lg font-medium">
              +63 2 8403 6910
            </a>
          </p>
          <p className="mt-2 text-sm text-title-muted">
            Verified from arthaland.com (corporate office line).
          </p>
          <p className="mt-6">
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:underline"
            >
              <FacebookIcon className="size-5" />
              ARTHALAND on Facebook
            </a>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 border border-border bg-surface-soft p-6 md:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm" htmlFor="firstName">
                First name
              </label>
              <input
                id="firstName"
                className="mt-1 w-full border border-border bg-surface px-3 py-2"
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-xs text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm" htmlFor="lastName">
                Last name
              </label>
              <input
                id="lastName"
                className="mt-1 w-full border border-border bg-surface px-3 py-2"
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="text-xs text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 w-full border border-border bg-surface px-3 py-2"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              className="mt-1 w-full border border-border bg-surface px-3 py-2"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-xs text-red-600">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm" htmlFor="development">
              Development of interest
            </label>
            <select
              id="development"
              className="mt-1 w-full border border-border bg-surface px-3 py-2"
              {...register('development')}
            >
              <option value="">Select (optional)</option>
              {getPublishedDevelopments().map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              className="mt-1 w-full border border-border bg-surface px-3 py-2"
              {...register('message')}
            />
            {errors.message && (
              <p className="text-xs text-red-600">{errors.message.message}</p>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('viewing')} />
            Request a property viewing
          </label>
          <Button type="submit" className="w-full sm:w-auto">
            {isSubmitting ? 'Sending…' : 'Submit inquiry'}
          </Button>
          {isSubmitSuccessful && (
            <p className="text-sm text-green-700" role="status">
              Thank you — your inquiry was received.
            </p>
          )}
        </form>
      </Container>
    </>
  )
}
