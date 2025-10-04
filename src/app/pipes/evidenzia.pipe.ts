/**
 * PIPE PERSONALIZZATA - Evidenzia Testo
 *
 * Una Pipe in Angular trasforma i dati nel template.
 * Questa pipe evidenzia il testo che corrisponde a un termine di ricerca.
 *
 * Uso: {{ testo | evidenzia:termine }}
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'evidenzia',
  standalone: true
})
export class EvidenziaPipe implements PipeTransform {

  /**
   * Il metodo transform viene chiamato automaticamente
   * quando usiamo la pipe nel template
   *
   * @param valore - Il testo da trasformare
   * @param termine - Il termine da evidenziare
   * @returns HTML con il termine evidenziato
   */
  transform(valore: string, termine: string): string {
    if (!termine || !valore) {
      return valore;
    }

    const regex = new RegExp(`(${termine})`, 'gi');
    return valore.replace(regex, '<mark>$1</mark>');
  }
}
