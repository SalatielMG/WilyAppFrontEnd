import {Component, ElementRef, Renderer2, ViewChildren} from '@angular/core';
import {IonicPage, NavController, ModalController, AlertController, Refresher} from 'ionic-angular';
import { ClienteProvider,UsuarioProvider } from '../../providers/index.services';
import { ClientePage, AddClientePage , prestamosCltePage} from '../../pages/index.paginas';


@IonicPage()
@Component({
  selector: 'page-clientes',
  templateUrl: 'clientes.html',
})

export class ClientesPage {

  prestamosClte = prestamosCltePage;
  clientPage = ClientePage;
  addClientePage = AddClientePage;

  @ViewChildren("tarjeta") miCliente=ElementRef;
  @ViewChildren("palomita") seleccionar=ElementRef;

  constructor(private ctrlModal:ModalController ,private usProvider:UsuarioProvider ,public clienteProvider:ClienteProvider ,public navCtrl: NavController, private renderer: Renderer2, private alertCtrl:AlertController) {
    console.log("******************************Constructor Clientes******************************");

  }
  ionViewWillEnter() {
    console.log('******************************ionViewWillEnter ClientesPage******************************');
    if(this.clienteProvider.util.esCambioClte)
      this.clienteProvider.cargarTodosClientes();
  }


  abrirClienteModal(data:any={}){
    const modal = this.ctrlModal.create(this.addClientePage, data);
    modal.present();
  }
  agregarClienteModal () {
    var data = { opcion: 1 };
    const modal = this.ctrlModal.create(AddClientePage, data);
    modal.present();
  }
  imgS(x){
      if(x==1)
        return "H.png";
      return "M.png";
  }
  cltRlim(){
    let html:string ="<ion-list>";
    for (let c of this.clienteProvider.idClientes){
      html = html + "<ion-item><ion-thumbnail item-start></ion-thumbnail><ion-row no-padding><p class='nombreCliente'>"+c.nombreCliente+"</p></ion-row><ion-row no-padding><p class='descripcion'><strong>Domicilio: </strong>"+c.direccion+"</p><p class='descripcion'><strong>Telefono: </strong>"+c.telefono+"</p></ion-row></ion-item><br>";
    }
    html = html + "</ion-list>";
    return html;
  }
  eliminarCliente(){
    var i=this.clienteProvider.idClientes.length;
    var msj="el cliente seleccionado?";
    if(i!=1)
      msj="los "+i+" clientes seleccionados?";
    const confirm = this.alertCtrl.create({
      title: '¿ Desea eliminar '+msj,
      message: "¡ Pienselo ! "+this.cltRlim(),
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
            this.clienteProvider.util.crearLoading("Eliminando cliente(s), Sea Paciente Porfavor...");
            this.clienteProvider.eliminarClientes(this.usProvider.id_usuario,this.usProvider.token).subscribe(()=>{
              if(this.clienteProvider.isNew){
                console.log('Eliminado');
              }else{
                console.log("jajajaja Aun asi no pudistes elimnar a tus clientes");
              }
            });
          }
        }
      ]
    });
    confirm.present();
  }

  siguiente_pagina(infiniteScroll){
    this.clienteProvider.cargarClientes().then(
      ()=>{
        infiniteScroll.complete();
      }
    );
  }

  deleteSearch(){
    console.log("deleteSearch");
    this.clienteProvider.cargarTodosClientes();
  }

  buscarCliente(ev: any) {
    if(ev.target.value=='')
      return;
    this.clienteProvider.buscar = ev.target.value;
    this.clienteProvider.resetear();
    this.clienteProvider.cargarClientes();
  }

  seleccionarCliente(cliente, row:number, col:number) {
    let pos = row*2;
    if(col==1)
      pos = (row*col)+(row+col);
    console.log("row:="+row);console.log("col:="+col);console.log("pos:="+pos);
    console.log(this.miCliente["_results"][pos]);
    console.log(this.seleccionar["_results"][pos]);
    //Realiza Comparacion
    console.log(this.clienteProvider.idClientes.indexOf(cliente));
    var i = this.clienteProvider.idClientes.indexOf(cliente);
    if ( i !== -1 ) {
      this.clienteProvider.idClientes.splice( i, 1 );
      this.clienteProvider.index.splice(i,1);
      this.renderer.removeClass(this.miCliente["_results"][pos].nativeElement, "rodondoS");
      this.renderer.addClass(this.miCliente["_results"][pos].nativeElement, "rodondo");
      this.renderer.removeClass(this.seleccionar["_results"][pos].nativeElement,"seleccionar");
      this.renderer.addClass(this.seleccionar["_results"][pos].nativeElement,"ocultar");
      console.log("Encontrado y removido")
    }else{//Sino lo agrega y pinta
      this.clienteProvider.idClientes.push(cliente);
      this.clienteProvider.index.push({"row":row,"col":col,"pos":pos});
      this.renderer.removeClass(this.miCliente["_results"][pos].nativeElement, "rodondo");
      this.renderer.addClass(this.miCliente["_results"][pos].nativeElement, "rodondoS");
      this.renderer.removeClass(this.seleccionar["_results"][pos].nativeElement,"ocultar");
      this.renderer.addClass(this.seleccionar["_results"][pos].nativeElement,"seleccionar");
      console.log("NO Encontrado y agregado")
    }
    console.log(this.clienteProvider.idClientes);
    console.log(this.clienteProvider.index);
  }

  doRefresh(refresher: Refresher) {
    this.clienteProvider.buscar="";
    this.clienteProvider.resetear();
    this.clienteProvider.cargarClientes().then(() => {
      refresher.complete();
      console.log('Reresco terminado ', refresher);
    });
  }

  doPulling(refresher: Refresher) {
    console.log('DOPULLING!!! :)', refresher.progress);
  }

}
