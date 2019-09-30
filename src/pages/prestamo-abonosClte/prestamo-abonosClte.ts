import {Component, ElementRef, Renderer2, ViewChildren} from '@angular/core';
import {IonicPage, NavController, NavParams, Events, AlertController, Refresher} from 'ionic-angular';
import {PrestamoProvider, AbonoProvider, UsuarioProvider} from "../../providers/index.services";

@IonicPage()
@Component({
  selector: 'page-prestamo-abonos-clte',
  templateUrl: 'prestamo-abonosClte.html',
})
export class PrestamoAbonosCltePage {

  titulo: string;
  prestamo;
  @ViewChildren("itemContenido") itemContent = ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams, public abonoProvider: AbonoProvider, public prestamoProvider: PrestamoProvider, public events: Events, public alertCtrl: AlertController, public userProvider: UsuarioProvider, public renderer: Renderer2) {
    console.log("******************************Constructor PrestamoAbonosCltePage******************************");
    this.prestamo = this.navParams.get("prestamo");
    this.titulo = (this.prestamoProvider.prestamoClte == 1) ? "Activo": "Cerrado";
    this.abonoProvider.esActivoClte = this.prestamoProvider.prestamoClte;
    this.abonoProvider.idPrestamoClte = this.prestamo["id"];
    this.abonoProvider.cargarTodoAbonoClte();
  }

  ionViewWillEnter() {
    console.log('******************************ionViewWillEnter PrestamoAbonosCltePage******************************');
    console.log("this.itemContent", this.itemContent["_results"]);
  }

  ionViewWillUnload(){
    console.log('******************************ionViewWillUnload PrestamoAbonosCltePage******************************');
    this.abonoProvider.idPrestamoClte = 0;
  }

  eventoBtn(bnd:boolean = false){
    console.log('Evento publicado evt:btnClte !', bnd);
    this.events.publish('evt:btnClte', bnd);
  }

  cerrarPrestamoA(){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea cerrar el prestamo ?',
      message: " Ingrese alguna nota o razon por la que cierra el prestamo",
      inputs: [
        {
          name: 'nota',
          placeholder: 'Ej. LLegue a un acuerdo con el cliente'
        },
      ],
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
            console.log("confirm.data", confirm.data["inputs"]);
            /*
            * Llamar a un metodo para cerrar el prestamo.
            *
            * despues de carrar hay que actualizar los array de prestamos activos y prestamos cerrados de Gral
            * */
            /*this.prestamoProvider.cerrarPrestamoActivo(this.abonoProvider.idPrestamoClte, this.userProvider.id_usuario, this.userProvider.token, false).subscribe(()=>{
              if(this.prestamoProvider.isNew) {this.navCtrl.pop(); this.abonoProvider.ActualizarCambioAbonosGral(true);}
            });*/
          }
        }
      ]
    });
    confirm.present();
  }

  updateTempAbono(){
    this.abonoProvider.actualizarTempAbonoClte().then((data)=>{
      setTimeout(()=>{
        console.log(this.abonoProvider.anuladosClte);
        console.log("tempAboo", this.abonoProvider.tempAbonosClte);
        console.log("this.itemContent", this.itemContent["_results"]);
        /*
        * Actualizar los colores de los items que son status == 0
        *
        *
        * */
        if(this.abonoProvider.anuladosClte){//Hay que pintar el fondo del item con rojo
          for(let pos = 0; pos < this.abonoProvider.tempAbonosClte.length; pos++){
            if(this.abonoProvider.tempAbonosClte[pos].status == 0){
              console.log("this.itemContent[_results][pos].nativeElement", this.itemContent["_results"][pos]["_elementRef"].nativeElement);
              //this.renderer.setStyle( this.itemContent["_results"][pos]["_elementRef"].nativeElement,"background-color", "#ef4200");
              this.renderer.addClass(this.itemContent["_results"][pos]["_elementRef"].nativeElement, "abonoAnulado");
            }
          }

        }

      },()=>{
        if (this.itemContent != null) {

        }
      });

    });

  }

  doRefresh(refresher: Refresher) {    //El refresher solo se carga cuando se esta consultando abbonos d eprestaso activos
    this.abonoProvider.resetearACLTE();
    this.abonoProvider.cargarAbonosPClte().then(
      (data)=>{
        refresher.complete();
        console.log('Reresco terminado ', refresher);
      }
    );
  }

  doPulling(refresher: Refresher) {
    console.log('DOPULLING!!! :)', refresher.progress);
  }

  verificarpenultimoAbonoEliminado(){//En teoria este metodo solo es aplicado para abonos con status 0
    let tam = this.abonoProvider.tempAbonosClte.length;
    if(tam == 1){//Si solo hay un registro
      return true;
    }else{
      if(this.abonoProvider.tempAbonosClte[tam - 2].status == 0){//Si el penultimo elemento del aray temp tambien esta eliminado devuelve un false
        console.log("tempAbonosClte", this.abonoProvider.tempAbonosClte[tam - 2].status);
        return false;
      }
      return true;
    }
  }

  anularPago(idAbono){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea anular el pago ?',
      message: "¡ Si lo anula el pago podra verlo si marca la casilla 'anulado' !",
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Anular',
          handler: () => {
            this.abonoProvider.anularAbono(idAbono, this.userProvider.id_usuario, this.userProvider.token, false);
          }
        }
      ]
    });
    confirm.present();
  }

  restaurarPago(idAbono){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea restaurar el pago ?',
      message: "¡ Si restaura el pago, esta se anexara al historial de pagos y por consiguiente afectara a la suma total generada!",
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
            this.abonoProvider.restaurarAbono(idAbono, this.userProvider.id_usuario, this.userProvider.token, false);
          }
        }
      ]
    });
    confirm.present();
  }

  eliminarPermanentementePago(idAbono){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea eliminar permanentemente el pago ?',
      message: "¡ Si esta seguro proceda con la eliminación, esto hara que el registro del pago desaparezca de la Base de Datos!",
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
            this.abonoProvider.eliminarPermanentemente(idAbono, this.userProvider.id_usuario, this.userProvider.token, false);
          }
        }
      ]
    });
    confirm.present();
  }

  public verificarnumAbonoActivo(){
    let bnd = false;
    for(let ab of this.abonoProvider.abonosClte){
      if(ab.status == 1){
        bnd = true;
        break;
      }
    }
    return bnd;
  }

}
