import { Outlet } from 'react-router-dom'
import { ScrollMotionProvider } from '../motion/ScrollMotionProvider'
import { PageTransition } from './PageTransition'
import { ScrollToTop } from './ScrollToTop'
import { SiteFooter } from './SiteFooter'
import { SupportWidget } from '../support/SupportWidget'

export function MainLayout() {
  return (
    <ScrollMotionProvider>
      <ScrollToTop />
      <PageTransition>
        <Outlet />
        <SiteFooter />
      </PageTransition>
      <SupportWidget />
    </ScrollMotionProvider>
  )
}
