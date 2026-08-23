/**
 * Zone 3 aggregation guard.
 *
 * Any organisational figure derived from people passes through here. Groups
 * below the tenant's aggregation floor are suppressed rather than rounded, so
 * a small division can never be reverse-engineered into an individual.
 */
export interface Aggregate<T> {
  suppressed: boolean;
  populationSize: number;
  value: T | null;
  reason?: string;
}

export function aggregate<T>(populationSize: number, minimum: number, compute: () => T): Aggregate<T> {
  if (populationSize < minimum) {
    return {
      suppressed: true,
      populationSize,
      value: null,
      reason: `Group of ${populationSize} is below the aggregation floor of ${minimum}.`,
    };
  }
  return { suppressed: false, populationSize, value: compute() };
}

export const zoneLabels = {
  zone1: 'Administrative data',
  zone2: 'Personal wellbeing vault',
  zone3: 'Organisational intelligence',
} as const;

export const zoneDescriptions = {
  zone1: 'Entitlement, transactions, clinic visits, MC dates and approvals. Visible to authorised HR, Finance and administrators.',
  zone2: 'Voluntary wellbeing readings, check-ins, screening detail and personal goals. Employee-owned and consent-controlled.',
  zone3: 'Aggregated trends, participation and anonymous patterns. Visible to authorised leadership and the wellbeing team, suppressed below the aggregation floor.',
} as const;
