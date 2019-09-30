import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { prestamosCltePage } from './prestamosClte';

@NgModule({
  declarations: [
    prestamosCltePage,
  ],
  imports: [
    IonicPageModule.forChild(prestamosCltePage),
  ],
})
export class PrestamosCltePageModule {}
