import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { ApiResponse } from '../models/challenge.model';

const LEVEL4_THROTTLE_URL = 'https://jsonplaceholder.typicode.com/comments';

interface Level4ThrottlePayload {
  size: number;
  status: number;
  url: string;
}

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

  pingLevel4(): Observable<ApiResponse<Level4ThrottlePayload>> {
    const url = new URL(LEVEL4_THROTTLE_URL);
    url.searchParams.set('_limit', '250');
    url.searchParams.set('_', Date.now().toString());

    return from(fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache'
      }
    }).then(async (response) => {
      const payload = await response.text();

      return {
        success: response.ok,
        message: response.ok ? 'Public payload downloaded' : 'Public request failed',
        data: {
          size: payload.length,
          status: response.status,
          url: response.url
        }
      } satisfies ApiResponse;
    }));
  }
}
