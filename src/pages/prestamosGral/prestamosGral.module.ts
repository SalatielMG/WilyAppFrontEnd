import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { prestamosGralPage } from './prestamosGral';

@NgModule({
  declarations: [
    prestamosGralPage,
  ],
  imports: [
    IonicPageModule.forChild(prestamosGralPage),
  ],
})
export class PrestamosGralPageModule {}
