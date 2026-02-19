import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  QueryList,
  ViewChildren,
  computed,
  signal,
} from '@angular/core';
import { places, Place } from '../shared/places';
import { DecimalPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

type DistanceMode = 'asc' | 'desc' | 'custom';

@Component({
  selector: 'app-destinations-view-all',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './destinations-view-all.html',
  styleUrls: ['./destinations-view-all.css'],
})
export class DestinationsViewAllComponent implements AfterViewInit, OnDestroy {
  constructor(private el: ElementRef) {}
  @ViewChildren('cardEl') cardElements!: QueryList<ElementRef<HTMLElement>>;

  menuOpen = signal(false);
  activeChild = signal<string | null>(null);
  isCustomDistanceOpen = signal(false);
  places: Place[] = places;
  query = signal('');

  priceMaxLimit = 20000;

  priceMin = signal(0);
  priceMax = signal(this.priceMaxLimit);

  private draggingThumb: 'min' | 'max' | null = null;
  private activeSlider: HTMLElement | null = null;
  private cardChangesSub?: Subscription;
  private previousCardPositions = new Map<number, DOMRect>();

  priceMinPercent = computed(() => this.clampPercent((this.priceMin() / this.priceMaxLimit) * 100));

  priceMaxPercent = computed(() => this.clampPercent((this.priceMax() / this.priceMaxLimit) * 100));

  tooltipOverlap = computed(() => Math.abs(this.priceMaxPercent() - this.priceMinPercent()) < 8);

  private clampPercent(value: number) {
    return Math.max(0, Math.min(100, value));
  }

  toggleMenu() {
    this.menuOpen.update((v) => !v);

    if (!this.menuOpen()) {
      this.activeChild.set(null);
      this.isCustomDistanceOpen.set(false);
    }
  }

  toggleChild(name: string) {
    this.activeChild.update((current) => (current === name ? null : name));
  }

  closeAllMenus() {
    this.menuOpen.set(false);
    this.activeChild.set(null);
    this.isCustomDistanceOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.draggingThumb) return;
    if (this.el.nativeElement.contains(target)) return;

    this.closeAllMenus();
  }

  @HostListener('window:resize')
  handleResize() {
    this.captureCardPositions();
  }

  startSliderDrag(event: MouseEvent, thumb: 'min' | 'max') {
    event.preventDefault();

    this.draggingThumb = thumb;

    const target = event.currentTarget as HTMLElement;
    this.activeSlider = target.closest('.price-slider') as HTMLElement;

    window.addEventListener('mousemove', this.onSliderDrag);
    window.addEventListener('mouseup', this.stopSliderDrag);
  }

  onSliderDrag = (event: MouseEvent) => {
    if (!this.draggingThumb || !this.activeSlider) return;

    const rect = this.activeSlider.getBoundingClientRect();

    const percent = this.clampPercent(((event.clientX - rect.left) / rect.width) * 100);

    const value = Math.round((percent / 100) * this.priceMaxLimit);

    if (this.draggingThumb === 'min') {
      if (value >= this.priceMax()) return;
      this.priceMin.set(value);
    } else {
      if (value <= this.priceMin()) return;
      this.priceMax.set(value);
    }

    this.setPriceRange(this.priceMin(), this.priceMax());
  };

  stopSliderDrag = () => {
    this.draggingThumb = null;
    this.activeSlider = null;

    window.removeEventListener('mousemove', this.onSliderDrag);
    window.removeEventListener('mouseup', this.stopSliderDrag);
  };

  sortState = signal({
    distanceMode: 'asc' as DistanceMode,
    minDistance: null as number | null,
    maxDistance: null as number | null,

    selectedTypes: [] as string[],
    selectedPopularities: [] as string[],

    minPrice: null as number | null,
    maxPrice: null as number | null,
  });

  types = computed(() => Array.from(new Set(this.places.map((p) => p.type))).sort());

  popularities = computed(() => Array.from(new Set(this.places.map((p) => p.popularFor))).sort());

  isDistanceActive = computed(() => {
    const s = this.sortState();
    return s.distanceMode !== 'asc';
  });

  isTypeActive = computed(() => this.sortState().selectedTypes.length > 0);

  isPopularityActive = computed(() => this.sortState().selectedPopularities.length > 0);

  isPriceActive = computed(() => {
    const state = this.sortState();

    if (state.minPrice === null && state.maxPrice === null) return false;

    return state.minPrice !== 0 || state.maxPrice !== this.priceMaxLimit;
  });

  filteredPlaces = computed(() => {
    let result = this.places;
    const state = this.sortState();

    const q = this.query().toLowerCase().trim();

    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.blurb.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }

    if (state.selectedTypes.length) {
      result = result.filter((p) => state.selectedTypes.includes(p.type));
    }

    if (state.selectedPopularities.length) {
      result = result.filter((p) => state.selectedPopularities.includes(p.popularFor));
    }

    if (state.minPrice !== null) {
      result = result.filter((p) => p.price >= state.minPrice!);
    }

    if (state.maxPrice !== null) {
      result = result.filter((p) => p.price <= state.maxPrice!);
    }

    if (state.distanceMode === 'custom') {
      if (state.minDistance !== null) {
        result = result.filter((p) => p.distanceKm >= state.minDistance!);
      }

      if (state.maxDistance !== null) {
        result = result.filter((p) => p.distanceKm <= state.maxDistance!);
      }
    }

    if (state.distanceMode === 'asc') {
      result = [...result].sort((a, b) => a.distanceKm - b.distanceKm);
    }

    if (state.distanceMode === 'desc') {
      result = [...result].sort((a, b) => b.distanceKm - a.distanceKm);
    }

    return result;
  });

  updateQuery(value: string) {
    this.query.set(value);
  }

  setDistanceMode(mode: DistanceMode) {
    this.sortState.update((s) => ({
      ...s,
      distanceMode: mode,
      minDistance: null,
      maxDistance: null,
    }));
  }

  setCustomDistance(min: number | null, max: number | null) {
    this.sortState.update((s) => ({
      ...s,
      distanceMode: 'custom',
      minDistance: min,
      maxDistance: max,
    }));
  }

  setType(type: string) {
    this.sortState.update((s) => ({
      ...s,
      selectedTypes: s.selectedTypes[0] === type ? [] : [type],
    }));
  }

  setPopularity(popularity: string) {
    this.sortState.update((s) => ({
      ...s,
      selectedPopularities: s.selectedPopularities[0] === popularity ? [] : [popularity],
    }));
  }

  setPriceRange(min: number | null, max: number | null) {
    this.sortState.update((s) => ({
      ...s,
      minPrice: min,
      maxPrice: max,
    }));
  }

  clearAllFilters() {
    this.priceMin.set(0);
    this.priceMax.set(this.priceMaxLimit);

    this.sortState.set({
      distanceMode: 'asc',
      minDistance: null,
      maxDistance: null,
      selectedTypes: [],
      selectedPopularities: [],
      minPrice: null,
      maxPrice: null,
    });

    this.closeAllMenus();
  }

  trackById(_: number, place: Place) {
    return place.id;
  }

  ngAfterViewInit() {
    this.captureCardPositions();
    this.cardChangesSub = this.cardElements.changes.subscribe(() => {
      this.animateCardMovement();
    });
  }

  ngOnDestroy() {
    this.cardChangesSub?.unsubscribe();
  }

  private captureCardPositions() {
    this.previousCardPositions.clear();

    this.cardElements.forEach((ref) => {
      const el = ref.nativeElement;
      const id = Number(el.dataset['placeId']);
      if (!Number.isNaN(id)) {
        this.previousCardPositions.set(id, el.getBoundingClientRect());
      }
    });
  }

  private animateCardMovement() {
    this.cardElements.forEach((ref) => {
      const el = ref.nativeElement;
      const id = Number(el.dataset['placeId']);
      const newPosition = el.getBoundingClientRect();
      const oldPosition = this.previousCardPositions.get(id);

      if (!oldPosition) {
        el.animate(
          [
            { opacity: 0, transform: 'translateY(12px) scale(0.98)' },
            { opacity: 1, transform: 'translateY(0) scale(1)' },
          ],
          { duration: 240, easing: 'ease-out' },
        );
        return;
      }

      const deltaX = oldPosition.left - newPosition.left;
      const deltaY = oldPosition.top - newPosition.top;

      if (!deltaX && !deltaY) return;

      el.animate(
        [
          { transform: `translate(${deltaX}px, ${deltaY}px)` },
          { transform: 'translate(0, 0)' },
        ],
        { duration: 360, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
    });

    this.captureCardPositions();
  }
}
