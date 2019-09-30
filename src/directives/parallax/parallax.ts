import { Directive, ElementRef, Renderer2 } from '@angular/core';


@Directive({
  selector: '[parallax]',
  host:{
    '(ionScroll)':'onCntscroll($event)',
  }
})
export class ParallaxDirective {

  header:any;
  main_cnt:any;
  ta:any

  constructor(public element:ElementRef, public renderer:Renderer2) {
    console.log('Hello ParallaxDirective Directive');
  }

  ngOnInit(){
    let cnt=this.element.nativeElement.getElementsByClassName('scroll-content')[0];
    this.header = cnt.getElementsByClassName('bg')[0];
    this.main_cnt = cnt.getElementsByClassName('main-cnt')[0];

    this.renderer.setStyle(this.header,'webTransformOrigin','center bottom');
    this.renderer.setStyle(this.header,'background-size','cover');
    this.renderer.setStyle(this.main_cnt,'position','absolute');

  }

  onCntscroll(evt){
    evt.domWrite(()=>{
      this.update(evt);
    });
    console.log(evt);
  }

  update(evt){
    if(evt.scrollTop>0){
      this.ta = evt.scrollTop/2;
    }
    this.renderer.setStyle(this.header,'webkitTransform','translate3d(0,'+this.ta+'px,0) scale(1,1)');
  }

}
