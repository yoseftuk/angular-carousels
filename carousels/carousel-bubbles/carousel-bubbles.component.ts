import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

interface Circle {
  x: number;
  y: number;
  r: number;
}
@Component({
  selector: 'app-carousel-bubbles',
  templateUrl: './carousel-bubbles.component.html',
  styleUrls: ['./carousel-bubbles.component.css']
})
export class CarouselBubblesComponent implements OnInit, AfterViewInit {

  @Input('urls') urls: string[];
  @Input('interval') interval: number;
  @ViewChild('canvasRef') canvasRef: ElementRef;
  @ViewChild('containerRef') containerRef: ElementRef;
  canvas: HTMLCanvasElement;
  container: HTMLDivElement;
  img;
  ctx;
  current: number;
  focus: boolean;
  circles: Circle[];
  interFunc;

  constructor() { }

  ngOnInit() {
    this.current = 0;
    this.setInterval();
    window.addEventListener('focus', () => { this.setInterval(); });
    window.addEventListener('blur', () => { this.clearInterval(); });
    window.addEventListener('resize', () => {this.ngAfterViewInit(); });
  }

  setInterval = () => {
    this.focus = true;
    this.interFunc = setInterval(() => {
      this.current = (this.current + 1) % this.urls.length;
      this.changeImage(0); },  this.interval || 7000);
  }
  clearInterval = () => {
    this.focus = false;
    clearInterval(this.interFunc);
    this.setImage();
  }

  ngAfterViewInit(): void {
    this.container = <HTMLDivElement>this.containerRef.nativeElement;
    this.canvas = <HTMLCanvasElement>this.canvasRef.nativeElement;

    // init the canvas
    this.canvas.height = this.container.offsetHeight;
    this.canvas.width = this.container.offsetWidth;
    this.ctx = this.canvas.getContext('2d');
    this.img = new Image;
    this.setImage();
    this.initCircles();

  }

  setImage = () => {
    this.img.src = this.urls[this.current];
    this.img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.canvas.width, this.canvas.height);
    };
  }

  initCircles = () => {
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.circles = [
      {x: width * 0.8, y: height * 0.8, r: width * 0.1},
      {x: width * 0.5, y: height * 0.2, r: width * 0.15},
      {x: width * 0.6, y: height * 0.6, r: width * 0.1},
      {x: width * 0.2, y: height * 0.3, r: width * 0.1},
      {x: width * 0.3, y: height * 0.4, r: width * 0.15},
      {x: width * 0.1, y: height * 0.5, r: width * 0.2},
      {x: width * 0.71, y: height * 0.7, r: width * 0.15},
      {x: width * 0.9, y: height * 0.18, r: width * 0.1},
      {x: width * 0.4, y: height * 0.8, r: width * 0.1},
      {x: width * 0.8, y: height * 0.25, r: width * 0.15},
      {x: width * 0.1, y: height * 0.1, r: width * 0.2},
      {x: width * 0.5, y: height * 0.5, r: width * 0.15},
      {x: width * 0.9, y: height * 0.5, r: width * 0.17},
      {x: width * 0.15, y: height * 0.9, r: width * 0.17},
      {x: width * 0.9, y: height * 0.9, r: width * 0.15},
      {x: width * 0.5, y: height * 0.9, r: width * 0.15},
      {x: width * 0.5, y: height * 0.9, r: width * 0.15},
      {x: width * 0.25, y: height * 0.1, r: width * 0.1},
      {x: width * 0.9, y: height * 0.1, r: width * 0.2},
      {x: width * 0.6, y: height * 0.25, r: width * 0.2},
      {x: width * 0.3, y: height * 0.6, r: width * 0.15},
      {x: width * 0.3, y: height * 0.1, r: width * 0.15},
      {x: width * 0.3, y: height * 0.9, r: width * 0.15},
      {x: width * 0.7, y: height * 0.9, r: width * 0.15},
      {x: width * 0.5, y: height * 0.05, r: width * 0.15},
    ];
  }

  changeImage = (i: number) => {

    if (i < this.circles.length && this.focus) {
      this.drawCircle(this.circles[i], this.current);
      setTimeout(() => {this.changeImage(i + 1); }, 60);
    } else {

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  drawCircle = (circle: Circle, i: number) => {

    const x = circle.x;
    const y = circle.y;
    const r = circle.r;
    const imgRX = r *  (this.img.width / this.canvas.width);
    const imgRY = r *  (this.img.height / this.canvas.height);
    const imgX = x *  (this.img.width / this.canvas.width);
    const imgY = y *  (this.img.height / this.canvas.height);

    this.img.src = this.urls[i];
    this.img.onload = () => {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
      this.ctx.closePath();
      this.ctx.clip();
      this.ctx.drawImage(this.img, imgX - imgRX , imgY - imgRY , imgRX * 2 , imgRY * 2 , x - r, y - r, r * 2, r * 2);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 25, 0, Math.PI * 2, true);
      this.ctx.clip();
      this.ctx.closePath();
      this.ctx.restore();
    };
  }

}
