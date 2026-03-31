import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

async function bootstrap() {
  if (typeof window !== 'undefined') {
    const { worker } = await import('./app/mock/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: './mockServiceWorker.js' }
    });
  }
  bootstrapApplication(AppComponent, appConfig).catch(console.error);
}

bootstrap();
