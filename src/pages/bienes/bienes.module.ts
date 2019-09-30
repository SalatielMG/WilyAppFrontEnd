import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BienesPage } from './bienes';

@NgModule({
  declarations: [
    BienesPage,
  ],
  imports: [
    IonicPageModule.forChild(BienesPage),
  ],
})
export class BienesPageModule {}
