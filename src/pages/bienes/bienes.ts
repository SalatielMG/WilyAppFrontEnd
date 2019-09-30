import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UsuarioProvider} from "../../providers/usuario/usuario";
import {BienProvider} from "../../providers/bien/bien";


@IonicPage()
@Component({
  selector: 'page-bienes',
  templateUrl: 'bienes.html',
})
export class BienesPage {

  myForm: FormGroup;

  constructor(public viewCtrl:ViewController ,public formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public userProvider: UsuarioProvider, public bienProvider: BienProvider) {
    this.myForm = this.createMyForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BienesPage');
  }
  private createMyForm(){
    return this.formBuilder.group({
      nombre: ["", Validators.required],
      tipo: ["", Validators.required]
    });
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }
  saveData(){
    console.log("myform", this.myForm.value);
    this.bienProvider.agregarBien(this.myForm.value, this.userProvider.id_usuario, this.userProvider.token).subscribe(()=>{
      if(this.bienProvider.isNew) this.closeModal();
    });
  }
}
