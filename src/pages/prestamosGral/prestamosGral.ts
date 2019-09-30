import {Component} from '@angular/core';
import {NavController, AlertController, NavParams, Refresher} from 'ionic-angular';
import { UsuarioProvider, PrestamoProvider } from "../../providers/index.services";
import { PrestamoAbonosGralPage, PagoPage } from "../../pages/index.paginas";


@Component({
  selector: 'page-prestamosActivos',
  templateUrl: 'prestamosGral.html'
})
export class prestamosGralPage {

  /**Variables**/
  //prestamoAbonosPage = PrestamoAbonosGralPage;
  pagoPage = PagoPage;
  /**Variables**/

  constructor(public navCtrl: NavController,
  private usProvider:UsuarioProvider,
  public prestamoProvider:PrestamoProvider,
              public alertCtrl:AlertController,
              public navParams:NavParams)
  {
    console.log("******************************Constructor PrestamoAcivos******************************");
    //Se tendra que llara a cargar todos los prestasmo activos y cerrados
    this.prestamoProvider.idC=0;
    this.prestamoProvider.esAll=true;
    this.prestamoProvider.cargarTodosPrestamosActivos();
    this.prestamoProvider.cargarTodosPrestamosCerrados();
  }
  ionViewWillEnter(){
    console.log('******************************ionViewDidEnter PrestasmoActivosPage******************************');
    /*console.log("esCambioCliente:="+this.prestamoProvider.util.esCambioCliente);
    if(this.prestamoProvider.util.esCambioCliente){
      console.log('Probando if esCambioCliente');
      this.prestamoProvider.cargarPrestamosActivos();
    }*/
    //this.prestamoProvider.util.viewPrestamo = this.navParams.get("bnd");
    this.prestamoProvider.textoRefrescando = (this.prestamoProvider.prestamo== 1) ? "Cargando todos los Prestamos Activos" : "Cargando todos los Prestamos Cerrados";
    this.prestamoProvider.idC=0;
    if(this.prestamoProvider.util.esCambioPrestamo || this.prestamoProvider.util.esCambioCliente){//Una vez que entre al metodo y se haga eficazmente, la variable se vuelve falsa.
      this.prestamoProvider.cargarTodosPrestamosActivos();
      this.prestamoProvider.cargarTodosPrestamosCerrados();
    }
  }
  siguiente_pagina(event){
    if(this.prestamoProvider.prestamo == 1){//Activos
      this.prestamoProvider.cargarPrestamosActivos().then(
        ()=>{
          event.complete();
        }
      );
    }else{//Cerrados
      this.prestamoProvider.cargarPrestamosCerrados().then(
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
            this.prestamoProvider.eliminarPrestamo(prest.id,this.usProvider.id_usuario,this.usProvider.token, idx, true, this.prestamoProvider.prestamo);
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
            this.prestamoProvider.eliminarPrestamo(prest.id,this.usProvider.id_usuario,this.usProvider.token, i, true, this.prestamoProvider.prestamo);
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
            this.prestamoProvider.deshacerCierrePrestamo(id, this.usProvider.id_usuario, this.usProvider.token);
          }
        }
      ]
    });
    confirm.present();
  }


  doRefresh(refresher: Refresher) {

    if(this.prestamoProvider.prestamo == 1){//Es Prestamo Activo
      console.log('DOREFRESH Prestamos Activos', refresher);
      this.prestamoProvider.resetDataSearchPA();
      this.prestamoProvider.resetearPA();
      this.prestamoProvider.cargarPrestamosActivos().then(
        (data)=>{
          refresher.complete();
          console.log('Reresco terminado ', refresher);
          console.log('data despues del refresco ', data);

        }
      );
    }else{//Es Prestamo Cerrado
      console.log('DOREFRESH Prestamos Cerrados', refresher);
      this.prestamoProvider.resetDataSearchPC();
      this.prestamoProvider.resetearPC();
      this.prestamoProvider.cargarPrestamosCerrados().then(
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
