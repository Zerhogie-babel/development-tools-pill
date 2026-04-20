import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, map, Observable } from 'rxjs';
import { ApiResponse } from '../models/challenge.model';

const LEVEL2_EXTERNAL_URL = 'https://jsonplaceholder.typicode.com/posts';
const LEVEL3_EXTERNAL_URL = 'https://dummyjson.com/posts/add';
const LEVEL4_THROTTLE_URL = 'https://jsonplaceholder.typicode.com/comments';

export const LEVEL3_REQUIRED_HEADER = 'X-Challenge-Verified';
export const LEVEL3_REQUIRED_HEADER_VALUE = 'devtools';

export interface Level3Result {
  bodySuccess: boolean;
  headerPresent: boolean;
  message: string;
}

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
    return this.http.post<unknown>(LEVEL2_EXTERNAL_URL, body).pipe(
      map((response) => normalizeApiResponse(response, 'Respuesta externa sin override.'))
    );
  }

  validateLevel3(body: Record<string, unknown>): Observable<Level3Result> {
    return this.http.post<unknown>(LEVEL3_EXTERNAL_URL, body, { observe: 'response' }).pipe(
      map((httpResponse) => {
        const body = httpResponse.body;
        const apiResponse = normalizeApiResponse(body, 'Respuesta externa sin override.');
        const headerValue = httpResponse.headers.get(LEVEL3_REQUIRED_HEADER) ?? '';
        const headerPresent = headerValue.toLowerCase() === LEVEL3_REQUIRED_HEADER_VALUE.toLowerCase();
        return {
          bodySuccess: apiResponse.success,
          headerPresent,
          message: apiResponse.message
        };
      })
    );
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

function normalizeApiResponse(response: unknown, fallbackMessage: string): ApiResponse {
  if (typeof response !== 'object' || response === null) {
    return { success: false, message: fallbackMessage };
  }

  const payload = response as Partial<ApiResponse>;
  return {
    success: payload.success === true,
    message: typeof payload.message === 'string' ? payload.message : fallbackMessage,
    data: payload.data
  };
}
