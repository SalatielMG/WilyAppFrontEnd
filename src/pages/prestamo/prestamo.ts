import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BienProvider, InteresProvider, UsuarioProvider, PrestamoProvider } from '../../providers/index.services';

@IonicPage()
@Component({
  selector: 'page-prestamo',
  templateUrl: 'prestamo.html',
})
export class PrestamoPage {
  esGral: boolean;
  opcion:number=1;
  index:number;
  titulo:string="";
  cliente:any={};
  prestamo:any={};
  nomC:string;
  activoInput:boolean=false;
  myForm: FormGroup;
  btnSubmit:string="";
  fechaActual: string;
  fechaMinima: string = "2000" ;
  esGarantia: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController, public formBuilder: FormBuilder,
  private bienProvider: BienProvider, private  interesProvider:InteresProvider, private  prestamoProvider:PrestamoProvider, private usProvider:UsuarioProvider, public alertCtrl: AlertController) {
    this.bienProvider.cargarBienes();
    this.interesProvider.cargarIntereses();
    this.cliente=this.navParams.get('cliente');
    this.prestamo=this.navParams.get('prestamo');
    this.opcion=this.navParams.get('opcion');
    this.index=this.navParams.get('index');
    this.fechaActual = new Date().toISOString().substr(0,10);
    console.log('Contructor PrestamoPage');
    console.log("Hora Actual del sistema:= "+this.fechaActual);
    console.log(this.navParams.get('cliente'));
    console.log(this.navParams.get('opcion'));
    console.log(this.navParams.get('prestamo'));
    this.Opcion();

  }

  Opcion(){
    switch (this.opcion) {
      case 1://Alta
        this.titulo = "Nuevo";
        this.activoInput = false;
        this.nomC = this.cliente.nombreCliente;
        this.myForm = this.createMyForm();
        this.btnSubmit = "Enviar";
        break;
      case 2://Editar
        this.titulo = "Editar";
        this.esGral = this.navParams.get('esGral');
        this.activoInput = false;
        this.nomC = this.prestamo.nombreCliente;
        this.esGarantia = (this.prestamo.esGarantia == 1) ? true : false;
        this.myForm = this.createMyForm(this.prestamo["fecha"], false,this.prestamo["estado_bien"],this.prestamo["cantidad"], this.prestamo["bien"],this.prestamo["interes"], this.prestamo["observacion"]);
        this.btnSubmit = "Guardar";
        break;
      case 3://Cosultar
        this.titulo="Detalles";
        this.activoInput=true;
        this.nomC = this.prestamo.nombreCliente;
        this.myForm = this.createMyForm(this.prestamo["fecha"],this.prestamo["estado_bien"],this.prestamo["cantidad"], this.prestamo["bien"],this.prestamo["interes"], this.prestamo["observacion"]);
        this.btnSubmit="Regresar";
        break;
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PrestamoPage');

    console.log(this.navParams.get('message'));
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }
  saveData(){
    switch (this.opcion) {
      case 1://Alta
        //console.log(this.myForm.value);
        this.altas();
        break;
      case 2://Editar
        this.cambios();
        break;
      default://Cosultar
        this.closeModal();
        break;
    }
  }

  cambios(){
    this.prestamoProvider.editarPrestamo(this.myForm.value, this.esGarantia, this.usProvider.id_usuario, this.usProvider.token, this.prestamo["id"], this.index, this.esGral).subscribe(()=>{
      if(this.prestamoProvider.isNew){
        console.log("Holis Editado Prestamo ");
        this.closeModal();
      }else{
        console.log("jajajaja No se pudo editar tu Prestamo");
      }
    });
    console.log(this.myForm.value);
  }

  altas(){

    this.prestamoProvider.agregarPrestamo(this.myForm.value, this.esGarantia, this.usProvider.id_usuario,this.usProvider.token, this.cliente.id).subscribe(()=>{
      if(this.prestamoProvider.isNew){
        console.log("Holis nuevo Prestamo ");
        this.closeModal();
      }else{
        console.log("jajajaja No se pudo agregar tu PRestamo");
      }
    });
    console.log(this.myForm.value);
  }
  public Holi(holi){
    console.log("Holi", holi);
    this.esGarantia = holi;
  }
  private createMyForm(fecha=this.fechaActual, garan = false, estadoBien="",cantidad="", bien:any="", interes:any="", observacion:any=""){
    return this.formBuilder.group({
      fecha: [fecha, Validators.required],
      esGarantia: [garan, Validators.required],
      bien: [bien],
      estado_bien: [estadoBien, Validators.required],
      cantidad: [cantidad, Validators.required],
      interes: [interes, Validators.required],
      observacion: [observacion],
    });
  }

  public AgregarBien(){
    this.prestamoProvider.util.abrirModalBien();
  }

  public probandoEvent(evt){
    console.log(evt);
  }

}
