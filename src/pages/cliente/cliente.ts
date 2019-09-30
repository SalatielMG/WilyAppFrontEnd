import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import {PrestamoPage, prestamosCltePage} from "../index.paginas";

@IonicPage()
@Component({
  selector: 'page-cliente',
  templateUrl: 'cliente.html',
})
export class ClientePage {

  prestamosClte = prestamosCltePage;
  cliente:any={};
  sexo:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public  ctrlModal:ModalController) {
    this.cliente = this.navParams.get("client");
    if(this.cliente.sexo == 1) this.sexo = "Masculino"; else this.sexo = "Femenino";
    console.log(this.cliente);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientePage');
  }
  toco(){
    var data = { message : this.cliente, opcion: 1 };
    const modal = this.ctrlModal.create(PrestamoPage, data);
    modal.present();
    console.log("Holis me tocastes");
  }

}
