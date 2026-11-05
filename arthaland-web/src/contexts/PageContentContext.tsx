import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'
import {
  getLivePageSections,
  type PageSectionContent,
} from '../config/pageContentRegistry'
import { buildMergedSectionMap } from '../lib/cms/pageContentMerge'
import { fetchPublicPageSections } from '../lib/cms/pagesApi'
import { pathToPageSlug } from '../lib/cms/routePageSlug'
import { isSupabaseConfigured } from '../lib/supabase/config'
import { clampScrollToDocument, scrollToLocationHash } from '../lib/scrollReset'
import { ScrollTrigger } from '../animation/gsapSetup'

type PageContentContextValue = {
  pageSlug: string | null
  ready: boolean
  getSection: (sectionKey: string) => PageSectionContent
}

const PageContentContext = createContext<PageContentContextValue | null>(null)

export function PageContentProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const cms = isSupabaseConfigured()
  const pageSlug = pathToPageSlug(pathname)
  const [merged, setMerged] = useState<Record<string, PageSectionContent>>({})
  const [ready, setReady] = useState(!cms || !pageSlug)

  useEffect(() => {
    if (!pageSlug) {
      setMerged({})
      setReady(true)
      return
    }

    const defaults = Object.fromEntries(
      getLivePageSections(pageSlug).map((s) => [s.sectionKey, { ...s.content }]),
    )
    setMerged(defaults)

    if (!cms) {
      setReady(true)
      return
    }

    let cancelled = false
    setReady(false)
    fetchPublicPageSections(pageSlug)
      .then((rows) => {
        if (cancelled) return
        setMerged(buildMergedSectionMap(pageSlug, rows))
        setReady(true)
        requestAnimationFrame(() => {
          if (cancelled) return
          ScrollTrigger.refresh(false)
          clampScrollToDocument()
          if (typeof window !== 'undefined' && window.location.hash) {
            scrollToLocationHash(window.location.hash)
          }
        })
      })
      .catch(() => {
        if (cancelled) return
        setMerged(defaults)
        setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [pageSlug, cms])

  const getSection = useCallback(
    (sectionKey: string): PageSectionContent => {
      if (pageSlug) {
        const fromMap = merged[sectionKey]
        if (fromMap) return fromMap
        const live = getLivePageSections(pageSlug).find((s) => s.sectionKey === sectionKey)
        return live?.content ?? {}
      }
      return {}
    },
    [merged, pageSlug],
  )

  const value = useMemo(
    () => ({ pageSlug, ready, getSection }),
    [pageSlug, ready, getSection],
  )

  return (
    <PageContentContext.Provider value={value}>{children}</PageContentContext.Provider>
  )
}

export function usePageSection(sectionKey: string): PageSectionContent {
  const ctx = useContext(PageContentContext)
  if (!ctx) {
    const slug = pathToPageSlug(window.location.pathname)
    const live = slug
      ? getLivePageSections(slug).find((s) => s.sectionKey === sectionKey)
      : undefined
    return live?.content ?? {}
  }
  return ctx.getSection(sectionKey)
}
