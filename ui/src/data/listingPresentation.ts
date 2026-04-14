import type { Task } from '@/data/contract';
import type { DiscoveryListing, ListingKind, TaskPriceType, TaskTaskType } from '@/data/listingTypes';

const serviceImages = [
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
];

const imageFallbacks = ['#DDEBE6', '#E9EEF9', '#F3E6DF', '#E5F0EA', '#E8E6F3', '#EDEBE5'];

export function listingKind(task: Pick<Task, 'task_type' | 'professional' | 'recurring'>): ListingKind {
  return task.task_type === 'tasker' || task.professional || task.recurring ? 'worker' : 'job';
}

export function formatPrice(price: number | null | undefined, priceType: TaskPriceType | null | undefined): string {
  if (price == null) return 'Contact';
  const rounded = Number.isInteger(price) ? String(price) : price.toFixed(2);
  if (priceType === 'per_hour') return `€${rounded}/hr`;
  if (priceType === 'per_day') return `€${rounded}/day`;
  return `€${rounded} fixed`;
}

export function readableTaskType(taskType: TaskTaskType | null | undefined, kind: ListingKind): string {
  if (taskType === 'tasker' || kind === 'worker') return 'Service';
  return 'Job';
}

export function readablePriceType(priceType: TaskPriceType | null | undefined): string {
  if (priceType === 'per_hour') return 'Hourly';
  if (priceType === 'per_day') return 'Daily';
  return 'Fixed';
}

export function taskToListing(task: Task, index: number): DiscoveryListing {
  const kind = listingKind(task);
  const subtitle = task.short_description || task.description || 'Available nearby';
  const hasCoordinates = task.latitude != null && task.longitude != null;

  return {
    id: String(task.id),
    sourceId: task.id,
    kind,
    title: task.name,
    subtitle,
    locationLabel: task.remote_work ? 'Remote friendly' : hasCoordinates ? 'Near Vienna' : `Area ${task.address_id ?? 'nearby'}`,
    rateLabel: formatPrice(task.price, task.price_type ?? null),
    rating: 4.4 + (index % 6) * 0.1,
    reviewCount: 18 + index * 2,
    distanceKm: task.distance_km ?? 0.8 + index * 0.2,
    latitude: task.latitude ?? null,
    longitude: task.longitude ?? null,
    price: task.price ?? null,
    priceType: task.price_type ?? null,
    taskType: task.task_type ?? null,
    imageUrl: serviceImages[index % serviceImages.length],
    imageColor: imageFallbacks[index % imageFallbacks.length],
    trustSignals: [
      kind === 'worker' ? 'Profile checked' : 'Verified poster',
      task.remote_work ? 'Remote ok' : `${(task.distance_km ?? 1.2).toFixed(1)} km away`,
      task.asap ? 'ASAP' : readablePriceType(task.price_type ?? null),
    ],
  };
}
