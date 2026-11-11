import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { auditPropertyPublicVisibility } from '../../lib/cms/propertyPublicAudit'
import type { PropertyPublicAudit } from '../../lib/cms/propertyPublicAudit'

type PropertyPublicVisibilityPanelProps = {
  slug: string
}

export function PropertyPublicVisibilityPanel({ slug }: PropertyPublicVisibilityPanelProps) {
  const [audit, setAudit] = useState<PropertyPublicAudit | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    auditPropertyPublicVisibility(slug)
      .then(setAudit)
      .catch((e: Error) => setError(e.message))
  }, [slug])

  if (error) {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        Could not load public visibility audit: {error}
      </p>
    )
  }

  if (!audit) {
    return (
      <p className="rounded-2xl border border-border bg-surface p-4 text-sm text-title-muted">
        Loading public visibility…
      </p>
    )
  }

  const ok = audit.issues.length === 0

  return (
    <div
      className={`rounded-2xl border p-6 ${ok ? 'border-emerald-200 bg-emerald-50/50' : 'border-amber-200 bg-amber-50/60'}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-title-muted">
            Public site visibility
          </h2>
          <p className="mt-1 text-sm">
            {ok
              ? 'This property should show your CMS content on the live site (when production env matches).'
              : `${audit.issues.length} issue(s) may hide uploads from visitors.`}
          </p>
        </div>
        <Link
          to={`/properties/${slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm underline"
        >
          Open public page
        </Link>
      </div>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-title-muted">CMS on in this build</dt>
          <dd>{audit.cmsEnabledInBuild ? 'Yes' : 'No'}</dd>
        </div>
        <div>
          <dt className="text-title-muted">Listing reachable</dt>
          <dd>{audit.publicPageReachable ? 'Yes' : 'No'}</dd>
        </div>
        <div>
          <dt className="text-title-muted">Hero URL set</dt>
          <dd className="truncate">{audit.heroImageUrl ? 'Yes' : 'Missing'}</dd>
        </div>
        <div>
          <dt className="text-title-muted">Gallery images (public)</dt>
          <dd>
            ~{audit.galleryVisibleOnPublicEstimate} visible · {audit.publishedGalleryCount}{' '}
            published · {audit.unpublishedGalleryCount} hidden
          </dd>
        </div>
        {audit.lastUpdated && (
          <div className="sm:col-span-2">
            <dt className="text-title-muted">developments.updated_at</dt>
            <dd>{audit.lastUpdated}</dd>
          </div>
        )}
      </dl>

      {audit.issues.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-amber-950">
          {audit.issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs text-title-muted">
        Hero → Overview upload · Gallery → Media library · Portfolio card → Set as cover on Media
        library or hero also updates card when empty.
      </p>
    </div>
  )
}
