import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { BookingService } from '../shared/booking.service';
import { places } from '../shared/places';

type HotelOption = {
  name: string;
  basePrice: number;
};

@Component({
  selector: 'app-book-tour-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-tour-page.html',
  styleUrls: ['./book-tour-page.css'],
})
export class BookTourPage implements OnInit {
  private route = inject(ActivatedRoute);

  readonly selectedPlaceId = signal('');
  readonly today = new Date().toISOString().split('T')[0];
  readonly visitDate = signal(this.today);
  readonly showOtherField = signal(false);
  readonly otherPlaceName = signal('');
  readonly members = signal(1);
  readonly selectedHotel = signal<HotelOption | null>(null);
  readonly paymentReady = signal(false);
  readonly scratchRevealed = signal(false);

  readonly hotelOptions = signal<HotelOption[]>([]);
  readonly places = places;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    /* ✅ READ DESTINATION ID FROM ROUTE */
    const routeId = this.route.snapshot.paramMap.get('id');

    if (routeId) {
      this.selectedPlaceId.set(routeId);
    } else {
      this.selectedPlaceId.set(this.places[0]?.id ?? '');
    }

    if (!this.authService.user) {
      sessionStorage.setItem('auth_return', '/book-tour/' + this.selectedPlaceId());
      this.router.navigateByUrl('/signin');
      return;
    }

    this.updateHotels();
  }

  onPlaceChange(value: string): void {
    this.selectedPlaceId.set(value);
    this.updateHotels();
  }

  onMembersChange(value: number): void {
    this.members.set(Math.max(1, Number(value) || 1));
    this.updateHotels();
  }

  selectHotel(option: HotelOption): void {
    this.selectedHotel.set(option);
    this.paymentReady.set(true);
  }

  onHotelChange(hotelName: string): void {
    const hotel = this.hotelOptions().find((h) => h.name === hotelName);
    if (hotel) {
      this.selectedHotel.set(hotel);
    }
  }

  get totalPrice(): number {
    const hotel = this.selectedHotel();
    if (!hotel) return 0;
    return hotel.basePrice * this.members();
  }

  startPayment(): void {
    if (!this.selectedHotel()) return;

    this.scratchRevealed.set(true);

    const place = this.places.find((p) => p.id === this.selectedPlaceId());

    this.bookingService.saveBooking({
      placeId: this.selectedPlaceId(),
      placeName: place?.name ?? 'Destination',
      hotel: this.selectedHotel()?.name ?? 'Hotel',
      members: this.members(),
      price: this.totalPrice,
      visitDate: this.visitDate(),
      status: 'visiting-soon',
      createdAt: new Date().toISOString(),
    });
  }

  closeScratch(): void {
    this.scratchRevealed.set(false);
    this.router.navigateByUrl('/activities');
  }

  goBack(): void {
    this.router.navigateByUrl('/destinations/all');
  }

  private updateHotels(): void {
    const members = this.members();

    const baseHotels: HotelOption[] = [
      { name: 'Skyline Suites', basePrice: 120 },
      { name: 'Vista Retreat', basePrice: 160 },
      { name: 'Aurora Grand', basePrice: 210 },
    ];

    const scaled = baseHotels.map((h) => ({
      ...h,
      basePrice: h.basePrice + members * 20,
    }));

    this.hotelOptions.set(scaled);
    this.selectedHotel.set(scaled[0]);
    this.paymentReady.set(true);
  }
}
