import { Component } from '@angular/core';
import {AlertController, NavController, NavParams, Refresher} from 'ionic-angular';
import {PrestamoProvider, ClienteProvider, UsuarioProvider} from "../../providers/index.services";

@Component({
  selector: 'page-papelera',
  templateUrl: 'papelera.html'
})

export class PapeleraPage {

  papelera: number = 1;//Cliente
  prestamo: number = 1;

  constructor(public navCtrl: NavController, public prestamoProvider: PrestamoProvider, public clienteProvider: ClienteProvider, public navParams:NavParams, public alertCtrl: AlertController, public userProvider: UsuarioProvider) {
    //Llamar al metodo que recarga todos los clientes.
    //this.clienteProvider.cargarClientesEliminados();
  }

  /*Clientes*/
  eliminarPermanentementeCliente(Clte:any, index:number){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea eliminar permanentemente el Cliente ?',
      message: "¡ Si esta seguro proceda con la eliminación, esto hara que el registro del cliente junto con todos sus prestamos y abonos desaparezcan de la Base de Datos!"+this.prestamoProvider.util.msjCliente(Clte),
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.clienteProvider.eliminarPermanentementeCliente(this.userProvider.id_usuario, this.userProvider.token, Clte.id, index);
            //this.abonoProvider.eliminarPermanentemente(idAbono, this.userProvider.id_usuario, this.userProvider.token, true);
          }
        }
      ]
    });
    confirm.present();
  }

  restaurarCliente(Clte: any, index:number){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea restaurar el Cliente ?',
      message: "¡ Si restaura el Cliente, esta se anexara a la lista de sus Clientes y por consiguiente se recuperaran todos los movimientos de prestamos y pagos que haya hecho!"+this.prestamoProvider.util.msjCliente(Clte),
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Restaurar',
          handler: () => {
            this.clienteProvider.restaurarCliente(this.userProvider.id_usuario, this.userProvider.token, Clte.id, index);
            //this.abonoProvider.restaurarAbono(idAbono, this.userProvider.id_usuario, this.userProvider.token, true);
          }
        }
      ]
    });
    confirm.present();
  }
  /*Clientes*/

  /*PRestamos*/
  eliminarPermanentementePrestamo(Prest:any, index:number){
    let titulo = (this.prestamo) ? 'Activo ?' : 'Cerrado ?';
    const confirm = this.alertCtrl.create({
      title: '¿ Desea Eliminar Permanentemente el Prestamo con Estado ' + titulo,
      message: "¡ Si esta seguro proceda con la eliminación, esto hara que el registro del Prestamo junto con los movimientos de los pagos realizados desaparezcan de la Base de Datos!"+this.prestamoProvider.util.msjEliminarPrestamo(Prest),
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.prestamoProvider.eliminarPermanentementePrestamo(this.userProvider.id_usuario, this.userProvider.token, Prest.id, index, this.prestamo);
            //this.abonoProvider.eliminarPermanentemente(idAbono, this.userProvider.id_usuario, this.userProvider.token, true);
          }
        }
      ]
    });
    confirm.present();
  }

  restaurarPrestamo(Prest: any, index: number){
    let titulo = (this.prestamo) ? 'Activo' : 'Cerrado';
    const confirm = this.alertCtrl.create({
      title: '¿ Desea Restaurar el Prestamo con Estado ' + titulo + ' ?',
      message: "¡ Si restaura el Prestamo, esta se anexara a la lista de los Prestamos " + titulo+ "s y por consiguiente se recuperaran todos los movimientos de los pagos realizados!"+this.prestamoProvider.util.msjEliminarPrestamo(Prest),
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Restaurar',
          handler: () => {
            this.prestamoProvider.restaurarPrestamo(this.userProvider.id_usuario, this.userProvider.token, Prest.id, this.prestamo, index);
            //this.abonoProvider.restaurarAbono(idAbono, this.userProvider.id_usuario, this.userProvider.token, true);
          }
        }
      ]
    });
    confirm.present();
  }
  /*Prestamos*/



  ionViewWillEnter() {
    console.log('******************************ionViewWillEnter PapeleraPage******************************');
    this.verfificarActualizacion();
  }

    segmentChanged(evt){//Evento en los cambios del segment Principal
      this.verfificarActualizacion();
    }
  private verfificarActualizacion(){
    console.log(this.papelera);
    if(this.papelera == 1) this.actualizarClientesEliminados(); else this.actualizarPrestamosEliminados();
  }
  actualizarClientesEliminados(){
    console.log("this.clienteProvider.util.esCambioClienteEliminado", this.clienteProvider.util.esCambioClienteEliminado);
    if(this.clienteProvider.util.esCambioClienteEliminado){
      this.clienteProvider.cargarClientesEliminados();
    }
  }
  actualizarPrestamosEliminados(){
    console.log(this.prestamo);
    console.log("this.prestamoProvider.util.esCambioPrestamoAcElim", this.prestamoProvider.util.esCambioPrestamoAcElim);
    console.log("this.prestamoProvider.util.esCambioPrestamoCeElim", this.prestamoProvider.util.esCambioPrestamoCeElim);
    if(this.prestamo == 1){
      if(this.prestamoProvider.util.esCambioPrestamoAcElim){
        this.prestamoProvider.cargarPrestamosEliminados(this.prestamo);
      }
    }
    else {
      if(this.prestamoProvider.util.esCambioPrestamoCeElim){
        this.prestamoProvider.cargarPrestamosEliminados(this.prestamo);
      }
    }
  }

  segmentPrestamos(evt){
    this.actualizarPrestamosEliminados();
  }

  doRefresh(refresher: Refresher) {
    console.log("Switch Refresher",this.papelera);
    if(this.papelera == 1){
      console.log("Switch Refresher -> Probando",this.papelera);
      this.clienteProvider.cargarClientesEliminados().then(()=>{
        refresher.complete();
        console.log('Reresco terminado ', refresher);
      });
    }else if(this.papelera == 2){
      console.log("Switch Refresher -> Probando",this.papelera);
      console.log("caso 2: this.prestamo:= ", this.prestamo);
      this.prestamoProvider.cargarPrestamosEliminados(this.prestamo).then(() => {
        refresher.complete();
        console.log('Reresco terminado ', refresher);
      });
    }

  }

  doPulling(refresher: Refresher) {
    console.log('DOPULLING!!! :)', refresher.progress);
  }
}
