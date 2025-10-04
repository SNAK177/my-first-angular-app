/**
 * DIRETTIVA PERSONALIZZATA - Evidenzia Disponibile
 *
 * Una Direttiva in Angular modifica il comportamento o l'aspetto
 * di un elemento del DOM.
 *
 * Questa direttiva cambia il colore di sfondo di un elemento
 * in base alla disponibilità di un libro.
 *
 * Uso: <div [appEvidenziaDisponibile]="libro.disponibile">
 */

import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appEvidenziaDisponibile]',
  standalone: true
})
export class EvidenziaDisponibileDirective implements OnInit {

  /**
   * @Input() permette di passare dati dall'esterno
   * In questo caso, riceviamo un booleano (true/false)
   */
  @Input() appEvidenziaDisponibile: boolean = false;

  /**
   * ElementRef ci dà accesso all'elemento del DOM
   * su cui è applicata la direttiva
   */
  constructor(private el: ElementRef) {}

  /**
   * ngOnInit è un lifecycle hook che viene chiamato
   * quando Angular inizializza la direttiva
   */
  ngOnInit(): void {
    if (this.appEvidenziaDisponibile) {
      this.el.nativeElement.style.borderLeft = '4px solid #10b981';
      this.el.nativeElement.style.backgroundColor = '#f0fdf4';
    } else {
      this.el.nativeElement.style.borderLeft = '4px solid #ef4444';
      this.el.nativeElement.style.backgroundColor = '#fef2f2';
    }
  }
}
