import type { DiscoveryListing } from '@/data/listingTypes';

const palette = ['#C7D2FE', '#FBCFE8', '#A7F3D0', '#FDE68A', '#BFDBFE', '#E9D5FF'];
const neighborhoods = ['Surry Hills', 'Bondi', 'Parramatta', 'Newtown', 'Manly', 'Chatswood'];
const workerSubtitles = [
  'Top rated pro with same-day availability',
  'Five-star home cleaning specialist',
  'Assembly expert for flat-pack jobs',
  'Trusted dog walker with repeat clients',
  'Garden care with own equipment',
];
const jobSubtitles = [
  'Need help this afternoon',
  'Photos and supplies included',
  'Flexible timing this week',
  'Quick turnaround preferred',
  'Recurring work possible',
];

function seedListings(mode: 'job' | 'worker' | 'group'): DiscoveryListing[] {
  const kinds: Array<'job' | 'worker'> =
    mode === 'group' ? ['job', 'worker'] : mode === 'worker' ? ['worker'] : ['job'];
  return Array.from({ length: 24 }, (_, i) => {
    const kind = kinds[i % kinds.length];
    return {
      id: `${kind}-${i + 1}`,
      kind,
      title:
        kind === 'job'
          ? ['Deep clean 2BR', 'IKEA assembly', 'Dog walking', 'Garden tidy', 'Move-out clean'][i % 5]
          : ['Alex — Handyman', 'Sam — Cleaner', 'Jordan — Assembler', 'Riley — Walker', 'Casey — Gardener'][
              i % 5
            ],
      subtitle: kind === 'job' ? jobSubtitles[i % jobSubtitles.length] : workerSubtitles[i % workerSubtitles.length],
      locationLabel: neighborhoods[i % neighborhoods.length],
      rateLabel: kind === 'job' ? `$${45 + (i % 5) * 5}/hr` : `$${35 + (i % 4) * 5}/hr`,
      rating: 4.2 + (i % 8) * 0.1,
      reviewCount: 12 + i * 3,
      distanceKm: 0.5 + i * 0.3,
      imageColor: palette[i % palette.length],
    };
  });
}

export async function fetchMockListings(mode: 'job' | 'worker' | 'group'): Promise<DiscoveryListing[]> {
  await new Promise((r) => setTimeout(r, 220));
  return seedListings(mode);
}
