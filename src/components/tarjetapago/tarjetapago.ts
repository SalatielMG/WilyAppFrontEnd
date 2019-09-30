import {Component, Input, OnDestroy, OnInit} from '@angular/core';

/**
 * Generated class for the TarjetapagoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'tarjetapago',
  templateUrl: 'tarjetapago.html'
})
export class TarjetapagoComponent implements OnInit, OnDestroy {

  @Input("contentPago") contentPago:any;


  constructor() {
    console.log('Hello TarjetapagoComponent Component');

  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    console.log("this.contentPago", this.contentPago);
  }

}
