import { http, HttpResponse, delay } from 'msw';
import { notifyChallengeSolved } from './challenge-events';

const LEVEL_2_PATH = /\/api\/level-2\/submit$/;
const LEVEL_3_PATH = /\/api\/level-3\/validate$/;

async function parseRequestBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const cloned = request.clone();
    const contentType = cloned.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      const parsed = await cloned.json();
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as Record<string, unknown>;
      }
      return {};
    }

    const raw = await cloned.text();
    if (!raw.trim()) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Keep returning an empty object if the body is malformed.
  }

  return {};
}

export const handlers = [
  http.get('/api/level-1/check', async () => {
    await delay(200);
    return HttpResponse.json({ success: true, message: 'Check OK' });
  }),

  http.get('/api/level-1/tracker', async () => {
    await delay(300);
    return HttpResponse.json({ success: true, message: 'Tracked' });
  }),

  http.post(LEVEL_2_PATH, async ({ request }) => {
    await delay(200);
    const body = await parseRequestBody(request);
    const isCorrect =
      body['username'] === 'student' &&
      body['code'] === 'DEVTOOLS-2024' &&
      body['action'] === 'submit';
    if (isCorrect) {
      notifyChallengeSolved(2);
      return HttpResponse.json({ success: true, message: '¡Body correcto!' });
    }
    return HttpResponse.json({ success: false, message: 'Body incorrecto' }, { status: 400 });
  }),

  http.post(LEVEL_3_PATH, async ({ request }) => {
    await delay(200);
    const body = await parseRequestBody(request);
    const cacheControl = request.headers.get('Cache-Control') ?? '';
    const bodyOk = body['token'] === 'abc123' && body['version'] === 2;
    const headerOk = cacheControl.includes('no-cache');
    if (bodyOk && headerOk) {
      notifyChallengeSolved(3);
      return HttpResponse.json({ success: true, message: '¡Body y header correctos!' });
    }
    if (!bodyOk) {
      return HttpResponse.json({ success: false, message: 'Body incorrecto (respuesta obsoleta)' }, { status: 400 });
    }
    return HttpResponse.json({ success: false, message: 'Falta Cache-Control: no-cache' }, { status: 400 });
  }),
];
