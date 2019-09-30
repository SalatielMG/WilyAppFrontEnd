import { Component, Input, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'encabezado-deslizante',
  templateUrl: 'encabezado-deslizante.html'
})
export class EncabezadoDeslizante {

  @Input('scrollArea') scrollArea: any;
   headerHeight: any;
  bnd:boolean=true;
  otherHeeigth=320;
  newHeaderHeight: any;
  constructor(public element: ElementRef, public renderer: Renderer2) {
    this.headerHeight=320;
    //this.renderer.setStyle(this.element.nativeElement,'height',this.headerHeight+'px');
  }

  ngOnInit(){
    this.renderer.setStyle(this.element.nativeElement, 'height', '0px');
    this.scrollArea.ionScroll.subscribe((ev) => {
      this.resizeHeader(ev);
    });
  }

  resizeHeader(ev){

    ev.domWrite(() => {
      //console.log("(newHeaderHeight)::["+this.newHeaderHeight+"] = (headerHeight): "+this.headerHeight+" - (ev.scrollTop): "+(ev.scrollTop+this.headerHeight));
      if(this.bnd){
        this.newHeaderHeight = this.headerHeight - (ev.scrollTop+this.headerHeight);
        console.log("(newHeaderHeight)::["+this.newHeaderHeight+"] = (headerHeight): "+this.headerHeight+" - (ev.scrollTop): "+(ev.scrollTop+this.headerHeight));
      }else{

        this.newHeaderHeight = this.headerHeight - (this.otherHeeigth);
        console.log("(newHeaderHeight)::["+this.newHeaderHeight+"] = (headerHeight): "+this.headerHeight+" - (this.otherHeeigth): "+(this.otherHeeigth));

      }

      if(this.newHeaderHeight == 0){
        this.newHeaderHeight = 320;
        this.bnd=false;
        this.otherHeeigth=this.otherHeeigth-1;
      }else   if(this.newHeaderHeight >= 0){
        this.bnd=false;
        this.otherHeeigth=this.otherHeeigth-1;
      }else if(this.newHeaderHeight == 320){
        this.newHeaderHeight = 320;
      }

      this.renderer.setStyle(this.element.nativeElement, 'height', this.newHeaderHeight + 'px');
      //this.renderer.setStyle(this.element.nativeElement, 'background-color', "transparent");
      for(let headerElement of this.element.nativeElement.children){
        let totalHeight = headerElement.offsetTop + headerElement.clientHeight - (this.headerHeight/1.8);
        if(totalHeight > this.newHeaderHeight){
          this.renderer.setStyle(headerElement,'opacity','0');
        }else{
          this.renderer.setStyle(headerElement,'opacity','1');
        }
      }
    });
  }
}
