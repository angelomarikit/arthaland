import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SiteHeader } from '../components/layout/SiteHeader'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { FacebookIcon } from '../components/icons/FacebookIcon'
import {
  formErrorClass,
  formInputClass,
  formLabelClass,
  formSuccessClass,
} from '../components/forms/formStyles'
import { FadeInWhenVisible } from '../components/page/FadeInWhenVisible'
import { siteConfig } from '../config/site'
import { sectionImages } from '../config/sectionImages'
import { getPublishedDevelopments } from '../data/developments'
import { submitInquiry } from '../lib/inquiries'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Enter a valid email'),
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
      <SiteHeader embedded />
      <section className="relative min-h-[50vh] overflow-hidden bg-ink text-surface md:min-h-[55vh]">
        <img
          src={sectionImages.contactBg}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/35" />
        <Container className="section-x relative flex min-h-[50vh] flex-col justify-end pb-14 pt-32 md:min-h-[55vh] md:pb-16">
          <Eyebrow dark>Contact</Eyebrow>
          <h1 className="text-display-l mt-5 max-w-[12ch] animate-fade-up">
            <span className="block">Your Next Chapter</span>
            <span className="block">Starts Here.</span>
          </h1>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="section-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <FadeInWhenVisible className="lg:col-span-5">
            <div className="aspect-[4/5] overflow-hidden md:aspect-[3/4]">
              <img
                src={sectionImages.inquirySide}
                alt=""
                className="size-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-8 max-w-md leading-relaxed text-title-muted">
              Whether you are exploring a first home or comparing investment
              addresses, our sales team offers a calm, informed conversation —
              grounded in verified ARTHALAND materials.
            </p>
            <div className="mt-10 space-y-6 border-t border-border pt-10">
              <div>
                <p className="text-eyebrow text-title-muted">Office</p>
                <p className="mt-3 leading-relaxed">
                  Arthaland Century Pacific Tower
                  <br />
                  5th Avenue corner 30th Street
                  <br />
                  Taguig City, 1634 Metro Manila
                </p>
              </div>
              <div>
                <p className="text-eyebrow text-title-muted">Phone</p>
                <a
                  href="tel:+63284036910"
                  className="mt-3 block text-xl font-medium tracking-[-0.03em]"
                >
                  +63 2 8403 6910
                </a>
                <p className="mt-2 text-sm text-title-muted">
                  Corporate office line (arthaland.com).
                </p>
              </div>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-surface-soft"
              >
                <FacebookIcon className="size-5" />
                ARTHALAND on Facebook
              </a>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible className="lg:col-span-7">
            <div className="border border-border bg-surface-soft p-6 md:p-10 lg:p-12">
              <h2 className="text-heading-3">Send an inquiry</h2>
              <p className="mt-3 text-title-muted">
                Complete the form below. Submissions are handled through our
                existing inquiry integration.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={formLabelClass} htmlFor="firstName">
                      First name
                    </label>
                    <input
                      id="firstName"
                      className={formInputClass}
                      autoComplete="given-name"
                      {...register('firstName')}
                    />
                    {errors.firstName && (
                      <p className={formErrorClass}>{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={formLabelClass} htmlFor="lastName">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      className={formInputClass}
                      autoComplete="family-name"
                      {...register('lastName')}
                    />
                    {errors.lastName && (
                      <p className={formErrorClass}>{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className={formLabelClass} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={formInputClass}
                    autoComplete="email"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className={formErrorClass}>{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className={formLabelClass} htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={formInputClass}
                    autoComplete="tel"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className={formErrorClass}>{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className={formLabelClass} htmlFor="development">
                    Development of interest
                  </label>
                  <select id="development" className={formInputClass} {...register('development')}>
                    <option value="">Select (optional)</option>
                    {getPublishedDevelopments().map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={formLabelClass} htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className={`${formInputClass} resize-y min-h-[140px]`}
                    {...register('message')}
                  />
                  {errors.message && (
                    <p className={formErrorClass}>{errors.message.message}</p>
                  )}
                </div>
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 border-border"
                    {...register('viewing')}
                  />
                  Request a property viewing
                </label>
                <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Submit inquiry'}
                </Button>
                {isSubmitSuccessful && (
                  <p className={formSuccessClass} role="status">
                    Thank you — your inquiry was received. Our sales team will follow
                    up using the contact details you provided.
                  </p>
                )}
              </form>
            </div>
          </FadeInWhenVisible>
        </Container>
      </section>
    </>
  )
}
