import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Subscription {
  id?: number;
  fullName: string;
  email: string;
  isActive: boolean;
  subscribedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubscriptionResponse {
  message: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/subscriptions';
  private http = inject(HttpClient);

  /**
   * Create a new subscription
   * @param subscription - Subscription data
   * @returns Observable of subscription response
   */
  createSubscription(subscription: Omit<Subscription, 'id' | 'isActive' | 'subscribedAt' | 'createdAt' | 'updatedAt'>): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(this.apiUrl, subscription);
  }
}
