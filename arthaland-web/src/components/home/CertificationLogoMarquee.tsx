import { certificationLogos } from '../../config/certificationLogos'

/** Two identical sequences — 50% translate lines up on fixed-width slots for a seamless loop. */
const marqueeLogos = [...certificationLogos, ...certificationLogos]

/** Full-bleed certification strip after the homepage introduction. */
export function CertificationLogoMarquee() {
  return (
    <section
      className="w-full border-y border-border bg-surface py-6 md:py-8 lg:py-10"
      aria-label="Green building certifications"
    >
      <p className="sr-only">
        ARTHALAND developments pursue internationally recognized sustainability certifications
        including EDGE, BERDE, LEED, and WELL.
      </p>
      <div className="cert-marquee-viewport relative left-1/2 w-full max-w-[100vw] -translate-x-1/2 overflow-hidden">
        <ul className="cert-marquee-inner flex w-max items-center">
          {marqueeLogos.map((logo, index) => (
            <li
              key={`${logo.src}-${index}`}
              className="cert-marquee-slot flex shrink-0 items-center justify-center"
            >
              <img
                src={logo.src}
                alt={index < certificationLogos.length ? logo.alt : ''}
                aria-hidden={index >= certificationLogos.length ? true : undefined}
                className="cert-marquee-logo max-h-full w-full object-contain object-center"
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
