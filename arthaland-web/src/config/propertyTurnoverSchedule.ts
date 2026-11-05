import type { TurnoverSchedule } from '../domain/development/types'

/** Authoritative turnover copy for property detail pages (English). */
export const PROPERTY_TURNOVER_BY_SLUG: Record<string, TurnoverSchedule> = {
  liv: {
    summary: 'Pre-selling · Estimated turnover Q3 2031',
    milestones: [{ label: 'Estimated turnover', date: 'Q3 2031' }],
  },
  'una-apartments': {
    summary: 'Estimated turnover by tower',
    milestones: [
      { label: 'Tower 1', date: 'December 2026' },
      { label: 'Tower 2', date: 'December 2028' },
      { label: 'Tower 3', date: 'December 2030' },
    ],
  },
  sondris: {
    summary: 'Pre-selling · Estimated turnover April 2030',
    milestones: [{ label: 'Estimated turnover', date: 'April 2030' }],
  },
  eluria: {
    summary: 'Ready for occupancy (RFO)',
    milestones: [{ label: 'Ready for occupancy', date: 'RFO' }],
  },
  'sevina-park': {
    summary: 'Ready for occupancy (RFO)',
    milestones: [{ label: 'Ready for occupancy', date: 'RFO' }],
  },
}

export function applyPropertyTurnoverSchedule<T extends { slug: string; turnoverSchedule?: TurnoverSchedule }>(
  development: T,
): T {
  const schedule = PROPERTY_TURNOVER_BY_SLUG[development.slug] ?? development.turnoverSchedule
  if (!schedule) return development
  return { ...development, turnoverSchedule: schedule }
}
