import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export interface DemoUser {
  id: string;
}

const SESSION_KEY = 'my-app-angular-demo-user-v2';
const DEMO_ID = 'sandip';
const DEMO_PASSWORD = 'sandip123';

function isDemoUser(value: unknown): value is DemoUser {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as Record<string, unknown>)['id'] === DEMO_ID
  );
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly userState = signal<DemoUser | null>(this.loadUser());
  readonly currentUser = this.userState.asReadonly();

  login(id: string, password: string): boolean {
    if (id.trim() !== DEMO_ID || password !== DEMO_PASSWORD) return false;

    const user: DemoUser = { id: DEMO_ID };
    this.userState.set(user);
    this.storeUser(user);
    return true;
  }

  logout(): void {
    this.userState.set(null);
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Could not clear the demo login session.', error);
    }
  }

  private loadUser(): DemoUser | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    try {
      const storedUser = localStorage.getItem(SESSION_KEY);
      if (storedUser === null) return null;

      const parsedUser: unknown = JSON.parse(storedUser);
      if (!isDemoUser(parsedUser)) throw new Error('Saved demo user has an invalid format.');

      return { id: parsedUser.id };
    } catch (error) {
      console.error('Could not load the demo login session.', error);
      return null;
    }
  }

  private storeUser(user: DemoUser): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Could not save the demo login session.', error);
    }
  }
}
