import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/challenge.model';

@Injectable({ providedIn: 'root' })
export class ChallengeApiService {
  constructor(private http: HttpClient) {}

  checkLevel1(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>('/api/level-1/check');
  }

  trackLevel1(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>('/api/level-1/tracker');
  }

  submitLevel2(body: Record<string, unknown>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>('/api/level-2/submit', body);
  }

  validateLevel3(body: Record<string, unknown>, headers?: HttpHeaders): Observable<ApiResponse> {
    return this.http.post<ApiResponse>('/api/level-3/validate', body, { headers });
  }

  pingLevel4(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>('/api/level-4/ping');
  }
}
