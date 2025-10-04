/**
 * SERVIZIO - LIBRI SERVICE
 *
 * Un servizio in Angular è una classe che contiene la logica di business
 * e può essere iniettata in componenti o altri servizi.
 *
 * @Injectable({ providedIn: 'root' }) significa che:
 * - Il servizio è disponibile in tutta l'applicazione (singleton)
 * - Non serve registrarlo nei providers
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';
import { Libro } from '../models/libro.model';

@Injectable({
  providedIn: 'root'
})
export class LibriService {

  /**
   * BehaviorSubject è un tipo speciale di Observable che:
   * - Mantiene l'ultimo valore emesso
   * - Emette immediatamente il valore corrente ai nuovi subscriber
   * - Permette di aggiornare il valore con .next()
   *
   * Usiamo il dollaro ($) alla fine del nome per convenzione,
   * indicando che è un Observable
   */
  private libriSubject$ = new BehaviorSubject<Libro[]>(this.getLibriIniziali());

  /**
   * Esponiamo solo la versione read-only (asObservable)
   * così i componenti possono leggere ma non modificare direttamente
   */
  public libri$ = this.libriSubject$.asObservable();

  constructor() {
    console.log('📚 LibriService inizializzato!');
  }

  /**
   * METODO: Ottieni tutti i libri
   * Simula una chiamata HTTP con delay
   */
  getLibri(): Observable<Libro[]> {
    return of(this.libriSubject$.value).pipe(
      delay(300)
    );
  }

  /**
   * METODO: Ottieni un libro specifico per ID
   */
  getLibroById(id: number): Observable<Libro | undefined> {
    const libro = this.libriSubject$.value.find(l => l.id === id);
    return of(libro).pipe(delay(200));
  }

  /**
   * METODO: Aggiungi un nuovo libro
   */
  aggiungiLibro(libro: Omit<Libro, 'id'>): void {
    const libriAttuali = this.libriSubject$.value;
    const nuovoId = Math.max(...libriAttuali.map(l => l.id), 0) + 1;

    const nuovoLibro: Libro = {
      ...libro,
      id: nuovoId
    };

    this.libriSubject$.next([...libriAttuali, nuovoLibro]);
  }

  /**
   * METODO: Aggiorna un libro esistente
   */
  aggiornaLibro(libro: Libro): void {
    const libriAttuali = this.libriSubject$.value;
    const index = libriAttuali.findIndex(l => l.id === libro.id);

    if (index !== -1) {
      const libriAggiornati = [...libriAttuali];
      libriAggiornati[index] = libro;
      this.libriSubject$.next(libriAggiornati);
    }
  }

  /**
   * METODO: Elimina un libro
   */
  eliminaLibro(id: number): void {
    const libriFiltrati = this.libriSubject$.value.filter(l => l.id !== id);
    this.libriSubject$.next(libriFiltrati);
  }

  /**
   * METODO: Cerca libri per titolo o autore
   */
  cercaLibri(termine: string): Observable<Libro[]> {
    const termineMinuscolo = termine.toLowerCase();
    const risultati = this.libriSubject$.value.filter(libro =>
      libro.titolo.toLowerCase().includes(termineMinuscolo) ||
      libro.autore.toLowerCase().includes(termineMinuscolo)
    );
    return of(risultati).pipe(delay(200));
  }

  /**
   * Dati iniziali di esempio
   */
  private getLibriIniziali(): Libro[] {
    return [
      {
        id: 1,
        titolo: 'Il Signore degli Anelli',
        autore: 'J.R.R. Tolkien',
        anno: 1954,
        genere: 'Fantasy',
        descrizione: 'Un\'epica avventura nella Terra di Mezzo',
        disponibile: true,
        copertina: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 2,
        titolo: '1984',
        autore: 'George Orwell',
        anno: 1949,
        genere: 'Distopia',
        descrizione: 'Un romanzo distopico sul totalitarismo',
        disponibile: true,
        copertina: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 3,
        titolo: 'Il Piccolo Principe',
        autore: 'Antoine de Saint-Exupéry',
        anno: 1943,
        genere: 'Favola',
        descrizione: 'Una favola filosofica e poetica',
        disponibile: false,
        copertina: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 4,
        titolo: 'Harry Potter e la Pietra Filosofale',
        autore: 'J.K. Rowling',
        anno: 1997,
        genere: 'Fantasy',
        descrizione: 'Il primo libro della saga di Harry Potter',
        disponibile: true,
        copertina: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ];
  }
}
