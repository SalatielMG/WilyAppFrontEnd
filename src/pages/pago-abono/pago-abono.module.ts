import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagoAbonoPage } from './pago-abono';

@NgModule({
  declarations: [
    PagoAbonoPage,
  ],
  imports: [
    IonicPageModule.forChild(PagoAbonoPage),
  ],
})
export class PagoAbonoPageModule {}
