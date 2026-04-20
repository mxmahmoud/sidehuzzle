import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import { Button, Chip } from '@/components/side/Button';
import { GlassSurface } from '@/components/side/GlassSurface';
import { Text } from '@/components/ui/text';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useThemeColors } from '@/theme/useThemeColors';

type SearchOption = { label: string; icon: keyof typeof Ionicons.glyphMap };
type SearchRow = { type: 'header'; key: string; label: string } | ({ type: 'item'; key: string; source: 'recent' | 'trending' } & SearchOption);

const RECENT_SEARCHES: SearchOption[] = [
  { label: 'Cleaner near me', icon: 'time-outline' },
  { label: 'Ikea assembly', icon: 'time-outline' },
  { label: 'Dog walking today', icon: 'time-outline' },
];

const TRENDING_SEARCHES: SearchOption[] = [
  { label: 'Deep cleaning', icon: 'sparkles-outline' },
  { label: 'Move a sofa', icon: 'cube-outline' },
  { label: 'Dog walking', icon: 'paw-outline' },
  { label: 'Garden cleanup', icon: 'leaf-outline' },
  { label: 'Handyman', icon: 'hammer-outline' },
  { label: 'Painting', icon: 'color-palette-outline' },
];

const CATEGORIES = ['All', 'Cleaning', 'Assembly', 'Moving', 'Garden', 'Handyman', 'Pet care', 'Painting', 'Plumbing', 'Electrical'];
const SORT_OPTIONS = ['Relevance', 'Price: low to high', 'Price: high to low', 'Rating', 'Distance'];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function snapValue(value: number, min: number, max: number, step: number) {
  const snapped = Math.round((value - min) / step) * step + min;
  return clamp(Number(snapped.toFixed(2)), min, max);
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function ratingToValue(rating: string) {
  if (rating === 'Any') return 0;
  const parsed = Number.parseFloat(rating);
  return Number.isFinite(parsed) ? parsed : 0;
}

function ratingFromValue(value: number) {
  return value <= 0 ? 'Any' : `${formatNumber(value)}+`;
}

function PanelTitle({ icon, title, action }: { icon: keyof typeof Ionicons.glyphMap; title: string; action?: ReactNode }) {
  const c = useThemeColors();
  return (
    <View className="flex-row items-center justify-between gap-side-md">
      <View className="min-w-0 flex-1 flex-row items-center gap-side-sm">
        <View className="size-9 items-center justify-center rounded-lg bg-secondary">
          <Ionicons name={icon} size={17} color={c.accent_primary} />
        </View>
        <Text className="text-[15px] font-black leading-5" style={{ color: c.text_primary }}>
          {title}
        </Text>
      </View>
      {action}
    </View>
  );
}

function FilterGroup({ title, children, wrap = true }: { title: string; children: ReactNode; wrap?: boolean }) {
  return (
    <View className="gap-side-sm">
      <Text className="text-[12px] font-bold uppercase leading-4 text-muted-foreground">{title}</Text>
      <View className={wrap ? 'flex-row flex-wrap gap-side-sm' : 'gap-side-md'}>{children}</View>
    </View>
  );
}

function buildSearchRows(query: string): SearchRow[] {
  const trimmedQuery = query.trim();
  const needle = trimmedQuery.toLowerCase();
  const recent = needle ? RECENT_SEARCHES.filter((item) => item.label.toLowerCase().includes(needle)) : RECENT_SEARCHES;
  const trending = needle ? TRENDING_SEARCHES.filter((item) => item.label.toLowerCase().includes(needle)) : TRENDING_SEARCHES;
  const rows: SearchRow[] = [];

  if (recent.length) {
    rows.push({ type: 'header', key: 'recent-header', label: 'Recent searches' });
    rows.push(...recent.map((item) => ({ type: 'item' as const, key: `recent-${item.label}`, source: 'recent' as const, ...item })));
  }

  if (trending.length) {
    rows.push({ type: 'header', key: 'trending-header', label: 'Trending nearby' });
    rows.push(...trending.map((item) => ({ type: 'item' as const, key: `trending-${item.label}`, source: 'trending' as const, ...item })));
  }

  if (!rows.length) {
    rows.push({ type: 'header', key: 'fallback-header', label: 'Trending nearby' });
    rows.push(...TRENDING_SEARCHES.map((item) => ({ type: 'item' as const, key: `fallback-${item.label}`, source: 'trending' as const, ...item })));
  }

  return rows;
}

function SearchSuggestionRow({ item, onSelect }: { item: SearchRow; onSelect: (value: string) => void }) {
  const c = useThemeColors();

  if (item.type === 'header') {
    return (
      <Text className="px-side-xs pt-side-xs text-[12px] font-extrabold uppercase leading-4 tracking-[0px]" style={{ color: c.text_secondary }}>
        {item.label}
      </Text>
    );
  }

  const iconTint = item.source === 'recent' ? c.text_secondary : c.accent_primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.label}
      onPress={() => onSelect(item.label)}
      className="min-h-[50px] flex-row items-center gap-side-md rounded-lg px-side-sm py-side-sm web:cursor-pointer"
    >
      <View className="size-9 items-center justify-center rounded-lg bg-secondary">
        <Ionicons name={item.icon} size={17} color={iconTint} />
      </View>
      <Text className="min-w-0 flex-1 text-[15px] font-bold leading-5" style={{ color: c.text_primary }} numberOfLines={1}>
        {item.label}
      </Text>
      <Ionicons name="chevron-forward" size={15} color={c.text_secondary} />
    </Pressable>
  );
}

function RangeSlider({
  label,
  value,
  min,
  max,
  step,
  valueLabel,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  valueLabel: string;
  onChange: (value: number) => void;
}) {
  const c = useThemeColors();
  const [trackWidth, setTrackWidth] = useState(0);
  const progress = (clamp(value, min, max) - min) / (max - min);

  const updateFromEvent = (event: GestureResponderEvent) => {
    if (!trackWidth) return;
    const nextProgress = clamp(event.nativeEvent.locationX / trackWidth, 0, 1);
    onChange(snapValue(min + nextProgress * (max - min), min, max, step));
  };

  return (
    <GlassSurface variant="control" className="w-full gap-side-md p-side-md">
      <View className="flex-row items-center justify-between gap-side-md">
        <Text className="text-[14px] font-bold leading-5" style={{ color: c.text_primary }}>
          {label}
        </Text>
        <Text className="text-[13px] font-extrabold leading-[18px]" style={{ color: c.accent_primary }}>
          {valueLabel}
        </Text>
      </View>

      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min, max, now: value, text: valueLabel }}
        className="h-9 justify-center"
        onLayout={(event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={updateFromEvent}
        onResponderMove={updateFromEvent}
      >
        <View className="h-[5px] overflow-hidden rounded-full" style={{ backgroundColor: c.glass_control }}>
          <View className="h-full rounded-full bg-primary" style={{ width: `${progress * 100}%` }} />
        </View>
        <View
          className="absolute top-[8px] size-5 rounded-full border bg-background"
          style={{
            borderColor: c.accent_primary,
            left: `${progress * 100}%`,
            transform: [{ translateX: -10 }],
          }}
        />
      </View>
    </GlassSurface>
  );
}

export function SearchSuggestionsPanel({
  query,
  onSelect,
  onClose,
}: {
  query: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const rows = useMemo(() => buildSearchRows(query), [query]);
  const listHeight = Math.min(340, Math.max(190, rows.length * 48));

  return (
    <GlassSurface variant="sheet" className="gap-side-md p-side-md" testID="search-suggestions-panel">
      <View className="items-end">
        <Button icon="close" variant="icon" accessibilityLabel="Close search suggestions" onPress={onClose} />
      </View>
      <View style={{ height: listHeight }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {rows.map((item, index) => (
            <View key={item.key}>
              <SearchSuggestionRow item={item} onSelect={onSelect} />
              {index < rows.length - 1 ? <View className="h-1" /> : null}
            </View>
          ))}
        </ScrollView>
      </View>
    </GlassSurface>
  );
}

export function DiscoveryFilterPanel({ onApply, onClose }: { onApply: () => void; onClose: () => void }) {
  const c = useThemeColors();
  const category = useDiscoveryStore((s) => s.category);
  const sortBy = useDiscoveryStore((s) => s.sortBy);
  const priceRange = useDiscoveryStore((s) => s.priceRange);
  const distance = useDiscoveryStore((s) => s.distance);
  const rating = useDiscoveryStore((s) => s.rating);
  const setCategory = useDiscoveryStore((s) => s.setCategory);
  const setSortBy = useDiscoveryStore((s) => s.setSortBy);
  const setPriceRange = useDiscoveryStore((s) => s.setPriceRange);
  const setDistance = useDiscoveryStore((s) => s.setDistance);
  const setRating = useDiscoveryStore((s) => s.setRating);
  const resetFilters = useDiscoveryStore((s) => s.resetFilters);

  return (
    <GlassSurface variant="sheet" className="gap-side-lg p-side-md" testID="discovery-filter">
      <PanelTitle
        icon="options-outline"
        title="Filter the market"
        action={<Button icon="close" variant="icon" accessibilityLabel="Close filters" onPress={onClose} />}
      />

      <ScrollView className="max-h-[320px] md:max-h-[560px]" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="gap-side-lg pb-side-sm">
          <FilterGroup title="Price range" wrap={false}>
            <RangeSlider
              label="Hourly budget"
              value={priceRange[1]}
              min={20}
              max={200}
              step={5}
              valueLabel={`up to €${priceRange[1]}/hr`}
              onChange={(next) => setPriceRange([0, next])}
            />
          </FilterGroup>

          <FilterGroup title="Distance" wrap={false}>
            <RangeSlider
              label="Radius"
              value={Number.parseFloat(distance) || 10}
              min={1}
              max={50}
              step={1}
              valueLabel={`${Math.round(Number.parseFloat(distance) || 10)} km`}
              onChange={(next) => setDistance(`${Math.round(next)} km`)}
            />
          </FilterGroup>

          <FilterGroup title="Rating" wrap={false}>
            <RangeSlider
              label="Minimum rating"
              value={ratingToValue(rating)}
              min={0}
              max={5}
              step={0.5}
              valueLabel={rating === 'Any' ? 'Any rating' : `${rating.replace('+', '')}+ stars`}
              onChange={(next) => setRating(ratingFromValue(next))}
            />
          </FilterGroup>

          <FilterGroup title="Category">
            {CATEGORIES.map((cat) => (
              <Chip key={cat} label={cat} selected={category === cat} onPress={() => setCategory(cat)} />
            ))}
          </FilterGroup>

          <FilterGroup title="Sort by">
            {SORT_OPTIONS.map((opt) => (
              <Chip key={opt} label={opt} selected={sortBy === opt} onPress={() => setSortBy(opt)} />
            ))}
          </FilterGroup>
        </View>
      </ScrollView>

      <View className="flex-row gap-side-sm">
        <Button
          label="Reset"
          icon="refresh-outline"
          variant="secondary"
          className="flex-1"
          onPress={() => {
            resetFilters();
            onClose();
          }}
        />
        <Button label="Apply" icon="checkmark" variant="primary" className="flex-1" onPress={onApply} testID="apply-filters" />
      </View>
    </GlassSurface>
  );
}
