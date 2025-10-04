/**
 * COMPONENTE LISTA LIBRI
 *
 * Questo componente mostra l'elenco di tutti i libri disponibili.
 * Dimostra:
 * - Dependency Injection (iniezione del servizio)
 * - Observable e async pipe
 * - Event binding
 * - Two-way binding [(ngModel)]
 * - Uso di direttive strutturali
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { LibriService } from '../../services/libri.service';
import { Libro } from '../../models/libro.model';
import { EvidenziaDisponibileDirective } from '../../directives/evidenzia-disponibile.directive';

@Component({
  selector: 'app-lista-libri',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    EvidenziaDisponibileDirective
  ],
  templateUrl: './lista-libri.html',
  styleUrl: './lista-libri.css'
})
export class ListaLibri implements OnInit, OnDestroy {

  /**
   * Array dei libri da visualizzare
   */
  libri: Libro[] = [];

  /**
   * Array filtrato dei libri (dopo ricerca/filtri)
   */
  libriFiltrati: Libro[] = [];

  /**
   * Termine di ricerca inserito dall'utente
   */
  termineRicerca = '';

  /**
   * Filtro per genere selezionato
   */
  genereSelezionato = '';

  /**
   * Flag per mostrare solo libri disponibili
   */
  soloDisponibili = false;

  /**
   * Flag di caricamento
   */
  caricamento = true;

  /**
   * Lista dei generi unici per il filtro
   */
  generi: string[] = [];

  /**
   * Subject per gestire l'unsubscribe automatico
   * Questo previene memory leak quando il componente viene distrutto
   */
  private destroy$ = new Subject<void>();

  /**
   * DEPENDENCY INJECTION
   * Angular inietta automaticamente il servizio LibriService
   * nel costruttore. Questo è il cuore del DI di Angular.
   */
  constructor(private libriService: LibriService) {
    console.log('📚 ListaLibri componente creato!');
  }

  /**
   * LIFECYCLE HOOK: ngOnInit
   * Viene chiamato dopo che Angular ha inizializzato il componente.
   * È il posto ideale per inizializzare i dati.
   */
  ngOnInit(): void {
    this.caricaLibri();
  }

  /**
   * LIFECYCLE HOOK: ngOnDestroy
   * Viene chiamato prima che Angular distrugga il componente.
   * Qui facciamo pulizia (unsubscribe da Observable, ecc.)
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carica i libri dal servizio
   */
  caricaLibri(): void {
    this.caricamento = true;

    this.libriService.getLibri()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (libri) => {
          this.libri = libri;
          this.libriFiltrati = libri;
          this.estraiGeneri();
          this.caricamento = false;
        },
        error: (errore) => {
          console.error('Errore nel caricamento dei libri:', errore);
          this.caricamento = false;
        }
      });
  }

  /**
   * Estrae i generi unici dai libri per il filtro
   */
  estraiGeneri(): void {
    const generiSet = new Set(this.libri.map(libro => libro.genere));
    this.generi = Array.from(generiSet).sort();
  }

  /**
   * Applica i filtri di ricerca e selezione
   * Questo metodo viene chiamato ogni volta che l'utente modifica i filtri
   */
  applicaFiltri(): void {
    let risultato = [...this.libri];

    if (this.termineRicerca) {
      const termine = this.termineRicerca.toLowerCase();
      risultato = risultato.filter(libro =>
        libro.titolo.toLowerCase().includes(termine) ||
        libro.autore.toLowerCase().includes(termine)
      );
    }

    if (this.genereSelezionato) {
      risultato = risultato.filter(libro => libro.genere === this.genereSelezionato);
    }

    if (this.soloDisponibili) {
      risultato = risultato.filter(libro => libro.disponibile);
    }

    this.libriFiltrati = risultato;
  }

  /**
   * Resetta tutti i filtri
   */
  resetFiltri(): void {
    this.termineRicerca = '';
    this.genereSelezionato = '';
    this.soloDisponibili = false;
    this.libriFiltrati = [...this.libri];
  }

  /**
   * Elimina un libro
   */
  eliminaLibro(id: number, evento: Event): void {
    evento.stopPropagation();

    if (confirm('Sei sicuro di voler eliminare questo libro?')) {
      this.libriService.eliminaLibro(id);
      this.caricaLibri();
    }
  }

  /**
   * Metodo helper per il trackBy di *ngFor
   * Migliora le performance aiutando Angular a identificare quali elementi
   * sono cambiati nell'array
   */
  trackByLibroId(index: number, libro: Libro): number {
    return libro.id;
  }
}
