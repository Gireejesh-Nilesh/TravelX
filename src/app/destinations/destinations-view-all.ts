import { Component, computed, signal } from '@angular/core';
import { places, Place } from '../shared/places'; // adjust path if needed
import { DecimalPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-destinations-view-all',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, // ✅ FIXES routerLink error
    DecimalPipe, // (keep if you already added it)
  ],
  templateUrl: './destinations-view-all.html',
  styleUrls: ['./destinations-view-all.css'],
})
export class DestinationsViewAllComponent {
  /* ---------------- STATE ---------------- */

  // raw dataset
  places: Place[] = places;

  // UI state
  query = signal('');
  sortAsc = signal(true);

  selectedType = signal<string | null>(null);
  selectedPopularity = signal<string | null>(null);

  /* ---------------- DERIVED FILTER DATA ---------------- */

  types = computed(() => Array.from(new Set(this.places.map((p) => p.type))).sort());

  popularities = computed(() => Array.from(new Set(this.places.map((p) => p.popularFor))).sort());

  /* ---------------- MAIN VIEW MODEL ---------------- */

  filteredPlaces = computed(() => {
    let result = this.places;

    /* ---- TEXT SEARCH ---- */
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

    /* ---- TYPE FILTER ---- */
    const type = this.selectedType();
    if (type) {
      result = result.filter((p) => p.type === type);
    }

    /* ---- POPULARITY FILTER ---- */
    const popularity = this.selectedPopularity();
    if (popularity) {
      result = result.filter((p) => p.popularFor === popularity);
    }

    /* ---- SORTING ---- */
    if (this.sortAsc()) {
      result = [...result].sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      result = [...result].sort((a, b) => b.distanceKm - a.distanceKm);
    }

    return result;
  });

  /* ---------------- EVENT HANDLERS ---------------- */

  updateQuery(value: string) {
    this.query.set(value);
  }

  toggleSort() {
    this.sortAsc.update((v) => !v);
  }

  setType(value: string) {
    this.selectedType.set(value || null);
  }

  setPopularity(value: string) {
    this.selectedPopularity.set(value || null);
  }

  /* ---------------- TRACKING ---------------- */

  trackById(_: number, place: Place) {
    return place.id;
  }
}
