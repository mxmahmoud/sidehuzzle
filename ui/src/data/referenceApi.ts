import { apiGet } from '@/data/api'

import { referenceDataSchema, type ReferenceData } from '@/data/contract'

export async function getReferenceData(): Promise<ReferenceData> {
  return referenceDataSchema.parse(await apiGet('/reference-data'))
}
