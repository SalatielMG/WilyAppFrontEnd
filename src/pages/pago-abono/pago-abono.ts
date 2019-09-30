import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {PrestamoProvider, PagoProvider, UsuarioProvider} from "../../providers/index.services";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-pago-abono',
  templateUrl: 'pago-abono.html',
})
export class PagoAbonoPage {
  textBntAbonar: string = "";
  titulo: string = "";
  abono: any = {};
  opcion: number;
  pago: any = {};
  index: any;
  esGral; any;
  myForm: FormGroup;
  abonoInteres: number;
  abonoCapital: number;
  interesRestante: number;
  capitalRestante: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public usProvider: UsuarioProvider, public prestamoProvider: PrestamoProvider, public events: Events, public viewCtrl:ViewController, public formBuilder: FormBuilder, public pagoProvider: PagoProvider) {
    this.pago = this.navParams.get("pago");
    this.index = this.navParams.get("index");
    this.esGral = this.navParams.get("esGral");
    this.opcion = this.navParams.get("opcion");
    switch (this.opcion) {
      case 1:
        this.textBntAbonar = "Abonar";
        this.titulo = "Nuevo";
        this.abonoCapital = this.pago.abonoCapital;
        this.abonoInteres = this.pago.abonoInteres;
        this.interesRestante = this.pago.interesRestante;
        this.capitalRestante = this.pago.capitalRestante;
        //let fechaActual = this.abonoProvider.util.obtFechaActual();
        this.myForm = this.createMyForm(this.pago.fechaInicial, "0", "");
        console.log("pago in '*PagoAbono.ts*'", this.pago);
        console.log("this.pago.interesAcumulado", this.pago.interesAcumulado);
        break;
      case 2:
        this.textBntAbonar = "Actualizar";
        this.titulo = "Editar";
        this.abono = this.navParams.get("abono");
        this.abonoCapital = this.pago.abonoCapital;
        this.abonoInteres = this.pago.abonoInteres;
        this.interesRestante = this.pago.interesRestante;
        this.capitalRestante = this.pago.capitalRestante;
        //this.xdRestaR();
        //this.actualizarCampos(this.abono.cantidad);
        this.myForm = this.createMyForm(this.abono.fecha, this.abono.cantidad, this.abono.nota);

        break;
    }

    //prestamoProvider.util.abrirModalPagoAbono({pago: pago, index: i, esGral: true, opcion: 1})
    //prestamoProvider.util.abrirModalPagoAbono({pago: pago, abono: abono, index: i, esGral: true, opcion: 1})
  }
  private xdRestaR(){
    if(this.interesRestante == 0){
      if(this.abonoCapital >= parseInt(this.abono.cantidad)){
        this.abonoCapital = this.abonoCapital - parseInt(this.abono.cantidad);
      }else{
        this.abonoInteres = parseInt(this.pago.interesAcumulado) - (parseInt(this.abono.cantidad) - this.abonoCapital);
        this.abonoCapital = 0;
      }
    }else{
      console.log("Prodando", (parseInt(this.abonoInteres.toString()) - parseInt(this.abono.cantidad)));
      this.abonoInteres = parseInt(this.abonoInteres.toString()) - parseInt(this.abono.cantidad);
      this.interesRestante = parseInt(this.pago.interesAcumulado) - parseInt(this.abonoInteres.toString());
    }
  }

  public actualizarCampos(evt){
    console.log(evt);
    if(evt == "") evt = "0";
    let totalAbono = parseInt(this.pago.abonoInteres) + parseInt(evt) ;
    console.log(totalAbono);
    if(totalAbono >= parseInt(this.pago.interesAcumulado)){
      this.abonoInteres = parseInt(this.pago.interesAcumulado);
      this.abonoCapital = parseInt(this.pago.abonoCapital) + (totalAbono - parseInt(this.pago.interesAcumulado));
    }else{
      this.abonoInteres = totalAbono;
      this.abonoCapital = 0;
    }
    this.interesRestante = parseInt(this.pago.interesAcumulado) - this.abonoInteres;
    this.capitalRestante = parseInt(this.pago.capitalActual) - this.abonoCapital;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagoAbonoPage');
  }
  ionViewWillUnload(){
    console.log('ionViewWillUnload PagoAbonoPage');
    this.pago = {};
  }
  eventoBtn(bnd:boolean = false){
    console.log('Evento publicado !', bnd);
    this.events.publish('evt:btn', bnd);
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }
  /*

  */

  private createMyForm(fechaP = this.pagoProvider.util.obtFechaActual(), abonoP = "0", notaP = ""){
    return this.formBuilder.group({
      fecha: [fechaP, Validators.required],
      abono: [abonoP, Validators.required],
      nota: [notaP]
    });
  }

  saveData(){
    console.log("Data Formulario", this.myForm.value);
    switch(this.opcion){
      case 1:
        this.alta();
        break;
      case 2:
        this.editar();
        break;
    }
  }
                                                                    //editarAbono(idUsuario, token, pagoId, abonoId, dataAbono: any, indexPago, esGral: boolean = true){
  editar(){
    this.pagoProvider.editarAbono(this.usProvider.id_usuario, this.usProvider.token, this.pago.id, this.abono.id, this.myForm.value, this.index, this.esGral).then(() => {
      if(this.pagoProvider.isCorrectAbono) this.closeModal();
    });
  }

  alta(){
    this.pagoProvider.agregarAbono(this.usProvider.id_usuario, this.usProvider.token, this.pago.id, this.myForm.value, this.index, this.esGral).then(() => {
      if(this.pagoProvider.isCorrectAbono) this.closeModal();
      setTimeout(() => {
        //console.log("this.navCtrl.parent" , this.navCtrl.parent);
        //this.ev(this.index);
      });
    });
  }
  ev(index:number){
    console.log('Evento publicado !', index);
    this.events.publish('altaAbono:btn', index);
  }
}
