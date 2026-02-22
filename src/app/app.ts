import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Hero } from './hero/hero';
import { DestinationsSection } from './destinations/destinations-section';
import { filter, Subscription } from 'rxjs';
import { AuthModal } from './auth/auth-modal';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    Navbar,
    Hero,
    DestinationsSection,
    AuthModal,
    HttpClientModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('task-2');
  isHome = true;
  authMode: 'signin' | 'signup' | null = null;
  contactMessage = '';
  contactStatus = '';
  isRouting = false;
  hideNavbar = false;

  private navSub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.navSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isRouting = true;
        this.isHome = this.isHomeRoute(event.url);
        if (event.url === '/signin') {
          this.authMode = 'signin';
        } else if (event.url === '/signup') {
          this.authMode = 'signup';
        }
        this.hideNavbar = this.isFormRoute(event.url);
        return;
      }
      if (event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isRouting = false;
        this.isHome = this.isHomeRoute(this.router.url);
        return;
      }
      if (event instanceof NavigationEnd) {
        const nav = event as NavigationEnd;
        this.isHome = this.isHomeRoute(nav.urlAfterRedirects);
        if (nav.urlAfterRedirects === '/signin') {
          this.authMode = 'signin';
        } else if (nav.urlAfterRedirects === '/signup') {
          this.authMode = 'signup';
        } else {
          this.authMode = null;
        }
        this.hideNavbar = this.isFormRoute(nav.urlAfterRedirects);
        if (nav.urlAfterRedirects === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (nav.urlAfterRedirects === '/destinations') {
          const scrollToDestinations = () => {
            const section = document.getElementById('destinations');
            if (section) {
              section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          };
          setTimeout(() => {
            scrollToDestinations();
            window.requestAnimationFrame(scrollToDestinations);
          }, 0);
        } else if (
          nav.urlAfterRedirects !== '/' &&
          nav.urlAfterRedirects !== '/signin' &&
          nav.urlAfterRedirects !== '/signup'
        ) {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
        this.isRouting = false;
      }
    });
    this.isHome = this.isHomeRoute(this.router.url);
    this.hideNavbar = this.isFormRoute(this.router.url);
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
  }

  closeAuth(): void {
    this.authMode = null;
    this.router.navigateByUrl('/');
  }

  onAuthSuccess(): void {
    this.authMode = null;
    const returnUrl = sessionStorage.getItem('auth_return');
    if (returnUrl) {
      sessionStorage.removeItem('auth_return');
      this.router.navigateByUrl(returnUrl);
      return;
    }
    this.router.navigateByUrl('/');
  }

  submitContact(): void {
    if (!this.contactMessage.trim()) {
      this.contactStatus = 'Please add a message before sending.';
      return;
    }
    const subject = encodeURIComponent('Travel Inquiry');
    const body = encodeURIComponent(this.contactMessage);
    window.location.href = `mailto:nileshshakhya@gmail.com?subject=${subject}&body=${body}`;
    this.contactStatus = 'Draft email created. You can send it now.';
    this.contactMessage = '';
  }

  private isFormRoute(url: string): boolean {
    return url === '/book-tour' || url === '/signin' || url === '/signup';
  }

  private isHomeRoute(url: string): boolean {
    return url === '/' || url === '/destinations';
  }
}
