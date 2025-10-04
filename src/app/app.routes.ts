/**
 * ROUTING CONFIGURATION
 *
 * Questo file definisce tutte le rotte dell'applicazione.
 * Il routing in Angular permette di:
 * - Navigare tra diverse viste/componenti
 * - Passare parametri tramite URL
 * - Gestire route parametriche e wildcard
 * - Implementare lazy loading (caricamento pigro)
 *
 * Sintassi delle rotte:
 * - path: il percorso URL
 * - component: il componente da visualizzare
 * - :id: parametro dinamico nell'URL
 * - ** : wildcard per gestire route non trovate (404)
 */

import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ListaLibri } from './components/lista-libri/lista-libri';
import { DettaglioLibro } from './components/dettaglio-libro/dettaglio-libro';
import { FormLibro } from './components/form-libro/form-libro';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home - Libreria Angular'
  },
  {
    path: 'libri',
    component: ListaLibri,
    title: 'Lista Libri - Libreria Angular'
  },
  {
    path: 'libro/nuovo',
    component: FormLibro,
    title: 'Aggiungi Libro - Libreria Angular'
  },
  {
    path: 'libro/modifica/:id',
    component: FormLibro,
    title: 'Modifica Libro - Libreria Angular'
  },
  {
    path: 'libro/:id',
    component: DettaglioLibro,
    title: 'Dettaglio Libro - Libreria Angular'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
