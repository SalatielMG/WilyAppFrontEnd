import {Component, ViewChild, Renderer2} from '@angular/core';
import { BienProvider, InteresProvider, UsuarioProvider, PrestamoProvider } from '../../providers/index.services';

@Component({
  selector: 'acordeonClte',
  templateUrl: 'acordeonClte.html'
})
export class AcordeonClteComponent {

  @ViewChild("contenidoClte") contenidoClte:any;

  //Other Variables
  private bnd:boolean = true;
  private esCliente:boolean = false;

  constructor(public renderer: Renderer2,  public bienProvider: BienProvider, public  interesProvider:InteresProvider, public  prestamoProvider:PrestamoProvider, public usProvider:UsuarioProvider) {

  }

  ngOnInit(){
    this.renderer.setStyle(this.contenidoClte.nativeElement,"webkitTransition","max-height 500ms, padding 500ms");
    this.verificarPosCardContent();
    console.log("Probando ngOnInit()", this.contenidoClte.nativeElement);
  }

  verificarPosCardContent(){
    if(this.prestamoProvider.prestamoClte == 1){
      if(this.prestamoProvider.expandedPAClte)
        this.expandir(this.prestamoProvider.heigthPAClte, this.prestamoProvider.padPAClte);
    }else{
      if(this.prestamoProvider.expandedPCClte)
        this.expandir(this.prestamoProvider.heigthPCClte, this.prestamoProvider.padPCClte);
    }
  }

  minimizar(){
    this.renderer.setStyle(this.contenidoClte.nativeElement,"max-height","0px");
    this.renderer.setStyle(this.contenidoClte.nativeElement,"padding","0px 0px");
  }
Clte
  expandir(H, P){
    this.renderer.setStyle(this.contenidoClte.nativeElement,"max-height",H+"px");
    this.renderer.setStyle(this.contenidoClte.nativeElement,"padding",P+"px"+" 0px");
  }

  holi(expand = this.prestamoProvider.expandedPAClte, heigthAlt = this.prestamoProvider.heigthPAClte, padding = this.prestamoProvider.padPAClte){  //Para PA no se envia nigun parametro
    if(expand){//Esta expandido y lo minimiza
      this.minimizar();
    }else{//Esta minimmizada y lo expande
      this.expandir(heigthAlt, padding);
    }
    if(this.prestamoProvider.prestamoClte == 1){//PA
      this.prestamoProvider.expandedPAClte = !this.prestamoProvider.expandedPAClte;
      this.prestamoProvider.iconPAClte = this.prestamoProvider.iconPAClte == "arrow-forward" ? "arrow-down" : "arrow-forward";
    }else{//PC
      this.prestamoProvider.expandedPCClte = !this.prestamoProvider.expandedPCClte;
      this.prestamoProvider.iconPCClte = this.prestamoProvider.iconPCClte == "arrow-forward" ? "arrow-down" : "arrow-forward";
    }
  }

  habilitar(){
    if(this.prestamoProvider.prestamoClte == 1)
      return this.prestamoProvider.filterPAClte.length != 0;
    else
      return this.prestamoProvider.filterPCClte.length != 0;
  }

  filtro(){
    if(this.prestamoProvider.prestamoClte == 1){//Activo
      if(this.prestamoProvider.filterPAClte.length > 0){
        this.prestamoProvider.expandedPAClte = true;
        this.prestamoProvider.iconPAClte = "arrow-down";
        this.prestamoProvider.heigthPAClte = (this.prestamoProvider.filterPAClte.length + 1) * 100;
        this.prestamoProvider.padPAClte = (this.prestamoProvider.filterPAClte.length + 1) * 5;
        if(this.verificarDato("1")){
          this.prestamoProvider.heigthPAClte = this.prestamoProvider.heigthPAClte + 100;
          this.prestamoProvider.padPAClte = this.prestamoProvider.padPAClte + 5;
        }
        this.expandir(this.prestamoProvider.heigthPAClte, this.prestamoProvider.padPAClte);
      }else{
        this.prestamoProvider.resetHeigthCardContentPA(this.esCliente);
        this.minimizar();
      }
      console.log("heigthPAClte", this.prestamoProvider.heigthPAClte);
      console.log("padPAClte", this.prestamoProvider.padPAClte);
      console.log("expandedPAClte", this.prestamoProvider.expandedPAClte);
      console.log("iconPAClte", this.prestamoProvider.iconPAClte);
      console.log("FilterPAClte", this.prestamoProvider.filterPAClte);
      console.log("(Activo OKBtn) this.filtro()", this.contenidoClte.nativeElement);
    }else{//Cerrado
      if(this.prestamoProvider.filterPCClte.length > 0){
        this.prestamoProvider.expandedPCClte = true;
        this.prestamoProvider.iconPCClte = "arrow-down";

        this.prestamoProvider.heigthPCClte = (this.prestamoProvider.filterPCClte.length + 1) * 100;
        this.prestamoProvider.padPCClte = (this.prestamoProvider.filterPCClte.length + 1) * 5;
        if(this.verificarDato("1")){
          this.prestamoProvider.heigthPCClte = this.prestamoProvider.heigthPCClte + 100;
          this.prestamoProvider.padPCClte = this.prestamoProvider.padPCClte + 5;
        }
        this.expandir(this.prestamoProvider.heigthPCClte, this.prestamoProvider.padPCClte);
      }else{//Esta vacio, Se minimizara
        this.prestamoProvider.resetHeigthCardContentPC(this.esCliente);
        this.minimizar();
      }
      console.log("heigthPCClte", this.prestamoProvider.heigthPCClte);
      console.log("padPCClte", this.prestamoProvider.padPCClte);
      console.log("expandedPCClte", this.prestamoProvider.expandedPCClte);
      console.log("iconPCClte", this.prestamoProvider.iconPCClte);
      console.log("FilterPCClte", this.prestamoProvider.filterPCClte);
      console.log("(Cerrado OKBtn) this.filtro()", this.contenidoClte.nativeElement);
    }
  }

  buscar(){
    let arrayDataSearchTemp = [];
    let arrayDataCamposTemp = (this.prestamoProvider.prestamoClte == 1) ? this.prestamoProvider.camposFomularioPAClte : this.prestamoProvider.camposFomularioPCClte;
    for(let i = 1; i < arrayDataCamposTemp.length; i ++){
      if(this.verificarDato(""+i)){
        switch (i) {
          case 1:
            arrayDataSearchTemp.push(arrayDataCamposTemp[0]);
            arrayDataSearchTemp.push(arrayDataCamposTemp[1]);
            break;
          /*case 2:
            arrayDataSearchTemp.push(arrayDataCamposTemp[2]);
            break;*/
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
    console.log("prestamo(Activo[1] ó Cerrado[2]) := "+this.prestamoProvider.prestamoClte);
    if(this.prestamoProvider.prestamoClte == 1){//Prestamos activos
      this.prestamoProvider.dataBusquedaPAClte = arrayDataSearchTemp;
      this.prestamoProvider.filtrosPAClte = this.prestamoProvider.filterPAClte;
      this.prestamoProvider.bucarPrestamosActivos(this.esCliente);
      console.log("dataBusquedaPAClte:= ", this.prestamoProvider.dataBusquedaPAClte);
      console.log("filtrosPAClte:=", this.prestamoProvider.filterPAClte);
      console.log("paginaPAClte:= "+this.prestamoProvider.paginaPAClte);
    }else{//Prestamos Cerrados
      this.prestamoProvider.dataBusquedaPCClte = arrayDataSearchTemp;
      this.prestamoProvider.filtrosPCClte = this.prestamoProvider.filterPCClte;
      this.prestamoProvider.bucarPrestamosCerrados(this.esCliente);
      console.log("dataBusquedaPCClte:= ", this.prestamoProvider.dataBusquedaPCClte);
      console.log("filtrosPCClte:=", this.prestamoProvider.filterPCClte);
      console.log("paginaPCClte:= "+this.prestamoProvider.paginaPCClte);
    }
  }

  validar(){
    this.bnd = true;
    let arrayDataCamposTemp = (this.prestamoProvider.prestamoClte == 1) ? this.prestamoProvider.camposFomularioPAClte : this.prestamoProvider.camposFomularioPCClte;
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
          /*case 2:
            if(arrayDataCamposTemp[2].length==0){
              this.bnd = false;
            }
            break;*/
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
    if(this.prestamoProvider.prestamoClte == 1){//Activos
      if (this.prestamoProvider.filterPAClte.indexOf(dato) != -1)
        return true;
      return false;
    }else{//Cerrados
      if (this.prestamoProvider.filterPCClte.indexOf(dato) != -1)
        return true;
      return false;
    }
  }

}
