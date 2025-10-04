/**
 * COMPONENTE FORM LIBRO
 *
 * Questo componente gestisce la creazione e modifica di un libro.
 * Dimostra:
 * - REACTIVE FORMS (FormBuilder, FormGroup, Validators)
 * - Validazione dei form
 * - Gestione dell'invio del form
 * - Navigazione con parametri
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LibriService } from '../../services/libri.service';
import { Libro } from '../../models/libro.model';

@Component({
  selector: 'app-form-libro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-libro.html',
  styleUrl: './form-libro.css'
})
export class FormLibro implements OnInit, OnDestroy {

  /**
   * FormGroup \u00e8 un contenitore per i controlli del form
   * Gestisce i valori, la validit\u00e0 e gli eventi
   */
  libroForm!: FormGroup;

  /**
   * Flag per distinguere tra modalit\u00e0 creazione e modifica
   */
  modalitaModifica = false;

  /**
   * ID del libro in modalit\u00e0 modifica
   */
  libroId: number | null = null;

  /**
   * Flag di invio
   */
  invioInCorso = false;

  /**
   * Lista dei generi disponibili
   */
  generiDisponibili = ['Fantasy', 'Distopia', 'Favola', 'Romanzo', 'Giallo', 'Thriller', 'Fantascienza', 'Horror'];

  /**
   * Subject per l'unsubscribe
   */
  private destroy$ = new Subject<void>();

  /**
   * FormBuilder: utility per costruire form reactive in modo semplificato
   */
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private libriService: LibriService
  ) {}

  ngOnInit(): void {
    this.inizializzaForm();
    this.verificaModalita();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inizializza il form reactive con validatori
   * Validators e una classe che fornisce validatori predefiniti
   */
  inizializzaForm(): void {
    this.libroForm = this.fb.group({
      titolo: ['', [Validators.required, Validators.minLength(2)]],
      autore: ['', [Validators.required, Validators.minLength(2)]],
      anno: ['', [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]],
      genere: ['', Validators.required],
      descrizione: ['', [Validators.required, Validators.minLength(10)]],
      disponibile: [true],
      copertina: ['']
    });
  }

  /**
   * Verifica se siamo in modalita modifica leggendo i parametri della rotta
   */
  verificaModalita(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['id']) {
          this.modalitaModifica = true;
          this.libroId = +params['id'];
          this.caricaLibro(this.libroId);
        }
      });
  }

  /**
   * Carica i dati del libro in modalita modifica
   */
  caricaLibro(id: number): void {
    this.libriService.getLibroById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (libro) => {
          if (libro) {
            /**
             * patchValue aggiorna i valori del form
             * senza resettare lo stato di validazione
             */
            this.libroForm.patchValue({
              titolo: libro.titolo,
              autore: libro.autore,
              anno: libro.anno,
              genere: libro.genere,
              descrizione: libro.descrizione,
              disponibile: libro.disponibile,
              copertina: libro.copertina || ''
            });
          }
        },
        error: (errore) => {
          console.error('Errore nel caricamento del libro:', errore);
          this.router.navigate(['/libri']);
        }
      });
  }

  /**
   * Gestisce l'invio del form
   */
  onSubmit(): void {
    /**
     * Controlla se il form e valido prima di procedere
     * markAllAsTouched() marca tutti i campi come "touched"
     * per mostrare gli errori di validazione
     */
    if (this.libroForm.invalid) {
      this.libroForm.markAllAsTouched();
      return;
    }

    this.invioInCorso = true;

    const datiForm = this.libroForm.value;

    if (this.modalitaModifica && this.libroId) {
      const libroAggiornato: Libro = {
        id: this.libroId,
        ...datiForm
      };
      this.libriService.aggiornaLibro(libroAggiornato);
    } else {
      this.libriService.aggiungiLibro(datiForm);
    }

    setTimeout(() => {
      this.invioInCorso = false;
      this.router.navigate(['/libri']);
    }, 500);
  }

  /**
   * Annulla e torna alla lista
   */
  annulla(): void {
    this.router.navigate(['/libri']);
  }

  /**
   * Helper per accedere facilmente ai controlli del form nel template
   */
  get f() {
    return this.libroForm.controls;
  }

  /**
   * Helper per verificare se un campo ha errori ed e stato toccato
   */
  haErrore(campo: string): boolean {
    const controllo = this.libroForm.get(campo);
    return !!(controllo && controllo.invalid && controllo.touched);
  }

  /**
   * Helper per ottenere il messaggio di errore di un campo
   */
  getMessaggioErrore(campo: string): string {
    const controllo = this.libroForm.get(campo);
    if (!controllo || !controllo.errors) return '';

    if (controllo.errors['required']) {
      return 'Questo campo e obbligatorio';
    }
    if (controllo.errors['minlength']) {
      const minLength = controllo.errors['minlength'].requiredLength;
      return `Minimo ${minLength} caratteri richiesti`;
    }
    if (controllo.errors['min']) {
      return `Valore minimo: ${controllo.errors['min'].min}`;
    }
    if (controllo.errors['max']) {
      return `Valore massimo: ${controllo.errors['max'].max}`;
    }

    return 'Campo non valido';
  }
}
