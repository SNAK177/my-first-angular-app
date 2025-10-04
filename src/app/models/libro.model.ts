/**
 * INTERFACCIA - LIBRO MODEL
 *
 * Un'interfaccia TypeScript definisce la struttura di un oggetto.
 * In questo caso, definiamo come deve essere fatto un "Libro".
 *
 * Le interfacce aiutano a:
 * - Avere controllo del tipo dei dati
 * - Prevenire errori durante lo sviluppo
 * - Avere autocompletamento nell'editor
 */

export interface Libro {
  id: number;
  titolo: string;
  autore: string;
  anno: number;
  genere: string;
  descrizione: string;
  disponibile: boolean;
  copertina?: string;
}
