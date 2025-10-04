/**
 * COMPONENTE ROOT (PRINCIPALE)
 *
 * Questo è il componente principale dell'applicazione.
 * È il primo componente che viene caricato e contiene:
 * - RouterOutlet: placeholder dove vengono renderizzati i componenti delle rotte
 * - Navbar: barra di navigazione comune a tutte le pagine
 *
 * Il componente root rimane sempre visibile e wrappa gli altri componenti
 */

import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  /**
   * Proprietà del componente
   */
  titolo = 'Libreria Angular';
  annoCorrente = new Date().getFullYear();
}
