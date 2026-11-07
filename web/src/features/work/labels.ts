import type { ProjectSector, ProjectType } from '@/lib/types'

// The order the filters show the kinds and sectors in. Their names are in the
// dictionary: work.types (plural, as the visitor reads a shelf of work),
// work.sectors, and work.type for one project's kind.
export const TYPES: ProjectType[] = ['system', 'finance', 'website', 'platform', 'app']

export const SECTORS: ProjectSector[] = ['charity', 'education', 'government', 'dawah', 'business']

/** A country's name from the dictionary's work.countries; any other code shows as is. */
export const countryName = (countries: Record<string, string>, code: string | null) => (code ? (countries[code] ?? code) : null)
