import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { SalesContactBlock } from '../components/contact/SalesContactBlock'
import { SiteHeader } from '../components/layout/SiteHeader'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { FacebookIcon } from '../components/icons/FacebookIcon'
import {
  formErrorClass,
  formInputUnderlineClass,
  formLabelClass,
  formSuccessClass,
} from '../components/forms/formStyles'
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

function FormCorners() {
  return (
    <>
      <span className="pointer-events-none absolute left-0 top-0 size-[18px] border-l border-t border-ink/25" />
      <span className="pointer-events-none absolute right-0 top-0 size-[18px] border-r border-t border-ink/25" />
      <span className="pointer-events-none absolute bottom-0 left-0 size-[18px] border-b border-l border-ink/25" />
      <span className="pointer-events-none absolute bottom-0 right-0 size-[18px] border-b border-r border-ink/25" />
    </>
  )
}

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
      <section className="hero-under-header relative min-h-[42vh] overflow-hidden bg-ink text-surface md:min-h-[48vh]">
        <img
          src={sectionImages.contactBg}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/50 to-ink" />
        <Container className="section-x relative flex min-h-[42vh] flex-col justify-end pb-28 pt-32 md:min-h-[48vh] md:pb-36">
          <Eyebrow dark>Contact</Eyebrow>
          <h1 className="text-display-l mt-5 max-w-[12ch] animate-fade-up">
            <span className="block">Your Next Chapter</span>
            <span className="block">Starts Here.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-surface/75 animate-fade-up animation-delay-150">
            A private conversation with the ARTHALAND sales team — thoughtful,
            unhurried, and grounded in verified development information.
          </p>
        </Container>
      </section>

      <section className="relative bg-ink pb-20 pt-0 md:pb-28">
        <Container className="section-x relative z-10 -mt-24 md:-mt-32">
          <div className="grid overflow-hidden border border-border-on-dark/80 lg:grid-cols-12 lg:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.45)]">
            {/* Visual + contact panel */}
            <div className="relative min-h-[360px] lg:col-span-5 lg:min-h-[680px]">
              <img
                src={sectionImages.contactPanel}
                alt=""
                className="absolute inset-0 size-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
              <div className="relative flex h-full min-h-[360px] flex-col justify-between p-8 md:p-10 lg:min-h-[680px] lg:p-12">
                <div className="max-w-xs">
                  <p className="text-eyebrow text-surface/60">Consultation</p>
                  <p className="mt-4 text-2xl font-light leading-snug tracking-[-0.04em] text-surface md:text-3xl">
                    Tell us what you are looking for — we will guide you through
                    the published portfolio.
                  </p>
                </div>

                <div className="mt-10 space-y-4 lg:mt-0">
                  <div className="border border-surface/20 bg-ink/40 p-6 backdrop-blur-md md:p-7">
                    <div className="flex gap-4">
                      <MapPin className="mt-0.5 size-5 shrink-0 text-surface/70" aria-hidden />
                      <div>
                        <p className="text-nav text-surface/55">Office</p>
                        <p className="mt-2 text-sm leading-relaxed text-surface/90">
                          Arthaland Century Pacific Tower
                          <br />
                          5th Avenue corner 30th Street
                          <br />
                          Taguig City, 1634 Metro Manila
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 border-t border-surface/15 pt-6">
                      <SalesContactBlock variant="dark" />
                    </div>
                  </div>

                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border border-surface/25 bg-surface/5 px-6 py-4 text-surface transition-colors hover:bg-surface hover:text-ink"
                  >
                    <span className="inline-flex items-center gap-3 text-sm font-medium">
                      <FacebookIcon className="size-5" />
                      ARTHALAND on Facebook
                    </span>
                    <ArrowUpRight className="size-4 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Inquiry form */}
            <div className="relative bg-surface lg:col-span-7">
              <FormCorners />
              <div className="px-8 py-10 md:px-12 md:py-14 lg:px-14 lg:py-16">
                <Eyebrow>Inquiry</Eyebrow>
                <h2 className="text-heading-2 mt-3 max-w-[14ch]">
                  Send a message to our sales team
                </h2>
                <p className="mt-4 max-w-md text-title-muted">
                  Share your details and development interest. The same secure
                  inquiry flow used across this site applies here.
                </p>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-10 space-y-8"
                  noValidate
                >
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div>
                      <label className={formLabelClass} htmlFor="firstName">
                        First name
                      </label>
                      <input
                        id="firstName"
                        className={formInputUnderlineClass}
                        autoComplete="given-name"
                        placeholder="Given name"
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
                        className={formInputUnderlineClass}
                        autoComplete="family-name"
                        placeholder="Family name"
                        {...register('lastName')}
                      />
                      {errors.lastName && (
                        <p className={formErrorClass}>{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <label className={formLabelClass} htmlFor="email">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={formInputUnderlineClass}
                        autoComplete="email"
                        placeholder="you@email.com"
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
                        className={formInputUnderlineClass}
                        autoComplete="tel"
                        placeholder="+63 …"
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p className={formErrorClass}>{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className={formLabelClass} htmlFor="development">
                      Development of interest
                    </label>
                    <select
                      id="development"
                      className={`${formInputUnderlineClass} cursor-pointer`}
                      {...register('development')}
                    >
                      <option value="">Optional — select a development</option>
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
                      rows={4}
                      className={`${formInputUnderlineClass} min-h-[120px] resize-y`}
                      placeholder="How can we help you explore ARTHALAND residences?"
                      {...register('message')}
                    />
                    {errors.message && (
                      <p className={formErrorClass}>{errors.message.message}</p>
                    )}
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 border border-border bg-surface-soft px-5 py-4 text-sm transition-colors hover:border-ink/30">
                    <input
                      type="checkbox"
                      className="size-4 shrink-0 accent-ink"
                      {...register('viewing')}
                    />
                    <span>Request a property viewing where available</span>
                  </label>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending…' : 'Submit inquiry'}
                    </Button>
                    <p className="max-w-xs text-xs text-title-muted">
                      Supervised by Mr. Gary Lee · ARTHALAND property sales
                      channel
                    </p>
                  </div>

                  {isSubmitSuccessful && (
                    <p className={formSuccessClass} role="status">
                      Thank you — your inquiry was received. Our sales team will
                      follow up using the contact details you provided.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </Container>

        {/* Soft transition into footer */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink" />
      </section>
    </>
  )
}
