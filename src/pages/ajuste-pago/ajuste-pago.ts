import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {PrestamoProvider, UsuarioProvider, PagoProvider} from "../../providers/index.services";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {DatePipe} from "@angular/common";

@IonicPage()
@Component({
  selector: 'page-ajuste-pago',
  templateUrl: 'ajuste-pago.html',
})
export class AjustePagoPage {

  esGral: boolean = false;
  fechaActual:string = "";
  myForm: FormGroup;
  total:any = {};
  ultimoPago:any = {};
  abonoInteres: number;
  abonoCapital: number;
  interesRestante: number;
  capitalRestante: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController, public formBuilder: FormBuilder, public pagoProvider: PagoProvider, public prestamoProvider:PrestamoProvider, public userProvider: UsuarioProvider, public datePipe: DatePipe) {
    this.fechaActual = this.pagoProvider.util.obtFechaActual();
    this.total = this.navParams.get("total");
    this.ultimoPago =  this.navParams.get("ultimoPago");
    this.esGral = this.navParams.get("esGral");
    this.abonoInteres = this.total.abonoInteres;
    this.abonoCapital = this.total.abonoCapital;
    this.interesRestante = this.total.interesRestante;
    this.capitalRestante = this.total.capitalRestante;
    this.pagoProvider.resetajusPay();
    if(this.ultimoPago.mes == 0)
      console.log("NUlO Jejeje");
    console.log("Total:= ", this.total);
    console.log("ultimoPago:= ", this.ultimoPago);
    this.myForm = this.createMyForm(this.fechaActual);
  }
  eventoBtn(){
    this.pagoProvider.ajustar = !this.pagoProvider.ajustar;
    if(this.pagoProvider.ajustar){//Calcular el pago en meses
      /*
      * Calcular los pagos.
      * 1.-
      * */
      this.pagoProvider.calcularPgoMes(this.userProvider.id_usuario, this.userProvider.token, (this.esGral) ? this.pagoProvider.idPrestamoGral: this.pagoProvider.idPrestamoClte, this.ultimoPago, (this.esGral) ? this.pagoProvider.totalGral: this.pagoProvider.totalClte, this.myForm.value).then(() => {
      });
    }else{//Resetear.
      this.pagoProvider.resetajusPay();
    }
  }
  public fechaCorte(fecha){
    let ok = this.datePipe.transform(fecha, "dd MMMM yyyy");
    if(fecha == null || fecha == "")
      ok = "¡ Mes abierto !";
    return ok;
  }
  public actualizarCampos(evt){
    console.log(evt);
    if(evt == "") evt = "0";
    let totalAbono = parseInt(this.total.abonoInteres) + parseInt(evt) ;
    console.log(totalAbono);
    if(totalAbono >= parseInt(this.total.interesAcumulado)){
      this.abonoInteres = parseInt(this.total.interesAcumulado);
      this.abonoCapital = parseInt(this.total.abonoCapital) + (totalAbono - parseInt(this.total.interesAcumulado));
    }else{
      this.abonoInteres = totalAbono;
      this.abonoCapital = this.total.abonoCapital;
    }
    this.interesRestante = parseInt(this.total.interesAcumulado) - this.abonoInteres;
    this.capitalRestante = parseInt(this.total.capitalPrestado) - this.abonoCapital;
    this.pagoProvider.resetajusPay();
  }
  public calcularIntGenFP() {
    this.pagoProvider.resetajusPay();
    this.pagoProvider.calcFechaPagoInteresGenerado(this.ultimoPago, this.total, this.myForm.value.fechaPagar, this.esGral).subscribe((data:any)=>{
      console.log("data", data);
      this.total.interesAcumulado = parseInt(data.interesGeneradoFechaPgo) + parseInt(this.total.interesMesAcumulado);
      this.actualizarCampos(this.myForm.value.cantidadPagar);
      this.pagoProvider.util.detenerLoading();
    });
  }
  private createMyForm(fechaP = "", cantidadP = "0", notaP = ""){
    return this.formBuilder.group({
      fechaPagar: [fechaP, Validators.required],
      cantidadPagar: [cantidadP, Validators.required],
      notaPagar: [notaP],
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AjustePagoPage');
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }
  saveData(){
    if(parseInt(this.myForm.value.cantidadPagar) == 0){
      this.pagoProvider.util.msj("Error Cantidad a Pagar", "¡ La cantidad a pagar debe ser mayor a cero !");
      return;
    }
    if(!this.pagoProvider.ajustar){
      this.pagoProvider.util.msj("Error Ajustar Pagos", "¡ Porfavor ajuste el pago en meses, presione el boton para acomodar el pago en meses !");
      return;
    }
    this.pagoProvider.ajustarPagos(this.userProvider.id_usuario, this.userProvider.token, this.esGral).then(()=>{
      if(this.pagoProvider.isCorrectAjustePago)this.closeModal();
    });
    console.log("Data Formulario", this.myForm.value);
  }
}
