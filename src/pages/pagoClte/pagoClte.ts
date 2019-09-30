import {Component, ElementRef, ViewChildren, Renderer2} from '@angular/core';
import {AlertController, Events, IonicPage, NavController, NavParams, Refresher} from 'ionic-angular';
import {PrestamoProvider, PagoProvider, UsuarioProvider } from "../../providers/index.services";
import {PagoAbonoPage} from '../../pages/index.paginas';
import { DatePipe, CurrencyPipe } from '@angular/common';
/**
 * Generated class for the PagoCltePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pago-clte',
  templateUrl: 'pagoClte.html',
})
export class PagoCltePage {

  fechaActual = "";
  titulo: string;
  prestamo: any = {};
  pagoAbonoPage = PagoAbonoPage;
  @ViewChildren("cntPago") cntPagoContent = ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams, public prestamoProvider: PrestamoProvider, public pagoProvider: PagoProvider, public events: Events, public alertCtrl: AlertController, public userProvider: UsuarioProvider, public datePipe: DatePipe, public currencyPipe: CurrencyPipe, public renderer: Renderer2) {
    this.prestamo = this.navParams.get("prestamo");
    this.titulo = (this.prestamoProvider.prestamoClte == 1) ? "Activo": "Cerrado";
    this.pagoProvider.esActivoClte = this.prestamoProvider.prestamoClte;
    this.pagoProvider.idPrestamoClte = this.prestamo["id"];
    this.pagoProvider.util.respaldoidPrestamoClte = this.pagoProvider.idPrestamoClte;
    this.pagoProvider.cargarTodoPago(false);
    this.fechaActual = this.pagoProvider.util.obtFechaActual();
  }
  eventoBtn(bnd:boolean = false){
    console.log('Evento publicado !', bnd);
    this.events.publish('evt:btnClte', bnd);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PagoCltePage');
  }
  ionViewDidEnter() {
    console.log('ionViewDidEnter PagoPage');
    console.log("Probando", this.cntPagoContent["_results"]);
    //this.alistarItemsPago();
    this.mmProbando();
    this.events.subscribe('altaAbono:btn', (index) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Suscrito a := altaAbono:btn', index);
      //this.activarEsDespliegue(index);
      console.log("this.events()", this.events);
      //console.log("Subscribe the events", this.events['_channels']['evt:btnClte']);
    });
    console.log("this.events()", this.events);
  }
  private mmProbando(){
    for(let i = 0; i < this.pagoProvider.tempPagosClte.length; i++){
      if(this.pagoProvider.anuladosClte){
        if(this.pagoProvider.tempPagosClte[i].abierto == 0){//Hay que desplegar
          this.pagoProvider.pagosClte[i].abierto = 1;
          this.pagoProvider.tempPagosClte[i].abierto = 1;
        }else{
          this.pagoProvider.pagosClte[i].abierto = 0;
          this.pagoProvider.tempPagosClte[i].abierto = 0;
        }
        //this.desplegar(i, this.pagoProvider.tempPagosClte[i].id);
      }else{
        if(this.pagoProvider.tempPagosClte[i].abierto == 0){//Hay que desplegar
          this.pagoProvider.pagosClte[this.pagoProvider.tempPagosClte[i].posPago].abierto = 1;
          this.pagoProvider.tempPagosClte[i].abierto = 1;
        }else{
          this.pagoProvider.pagosClte[this.pagoProvider.tempPagosClte[i].posPago].abierto = 0;
          this.pagoProvider.tempPagosClte[i].abierto = 0;
        }
        //this.desplegar(i, this.pagoProvider.tempPagosClte[i].id);
      }
      this.desplegar(i, this.pagoProvider.tempPagosClte[i].id);
    }
  }
  public calcularUltimoMA(){
    let tam = this.pagoProvider.tempPagosClte.length;
    if(tam < 0) return {};
    let pago = {mes: 0};
    for (let i = 0; i < tam; i++){
      if(this.pagoProvider.tempPagosClte[i].status == 1){
        pago = this.pagoProvider.tempPagosClte[i];
      }
    }
    return pago;
  }
  abrirNuevoMes(){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea abrir un nuevo Mes ?',
      message: " Esto significa que no tiene nigun mes abierto entonces Proceda. De lo contrario cierre el mes abierto y ahora si podra abir el nuevo mes.",

      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Abrir',
          handler: () => {
            this.pagoProvider.abrirMes(this.userProvider.id_usuario, this.userProvider.token, false).then(() => {
              setTimeout(() => {
                //this.activarEsDespliegue(this.pagoProvider.tempPagosGral.length - 1);
              });
            });
          }
        }
      ]
    });
    confirm.present();
  }

  public activarEsDespliegue(index: number){
    if(this.cntPagoContent != null){
      console.log("this.cntPagoContent != null::this.pagoProvider.tempPagosClte[" + index + "].abierto",  this.pagoProvider.tempPagosClte[index].abierto);

      if(this.pagoProvider.isCorrectPago){
        console.log("this.pagoProvider.isCorrectPago::this.pagoProvider.tempPagosClte[" + index + "].abierto",  this.pagoProvider.tempPagosClte[index].abierto);
        //this.mmProbando();
        if(this.pagoProvider.anuladosClte){
          if(this.pagoProvider.tempPagosClte[index].abierto == 0){//Hay que desplegar
            this.pagoProvider.tempPagosClte[index].abierto = 1;
            this.pagoProvider.pagosClte[index].abierto = 1;
          }else{
            this.pagoProvider.tempPagosClte[index].abierto = 0;
            this.pagoProvider.pagosClte[index].abierto = 0;
          }
        }else{
          if(this.pagoProvider.tempPagosClte[index].abierto == 0){//Hay que desplegar
            this.pagoProvider.tempPagosClte[index].abierto = 1;
            this.pagoProvider.pagosClte[this.pagoProvider.tempPagosClte[index].posPago].abierto = 1;

          }else{
            this.pagoProvider.tempPagosClte[index].abierto = 0;
            this.pagoProvider.pagosClte[this.pagoProvider.tempPagosClte[index].posPago].abierto = 0;

          }
        }
        console.log("this.cntPagoContent[_results][" + index + "]", this.cntPagoContent["_results"][index]);
        this.desplegar(index, this.pagoProvider.tempPagosClte[index].id);
      }
    }
  }

  public cerrarMes(pago: any, index){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea Cerrar el '+ pago.mes + '° Mes ?',
      message: " Esto significa que el cliente ha cubierto el Interes Acumulado hasta este mes ó ha llegado a un acuerdo. Si esta seguro Proceda.",
      inputs:[
        {
          name: 'fechaCierre',
          type: 'date',
          value: pago.fechaFinal,
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Cerrar',
          handler: () => {
            //confirm.getTransitionName("fechaCierre");
            //console.log("Confirm jeje", confirm.data.inputs[0]["value"]);
            //console.log("confirm.getTransitionName(\"fechaCierre\")", confirm.getTransitionName("fechaCierre"));
            this.pagoProvider.cerrarMes(this.userProvider.id_usuario, this.userProvider.token, pago.id, confirm.data.inputs[0]["value"], index, false);
          }
        }
      ]
    });
    confirm.present();
  }

  public anularMes(pago: any, index){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea Anular el '+ pago.mes + '° Mes ?',
      message: " Esto hara que todos los abonos que se hicieron durante este mes, se cancelen y el mes se anule. ¡ Si esta seguro Proceda !",

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Anular',
          handler: () => {
            this.pagoProvider.anularMes(this.userProvider.id_usuario, this.userProvider.token, pago.id, index, false).then(() => {
              setTimeout(() => {
                this.activarEsDespliegue(index);
              });
            });
          }
        }
      ]
    });
    confirm.present();
  }
  public volverAbrirMes(pago: any, index){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea volver Abrir el '+ pago.mes + '° Mes ?',
      message: " Esto hara que el mes elegido se vuelva abrir y sean restaurados todos sus abonos correspondientes. ¡ Si esta seguro Proceda !",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Abrir otra vez',
          handler: () => {
            this.pagoProvider.volverAbrirMes(this.userProvider.id_usuario, this.userProvider.token, pago.id, index, false);
          }
        }
      ]
    });
    confirm.present();
  }
  public eliminarPagoPermanentemente(pago: any, index){
    console.log("Index seleccionado", index);
    console.log("this.pagosClte[" + index + "]", this.pagoProvider.pagosClte[index]);
    console.log("this.tempPagosClte[" + index + "]", this.pagoProvider.tempPagosClte[index]);
    const confirm = this.alertCtrl.create({
      title: '¿ Desea eliminar Permanentemente el '+ pago.mes + '° Mes ?',
      message: " Esto hara que el mes desaparezca de la Base de Datos asi también todos sus abonos correspondientes. ¡ Si esta seguro Proceda !",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.pagoProvider.eliminarPermanentementeMes(this.userProvider.id_usuario, this.userProvider.token, pago.id, index, false);
          }
        }
      ]
    });
    confirm.present();
  }

  public restaurarMes(pago: any, index){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea Restaurar '+ pago.mes + '° Mes ?',
      message: " Esto hara que el mes vuelva hacer Activa y retomara su ultimo estado asi también con todos sus abonos correspondientes. ¡ Si esta seguro Proceda !",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Restaurar',
          handler: () => {
            this.pagoProvider.restaurarMes(this.userProvider.id_usuario, this.userProvider.token, pago.id, index, false);
          }
        }
      ]
    });
    confirm.present();
  }

  desplegar(i: any, idPago: any){
    if(this.pagoProvider.tempPagosClte[i].abierto == 0){//Hay que desplegar
      this.pagoProvider.tempPagosClte[i].abierto = 1;
      if(this.pagoProvider.anuladosClte){
        this.pagoProvider.pagosClte[i].abierto = 1;
      }else{
        this.pagoProvider.pagosClte[this.pagoProvider.tempPagosClte[i].posPago].abierto = 1;
      }

      /*Procedimiento
      * 1.- Hay que buscar los abnos de aucerdo al id del pago
      * 2.- Despues hay que contar cuantos abono tiene
      * 3.- si tiene mas de 1 desplegar
      * 4.- sino: no desplegar.
      * 5.-
      * */
      console.log("abonoPagoClte[idPago]", this.pagoProvider.abonosPagoClte[idPago]);
      let numabono = this.pagoProvider.abonosPagoClte[idPago].length;
      if( numabono > 0){
        this.expandir(150 * numabono, 25, this.cntPagoContent["_results"][i].nativeElement);
      }
      console.log("Expandir");
      console.log("idPago Recibido:=", idPago);
      console.log("idPago", this.cntPagoContent["_results"][i].nativeElement["id"]);
      console.log("mmm HOli", this.cntPagoContent["_results"][i].nativeElement);

    } else{//Hay que ocultar
      this.pagoProvider.tempPagosClte[i].abierto = 0;
      if(this.pagoProvider.anuladosClte){
        this.pagoProvider.pagosClte[i].abierto = 0;
      }else{
        this.pagoProvider.pagosClte[this.pagoProvider.tempPagosClte[i].posPago].abierto = 0;
      }
      this.minimizar(this.cntPagoContent["_results"][i].nativeElement);
      console.log("Minimizar");
      console.log("idPago Recibido:=", idPago);
      console.log("idPago", this.cntPagoContent["_results"][i].nativeElement["id"]);
      console.log("mmm HOli", this.cntPagoContent["_results"][i].nativeElement);
    }


  }
  minimizar(content: any){
    this.renderer.setStyle(content,"webkitTransition","max-height 500ms, padding 500ms");
    this.renderer.setStyle(content,"max-height","0px");
    this.renderer.setStyle(content,"padding","0px 16px");
  }
  expandir(H, P, content: any){
    this.renderer.setStyle(content,"webkitTransition","max-height 500ms, padding 500ms");
    this.renderer.setStyle(content,"max-height",H+"px");
    this.renderer.setStyle(content,"padding",P+"px"+" 16px");
  }

  updateTempAbono(){
    this.pagoProvider.actualizarTempPagoClte().then(() => {
      setTimeout(() => {
        if(this.cntPagoContent != null)
          this.mmProbando();
      });
    });
  }
  public compMesCerrado(index){
    for(let i = (index +1); i < this.pagoProvider.tempPagosClte.length; i++){
      if(this.pagoProvider.tempPagosClte[i].status == 1 && (this.pagoProvider.tempPagosClte[i].esAbierto == 1 || this.pagoProvider.tempPagosClte[i].esAbierto == 0)){
        return false;
      }
    }
    return true;
  }
  public eliminarPermanentemente(pago: any, abono: any, indexAbono){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea eliminar permanentemente el abono del '+ pago.mes + '° Mes ?',
      message: " Esto hara que el abono se elimine por completo de la Base de Datos y no podra restaurarlo en un futuro. ¡ Si esta seguro Proceda !",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.pagoProvider.eliminarPmnteAbono(this.userProvider.id_usuario, this.userProvider.token, pago.id, abono.id, indexAbono, false);
          }
        }
      ]
    });
    confirm.present();
  }
  public cancelarAbono(pago: any, abono: any, indexPago){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea anular el ' + abono.pos+ '° abono del '+ pago.mes + '° Mes ?',
      message: " Esto hara que el abono se anule. ¡ Si esta seguro Proceda !",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Anular',
          handler: () => {
            this.pagoProvider.cancelarAbono(this.userProvider.id_usuario, this.userProvider.token, pago.id, abono.id, indexPago, false);
          }
        }
      ]
    });
    confirm.present();
  }
  public RehacerAbono(pago: any, abono: any, indexPago){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea Restaurar el ' + abono.pos+ '° abono del '+ pago.mes + '° Mes ?',
      message: " Esto hara que el abono se restaure. ¡ Si esta seguro Proceda !",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Rehacer',
          handler: () => {
            this.pagoProvider.rehacerAbono(this.userProvider.id_usuario, this.userProvider.token, pago.id, abono.id, indexPago, false);
          }
        }
      ]
    });
    confirm.present();
  }
  /*public compPagoActivo(indexPago){
    for(let i = (index +1); i < this.pagoProvider.tempPagosGral.length; i++){
      if(this.pagoProvider.tempPagosGral[i].status == 1 && (this.pagoProvider.tempPagosGral[i].esAbierto == 1 || this.pagoProvider.tempPagosGral[i].esAbierto == 0)){
        return false;
      }
    }
    return true;
  }*/

  public verAbono(abono: any, pago: any){
    console.log(abono);
    let esAbb = (pago.esAbierto == 0) ? "Cerrado": "Abierto";
    let alert = this.alertCtrl.create({
      title: pago.mes + '° Mes "' + esAbb + '"',
      subTitle: "<br><br><p class='nombreCliente'><strong>" + this.pagoProvider.util.textAbono(abono.pos) + "</strong></p><p class='descripcion'><strong>Fecha: </strong>" + this.datePipe.transform(abono.fecha, "dd MMMM yyyy") + "</p> <p class='descripcion'><strong>Abono: </strong>" + this.currencyPipe.transform(abono.cantidad) + "</p> <p class='descripcion'><strong>Nota: " + abono.nota + "</strong></p>",
      buttons: ['Ok']
    });

    alert.present();
  }
  public cerrarPrestamoA(){
    const confirm = this.alertCtrl.create({
      title: '¿ Desea cerrar el prestamo ?',
      message: " Ingrese alguna nota o razon por la que cierra el prestamo",
      inputs: [
        {
          name: 'fechaCierre',
          type: 'date',
          value: this.pagoProvider.util.obtFechaActual(),
        },
        {
          name: 'nota',
          placeholder: 'Ej. LLegue a un acuerdo con el cliente'
        }
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
            console.log("Data jeje", confirm.data.inputs[0]["value"]);
            /*
            * Llamar a un metodo para cerrar el prestamo.
            *
            * despues de carrar hay que actualizar los array de prestamos activos y prestamos cerrados de Gral
            * */
            this.prestamoProvider.cerrarPrestamoActivo(this.pagoProvider.idPrestamoClte, confirm.data.inputs[0]["value"], confirm.data.inputs[1]["value"], this.userProvider.id_usuario, this.userProvider.token, false).subscribe(()=>{
              if(this.prestamoProvider.isNew) {this.navCtrl.pop();}
            });
          }
        }
      ]
    });
    confirm.present();
  }


  doRefresh(refresher: Refresher) {
    //console.log('DOREFRESH Prestamos Activos', refresher);
    //this.pagoProvider
    this.pagoProvider.resetearVariablesPagos(false);
    this.pagoProvider.cargarPagos(false).then(() => {
      refresher.complete();
      console.log('Reresco terminado ', refresher);

      setTimeout(() => {
        this.mmProbando();
      });
    });

  }

  doPulling(refresher: Refresher) {
    console.log('DOPULLING!!! :)', refresher.progress);
  }
}

