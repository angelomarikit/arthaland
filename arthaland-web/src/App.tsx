import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { MetaPixelPageView } from './components/analytics/MetaPixelPageView'
import { DocumentHead } from './components/seo/DocumentHead'
import { AdminGuard } from './components/admin/AdminGuard'
import { AdminLayout } from './components/admin/AdminLayout'
import { MainLayout } from './components/layout/MainLayout'
import { HomePage } from './pages/HomePage'

const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })),
)
const CertificationsPage = lazy(() =>
  import('./pages/CertificationsPage').then((m) => ({
    default: m.CertificationsPage,
  })),
)
const PropertiesPage = lazy(() =>
  import('./pages/PropertiesPage').then((m) => ({ default: m.PropertiesPage })),
)
const PropertyDetailPage = lazy(() =>
  import('./pages/PropertyDetailPage').then((m) => ({
    default: m.PropertyDetailPage,
  })),
)
const ServicesPage = lazy(() =>
  import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage })),
)
const TeamPage = lazy(() =>
  import('./pages/TeamPage').then((m) => ({ default: m.TeamPage })),
)
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const FeaturedUnitsPage = lazy(() =>
  import('./pages/FeaturedUnitsPage').then((m) => ({ default: m.FeaturedUnitsPage })),
)
const FeaturedUnitDetailPage = lazy(() =>
  import('./pages/FeaturedUnitDetailPage').then((m) => ({
    default: m.FeaturedUnitDetailPage,
  })),
)
const FaqPage = lazy(() =>
  import('./pages/FaqPage').then((m) => ({ default: m.FaqPage })),
)
const PrivacyPage = lazy(() =>
  import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)
const AdminLoginPage = lazy(() =>
  import('./pages/admin/AdminLoginPage').then((m) => ({
    default: m.AdminLoginPage,
  })),
)
const AdminDashboardPage = lazy(() =>
  import('./pages/admin/AdminDashboardPage').then((m) => ({
    default: m.AdminDashboardPage,
  })),
)
const AdminPropertiesPage = lazy(() =>
  import('./pages/admin/AdminPropertiesPage').then((m) => ({
    default: m.AdminPropertiesPage,
  })),
)
const AdminPropertyOverviewPage = lazy(() =>
  import('./pages/admin/AdminPropertyOverviewPage').then((m) => ({
    default: m.AdminPropertyOverviewPage,
  })),
)
const AdminPropertySectionPage = lazy(() =>
  import('./pages/admin/AdminPropertySectionPage').then((m) => ({
    default: m.AdminPropertySectionPage,
  })),
)
const AdminPropertyUnitsPage = lazy(() =>
  import('./pages/admin/AdminPropertyUnitsPage').then((m) => ({
    default: m.AdminPropertyUnitsPage,
  })),
)
const AdminPropertyMediaPage = lazy(() =>
  import('./pages/admin/AdminPropertyMediaPage').then((m) => ({
    default: m.AdminPropertyMediaPage,
  })),
)
const AdminPropertyAmenitiesPage = lazy(() =>
  import('./pages/admin/AdminPropertyAmenitiesPage').then((m) => ({
    default: m.AdminPropertyAmenitiesPage,
  })),
)
const AdminPagesPage = lazy(() =>
  import('./pages/admin/AdminPagesPage').then((m) => ({
    default: m.AdminPagesPage,
  })),
)
const AdminPageDetailPage = lazy(() =>
  import('./pages/admin/AdminPageDetailPage').then((m) => ({
    default: m.AdminPageDetailPage,
  })),
)
const AdminPageSectionPage = lazy(() =>
  import('./pages/admin/AdminPageSectionPage').then((m) => ({
    default: m.AdminPageSectionPage,
  })),
)
const AdminInquiriesPage = lazy(() =>
  import('./pages/admin/AdminInquiriesPage').then((m) => ({
    default: m.AdminInquiriesPage,
  })),
)
const AdminTeamPage = lazy(() =>
  import('./pages/admin/AdminTeamPage').then((m) => ({
    default: m.AdminTeamPage,
  })),
)
const AdminSettingsPage = lazy(() =>
  import('./pages/admin/AdminSettingsPage').then((m) => ({
    default: m.AdminSettingsPage,
  })),
)
const AdminFeaturedUnitsPage = lazy(() =>
  import('./pages/admin/AdminFeaturedUnitsPage').then((m) => ({
    default: m.AdminFeaturedUnitsPage,
  })),
)
const AdminFeaturedUnitEditPage = lazy(() =>
  import('./pages/admin/AdminFeaturedUnitEditPage').then((m) => ({
    default: m.AdminFeaturedUnitEditPage,
  })),
)
const AdminSiteImagesPage = lazy(() =>
  import('./pages/admin/AdminSiteImagesPage').then((m) => ({
    default: m.AdminSiteImagesPage,
  })),
)

function PageFallback() {
  return <div className="min-h-[40vh] bg-surface" aria-hidden />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DocumentHead />
        <MetaPixelPageView />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="certifications" element={<CertificationsPage />} />
              <Route path="properties" element={<PropertiesPage />} />
              <Route path="properties/:slug" element={<PropertyDetailPage />} />
              <Route path="featured-units" element={<FeaturedUnitsPage />} />
              <Route path="featured-units/:slug" element={<FeaturedUnitDetailPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route path="admin/login" element={<AdminLoginPage />} />
            <Route element={<AdminGuard />}>
              <Route element={<AdminLayout />}>
                <Route path="admin" element={<AdminDashboardPage />} />
                <Route path="admin/site-images" element={<AdminSiteImagesPage />} />
                <Route path="admin/pages" element={<AdminPagesPage />} />
                <Route path="admin/pages/:slug" element={<AdminPageDetailPage />} />
                <Route
                  path="admin/pages/:slug/sections/:sectionKey"
                  element={<AdminPageSectionPage />}
                />
                <Route path="admin/properties" element={<AdminPropertiesPage />} />
                <Route
                  path="admin/properties/:slug"
                  element={<AdminPropertyOverviewPage />}
                />
                <Route
                  path="admin/properties/:slug/sections/:sectionKey"
                  element={<AdminPropertySectionPage />}
                />
                <Route
                  path="admin/properties/:slug/units"
                  element={<AdminPropertyUnitsPage />}
                />
                <Route
                  path="admin/properties/:slug/media"
                  element={<AdminPropertyMediaPage />}
                />
                <Route
                  path="admin/properties/:slug/amenities"
                  element={<AdminPropertyAmenitiesPage />}
                />
                <Route path="admin/featured-units" element={<AdminFeaturedUnitsPage />} />
                <Route
                  path="admin/featured-units/:id"
                  element={<AdminFeaturedUnitEditPage />}
                />
                <Route path="admin/inquiries" element={<AdminInquiriesPage />} />
                <Route path="admin/team" element={<AdminTeamPage />} />
                <Route path="admin/settings" element={<AdminSettingsPage />} />
              </Route>
            </Route>

          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
