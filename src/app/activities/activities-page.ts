import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { BookingService, Booking } from '../shared/booking.service';
import { distanceKm } from '../shared/geo';
import { Place, places } from '../shared/places';

type Tab = 'visited' | 'recommended';

const LOCATION_KEY = 'travel_location';
type StoredLocation = {
  label: string;
  lat?: number;
  lng?: number;
  source?: 'manual' | 'api';
};

@Component({
  selector: 'app-activities-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './activities-page.html',
  styleUrls: ['./activities-page.css'],
})
export class ActivitiesPage implements OnInit {
  readonly activeTab = signal<Tab>('visited');
  readonly userName = signal('Traveler');
  readonly locationLabel = signal<string | null>(null);
  readonly locationCoords = signal<{ lat: number; lng: number } | null>(null);
  readonly locationLoading = signal(false);
  readonly bookings = signal<Booking[]>([]);

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.authService.user) {
      sessionStorage.setItem('auth_return', '/activities');
      this.router.navigateByUrl('/signin');
      return;
    }
    this.userName.set(this.authService.user?.name ?? 'Traveler');
    this.bookings.set(this.bookingService.loadBookings());
    const stored = this.loadStoredLocation();
    this.locationLabel.set(stored?.label ?? null);
    this.locationCoords.set(
      stored?.lat != null && stored?.lng != null
        ? { lat: stored.lat, lng: stored.lng }
        : null,
    );
    if (!stored || stored.source !== 'manual') {
      this.fetchLocationFromApi();
    }
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  get visitedPlaces(): Booking[] {
    return this.bookings();
  }

  get recommendedPlaces(): Place[] {
    const coords = this.locationCoords();
    if (coords) {
      return [...places]
        .sort((a, b) => distanceKm(coords, a.coordinates) - distanceKm(coords, b.coordinates))
        .slice(0, 5);
    }

    const location = this.locationLabel();
    if (!location) {
      return places.slice(0, 5);
    }
    const match = this.findCoordinatesFromLabel(location);
    if (!match) {
      return places.slice(0, 5);
    }
    return [...places]
      .sort(
        (a, b) =>
          distanceKm(match, a.coordinates) - distanceKm(match, b.coordinates),
      )
      .slice(0, 5);
  }

  updateLocation(label: string): void {
    const trimmed = label.trim();
    if (!trimmed) {
      return;
    }
    const coords = this.findCoordinatesFromLabel(trimmed);
    this.persistLocation({
      label: trimmed,
      lat: coords?.lat,
      lng: coords?.lng,
      source: 'manual',
    });
  }

  private loadStoredLocation(): StoredLocation | null {
    const raw = localStorage.getItem(LOCATION_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as StoredLocation;
    } catch {
      return null;
    }
  }

  private findCoordinatesFromLabel(label: string): { lat: number; lng: number } | null {
    const normalized = label.trim().toLowerCase();
    const match = places.find(
      (place) =>
        place.name.toLowerCase().includes(normalized) ||
        place.country.toLowerCase().includes(normalized),
    );
    return match?.coordinates ?? null;
  }

  private persistLocation(location: StoredLocation): void {
    localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
    this.locationLabel.set(location.label);
    this.locationCoords.set(
      location.lat != null && location.lng != null
        ? { lat: location.lat, lng: location.lng }
        : null,
    );
  }

  private async fetchLocationFromApi(): Promise<void> {
    this.locationLoading.set(true);
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as {
        city?: string;
        region?: string;
        country_name?: string;
        latitude?: number;
        longitude?: number;
      };
      const label = [data.city, data.region, data.country_name]
        .filter(Boolean)
        .join(', ');
      if (!label) {
        return;
      }
      this.persistLocation({
        label,
        lat: data.latitude,
        lng: data.longitude,
        source: 'api',
      });
    } catch {
      // Ignore location errors and fall back to manual input.
    } finally {
      this.locationLoading.set(false);
    }
  }

  bookingStatusLabel(booking: Booking): string {
    if (booking.status === 'visiting-soon' && this.isPastDate(booking.createdAt)) {
      return 'Visited';
    }
    if (booking.status === 'visiting-soon') {
      return 'Visiting soon';
    }
    return 'Booked';
  }

  bookingDateLabel(booking: Booking): string {
    if (!booking.createdAt) {
      return 'Date not set';
    }
    const date = new Date(booking.createdAt);
    if (Number.isNaN(date.getTime())) {
      return 'Date not set';
    }
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  private isPastDate(value: string): boolean {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return false;
    }
    const now = new Date();
    const visitDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return today.getTime() > visitDay.getTime();
  }
}
