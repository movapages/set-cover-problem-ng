import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { CountdownComponent } from './app/app.component';

bootstrapApplication(CountdownComponent, appConfig)
  .catch((err) => console.error(err));
