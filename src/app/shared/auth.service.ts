import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AuthUser = {
  name: string;
  email: string;
  phone?: string;
};

const USER_KEY = 'travel_user';
const USERS_KEY = 'travel_users';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(
    this.loadActiveUser(),
  );

  readonly user$ = this.userSubject.asObservable();

  get user(): AuthUser | null {
    return this.userSubject.value;
  }

  signIn(email: string, password: string): boolean {
    const users = this.loadUsers();
    const match = users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase(),
    );
    if (!match) {
      return false;
    }
    const storedPassword = localStorage.getItem(this.getPasswordKey(email));
    if (!storedPassword || storedPassword !== password) {
      return false;
    }
    this.setActiveUser(match);
    return true;
  }

  signUp(user: AuthUser, password: string): boolean {
    const users = this.loadUsers();
    const exists = users.some(
      (item) => item.email.toLowerCase() === user.email.toLowerCase(),
    );
    if (exists) {
      return false;
    }
    const nextUsers = [...users, user];
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    localStorage.setItem(this.getPasswordKey(user.email), password);
    this.setActiveUser(user);
    return true;
  }

  signOut(): void {
    localStorage.removeItem(USER_KEY);
    this.userSubject.next(null);
  }

  private loadUsers(): AuthUser[] {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw) as AuthUser[];
    } catch {
      return [];
    }
  }

  private loadActiveUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  private setActiveUser(user: AuthUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);
  }

  private getPasswordKey(email: string): string {
    return `travel_pass_${email.toLowerCase()}`;
  }
}
