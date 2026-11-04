import { useEffect, useState } from 'react'
import { getFeaturedUnitGuideSamples } from '../data/seed/featuredUnits.seed'
import type { FeaturedUnit } from '../domain/featuredUnit/types'
import { fetchPublicFeaturedUnits } from '../lib/cms/featuredUnitsApi'
import { useSupabaseCms } from '../lib/supabase/config'

export function usePublicFeaturedUnits() {
  const cms = useSupabaseCms()
  const [items, setItems] = useState<FeaturedUnit[]>(() => getFeaturedUnitGuideSamples())
  const [loading, setLoading] = useState(Boolean(cms))

  useEffect(() => {
    if (!cms) return
    setLoading(true)
    fetchPublicFeaturedUnits()
      .then(setItems)
      .finally(() => setLoading(false))
  }, [cms])

  return { items, loading }
}
