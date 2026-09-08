import { Routes } from '@angular/router';
import { Assistant } from './assistant/assistant';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./assistant/assistant').then((m) => m.Assistant),
    },
];
