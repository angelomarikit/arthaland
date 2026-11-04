/**
 * @deprecated Import from `../data/repositories/developmentRepository` or domain types.
 * Re-exports preserve existing import paths during CMS migration.
 */
export type {
  AvailabilityStatus as DevelopmentStatus,
  Development,
  DevelopmentCategory,
  DevelopmentRecord,
  PropertyType,
  PublicationStatus,
} from '../domain/development/types'

export {
  filterDevelopments,
  getAllDevelopmentRecords,
  getDevelopmentBySlug as getDevelopment,
  getDevelopmentMedia,
  getDevelopments,
  getFeaturedDevelopments,
  getInquiryFormDevelopments,
  getPortfolioDevelopments,
  getNavigationDevelopments,
  getPrimaryFeaturedDevelopment,
  getPublishedDevelopments,
  getUnitTypesByDevelopment,
} from './repositories/developmentRepository'
