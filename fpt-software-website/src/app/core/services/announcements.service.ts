import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  summary?: string;
  author?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  imageUrl?: string;
  readTime?: number; // in minutes
}

export interface AnnouncementListResponse {
  data: Announcement[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  summary?: string;
  author?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  isPublished?: boolean;
  tags?: string[];
  imageUrl?: string;
  readTime?: number;
}

export interface UpdateAnnouncementRequest {
  title?: string;
  content?: string;
  summary?: string;
  author?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  isPublished?: boolean;
  tags?: string[];
  imageUrl?: string;
  readTime?: number;
}

export interface FileUploadResponse {
  success: boolean;
  message?: string;
  data?: {
    fileName: string;
    fileUrl: string;
    mimetype: string;
    size: number;
  };
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnnouncementsService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/announcements';
  private http = inject(HttpClient);

  /**
   * Get all published announcements with pagination
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @returns Observable of announcement list response
   */
  getAnnouncements(page = 1, limit = 10): Observable<AnnouncementListResponse> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
    };

    return this.http.get<AnnouncementListResponse>(this.apiUrl, { params });
  }

  /**
   * Get all announcements for admin (including unpublished)
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @param search - Search term (optional)
   * @returns Observable of announcement list response
   */
  getAnnouncementsForAdmin(page = 1, limit = 10, search?: string): Observable<AnnouncementListResponse> {
    const params: any = {
      page: page.toString(),
      limit: limit.toString(),
    };

    if (search && search.trim()) {
      params.search = search.trim();
    }

    return this.http.get<AnnouncementListResponse>(`${this.apiUrl}/admin`, { params });
  }

  /**
   * Get a single announcement by ID
   * @param id - Announcement ID
   * @returns Observable of announcement
   */
  getAnnouncementById(id: number): Observable<Announcement> {
    return this.http.get<Announcement>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new announcement
   * @param announcement - Announcement creation data
   * @param file - Optional file to upload
   * @returns Observable of created announcement
   */
  createAnnouncement(announcement: CreateAnnouncementRequest, file?: File): Observable<Announcement> {
    const formData = new FormData();
    
    // Add announcement data
    Object.keys(announcement).forEach(key => {
      const value = announcement[key as keyof CreateAnnouncementRequest];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Add file if provided
    if (file) {
      formData.append('file', file);
    }

    return this.http.post<Announcement>(this.apiUrl, formData);
  }

  /**
   * Update an existing announcement
   * @param id - Announcement ID
   * @param announcement - Announcement update data
   * @param file - Optional file to upload
   * @returns Observable of updated announcement
   */
  updateAnnouncement(id: number, announcement: UpdateAnnouncementRequest, file?: File): Observable<Announcement> {
    const formData = new FormData();
    
    // Add announcement data
    Object.keys(announcement).forEach(key => {
      const value = announcement[key as keyof UpdateAnnouncementRequest];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Add file if provided
    if (file) {
      formData.append('file', file);
    }

    return this.http.patch<Announcement>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Delete an announcement
   * @param id - Announcement ID
   * @returns Observable of void
   */
  deleteAnnouncement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Upload a file
   * @param file - File to upload
   * @returns Observable of file upload response
   */
  uploadFile(file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<FileUploadResponse>(`${this.apiUrl}/upload`, formData);
  }
}
