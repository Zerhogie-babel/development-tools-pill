import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  http.get('/api/level-1/check', async () => {
    await delay(200);
    return HttpResponse.json({ success: true, message: 'Check OK' });
  }),

  http.get('/api/level-1/tracker', async () => {
    await delay(300);
    return HttpResponse.json({ success: true, message: 'Tracked' });
  }),

  http.post('/api/level-2/submit', async ({ request }) => {
    await delay(200);
    const body = await request.json() as Record<string, unknown>;
    const isCorrect =
      body['username'] === 'student' &&
      body['code'] === 'DEVTOOLS-2024' &&
      body['action'] === 'submit';
    if (isCorrect) {
      return HttpResponse.json({ success: true, message: '¡Body correcto!' });
    }
    return HttpResponse.json({ success: false, message: 'Body incorrecto' }, { status: 400 });
  }),

  http.post('/api/level-3/validate', async ({ request }) => {
    await delay(200);
    const body = await request.json() as Record<string, unknown>;
    const cacheControl = request.headers.get('Cache-Control') ?? '';
    const bodyOk = body['token'] === 'abc123' && body['version'] === 2;
    const headerOk = cacheControl.includes('no-cache');
    if (bodyOk && headerOk) {
      return HttpResponse.json({ success: true, message: '¡Body y header correctos!' });
    }
    if (!bodyOk) {
      return HttpResponse.json({ success: false, message: 'Body incorrecto (respuesta obsoleta)' }, { status: 400 });
    }
    return HttpResponse.json({ success: false, message: 'Falta Cache-Control: no-cache' }, { status: 400 });
  }),

  http.get('/api/level-4/ping', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      message: 'Pong',
      data: 'x'.repeat(10000)
    });
  }),
];
