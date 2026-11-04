import { certificationLogos } from '../../config/certificationLogos'

const marqueeLogos = [...certificationLogos, ...certificationLogos]

/** Continuous certification strip below the homepage hero (left → right). */
export function CertificationLogoMarquee() {
  return (
    <section
      className="border-b border-border bg-surface py-8 md:py-10"
      aria-label="Green building certifications"
    >
      <p className="sr-only">
        ARTHALAND developments pursue internationally recognized sustainability certifications
        including EDGE, BERDE, LEED, and WELL.
      </p>
      <div className="cert-marquee-viewport overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <ul className="cert-marquee-inner flex w-max items-center gap-[4.5rem] md:gap-24 lg:gap-[7.5rem]">
          {marqueeLogos.map((logo, index) => (
            <li key={`${logo.src}-${index}`} className="flex shrink-0 items-center">
              <img
                src={logo.src}
                alt={index < certificationLogos.length ? logo.alt : ''}
                aria-hidden={index >= certificationLogos.length ? true : undefined}
                className="cert-marquee-logo h-[6.25rem] w-auto max-w-[min(88vw,500px)] object-contain object-center md:h-[7.5rem] lg:h-[8.75rem]"
                loading={index < 4 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
