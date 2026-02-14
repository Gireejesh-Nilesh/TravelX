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

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  submit(): void {
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
      this.closed.emit();
    }, 550);
  }

  close(): void {
    this.closed.emit();
  }

  goBack(): void {
    this.closed.emit();
    this.router.navigateByUrl('/');
  }

  private validate(): boolean {
    if (this.mode === 'signup' && this.name.trim().length < 2) {
      this.formError.set('Please enter your name.');
      return false;
    }
    if (!this.isValidEmail(this.email)) {
      this.formError.set('Please enter a valid email address.');
      return false;
    }
    if (!this.isStrongPassword(this.password)) {
      this.formError.set(
        'Password needs 8+ chars with upper, lower, and number.',
      );
      return false;
    }
    return true;
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private isStrongPassword(value: string): boolean {
    return (
      value.length >= 8 &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /[0-9]/.test(value)
    );
  }
}
