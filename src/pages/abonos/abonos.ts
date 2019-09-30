import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PrestamoProvider, AbonoProvider, UsuarioProvider} from "../../providers/index.services";

@IonicPage()
@Component({
  selector: 'page-abonos',
  templateUrl: 'abonos.html',
})
export class AbonosPage {

  myForm: FormGroup;
  prestamo:any={};
  capActual:number;
  esActivoInteres:boolean = false;
  esActivoMora:boolean = false;
  nameInteres:string = "lock";
  nameMora:string = "lock";
  msjInteres: string = "";
  msjMora: string = "";
  fechaInput :string = "2000";
  Total:number;
  CapRestante:number;
  esGral: boolean = false;
  opcion:number = 1;
  titulo:string;
  abonoPrestamo:any={};

  /*Other Variables*/
  fechaTempProxPago: string = "";
  tamArregloAbonos: number = 0;


  constructor(public usProvider: UsuarioProvider, public prestamoProvider: PrestamoProvider, public abonoProvider: AbonoProvider, public viewCtrl:ViewController, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public events: Events) {

    console.log("--------------------Constructor AbonosPage---------------------- ");
    console.log("opcion", this.navParams.get("opcion"));
    this.opcion = this.navParams.get("opcion");
    this.prestamo = this.navParams.get("prest");
    this.esGral = this.navParams.get("esGral");
    if(this.esGral) this.tamArregloAbonos = abonoProvider.abonosGral.length; else this.tamArregloAbonos = abonoProvider.abonosClte.length;

    this.Op();

  }
  public Op(){
    switch (this.opcion) {
      case 1://Alta
        if(this.esGral) this.fechaTempProxPago = this.abonoProvider.fechaProximaGral; else this.fechaTempProxPago = this.abonoProvider.fechaProximaClte;
        this.titulo = "Nuevo Pago";
        console.log("this.prestamo", this.prestamo);
        console.log("this.capActual", this.capActual);
        let fechaActual = this.abonoProvider.util.obtFechaActual();
        this.myForm = this.createMyForm(fechaActual);
        this.calcularMnt(fechaActual);
        break;
      case 2://Cambio
        this.titulo = "Editar Pago";
        this.abonoPrestamo = this.navParams.get("abonoP");
        // private createMyForm(fechaP = "", interesP = "", abonoP = "0", moraP = "", notaP = "", totalPagarP = "", capRestP = ""){
        //
        this.myForm = this.createMyForm(
          this.abonoPrestamo.fechaAbono,
          this.abonoPrestamo.abonoInteres,
          this.abonoPrestamo.abonoCapital,
          this.abonoPrestamo.mora,
          this.abonoPrestamo.nota,
          this.abonoPrestamo.totalPagado,
          this.abonoPrestamo.capitalRestante);
        console.log("abonoPrestamo", this.abonoPrestamo);
        console.log("myForm.value", this.myForm.value);
        this.abonoProvider.recuperarDatoAbono(this.prestamo["id"], this.usProvider.id_usuario, this.usProvider.token).subscribe(data=>{
          console.log("Data REcuperado in Page Abono", data);
          this.fechaInput = data.fechaInput;
          this.capActual = data.CapAct;
          this.fechaTempProxPago = data.proximoPago;
          this.actualizarCampos({
            "totalPagar": this.abonoPrestamo.totalPagado,
            "capitalRestante": this.abonoPrestamo.capitalRestante
          });
          this.abonoProvider.util.detenerLoading();
        });
        break;
      case 3://Consulta
        break;
    }
  }

  calcularMnt(fechaAC){
    this.abonoProvider.calcularMontos(fechaAC, this.prestamo["id"], this.opcion).then(()=>{
      this.msjInteres = this.abonoProvider.montoCalculado["msjInteres"];
      this.msjMora = this.abonoProvider.montoCalculado["msjMora"];
      this.fechaInput = this.abonoProvider.montoCalculado["fechaInput"];
      this.capActual = this.abonoProvider.montoCalculado["CapAct"];
      console.log(this.abonoProvider.montoCalculado["montoInteres"]);
      console.log(this.abonoProvider.montoCalculado["montoMora"]);
      console.log(this.abonoProvider.montoCalculado["nota"]);
      console.log(this.abonoProvider.montoCalculado["montoInteres"]);
      this.actualizarCampos({
        "interes": this.abonoProvider.montoCalculado["montoInteres"],
        "mora": this.abonoProvider.montoCalculado["montoMora"],
        "nota": this.abonoProvider.montoCalculado["nota"]
      });
    });
  }
  prueba(evt){
    console.log(evt);
    this.calcularMnt(evt);
  }
  actualizarCampos(data){
    this.myForm.patchValue(data);
    this.valorTotal(parseInt(this.myForm.value["abono"]), parseInt(this.myForm.value["interes"]), parseInt(this.myForm.value["mora"]));
    this.valorCapRestante(parseInt(this.myForm.value["abono"]));
  }
  actualizarTotalPagar(event, indice){
    if(event == "" ) event = "0";
    switch (indice) {
      case 1://a.capital
        this.valorTotal(parseInt(this.myForm.value["interes"]), parseInt(this.myForm.value["mora"]), parseInt(event));
        //Actualizar el valor de Capital restante;
        this.valorCapRestante( parseInt(event));
        break;
      case 2://a.interes
        this.valorTotal(parseInt(this.myForm.value["abono"]), parseInt(this.myForm.value["mora"]), parseInt(event));
        break;
      case 3://mora
        this.valorTotal(parseInt(this.myForm.value["abono"]), parseInt(this.myForm.value["interes"]), parseInt(event));
        break;
    }
    console.log("Actualizar Total", event);
    console.log("this.myForm.value", this.myForm.value);
    console.log("Total", this.Total);
  }
  private valorTotal(a: number, b: number, c: number){
    this.Total = a + b + c;
  }
  private valorCapRestante(a: number){
    this.CapRestante = this.capActual - a;
  }

  switchInteres(evt){
    this.nameInteres = (!evt) ? this.prestamoProvider.util.nameLock: this.prestamoProvider.util.nameUnlock;
    console.log(evt);
  }

  switchMora(evt){
    this.nameMora = (!evt) ? this.prestamoProvider.util.nameLock: this.prestamoProvider.util.nameUnlock;
    console.log(evt);
  }
  eventoBtn(){
    this.events.publish('evt:cardAbono');
    console.log("Evento 'evt:cardAbono' publicado")
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }

  private createMyForm(fechaP = "", interesP = "", abonoP = "0", moraP = "", notaP = "", totalPagarP = "", capRestP = ""){
    return this.formBuilder.group({
      fecha: [fechaP, Validators.required],
      interes: [interesP, Validators.required],
      abono: [abonoP, Validators.required],
      mora: [moraP, Validators.required],
      nota: [notaP],
      totalPagar: [totalPagarP],
      capitalRestante: [capRestP],
    });
  }
  saveData(){
    console.log("Data Formulario", this.myForm.value);
    switch (this.opcion) {
      case 1://Alta
        this.alta();
        break;

      case 2://Cambio
        this.cambio();
        break;
      case 3://Consulta
        break;
    }

  }
  cambio(){
    this.abonoProvider.editarAbono(this.myForm.value, this.usProvider.id_usuario, this.usProvider.token, this.abonoPrestamo.idAbono, this.esGral).subscribe(()=>{
      if(this.abonoProvider.isCorrect) this.closeModal();
    });
  }
  alta(){
    this.abonoProvider.altaAbono(this.myForm.value, this.usProvider.id_usuario, this.usProvider.token, this.prestamo.id, this.esGral).subscribe(()=>{
      if(this.abonoProvider.isCorrect) this.closeModal();
    });
  }
  comprobar(evt){
    console.log(evt);
  }

}
