import {Component, Renderer2, Input, OnDestroy, OnInit} from '@angular/core';
import { PrestamoProvider } from '../../providers/index.services';
import {Events} from "ionic-angular";

@Component({
  selector: 'cardprestamo',
  templateUrl: 'cardprestamo.html'
})

export class Cardprestamo implements OnInit, OnDestroy {
  @Input("contentCliente") contenidoCliente:any;
  @Input("contentPrestamo") contenidoPrestamo:any;

  constructor(public renderer: Renderer2, public prestamoProvider: PrestamoProvider, public events: Events ) {
    console.log("******************************Constructor CardPrestamo******************************");

  }

  private unsubscribeToEvents(){
    return this.events.unsubscribe('evt:btn');
  }

  ngOnInit(){
    this.Init();
    this.prestamoProvider.resetBtnCnt();
    this.minimizar(this.contenidoCliente);
    this.minimizar(this.contenidoPrestamo);
    this.imprimirContent(true);
    this.imprimirContent(false);
    this.events.subscribe('evt:btn', (bnd) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Suscrito', bnd);
      this.verficar(bnd);
      this.imprimirContent(bnd);
      console.log("Subscribe the events", this.events['_channels']['evt:btn']);
    });
    console.log("ngOnInit()", this.events);
  }

  private Init(){
    this.renderer.setStyle(this.contenidoCliente,"webkitTransition","max-height 500ms, padding 500ms");
    this.renderer.setStyle(this.contenidoPrestamo,"webkitTransition","max-height 500ms, padding 500ms");
    this.renderer.setStyle(this.contenidoCliente,"max-height","0px");
    this.renderer.setStyle(this.contenidoPrestamo,"max-height","0px");
  }

  ngAfterContentInit(){
    this.verficar(true);
    this.verficar();
    console.log("ngAfterContentInit()", this.events);
  }

  imprimirContent(bnd){
    if(bnd)
    console.log("Probando contenidoCliente", this.contenidoCliente);
    else
    console.log("Probando contenidoPrestamo", this.contenidoPrestamo);
  }

  minimizar(content: any){
    this.renderer.setStyle(content,"max-height","0px");
    this.renderer.setStyle(content,"padding","0px 16px");
  }
  expandir(H, P, content: any){
    this.renderer.setStyle(content,"max-height",H+"px");
    this.renderer.setStyle(content,"padding",P+"px"+" 16px");
  }

  verficar(bnd:boolean = false){
    if(bnd){//contentCliente
      if(this.prestamoProvider.expandedCntCliente)
        this.minimizar(this.contenidoCliente);
      else
        this.expandir(212, 20, this.contenidoCliente);
      this.prestamoProvider.expandedCntCliente = !this.prestamoProvider.expandedCntCliente;
      this.prestamoProvider.iconCntCliente = this.prestamoProvider.iconCntCliente == "arrow-forward" ? "arrow-down" : "arrow-forward";
    }else{//contentPrestamo
      if(this.prestamoProvider.expandedCntPrestamo)
        this.minimizar(this.contenidoPrestamo);
      else
        this.expandir(800, 20, this.contenidoPrestamo);//500
      this.prestamoProvider.expandedCntPrestamo = !this.prestamoProvider.expandedCntPrestamo;
      this.prestamoProvider.iconCntPrestamo = this.prestamoProvider.iconCntPrestamo == "arrow-forward" ? "arrow-down" : "arrow-forward";
    }
  }

  ngOnDestroy(): void {
    if(this.unsubscribeToEvents()){
      console.log(":)");
    }else{
      console.log(":(");
    }
    console.log("ngOnDestroy()", this.events);
  }

}
