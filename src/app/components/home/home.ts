/**
 * COMPONENTE HOME
 *
 * Questo è un componente Angular. I componenti sono i building blocks
 * dell'applicazione Angular.
 *
 * Ogni componente ha:
 * - Una classe TypeScript (logica)
 * - Un template HTML (vista)
 * - Un file CSS (stile)
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Il decoratore @Component() fornisce metadati sul componente:
 * - selector: il tag HTML per usare questo componente
 * - imports: altri moduli/componenti da importare
 * - templateUrl: percorso del file HTML
 * - styleUrl: percorso del file CSS
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  /**
   * Proprietà del componente che possono essere usate nel template
   */
  titolo = 'Benvenuto nella Libreria Angular';
  sottotitolo = 'Impara Angular con esempi pratici';

  /**
   * Array di funzionalità dimostrate nell\'app
   */
  funzionalita = [
    {
      icona: '📦',
      titolo: 'Componenti',
      descrizione: 'Building blocks riutilizzabili dell\'applicazione'
    },
    {
      icona: '🔄',
      titolo: 'Data Binding',
      descrizione: 'Sincronizzazione tra modello e vista'
    },
    {
      icona: '🎯',
      titolo: 'Direttive',
      descrizione: 'Modificano il comportamento degli elementi DOM'
    },
    {
      icona: '🔧',
      titolo: 'Servizi',
      descrizione: 'Logica di business condivisa e riutilizzabile'
    },
    {
      icona: '📝',
      titolo: 'Form',
      descrizione: 'Gestione di form template-driven e reactive'
    },
    {
      icona: '🚀',
      titolo: 'Routing',
      descrizione: 'Navigazione tra diverse viste dell\'applicazione'
    },
    {
      icona: '🔀',
      titolo: 'Pipes',
      descrizione: 'Trasformazione dei dati nei template'
    },
    {
      icona: '💉',
      titolo: 'Dependency Injection',
      descrizione: 'Sistema per gestire le dipendenze'
    }
  ];

  /**
   * Metodo che viene chiamato quando si clicca sul pulsante
   * Dimostra l'event binding in Angular
   */
  mostraMessaggio(): void {
    alert('Questo è un esempio di event binding in Angular! 🎉');
  }
}
