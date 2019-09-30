import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { DatePipe, CurrencyPipe } from '@angular/common';

import { ClientesPage,
BienesPage,
prestamosCltePage,
AbonosPage,
HomePage,
PapeleraPage,
prestamosGralPage,
TabsPage,
ClientePage,
AddClientePage,
PrestamoPage,
PrestamoAbonosGralPage,
PrestamoAbonosCltePage,
PagoPage,
PagoCltePage,
PagoAbonoPage,
AjustePagoPage} from '../pages/index.paginas';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {HttpModule} from '@angular/http';
import {IonicStorageModule} from '@ionic/storage';
import { UsuarioProvider } from '../providers/usuario/usuario';
import { ClienteProvider } from '../providers/cliente/cliente';
import {BienProvider} from "../providers/bien/bien";
import {InteresProvider} from "../providers/interes/interes";
import {PrestamoProvider} from "../providers/prestamo/prestamo";
import {AbonoProvider} from "../providers/abono/abono";

import {Utilerias} from "../util/utilerias";
import {MomentPipe} from "../pipes/moment/moment";

import { ParallaxDirective } from '../directives/parallax/parallax';
import {ExpandableHeader} from "../components/expandable-header/expandable-header";
import {EncabezadoDeslizante} from "../components/encabezado-deslizante/encabezado-deslizante";
import { AcordeonGralComponent} from "../components/acordeonGral/acordeonGral";
import { AcordeonClteComponent} from "../components/acordeonClte/acordeonClte";
import { Cardprestamo} from "../components/cardprestamo/cardprestamo";
import { CardprestamoClteComponent} from "../components/cardprestamoClte/cardprestamoClte";
import { CardAbonoComponent} from '../components/card-abono/card-abono';
import { TarjetapagoComponent} from '../components/tarjetapago/tarjetapago';


import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { PagoProvider } from '../providers/pago/pago';

registerLocaleData(localeEs);


@NgModule({
  declarations: [
    MyApp,
    ClientesPage,
    BienesPage,
    prestamosCltePage,
    AbonosPage,
    PapeleraPage,
    prestamosGralPage,
    HomePage,
    TabsPage,
    ClientePage,
    AddClientePage,
    PrestamoPage,
    PrestamoAbonosGralPage,
    PrestamoAbonosCltePage,
    PagoPage,
    PagoCltePage,
    PagoAbonoPage,
    AjustePagoPage,
    MomentPipe,
    ParallaxDirective,
    ExpandableHeader,
    EncabezadoDeslizante,
    AcordeonGralComponent,
    AcordeonClteComponent,
    Cardprestamo,
    CardprestamoClteComponent,
    CardAbonoComponent,
    TarjetapagoComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp,{
      activator: "highlight",
      actionSheetEnter:	"action-sheet-slide-in",
      actionSheetLeave:	"action-sheet-slide-out",
      alertEnter:	"alert-pop-in",
      alertLeave:	"alert-pop-out",
      backButtonText:	"Atras",
      backButtonIcon:	"ios-arrow-back",
      iconMode:	"ios",
      loadingEnter:	"loading-pop-in",
      loadingLeave:	"loading-pop-out",
      menuType:	"reveal",
      modalEnter:	"modal-slide-in",
      modalLeave:	"modal-slide-out",
      pageTransition:	"ios-transition",
      pageTransitionDelay:	16,
      pickerEnter:	"picker-slide-in",
      pickerLeave:	"picker-slide-out",
      popoverEnter:	"popover-pop-in",
      popoverLeave:	"popover-pop-out",
      spinner:	"ios",
      tabsHighlight:	false,
      tabsLayout:	"icon-top",
      tabsPlacement:	"bottom",
      tabsHideOnSubPages:	false,
      toastEnter:	"toast-slide-in",
      toastLeave:	"toast-slide-out",
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ],
      monthShortNames: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado' ],
      dayShortNames: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ClientesPage,
    BienesPage,
    prestamosCltePage,
    AbonosPage,
    PapeleraPage,
    prestamosGralPage,
    HomePage,
    TabsPage,
    ClientePage,
    AddClientePage,
    PrestamoPage,
    PrestamoAbonosGralPage,
    PrestamoAbonosCltePage,
    PagoPage,
    PagoCltePage,
    PagoAbonoPage,
    AjustePagoPage
  ],
  providers: [
    DatePipe,
    CurrencyPipe,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsuarioProvider,
    ClienteProvider,
    BienProvider,
    InteresProvider,
    PrestamoProvider,
    AbonoProvider,
    Utilerias,
    {provide: LOCALE_ID, useValue:"es-MX" },
    PagoProvider
  ]
})
export class AppModule {}
