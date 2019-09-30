import { NgModule } from '@angular/core';
import { ExpandableHeader} from './expandable-header/expandable-header';
import { EncabezadoDeslizante } from './encabezado-deslizante/encabezado-deslizante';
import { AcordeonGralComponent } from './acordeonGral/acordeonGral';
import { Cardprestamo } from './cardprestamo/cardprestamo';
import { CardAbonoComponent } from './card-abono/card-abono';
import { AcordeonClteComponent } from './acordeonClte/acordeonClte';
import { CardprestamoClteComponent } from './cardprestamoClte/cardprestamoClte';
import { TarjetapagoComponent } from './tarjetapago/tarjetapago';
@NgModule({
	declarations: [ExpandableHeader,
    EncabezadoDeslizante,
    AcordeonGralComponent,
    Cardprestamo,
    CardAbonoComponent,
    AcordeonClteComponent,
    CardprestamoClteComponent,
    TarjetapagoComponent],
	imports: [],
	exports: [ExpandableHeader,
    EncabezadoDeslizante,
    AcordeonGralComponent,
    Cardprestamo,
    CardAbonoComponent,
    AcordeonClteComponent,
    CardprestamoClteComponent,
    TarjetapagoComponent]
})
export class ComponentsModule {}
