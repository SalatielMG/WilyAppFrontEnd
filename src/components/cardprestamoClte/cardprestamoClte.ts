import {Component, Renderer2, Input, OnDestroy, OnInit} from '@angular/core';
import { PrestamoProvider } from '../../providers/index.services';
import {Events} from "ionic-angular";

@Component({
  selector: 'cardprestamoClte',
  templateUrl: 'cardprestamoClte.html'
})
export class CardprestamoClteComponent implements OnInit, OnDestroy {

  @Input("contentClienteClte") contenidoClienteClte:any;
  @Input("contentPrestamoClte") contenidoPrestamoClte:any;
  bnd:boolean = false;

  constructor(public renderer: Renderer2, public prestamoProvider: PrestamoProvider, public events: Events ) {
    console.log("******************************Constructor CardPrestamo******************************");

  }

  private unsubscribeToEvents(){
    return this.events.unsubscribe('evt:btnClte');
  }

  ngOnInit(){
    this.Init();
    this.prestamoProvider.resetBtnCnt(this.bnd);
    this.minimizar(this.contenidoClienteClte);
    this.minimizar(this.contenidoPrestamoClte);
    this.imprimirContent(true);
    this.imprimirContent(false);
    this.events.subscribe('evt:btnClte', (bnd) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Suscrito', bnd);
      this.verficar(bnd);
      this.imprimirContent(bnd);
      console.log("Subscribe the events", this.events['_channels']['evt:btnClte']);
    });
    console.log("ngOnInit()", this.events);
  }

  private Init(){
    this.renderer.setStyle(this.contenidoClienteClte,"webkitTransition","max-height 500ms, padding 500ms");
    this.renderer.setStyle(this.contenidoPrestamoClte,"webkitTransition","max-height 500ms, padding 500ms");
    this.renderer.setStyle(this.contenidoClienteClte,"max-height","0px");
    this.renderer.setStyle(this.contenidoPrestamoClte,"max-height","0px");
  }

  ngAfterContentInit(){
    this.verficar(true);
    this.verficar();
    console.log("ngAfterContentInit()", this.events);
  }

  imprimirContent(bnd){
    if(bnd)
      console.log("Probando contenidoCliente", this.contenidoClienteClte);
    else
      console.log("Probando contenidoPrestamo", this.contenidoPrestamoClte);
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
      if(this.prestamoProvider.expandedCntClienteClte)
        this.minimizar(this.contenidoClienteClte);
      else
        this.expandir(212, 20, this.contenidoClienteClte);
      this.prestamoProvider.expandedCntClienteClte = !this.prestamoProvider.expandedCntClienteClte;
      this.prestamoProvider.iconCntClienteClte = this.prestamoProvider.iconCntClienteClte == "arrow-forward" ? "arrow-down" : "arrow-forward";
    }else{//contentPrestamo
      if(this.prestamoProvider.expandedCntPrestamoClte)
        this.minimizar(this.contenidoPrestamoClte);
      else
        this.expandir(800, 20, this.contenidoPrestamoClte);
      this.prestamoProvider.expandedCntPrestamoClte = !this.prestamoProvider.expandedCntPrestamoClte;
      this.prestamoProvider.iconCntPrestamoClte = this.prestamoProvider.iconCntPrestamoClte == "arrow-forward" ? "arrow-down" : "arrow-forward";
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
