import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  variabile= 'ciao';
  @Output('eventoCustom') emettitoreEventoCustom = new EventEmitter();
  emettiEventoCustom() {
    this.emettitoreEventoCustom.emit({valore: this.variabile, chiave: 'nazaro'});
  }
}
