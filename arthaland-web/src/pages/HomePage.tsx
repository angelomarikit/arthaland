import { CinematicHero } from '../components/hero/CinematicHero'
import { PropertyDiscoveryBar } from '../components/property/PropertyDiscoveryBar'
import { ArchitecturalGallerySection } from '../components/home/ArchitecturalGallerySection'
import { ClosingCtaSection } from '../components/home/ClosingCtaSection'
import { EditorialIntroSection } from '../components/home/EditorialIntroSection'
import { FeaturedHorizontalShowcase } from '../components/home/FeaturedHorizontalShowcase'
import { HomeFaqSection } from '../components/home/HomeFaqSection'
import { HomeInquirySection } from '../components/home/HomeInquirySection'
import { LifestyleEditorialSection } from '../components/home/LifestyleEditorialSection'
import { ServicesPinnedSection } from '../components/home/ServicesPinnedSection'
import { SustainabilityExpandSection } from '../components/home/SustainabilityExpandSection'

export function HomePage() {
  return (
    <>
      <CinematicHero />
      <PropertyDiscoveryBar />
      <EditorialIntroSection />
      <FeaturedHorizontalShowcase />
      <SustainabilityExpandSection />
      <LifestyleEditorialSection />
      <ArchitecturalGallerySection />
      <ServicesPinnedSection />
      <HomeFaqSection />
      <HomeInquirySection />
      <ClosingCtaSection />
    </>
  )
}
