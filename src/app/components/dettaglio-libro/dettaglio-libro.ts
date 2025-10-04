/**
 * COMPONENTE DETTAGLIO LIBRO
 *
 * Questo componente mostra i dettagli completi di un singolo libro.
 * Dimostra:
 * - ActivatedRoute per leggere i parametri dell'URL
 * - Router per la navigazione programmatica
 * - Lifecycle hooks
 * - Gestione di dati asincroni
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LibriService } from '../../services/libri.service';
import { Libro } from '../../models/libro.model';

@Component({
  selector: 'app-dettaglio-libro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dettaglio-libro.html',
  styleUrl: './dettaglio-libro.css'
})
export class DettaglioLibro implements OnInit, OnDestroy {

  /**
   * Il libro da visualizzare
   */
  libro: Libro | null = null;

  /**
   * Flag di caricamento
   */
  caricamento = true;

  /**
   * Subject per l'unsubscribe
   */
  private destroy$ = new Subject<void>();

  /**
   * ActivatedRoute: permette di accedere ai parametri della rotta corrente
   * Router: permette di navigare programmaticamente
   * LibriService: servizio iniettato per gestire i dati
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private libriService: LibriService
  ) {}

  ngOnInit(): void {
    /**
     * route.params è un Observable che emette i parametri dell'URL
     * In questo caso, prendiamo il parametro 'id'
     */
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = +params['id'];
        if (id) {
          this.caricaLibro(id);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carica i dettagli del libro dal servizio
   */
  caricaLibro(id: number): void {
    this.caricamento = true;

    this.libriService.getLibroById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (libro) => {
          if (libro) {
            this.libro = libro;
          } else {
            this.router.navigate(['/libri']);
          }
          this.caricamento = false;
        },
        error: (errore) => {
          console.error('Errore nel caricamento del libro:', errore);
          this.caricamento = false;
          this.router.navigate(['/libri']);
        }
      });
  }

  /**
   * Naviga alla pagina di modifica
   */
  modificaLibro(): void {
    if (this.libro) {
      this.router.navigate(['/libro/modifica', this.libro.id]);
    }
  }

  /**
   * Elimina il libro corrente
   */
  eliminaLibro(): void {
    if (this.libro && confirm('Sei sicuro di voler eliminare questo libro?')) {
      this.libriService.eliminaLibro(this.libro.id);
      this.router.navigate(['/libri']);
    }
  }

  /**
   * Torna alla lista
   */
  tornaAllaLista(): void {
    this.router.navigate(['/libri']);
  }
}
