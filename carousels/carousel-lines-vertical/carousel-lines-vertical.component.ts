import {AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-carousel-lines-vertical',
  templateUrl: './carousel-lines-vertical.component.html',
  styleUrls: ['./carousel-lines-vertical.component.css']
})
export class CarouselLinesVerticalComponent implements OnInit, AfterViewInit {

  @Input('urls') urls: string[];
  @Input('interval') interval: number;
  @ViewChild('div') div: ElementRef;
  bigBackground: string;
  linesBackground: string;
  current: number;
  width: number;
  height: number;
  show: boolean[];
  focus: boolean;
  inter = 200;
  size: string;
  intervalFunc;
  constructor() { }

  ngOnInit() {
    this.bigBackground = this.urls[0];
    this.linesBackground = this.urls[0];
    this.current = 1;
    this.width = 0;
    this.height = 0;
    this.focus = true;
    this.show = [false, false, false, false, false, false, false, false, false, false];
    this.setInterval();
    window.addEventListener('focus', this.setInterval);
    window.addEventListener('blur', this.clearInterval);
    window.addEventListener('resize', this.ngAfterViewInit);
  }

  ngAfterViewInit() {
    this.width = this.div.nativeElement.offsetWidth;
    this.height = this.div.nativeElement.offsetHeight;
    setTimeout(() => {
      this.size = (this.width) + 'px ' + (this.height) + 'px';
    }, 150);
  }
  setInterval = () => {
    this.focus = true;
    this.intervalFunc = setInterval(this.loop, this.interval || 6000);
    console.log('focus');
  }
  clearInterval = () => {
    this.focus = false;
    clearInterval(this.intervalFunc);
    console.log('blur');
    this.hideLines();
  }

  loop = () => {
    this.linesBackground = this.urls[this.current];
    this.showLine(0);
    setTimeout(this.hideLines, this.inter * 10 + 500);
  }

  showLine = (i: number): void => {
    if (i < 10 && this.focus) {
      this.show[i] = true;
      setTimeout(() => {this.showLine(i + 1); }, this.inter);
    }
  }
  hideLines = (): void => {
    for (let i = 0; i < 10; i ++) {
      this.show[i] = false;
    }
    this.bigBackground = this.urls[this.current];
    this.current = (this.current + 1) % this.urls.length;
  }

}
