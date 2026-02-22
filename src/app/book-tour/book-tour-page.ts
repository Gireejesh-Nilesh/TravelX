import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteService } from '../services/quote.service';
import { Router } from '@angular/router';
import { HotelBooking } from './hotel-booking/hotel-booking';

@Component({
  selector: 'app-book-tour-page',
  standalone: true,
  imports: [CommonModule, HotelBooking],
  templateUrl: './book-tour-page.html',
  styleUrls: ['./book-tour-page.css'],
})
export class BookTourPage {
  toasts: { id: number; text: string; visible: boolean }[] = [];

  counter = 0;
  private toastTimer: any;

  // ✅ DEPENDENCY INJECTION
  constructor(
    private quoteService: QuoteService,
    private router: Router,
  ) {}

  showToast() {
    this.quoteService.getQuote().subscribe((q: any) => {
      const newToast = {
        id: ++this.counter,
        text: q.quote,
        visible: true,
      };

      /* ⭐ Clear any running timers FIRST */
      clearTimeout(this.toastTimer);
      if (this.toasts.length && this.toasts[0].text === q.quote) {
        return; // skip duplicate
      }

      /* ⭐ If toast exists → fade out & replace */
      if (this.toasts.length) {
        this.toasts[0].visible = false;

        setTimeout(() => {
          this.toasts = [newToast];
        }, 250);
      } else {
        this.toasts = [newToast];
      }

      /* ⭐ Auto dismiss */
      this.toastTimer = setTimeout(() => {
        if (this.toasts.length) {
          this.toasts[0].visible = false;

          setTimeout(() => {
            this.toasts = [];
          }, 250);
        }
      }, 4000);
    });
  }

  closeToast(id: number) {
    this.toasts = this.toasts.map((t) => (t.id === id ? { ...t, visible: false } : t));

    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    }, 250);
  }

  goToDestinations() {
    this.router.navigateByUrl('/destinations/all');
  }
}
