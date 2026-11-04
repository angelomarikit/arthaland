import { useEffect, useState } from 'react'
import type { Development } from '../domain/development/types'
import {
  filterDevelopments,
  getDevelopments as getLocalDevelopments,
  getDevelopmentBySlug as getLocalBySlug,
  getNavigationDevelopments as getLocalNav,
  getPortfolioDevelopments as getLocalPortfolio,
} from '../data/repositories/developmentRepository'
import { fetchPublicDevelopmentBySlug, fetchPublicDevelopments } from '../lib/cms/developmentsApi'
import { useSupabaseCms } from '../lib/supabase/config'

type LoadState = 'idle' | 'loading' | 'ready' | 'error'

export function usePublicDevelopmentsList() {
  const cms = useSupabaseCms()
  const [state, setState] = useState<LoadState>(cms ? 'loading' : 'ready')
  const [items, setItems] = useState<Development[]>(() =>
    cms ? [] : getLocalPortfolio(),
  )
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<'supabase' | 'local'>(cms ? 'supabase' : 'local')

  useEffect(() => {
    if (!cms) {
      setItems(getLocalPortfolio())
      setSource('local')
      setState('ready')
      return
    }
    let cancelled = false
    setState('loading')
    fetchPublicDevelopments()
      .then((rows) => {
        if (cancelled) return
        if (rows.length === 0) {
          setItems(getLocalPortfolio())
          setSource('local')
        } else {
          setItems(rows)
          setSource('supabase')
        }
        setState('ready')
      })
      .catch((e: Error) => {
        if (cancelled) return
        setError(e.message)
        setItems(getLocalPortfolio())
        setSource('local')
        setState('error')
      })
    return () => {
      cancelled = true
    }
  }, [cms])

  return { items, state, error, source, allLocal: getLocalDevelopments() }
}

export function useNavigationDevelopments() {
  const cms = useSupabaseCms()
  const { items: portfolio, state } = usePublicDevelopmentsList()
  if (!cms || state !== 'ready') return getLocalNav()
  const navSlugs = new Set(getLocalNav().map((d) => d.slug))
  const fromDb = portfolio.filter((d) => navSlugs.has(d.slug))
  const missing = getLocalNav().filter((d) => !fromDb.some((x) => x.slug === d.slug))
  return [...fromDb, ...missing].sort((a, b) => a.displayOrder - b.displayOrder)
}

export function usePublicDevelopment(slug: string | undefined) {
  const cms = useSupabaseCms()
  const [state, setState] = useState<LoadState>(cms && slug ? 'loading' : 'ready')
  const [development, setDevelopment] = useState<Development | undefined>(() =>
    slug && !cms ? getLocalBySlug(slug) : undefined,
  )
  const [source, setSource] = useState<'supabase' | 'local'>('local')

  useEffect(() => {
    if (!slug) return
    if (!cms) {
      setDevelopment(getLocalBySlug(slug))
      setSource('local')
      setState('ready')
      return
    }
    let cancelled = false
    setState('loading')
    fetchPublicDevelopmentBySlug(slug)
      .then((row) => {
        if (cancelled) return
        if (row) {
          setDevelopment(row)
          setSource('supabase')
        } else {
          setDevelopment(getLocalBySlug(slug))
          setSource('local')
        }
        setState('ready')
      })
      .catch(() => {
        if (cancelled) return
        setDevelopment(getLocalBySlug(slug))
        setSource('local')
        setState('error')
      })
    return () => {
      cancelled = true
    }
  }, [cms, slug])

  return { development, state, source }
}

export { filterDevelopments }
