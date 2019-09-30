import {AlertController, LoadingController, ModalController, ToastController} from "ionic-angular";
import { Injectable} from "@angular/core";
import { AbonosPage, PagoAbonoPage, PrestamoPage, BienesPage, AjustePagoPage } from "../pages/index.paginas";
import { DatePipe } from '@angular/common';

@Injectable()

export class Utilerias {

  public  respaldoidPrestamoGral: number = 0;
  public  respaldoidPrestamoClte: number = 0;

  public loading = [];
  public esCambioClte: boolean = true;
  public esCambioCliente: boolean = false;
  public esCambioClienteEliminado: boolean = true;
  public esCambioAbono: boolean = false;
  public esCambioPrestamo: boolean = false;
  public esCambioPrestamoAcElim: boolean = true;
  public esCambioPrestamoCeElim: boolean = true;
  public esCambioPrestamoAbono: boolean = false;
  public nameLock:string = "lock";
  public nameUnlock:string = "unlock";

  constructor(private alertCtrl:AlertController, private loadCtrl:LoadingController, private toastCtrl:ToastController, private ctrlModal:ModalController,  public datePipe: DatePipe,){

  }

  verifColor(ab:number){
    return (ab == 0) ? "cerrado": "abierto";
  }
  verifColorr(ab:number){
    return (ab == 0) ? "verde": "rojo";
  }
  abonoCancel(status){
    return (status == 0) ? "abonoAnulado": "abonoNormal";
  }
  public valorMes(mesTranscurrido){
    if(mesTranscurrido == 0) return "Ningun mes transcurrido";
    if(mesTranscurrido > 1) return mesTranscurrido + " meses transcurridos";
    return mesTranscurrido + " mes transcurrido";
  }
  public textAbono(pos){
    return (pos == 0) ? "Abono cancelado": pos + "° Abono";
  }
  cssMES(status){
    return (status == 0) ? "abonoAnulado": "pagoNormal";
  }
  public fechaCorte(fecha){
    let ok = this.datePipe.transform(fecha, "dd MMMM yyyy");
    if(fecha == null || fecha == "")
      ok = "¡ Mes abierto !";
    return ok;
  }


  public periodoFechas(fI, fF){
    let fechaI = this.datePipe.transform(fI, "dd MMMM yyyy");
    let fechaF = this.datePipe.transform(fF, "dd MMMM yyyy");
    return fechaI + " al " + fechaF;
  }
  public obtFechaActual(){
    return new Date().toISOString().substr(0,10);
  }

  public msjCliente(prest: any){
    return "<br><br><p class='nombreCliente'><strong>"+prest.nombreCliente+"</strong></p><p class='descripcion'><strong>Dirección:</strong>"+prest.direccion+"</p> <p class='descripcion'><strong>Telefono:</strong> "+prest.telefono+"</p>";
  }

  public msjEliminarPrestamo(prest: any){
    return "<br><br><strong>Fecha:</strong> "+prest.fecha+"<br><br><strong>Capital:</strong> $"+prest.cantidad+"<br><br><strong>Interes:</strong> "+this.pctje(prest.porcentaje)+"%<br><br><strong>Bien:</strong> "+prest.nombreBien+"<br><br><strong>Descripción:</strong> "+prest.estado_bien;
  }

  private pctje(x){
    return x*100;
  }
  public abrirModalPagoAbono(data, pa = PagoAbonoPage){
    console.log(data);
    const modal = this.ctrlModal.create(pa, data);
    modal.present();
  }
  public abrirModalAjustePago(data, pa = AjustePagoPage){
    console.log(data);
    const modal = this.ctrlModal.create(pa, data);
    modal.present();
  }
  public abrirModalAbono(data, ab = AbonosPage){
    console.log(data);
    const modal = this.ctrlModal.create(ab, data);
    modal.present();
  }

  public abrirModalPrestamo(data, prest = PrestamoPage){
    console.log(data);
    const modal = this.ctrlModal.create(prest, data);
    modal.present();
  }

  public abrirModalBien(bien = BienesPage){
    const modal = this.ctrlModal.create(bien);
    modal.present();
  }

  public toast(msj:string="",pos:string="top" , close=false, duration = 3){
    let data = {
      message: msj,
      duration: duration * 1000,
      position: pos
    };
    if(close){
      delete data["duration"];
      data["showCloseButton"] = true;
      data["closeButtonText"] = "Ok";
    }
    let toast = this.toastCtrl.create(data);
    toast.present();
  }
  public msj(titulo:string ="Error",msj:string="Ocurrio un error al procesar la información"){
    this.alertCtrl.create({
      title: titulo,
      subTitle: msj,
      buttons: ["OK"]
    }).present();
  }
  public crearLoading(contenido:string=""){
    let load = this.loadCtrl.create({
      content:contenido
    });
    load.present();
    this.loading.push(load);
  }
  public detenerLoading(){
    for(let l of this.loading){
      l.dismiss();
    }
    this.loading=[];
  }

  public asignarCambioC(){
    if(!this.esCambioCliente)
      this.esCambioCliente = true;
  }

  public designarCambioC(){
    if(this.esCambioCliente)
      this.esCambioCliente = false;
  }

}
