export type ListingKind = 'job' | 'worker';

export type DiscoveryListing = {
  id: string;
  sourceId: number;
  kind: ListingKind;
  title: string;
  subtitle: string;
  locationLabel: string;
  rateLabel: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  latitude: number | null;
  longitude: number | null;
  price: number | null;
  priceType: TaskPriceType | null;
  taskType: TaskTaskType | null;
  imageUrl: string;
  imageColor: string;
  trustSignals: string[];
};

export type TaskPriceType = 'per_hour' | 'fixed' | 'per_day';

export type TaskTaskType = 'task' | 'tasker';

export type TaskRecord = {
  id: number;
  name: string;
  short_description: string | null;
  description: string | null;
  price: number | null;
  price_type: TaskPriceType | null;
  task_type: TaskTaskType | null;
  asap: boolean | null;
  professional: boolean | null;
  recurring: boolean | null;
  remote_work: boolean | null;
  work_required_from: string | null;
  work_required_to: string | null;
  latitude: number | null;
  longitude: number | null;
  user_id: number | null;
  category_id: number | null;
  address_id: number | null;
  active: boolean | null;
};

export type TaskWithDistance = TaskRecord & {
  distance_km?: number;
};
