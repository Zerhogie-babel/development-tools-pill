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
];
