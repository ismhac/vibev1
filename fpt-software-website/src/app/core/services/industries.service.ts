import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Industry {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Legacy properties for backward compatibility
  icon?: string;
  services?: string[];
}

export interface IndustryListResponse {
  data: Industry[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateIndustryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface UpdateIndustryRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class IndustriesService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/industries';
  private http = inject(HttpClient);

  /**
   * Get all industries with pagination
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @returns Observable of industry list response
   */
  getIndustries(page = 1, limit = 10): Observable<IndustryListResponse> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
    };

    return this.http.get<IndustryListResponse>(this.apiUrl, { params });
  }

  /**
   * Get a single industry by ID
   * @param id - Industry ID
   * @returns Observable of industry
   */
  getIndustryById(id: number): Observable<Industry> {
    return this.http.get<Industry>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new industry
   * @param industry - Industry creation data
   * @returns Observable of created industry
   */
  createIndustry(industry: CreateIndustryRequest): Observable<Industry> {
    return this.http.post<Industry>(this.apiUrl, industry);
  }

  /**
   * Update an existing industry
   * @param id - Industry ID
   * @param industry - Industry update data
   * @returns Observable of updated industry
   */
  updateIndustry(id: number, industry: UpdateIndustryRequest): Observable<Industry> {
    return this.http.patch<Industry>(`${this.apiUrl}/${id}`, industry);
  }

  /**
   * Delete an industry
   * @param id - Industry ID
   * @returns Observable of void
   */
  deleteIndustry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
