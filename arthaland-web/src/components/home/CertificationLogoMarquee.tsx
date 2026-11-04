import { certificationLogos } from '../../config/certificationLogos'

const marqueeLogos = [...certificationLogos, ...certificationLogos]

/** Continuous certification strip below the homepage hero (left → right). */
export function CertificationLogoMarquee() {
  return (
    <section
      className="border-b border-border bg-surface py-5 md:py-6"
      aria-label="Green building certifications"
    >
      <p className="sr-only">
        ARTHALAND developments pursue internationally recognized sustainability certifications
        including EDGE, BERDE, LEED, and WELL.
      </p>
      <div className="cert-marquee-viewport overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <ul className="cert-marquee-inner flex w-max items-center gap-12 md:gap-16 lg:gap-20">
          {marqueeLogos.map((logo, index) => (
            <li key={`${logo.src}-${index}`} className="flex shrink-0 items-center">
              <img
                src={logo.src}
                alt={index < certificationLogos.length ? logo.alt : ''}
                aria-hidden={index >= certificationLogos.length ? true : undefined}
                className="cert-marquee-logo h-10 w-auto max-w-[min(42vw,200px)] object-contain object-center md:h-12 lg:h-14"
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
