import {Component, ViewChild, Renderer2} from '@angular/core';
import { BienProvider, InteresProvider, UsuarioProvider, PrestamoProvider } from '../../providers/index.services';


@Component({
  selector: 'acordeonGral',
  templateUrl: 'acordeonGral.html'
})
export class AcordeonGralComponent {

  @ViewChild("contenido") contenido:any;

 //Other Variables
  private bnd:boolean = true;

  constructor(public renderer: Renderer2,  public bienProvider: BienProvider, public  interesProvider:InteresProvider, public  prestamoProvider:PrestamoProvider, public usProvider:UsuarioProvider) {
    //this.myForm = this.createMyForm();
  }

  ngOnInit(){
    this.renderer.setStyle(this.contenido.nativeElement,"webkitTransition","max-height 500ms, padding 500ms");
    this.verificarPosCardContent();
    console.log("Probando ngOnInit()", this.contenido.nativeElement);
  }

  verificarPosCardContent(){
    if(this.prestamoProvider.prestamo == 1){
      if(this.prestamoProvider.expandedPA)
        this.expandir(this.prestamoProvider.heigthPA, this.prestamoProvider.padPA);
    }else{
      if(this.prestamoProvider.expandedPC)
        this.expandir(this.prestamoProvider.heigthPC, this.prestamoProvider.padPC);
    }
  }

  minimizar(){
    this.renderer.setStyle(this.contenido.nativeElement,"max-height","0px");
    this.renderer.setStyle(this.contenido.nativeElement,"padding","0px 0px");
  }

  expandir(H, P){
    this.renderer.setStyle(this.contenido.nativeElement,"max-height",H+"px");
    this.renderer.setStyle(this.contenido.nativeElement,"padding",P+"px"+" 0px");
  }

  holi(expand = this.prestamoProvider.expandedPA, heigthAlt = this.prestamoProvider.heigthPA, padding = this.prestamoProvider.padPA){  //Para PA no se envia nigun parametro
    if(expand){//Esta expandido y lo minimiza
      this.minimizar();
    }else{//Esta minimmizada y lo expande
      this.expandir(heigthAlt, padding);
    }
    if(this.prestamoProvider.prestamo == 1){//PA
      this.prestamoProvider.expandedPA = !this.prestamoProvider.expandedPA;
      this.prestamoProvider.iconPA = this.prestamoProvider.iconPA == "arrow-forward" ? "arrow-down" : "arrow-forward";
    }else{//PC
      this.prestamoProvider.expandedPC = !this.prestamoProvider.expandedPC;
      this.prestamoProvider.iconPC = this.prestamoProvider.iconPC == "arrow-forward" ? "arrow-down" : "arrow-forward";
    }
  }

  habilitar(){
    if(this.prestamoProvider.prestamo == 1)
      return this.prestamoProvider.filterPA.length != 0;
    else
      return this.prestamoProvider.filterPC.length != 0;
  }

  filtro(){
    if(this.prestamoProvider.prestamo == 1){//Activo
      if(this.prestamoProvider.filterPA.length > 0){
        this.prestamoProvider.expandedPA = true;
        this.prestamoProvider.iconPA = "arrow-down";
        this.prestamoProvider.heigthPA = (this.prestamoProvider.filterPA.length + 1) * 100;
        this.prestamoProvider.padPA = (this.prestamoProvider.filterPA.length + 1) * 5;
        if(this.verificarDato("1")){
          this.prestamoProvider.heigthPA = this.prestamoProvider.heigthPA + 100;
          this.prestamoProvider.padPA = this.prestamoProvider.padPA + 5;
        }
        this.expandir(this.prestamoProvider.heigthPA, this.prestamoProvider.padPA);
      }else{
        this.prestamoProvider.resetHeigthCardContentPA();
        this.minimizar();
      }
      console.log("heigthPA", this.prestamoProvider.heigthPA);
      console.log("padPA", this.prestamoProvider.padPA);
      console.log("expandedPA", this.prestamoProvider.expandedPA);
      console.log("iconPA", this.prestamoProvider.iconPA);
      console.log("FilterPA", this.prestamoProvider.filterPA);
      console.log("(Activo OKBtn) this.filtro()", this.contenido.nativeElement);
    }else{//Cerrado
       if(this.prestamoProvider.filterPC.length > 0){
        this.prestamoProvider.expandedPC = true;
        this.prestamoProvider.iconPC = "arrow-down";

        this.prestamoProvider.heigthPC = (this.prestamoProvider.filterPC.length + 1) * 100;
        this.prestamoProvider.padPC = (this.prestamoProvider.filterPC.length + 1) * 5;
        if(this.verificarDato("1")){
          this.prestamoProvider.heigthPC = this.prestamoProvider.heigthPC + 100;
          this.prestamoProvider.padPC = this.prestamoProvider.padPC + 5;
        }
        this.expandir(this.prestamoProvider.heigthPC, this.prestamoProvider.padPC);
      }else{//Esta vacio, Se minimizara
         this.prestamoProvider.resetHeigthCardContentPC();
         this.minimizar();
      }
      console.log("heigthPC", this.prestamoProvider.heigthPC);
      console.log("padPC", this.prestamoProvider.padPC);
      console.log("expandedPC", this.prestamoProvider.expandedPC);
      console.log("iconPC", this.prestamoProvider.iconPC);
      console.log("FilterPC", this.prestamoProvider.filterPC);
      console.log("(Cerrado OKBtn) this.filtro()", this.contenido.nativeElement);
    }
  }

  buscar(){
    let arrayDataSearchTemp = [];
    let arrayDataCamposTemp = (this.prestamoProvider.prestamo == 1) ? this.prestamoProvider.camposFomularioPA : this.prestamoProvider.camposFomularioPC;
    for(let i = 1; i < arrayDataCamposTemp.length; i ++){
      if(this.verificarDato(""+i)){
        switch (i) {
          case 1:
            arrayDataSearchTemp.push(arrayDataCamposTemp[0]);
            arrayDataSearchTemp.push(arrayDataCamposTemp[1]);
            break;
          case 2:
            arrayDataSearchTemp.push(arrayDataCamposTemp[2]);
            break;
          case 3:
            arrayDataSearchTemp.push(arrayDataCamposTemp[3]);
            break;
          case 4:
            arrayDataSearchTemp.push(arrayDataCamposTemp[4]);
            break;
          case 5:
            arrayDataSearchTemp.push(arrayDataCamposTemp[5]);
            break;
        }
      }
    }
    console.log("esAll:= "+this.prestamoProvider.esAll);
    console.log("idC:= "+this.prestamoProvider.idC);
    console.log("prestamo(Activo[1] ó Cerrado[2]) := "+this.prestamoProvider.prestamo);
    if(this.prestamoProvider.prestamo == 1){//Prestamos activos
      this.prestamoProvider.dataBusquedaPA = arrayDataSearchTemp;
      this.prestamoProvider.filtrosPA = this.prestamoProvider.filterPA;
      this.prestamoProvider.bucarPrestamosActivos();
      console.log("dataBusquedaPA:= ", this.prestamoProvider.dataBusquedaPA);
      console.log("filtrosPA:=", this.prestamoProvider.filterPA);
      console.log("paginaPA:= "+this.prestamoProvider.paginaPA);
    }else{//Prestamos Cerrados
      this.prestamoProvider.dataBusquedaPC = arrayDataSearchTemp;
      this.prestamoProvider.filtrosPC = this.prestamoProvider.filterPC;
      this.prestamoProvider.bucarPrestamosCerrados();
      console.log("dataBusquedaPC:= ", this.prestamoProvider.dataBusquedaPC);
      console.log("filtrosPC:=", this.prestamoProvider.filterPC);
      console.log("paginaPC:= "+this.prestamoProvider.paginaPC);
    }
  }

  validar(){
    this.bnd = true;
    let arrayDataCamposTemp = (this.prestamoProvider.prestamo == 1) ? this.prestamoProvider.camposFomularioPA : this.prestamoProvider.camposFomularioPC;
    for(let i = 1; i < arrayDataCamposTemp.length; i ++){
      if(this.verificarDato(""+i)){
        switch (i) {
          case 1:
            if(arrayDataCamposTemp[0].length==0){
              this.bnd = false;
            }else if(arrayDataCamposTemp[1].length==0){
              this.bnd = false;
            }
            break;
          case 2:
            if(arrayDataCamposTemp[2].length==0){
              this.bnd = false;
            }
            break;
          case 3:
            if(arrayDataCamposTemp[3].length==0)
              this.bnd = false;
            break;
          case 4:
            if(arrayDataCamposTemp[4].length==0)
              this.bnd = false;
            break;
          case 5:
            if(arrayDataCamposTemp[5].length==0)
              this.bnd = false;
            break;
        }
      }
      if(!this.bnd)
        break;
    }
    return this.bnd;
  }

  verificarDato(dato){
    if(this.prestamoProvider.prestamo == 1){//Activos
      if (this.prestamoProvider.filterPA.indexOf(dato) != -1)
        return true;
      return false;
    }else{//Cerrados
      if (this.prestamoProvider.filterPC.indexOf(dato) != -1)
        return true;
      return false;
    }
  }

}
