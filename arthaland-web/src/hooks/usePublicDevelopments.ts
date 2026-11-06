import { useEffect, useState } from 'react'
import type { Development, UnitType } from '../domain/development/types'
import { isSoldOutDevelopment } from '../config/developments'
import {
  filterDevelopments,
  getDevelopments as getLocalDevelopments,
  getDevelopmentBySlug as getLocalBySlug,
  getNavigationDevelopments as getLocalNav,
  getPortfolioDevelopments as getLocalPortfolio,
  getUnitTypesByDevelopment as getLocalUnitTypesByDevelopment,
} from '../data/repositories/developmentRepository'
import { fetchPublicDevelopments, fetchPublicPropertyDetail } from '../lib/cms/developmentsApi'
import { useSupabaseCms } from '../lib/supabase/config'

type LoadState = 'idle' | 'loading' | 'ready' | 'error'

function filterNavAndInquiry(list: Development[]): Development[] {
  return list.filter(
    (d) =>
      !isSoldOutDevelopment(d.slug) &&
      (d.publicationStatus === 'published' || d.publicationStatus === 'coming_soon'),
  )
}

export function usePublicDevelopmentsList() {
  const cms = useSupabaseCms()
  const [state, setState] = useState<LoadState>(cms ? 'loading' : 'ready')
  const [items, setItems] = useState<Development[]>(() => (cms ? [] : getLocalPortfolio()))
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (!cms) {
      setItems(getLocalPortfolio())
      setError(null)
      setState('ready')
      return
    }
    let cancelled = false
    setState('loading')
    setError(null)
    fetchPublicDevelopments()
      .then((rows) => {
        if (cancelled) return
        setItems(rows)
        setState('ready')
      })
      .catch((e: Error) => {
        if (cancelled) return
        setError(e.message)
        setItems([])
        setState('error')
      })
    return () => {
      cancelled = true
    }
  }, [cms])

  return { items, state, error, allLocal: getLocalDevelopments() }
}

export function useNavigationDevelopments() {
  const cms = useSupabaseCms()
  const { items: portfolio, state } = usePublicDevelopmentsList()
  if (!cms) return getLocalNav()
  if (state !== 'ready') return []
  return filterNavAndInquiry(portfolio).sort((a, b) => a.displayOrder - b.displayOrder)
}

export function useInquiryDevelopments() {
  const cms = useSupabaseCms()
  const [state, setState] = useState<LoadState>(cms ? 'loading' : 'ready')
  const [items, setItems] = useState<Development[]>(() =>
    cms ? [] : filterNavAndInquiry(getLocalNav()),
  )

  useEffect(() => {
    if (!cms) {
      setItems(filterNavAndInquiry(getLocalNav()))
      setState('ready')
      return
    }
    let cancelled = false
    setState('loading')
    fetchPublicDevelopments()
      .then((rows) => {
        if (cancelled) return
        setItems(filterNavAndInquiry(rows))
        setState('ready')
      })
      .catch(() => {
        if (cancelled) return
        setItems([])
        setState('error')
      })
    return () => {
      cancelled = true
    }
  }, [cms])

  return { items, state }
}

/** Property detail with unit types and floor plans from Supabase when CMS is enabled. */
export function usePublicDevelopmentDetail(slug: string | undefined) {
  const cms = useSupabaseCms()
  const [state, setState] = useState<LoadState>(cms && slug ? 'loading' : 'ready')
  const [development, setDevelopment] = useState<Development | undefined>()
  const [units, setUnits] = useState<UnitType[]>([])

  useEffect(() => {
    if (!slug) {
      setDevelopment(undefined)
      setUnits([])
      setState('ready')
      return
    }
    if (!cms) {
      const dev = getLocalBySlug(slug)
      setDevelopment(dev)
      setUnits(dev ? getLocalUnitTypesByDevelopment(dev.id) : [])
      setState('ready')
      return
    }
    let cancelled = false
    setState('loading')
    fetchPublicPropertyDetail(slug)
      .then((detail) => {
        if (cancelled) return
        if (detail) {
          setDevelopment(detail.development)
          setUnits(detail.units)
        } else {
          setDevelopment(undefined)
          setUnits([])
        }
        setState('ready')
      })
      .catch(() => {
        if (cancelled) return
        setDevelopment(undefined)
        setUnits([])
        setState('error')
      })
    return () => {
      cancelled = true
    }
  }, [cms, slug])

  return { development, units, state }
}

export { filterDevelopments }
