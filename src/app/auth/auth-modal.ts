import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

type AuthMode = 'signin' | 'signup';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-modal.html',
  styleUrls: ['./auth-modal.css'],
})
export class AuthModal {
  @Input({ required: true }) mode: AuthMode = 'signin';
  @Output() closed = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  readonly formError = signal<string | null>(null);
  readonly closing = signal(false);

  name = '';
  email = '';
  phone = '';
  password = '';

  /** ✅ NEW: controls when field errors appear */
  submitted = false;

  focusedField: string | null = null;

  setFocused(field: string) {
    this.focusedField = field;
  }

  clearFocused() {
    this.focusedField = null;
  }

  /* ---------------- FIELD ERRORS ---------------- */

  get nameError() {
    if (!this.submitted) return '';
    if (!this.name?.trim()) return 'Name is required';
    if (this.name.trim().length < 2) return 'Name is too short';
    return '';
  }

  get emailError() {
    if (!this.submitted) return '';
    if (!this.email?.trim()) return 'Email is required';
    if (!this.isValidEmail(this.email)) return 'Invalid email format';
    return '';
  }

  get passwordError() {
    if (!this.submitted) return '';
    if (!this.password?.trim()) return 'Password is required';
    if (!this.isStrongPassword(this.password)) {
      return 'Password needs 8+ chars with upper, lower, and number';
    }
    return '';
  }

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  submit(): void {
    /** ✅ IMPORTANT: mark submit attempt */
    this.submitted = true;

    this.formError.set(null);

    if (!this.validate()) {
      return;
    }

    if (this.mode === 'signin') {
      const ok = this.authService.signIn(this.email, this.password);

      if (!ok) {
        this.formError.set('Invalid email or password.');
        return;
      }

      this.success.emit();
      this.closed.emit();
      return;
    }

    const ok = this.authService.signUp(
      { name: this.name, email: this.email, phone: this.phone },
      this.password,
    );

    if (!ok) {
      this.formError.set('Email already exists. Try signing in.');
      return;
    }

    this.closing.set(true);

    window.setTimeout(() => {
      this.success.emit();

      if (window.history.length > 1) {
        window.history.back();
        return;
      }

      this.router.navigateByUrl('/');
    }, 550);
  }

  close(): void {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    this.router.navigateByUrl('/');
  }

  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    this.router.navigateByUrl('/');
  }

  /* ---------------- VALIDATION ---------------- */

  private validate(): boolean {
    if (this.mode === 'signup' && this.name.trim().length < 2) {
      return false;
    }

    if (!this.isValidEmail(this.email)) {
      return false;
    }

    if (!this.isStrongPassword(this.password)) {
      return false;
    }

    return true;
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private isStrongPassword(value: string): boolean {
    return value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value);
  }
}
