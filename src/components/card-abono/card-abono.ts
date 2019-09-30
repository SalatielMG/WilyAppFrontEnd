import {Component, Input, Renderer2} from '@angular/core';
import {Events} from "ionic-angular";
import {PrestamoProvider} from "../../providers/prestamo/prestamo";

@Component({
  selector: 'card-abono',
  templateUrl: 'card-abono.html'
})
export class CardAbonoComponent {
  @Input("contentPrestamoAbono") contenidoPrestamoAbono:any;

  expandedCntPrestamoAbono : boolean = false;

  constructor(public events: Events, public prestamoProvider: PrestamoProvider, public renderer: Renderer2) {

  }
  private unsubscribeToEvents(){
    return this.events.unsubscribe('evt:cardAbono',()=>{
      console.log("Desuscrito");
    });
  }
  ngOnInit(){
    this.renderer.setStyle(this.contenidoPrestamoAbono,"webkitTransition","max-height 500ms, padding 500ms");
    //this.renderer.setStyle(this.contenidoPrestamoAbono,"max-height","0px");
    this.prestamoProvider.iconCntPrestamoAbono = "arrow-forward";
    this.verficar();
    this.events.subscribe('evt:cardAbono', () => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Suscrito evt:cardAbono');
      this.verficar();
      this.imprimirContent();
      console.log("Subscribe the events", this.events['_channels']['evt:cardAbono']);
    });
    console.log("ngOnInit()", this.events);
  }
  imprimirContent(){
      console.log("Probando contenidoPrestamoAbono", this.contenidoPrestamoAbono);
  }

  minimizar(){
    this.renderer.setStyle(this.contenidoPrestamoAbono,"max-height","0px");
    this.renderer.setStyle(this.contenidoPrestamoAbono,"padding","0px 16px");
  }
  expandir(H, P){
    this.renderer.setStyle(this.contenidoPrestamoAbono,"max-height",H+"px");
    this.renderer.setStyle(this.contenidoPrestamoAbono,"padding",P+"px"+" 16px");
  }
  verficar(){
    if(this.expandedCntPrestamoAbono)
      this.minimizar();
    else
      this.expandir(500, 20);
    this.expandedCntPrestamoAbono = !this.expandedCntPrestamoAbono;
    this.prestamoProvider.iconCntPrestamoAbono = this.prestamoProvider.iconCntPrestamoAbono == "arrow-forward" ? "arrow-down" : "arrow-forward";

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
