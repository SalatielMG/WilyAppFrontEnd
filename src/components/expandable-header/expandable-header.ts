import { Component, Input, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'expandable-header',
  templateUrl: 'expandable-header.html'
})
export class ExpandableHeader {
  @Input('scrollArea') scrollArea: any;
  @Input('headerHeight') headerHeight: number;

  newHeaderHeight: any;

  constructor(public element: ElementRef, public renderer: Renderer2) {

  }

  ngAfterViewInit(){

    this.renderer.setStyle(this.element.nativeElement, 'height', this.headerHeight + 'px');

    this.scrollArea.ionScroll.subscribe((ev) => {
      this.resizeHeader(ev);
    });

  }

  resizeHeader(ev){

    ev.domWrite(() => {

      this.newHeaderHeight = this.headerHeight - ev.scrollTop;

      if(this.newHeaderHeight < 0){
        this.newHeaderHeight = 0;
      }

      this.renderer.setStyle(this.element.nativeElement, 'height', this.newHeaderHeight + 'px');

    });

  }

}
