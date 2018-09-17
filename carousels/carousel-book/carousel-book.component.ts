import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-carousel-book',
  templateUrl: './carousel-book.component.html',
  styleUrls: ['./carousel-book.component.css']
})
export class CarouselBookComponent implements OnInit, AfterViewInit {

  @Input('urls') urls: string[];
  @Input('interval') interval: number;
  @ViewChild('container') container: ElementRef;
  div: HTMLDivElement;

  flip: boolean;

  width: number;
  height: number;
  current: number;
  listed: number;
  rotate: number;
  brightness: number;
  perspective: number;

  size: string;
  position: string;
  interFunc;

  constructor() { }

  ngOnInit() {
    // init the values
    this.flip = false;
    this.current = 0;
    this.listed = 0;
    this.rotate = 0;
    this.brightness = 100;
    this.perspective = 0;
    this.position = 'left';
    // start listing to book listed
    this.setInterval();
    window.addEventListener('focus', this.setInterval);
    window.addEventListener('blur', this.clearInterval);
    window.addEventListener('resize', () => {this.ngAfterViewInit(); });

  }

  setInterval = () => {
    this.interFunc = setInterval(this.listBook, this.interval || 5000);
  }
  clearInterval = () => {
    clearInterval(this.interFunc);
  }

  listBook = () => {
    // animate the rotationY
    let i = 0;
    this.brightness = 100;
    // this.perspective = 1700;
    const inter = setInterval(() => {
      i ++;
      this.brightness = 100 + (i > 18 ? i - 36 : -i);
      this.rotate = i * 5;
      if (this.rotate === 180) {

        // init the new image, return back the listed list
        this.brightness = 100;
        this.perspective = 0;
        this.current = this.listed;
        this.size = (this.width) + 'px ' + (this.height) + 'px';
        this.flip = false;
        this.position = 'left';
        this.rotate = 0;
        // clear the interval
        clearInterval(inter);

      } else if (this.rotate === 90) {

        // change the image of the listed picture
        this.listed = (this.listed + 1) % this.urls.length;
        this.size = (this.width) + 'px  ' + (this.height) + 'px';
        this.flip = true;
        this.position = 'right';
      }
    }, 18);
  }

  ngAfterViewInit() {
    // receive the params of the parent div
    this.width = this.container.nativeElement.offsetWidth;
    this.height = this.container.nativeElement.offsetHeight;
    setTimeout(() => {
      this.size = (this.width) + 'px ' + (this.height) + 'px';
    }, 150);
  }

}
