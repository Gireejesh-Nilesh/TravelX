import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-hotel-booking',
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel-booking.html',
  styleUrls: ['./hotel-booking.css'],
})
export class HotelBooking {
  @ViewChild('resultsSection') resultsSection!: ElementRef;
  constructor(private http: HttpClient) {}

  showTravellers = false;

  scrollToResults() {
    setTimeout(() => {
      this.resultsSection?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 50);
  }

  adults = 1;
  children = 0;
  infants = 0;
  cabinClass = 'Economy';

  tripType: string = 'oneway';
  departDate: string | null = null;
  returnDate: string | null = null;

  setTrip(type: string) {
    this.tripType = type;

    if (type === 'oneway') {
      this.returnDate = null;
    }
  }

  toggleTravellerPanel() {
    this.showTravellers = !this.showTravellers;
  }

  get totalTravellers(): number {
    return this.flightData.adults + this.flightData.children + this.flightData.infants;
  }

  get totalHotelGuests(): number {
    return this.hotelData.adults + this.hotelData.children;
  }

  increase(type: 'adult' | 'child' | 'infant') {
    if (this.activeTab === 'flight') {
      if (type === 'adult') this.flightData.adults++;
      if (type === 'child') this.flightData.children++;
      if (type === 'infant') this.flightData.infants++;
    }

    if (this.activeTab === 'hotel') {
      this.hotelData.guests++;
      if (type === 'adult') this.hotelData.adults++;
      if (type === 'child') this.hotelData.children++;
    }
  }

  decrease(type: 'adult' | 'child' | 'infant') {
    if (this.activeTab === 'flight') {
      if (type === 'adult' && this.flightData.adults > 1) this.flightData.adults--;
      if (type === 'child' && this.flightData.children > 0) this.flightData.children--;
      if (type === 'infant' && this.flightData.infants > 0) this.flightData.infants--;
    }

    if (this.activeTab === 'hotel') {
      if (this.hotelData.guests > 1) this.hotelData.guests--;
      if (type === 'adult' && this.hotelData.adults > 1) this.hotelData.adults--;
      if (type === 'child' && this.hotelData.children > 0) this.hotelData.children--;
    }
  }

  syncHotelGuestsFromFlight() {
    this.hotelData.guests = this.flightData.adults + this.flightData.children;
  }

  today: string = '';

  ngOnInit() {
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
  }

  flightData = {
    adults: 1,
    children: 0,
    infants: 0,
    departDate: null as string | null,
    returnDate: null as string | null,
    cabinClass: 'Economy',
  };

  busData = {
    from: '', // ⭐ ADD THIS
    to: '', // ⭐ ADD THIS
    passengers: 1,
    departDate: null as string | null,
    returnDate: null as string | null,
  };

  hotelData = {
    city: '', // ⭐ ADD THIS
    guests: 1,
    rooms: 1,
    checkIn: null as string | null,
    checkOut: null as string | null,
    roomType: 'AC',
    adults: 1,
    children: 0,
  };

  showResults = false;
  isLoading = false;

  /* ⭐ UPDATED FOR INSTANT RESULTS */
  searchFlights() {
    const payload = {
      from: this.searchFrom,
      to: this.searchTo,
      departDate: this.flightData.departDate,
    };

    /* ⭐ SHOW MOCK DATA IMMEDIATELY */
    this.filteredFlights = this.getMockFlights(this.searchFrom, this.searchTo);
    this.showResults = true;
    this.noResults = false;

    // this.isLoading = true;

    this.http.post<any[]>('http://localhost:3000/flights/search', payload).subscribe({
      next: (data) => {
        if (data?.length) {
          this.filteredFlights = data; // silent replacement
        }
      },
      error: () => {
        console.log('Using mock flights');
      },
    });
  }

  searchBuses() {
    this.filteredBuses = [
      {
        operator: 'Orange Travels',
        busType: 'AC Sleeper',
        from: this.searchFrom,
        to: this.searchTo,
        departure: '21:30',
        arrival: '06:15',
        duration: '8h 45m',
        price: 1200,
      },
    ];

    this.showResults = true;
  }

  searchHotels() {
    this.filteredHotels = [
      {
        name: 'Hotel Grand Stay',
        location: this.searchFrom,
        roomType: this.hotelData.roomType,
        checkIn: this.hotelData.checkIn,
        checkOut: this.hotelData.checkOut,
        price: 3200,
      },
    ];

    this.showResults = true;
  }

  /* ⭐ SAFE ADDITION – DOES NOT DISTURB ANYTHING */
  getMockFlights(from: string, to: string) {
    return [
      {
        airline: 'IndiGo',
        flightNo: '6E-101',
        from,
        to,
        departure: '10:30',
        arrival: '12:45',
        duration: '2h 15m',
        price: 5400,
      },
      {
        airline: 'Air India',
        flightNo: 'AI-202',
        from,
        to,
        departure: '14:10',
        arrival: '16:35',
        duration: '2h 25m',
        price: 6200,
      },
    ];
  }

  activeTab: 'flight' | 'bus' | 'hotel' = 'flight';

  switchTab(tab: 'flight' | 'bus' | 'hotel') {
    this.activeTab = tab;
    this.showResults = false;
    this.errors = {};

    if (tab === 'bus') {
      this.busData.from = '';
      this.busData.to = '';
    }

    if (tab === 'hotel') {
      this.hotelData.city = '';
    }
  }

  get fromLabel(): string {
    if (this.activeTab === 'bus') return 'From City';
    if (this.activeTab === 'hotel') return 'City / Location';
    return 'From';
  }

  get toLabel(): string {
    if (this.activeTab === 'hotel') return 'Property / Area';
    return 'To';
  }

  get departLabel(): string {
    if (this.activeTab === 'hotel') return 'Check-In';
    return this.activeTab === 'bus' ? 'Travel Date' : 'Depart Date';
  }

  get returnLabel(): string {
    if (this.activeTab === 'hotel') return 'Check-Out';
    return 'Return Date';
  }

  get searchButtonLabel(): string {
    if (this.activeTab === 'bus') return 'Search Buses';
    if (this.activeTab === 'hotel') return 'Search Hotels';
    return 'Search Flights';
  }

  searchFrom = '';
  searchTo = '';

  search() {
    this.noResults = false;
    this.showResults = false;

    const isValid = this.validateFields();

    if (!isValid) {
      return; // ⭐ HARD STOP → Results never render
    }

    if (this.activeTab === 'flight') {
      this.searchFlights();
    }

    if (this.activeTab === 'bus') {
      this.searchBuses();
    }

    if (this.activeTab === 'hotel') {
      this.searchHotels();
    }

    this.scrollToResults();
  }

  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    this.selectedFileName = file.name;
  }

  allFlights = []; // untouched

  filteredFlights: any[] = [];
  filteredBuses: any[] = [];
  filteredHotels: any[] = [];

  errors: any = {};
  noResults = false;

  validateFields(): boolean {
    this.errors = {};
    this.noResults = false;

    /* FLIGHT VALIDATION */
    if (this.activeTab === 'flight') {
      if (!this.searchFrom?.trim()) this.errors.from = 'Origin is required';

      if (!this.searchTo?.trim()) this.errors.to = 'Destination is required';

      if (!this.flightData.departDate) this.errors.departDate = 'Depart date required';

      if (this.tripType === 'round' && !this.flightData.returnDate)
        this.errors.returnDate = 'Return date required';
    }

    /* BUS VALIDATION */
    if (this.activeTab === 'bus') {
      if (!this.searchFrom?.trim()) this.errors.from = 'From city required';

      if (!this.searchTo?.trim()) this.errors.to = 'To city required';

      if (!this.busData.departDate) this.errors.departDate = 'Travel date required';
    }

    /* HOTEL VALIDATION */
    if (this.activeTab === 'hotel') {
      if (!this.searchFrom?.trim()) this.errors.city = 'City required';

      if (!this.hotelData.checkIn) this.errors.checkIn = 'Check-in required';

      if (!this.hotelData.checkOut) this.errors.checkOut = 'Check-out required';

      if (!this.selectedFile) this.errors.idProof = 'ID proof required';
    }

    return Object.keys(this.errors).length === 0;
  }
}
