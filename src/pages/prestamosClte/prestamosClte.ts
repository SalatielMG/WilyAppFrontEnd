import {Component} from '@angular/core';
import {IonicPage, NavController, AlertController, NavParams, Refresher} from 'ionic-angular';
import { UsuarioProvider, PrestamoProvider } from "../../providers/index.services";
import {PagoCltePage, PrestamoAbonosCltePage} from "../../pages/index.paginas";

@IonicPage()
@Component({
  selector: 'page-prestamos',
  templateUrl: 'prestamosClte.html',
})
export class prestamosCltePage {
  /**Variables**/
  pagoCltePage = PagoCltePage;
  prestamoAbonosPage = PrestamoAbonosCltePage;
  clte: any;
  bnd: boolean = false;
  /**Variables**/

  constructor(public navCtrl: NavController,
              private usProvider:UsuarioProvider,
              public prestamoProvider:PrestamoProvider,
              public alertCtrl:AlertController,
              public navParams:NavParams)
  {
    console.log("******************************Constructor PrestamoAcivos******************************");
    //Se tendra que llara a cargar todos los prestasmo activos y cerrados
    this.prestamoProvider.esAll=false;
    this.clte=this.navParams.get("cliente");
    this.prestamoProvider.idC=this.clte["id"];
    this.prestamoProvider.cargarTodosPrestamosActivos(this.bnd);
    this.prestamoProvider.cargarTodosPrestamosCerrados(this.bnd);
  }

  ionViewWillEnter(){
    console.log('******************************ionViewDidEnter PrestasmoActivosPage******************************');
    /*console.log("esCambioCliente:="+this.prestamoProvider.util.esCambioCliente);
    if(this.prestamoProvider.util.esCambioCliente){
      console.log('Probando if esCambioCliente');
      this.prestamoProvider.cargarPrestamosActivos();
    }*/
    //this.prestamoProvider.util.viewPrestamo = this.navParams.get("bnd");
    this.prestamoProvider.textoRefrescando = (this.prestamoProvider.prestamoClte== 1) ? "Cargando todos los Prestamos Activos" : "Cargando todos los Prestamos Cerrados";
    this.clte=this.navParams.get("cliente");
    this.prestamoProvider.idC=this.clte["id"];
  }

  siguiente_pagina(event){
    if(this.prestamoProvider.prestamoClte == 1){//Activos
      this.prestamoProvider.cargarPrestamosActivos(this.bnd).then(
        ()=>{
          event.complete();
        }
      );
    }else{//Cerrados
      this.prestamoProvider.cargarPrestamosCerrados(this.bnd).then(
        ()=>{
          event.complete();
        }
      );
    }
  }

  borrarPrestamoActivo(idx:number, prest:any){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea cancelar el prestamo del cliente : '+prest.nombreCliente+' ?',
      message: this.prestamoProvider.util.msjEliminarPrestamo(prest),

      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.prestamoProvider.eliminarPrestamo(prest.id,this.usProvider.id_usuario,this.usProvider.token, idx, this.bnd, this.prestamoProvider.prestamoClte);
          }
        }
      ]
    });
    confirm.present();
  }
  borrarPrestamocerrado(i, prest){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea borrar el prestamo del cliente : ' + prest.nombreCliente + ' ?',
      message: this.prestamoProvider.util.msjEliminarPrestamo(prest),

      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.prestamoProvider.eliminarPrestamo(prest.id,this.usProvider.id_usuario,this.usProvider.token, i, this.bnd, this.prestamoProvider.prestamo);
          }
        }
      ]
    });
    confirm.present();
  }
  deshacerCierrePrestamo(id){
    const confirm = this.alertCtrl.create({
      title: "¿ Desea cambiar el estado del prestamo a 'Activo' ?",
      message: "Si lo hace, el prestamo elegido volvera hacer Activo otra vez y lo podra ver en la sección de prestamos Activos",
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            /*
            * Llamar a un metodo para cerrar el prestamo.
            *
            * despues de carrar hay que actualizar los array de prestamos activos y prestamos cerrados de Gral
            * */
            this.prestamoProvider.deshacerCierrePrestamo(id, this.usProvider.id_usuario, this.usProvider.token, this.bnd);
          }
        }
      ]
    });
    confirm.present();
  }


  doRefresh(refresher: Refresher) {

    if(this.prestamoProvider.prestamoClte == 1){//Es Prestamo Activo
      console.log('DOREFRESH Prestamos Activos', refresher);
      this.prestamoProvider.resetDataSearchPA(this.bnd);
      this.prestamoProvider.resetearPA(this.bnd);
      this.prestamoProvider.cargarPrestamosActivos(this.bnd).then(
        (data)=>{
          refresher.complete();
          console.log('Reresco terminado ', refresher);
          console.log('data despues del refresco ', data);

        }
      );
    }else{//Es Prestamo Cerrado
      console.log('DOREFRESH Prestamos Cerrados', refresher);
      this.prestamoProvider.resetDataSearchPC(this.bnd);
      this.prestamoProvider.resetearPC(this.bnd);
      this.prestamoProvider.cargarPrestamosCerrados(this.bnd).then(
        ()=>{
          refresher.complete();
          console.log('Reresco terminado ', refresher);
        }
      );
    }
  }

  doPulling(refresher: Refresher) {
    console.log('DOPULLING!!! :)', refresher.progress);
  }

}
