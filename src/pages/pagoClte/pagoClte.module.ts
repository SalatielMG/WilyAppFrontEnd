import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagoCltePage } from './pagoClte';

@NgModule({
  declarations: [
    PagoCltePage,
  ],
  imports: [
    IonicPageModule.forChild(PagoCltePage),
  ],
})
export class PagoCltePageModule {}
