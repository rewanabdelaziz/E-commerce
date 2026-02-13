import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { spinnerInterceptor } from './shared/interceprors/spinner.interceptor';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyC5iB1kmtf3WeaV0Xx4D5ywiWtMGPegt0w",
  authDomain: "e-commerce-1d3a7.firebaseapp.com",
  projectId: "e-commerce-1d3a7",
  storageBucket: "e-commerce-1d3a7.firebasestorage.app",
  messagingSenderId: "364711178541",
  appId: "1:364711178541:web:307408a0d8438c041b23a4",
  measurementId: "G-FHJ89L93TE"
};
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(),withInterceptors([spinnerInterceptor])),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
};
