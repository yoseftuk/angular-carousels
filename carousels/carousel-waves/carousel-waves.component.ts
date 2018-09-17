import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-carousel-waves',
  templateUrl: './carousel-waves.component.html',
  styleUrls: ['./carousel-waves.component.css']
})
export class CarouselWavesComponent implements OnInit, AfterViewInit {

  @Input('urls') urls: string[];
  @Input('interval') interval: number;
  @ViewChild('canvasRef') canvasRef: ElementRef;
  @ViewChild('canvasRef2') canvasRef2: ElementRef;
  @ViewChild('containerRef') containerRef: ElementRef;
  canvas: HTMLCanvasElement;
  canvas2: HTMLCanvasElement;
  container: HTMLDivElement;
  img;
  img2;
  ctx;
  ctx2;
  interFunc;
  current: number;
  show: boolean;

  constructor() {
  }

  ngOnInit() {
    this.img = new Image;
    this.img2 = new Image;
    this.current = 0;
    this.show = false;
    window.addEventListener('focus', () => {
      this.setInterval();
    });
    window.addEventListener('blur', () => {
      this.clearInterval();
    });
    window.addEventListener('resize', () => {
      this.ngAfterViewInit();
    });
    this.setInterval();

  }

  ngAfterViewInit(): void {
    this.container = <HTMLDivElement>this.containerRef.nativeElement;
    this.canvas = <HTMLCanvasElement>this.canvasRef.nativeElement;
    this.canvas2 = <HTMLCanvasElement>this.canvasRef2.nativeElement;

    // init the canvas
    this.canvas.height = this.container.offsetHeight;
    this.canvas.width = this.container.offsetWidth;
    this.canvas2.height = this.container.offsetHeight;
    this.canvas2.width = this.container.offsetWidth;
    this.ctx = this.canvas.getContext('2d');
    this.ctx2 = this.canvas2.getContext('2d');
    this.initImages();

  }

  setInterval = () => {
    this.interFunc = setInterval(() => {
      this.current = (this.current + 1) % this.urls.length;
      this.setImage();
      this.setImage2();
    }, this.interval || 6000);
  }

  clearInterval = () => {
    clearInterval(this.interFunc);
  }

  initImages = () => {
    this.img.src = this.urls[1];
    this.img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(
        this.img, 0, 0, this.img.width, this.img.height, 0, 0,
        this.canvas.width, this.canvas.height);
    };
  }

  setImage = () => {
    this.img.src = this.urls[this.current];
    this.img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(
        this.img, 0, 0, this.img.width, this.img.height, 0, 0,
        this.canvas.width, this.canvas.height);
      this.waves();
    };
  }
  setImage2 = () => {
    this.img2.src = this.urls[(this.current + 1) % this.urls.length];
    this.img2.onload = () => {
      this.ctx2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
      this.ctx2.drawImage(
        this.img2, 0, 0, this.img2.width, this.img2.height, 0, 0,
        this.canvas2.width, this.canvas2.height);
      this.show = true;
      this.waves2();
    };
  }

  // waves() {
  //
  //   const w = this.canvas.width;
  //   const h = this.canvas.height;
  //
  //   const o1 = new Osc(0.05), o2 = new Osc(0.03), o3 = new Osc(0.06),  // osc. for vert
  //     o4 = new Osc(0.08), o5 = new Osc(0.04), o6 = new Osc(0.067), // osc. for hori
  //
  //     // source grid lines
  //     x0 = 0, x1 = w * 0.25, x2 = w * 0.5, x3 = w * 0.75, x4 = w,
  //     y0 = 0, y1 = h * 0.25, y2 = h * 0.5, y3 = h * 0.75, y4 = h,
  //
  //     // cache source widths/heights
  //     sw0 = x1, sw1 = x2 - x1, sw2 = x3 - x2, sw3 = x4 - x3,
  //     sh0 = y1, sh1 = y2 - y1, sh2 = y3 - y2, sh3 = y4 - y3,
  //
  //     vcanvas = document.createElement('canvas'),  // off-screen canvas for 2. pass
  //     vctx = vcanvas.getContext('2d');
  //
  //   vcanvas.width = w;
  //   vcanvas.height = h;           // set to same size as main canvas
  //
  //   const loop = () => {
  //     this.ctx.clearRect(0, 0, w, h);
  //
  //     for (let y = 0; y < h; y++) {
  //
  //       // segment positions
  //       const lx1 = x1 + o1.current(y * 0.2) * 2.5,
  //         lx2 = x2 + o2.current(y * 0.2) * 2,
  //         lx3 = x3 + o3.current(y * 0.2) * 1.5,
  //
  //         // segment widths
  //         w0 = lx1,
  //         w1 = lx2 - lx1,
  //         w2 = lx3 - lx2,
  //         w3 = x4 - lx3;
  //
  //       // draw image lines
  //       this.ctx.drawImage(this.img, x0, y, sw0, 1, 0, y, w0, 1);
  //       this.ctx.drawImage(this.img, x1, y, sw1, 1, lx1 - 0.5, y, w1 + 0.5, 1);
  //       this.ctx.drawImage(this.img, x2, y, sw2, 1, lx2 - 0.5, y, w2 + 0.5, 1);
  //       this.ctx.drawImage(this.img, x3, y, sw3, 1, lx3 - 0.5, y, w3 + 0.5, 1);
  //     }
  //
  //     // pass 1 done, copy to off-screen canvas:
  //     vctx.clearRect(0, 0, w, h);    // clear off-screen canvas (only if alpha)
  //     vctx.drawImage(this.canvas, 0, 0);
  //     this.ctx.clearRect(0, 0, w, h);     // clear main (onlyif alpha)
  //
  //     for (let x = 0; x < w; x++) {
  //       const ly1 = y1 + o4.current(x * 0.32),
  //         ly2 = y2 + o5.current(x * 0.3) * 2,
  //         ly3 = y3 + o6.current(x * 0.4) * 1.5;
  //
  //       this.ctx.drawImage(vcanvas, x, y0, 1, sh0, x, 0, 1, ly1);
  //       this.ctx.drawImage(vcanvas, x, y1, 1, sh1, x, ly1 - 0.5, 1, ly2 - ly1 + 0.5);
  //       this.ctx.drawImage(vcanvas, x, y2, 1, sh2, x, ly2 - 0.5, 1, ly3 - ly2 + 0.5);
  //       this.ctx.drawImage(vcanvas, x, y3, 1, sh3, x, ly3 - 0.5, 1, y4 - ly3 + 0.5);
  //     }
  //
  //     requestAnimationFrame(loop);
  //   };
  //   loop();
  // }
  waves() {

    const w = this.canvas.width;
    const h = this.canvas.height;
    let m = 1;
    let finish = false;
    let halfWay = false;
    setTimeout(() => {
      halfWay = true;
    }, 1500);
    setTimeout(() => {
      finish = true;
    }, 3000);

    const o1 = new Osc(0.05), o2 = new Osc(0.03), o3 = new Osc(0.07),  // osc. for vert
      o4 = new Osc(0.03), o5 = new Osc(0.02), o6 = new Osc(0.05), // osc. for hori

      // source grid lines
      x0 = 0, x1 = w * 0.25, x2 = w * 0.5, x3 = w * 0.75, x4 = w,
      y0 = 0, y1 = h * 0.25, y2 = h * 0.5, y3 = h * 0.75, y4 = h,

      // cache source widths/heights
      sw0 = x1, sw1 = x2 - x1, sw2 = x3 - x2, sw3 = x4 - x3,
      sh0 = y1, sh1 = y2 - y1, sh2 = y3 - y2, sh3 = y4 - y3,

      vcanvas = document.createElement('canvas'),  // off-screen canvas for 2. pass
      vctx = vcanvas.getContext('2d');

    vcanvas.width = w;
    vcanvas.height = h;           // set to same size as main canvas

    const loop = () => {
      this.ctx.clearRect(0, 0, w, h);

      vctx.clearRect(0, 0, w, h);    // clear off-screen canvas (only if alpha)
      vctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.canvas.width, this.canvas.height);

      for (let y = 0; y < h; y++) {

        // segment positions
        const lx1 = x1 + o1.current(y * 0.2) * m,
          lx2 = x2 + o2.current(y * 0.2) * m,
          lx3 = x3 + o3.current(y * 0.2) * m,

          // segment widths
          w0 = lx1,
          w1 = lx2 - lx1,
          w2 = lx3 - lx2,
          w3 = x4 - lx3;

        // draw image lines
        this.ctx.drawImage(vcanvas, x0, y, sw0, 1, 0, y, w0, 1);
        this.ctx.drawImage(vcanvas, x1, y, sw1, 1, lx1 - 0.5, y, w1 + 0.5, 1);
        this.ctx.drawImage(vcanvas, x2, y, sw2, 1, lx2 - 0.5, y, w2 + 0.5, 1);
        this.ctx.drawImage(vcanvas, x3, y, sw3, 1, lx3 - 0.5, y, w3 + 0.5, 1);
      }

      // pass 1 done, copy to off-screen canvas:
      vctx.clearRect(0, 0, w, h);    // clear off-screen canvas (only if alpha)
      vctx.drawImage(this.canvas, 0, 0);
      this.ctx.clearRect(0, 0, w, h);     // clear main (onlyif alpha)

      for (let x = 0; x < w; x++) {
        const ly1 = y1 + o4.current(x * 0.32) * m,
          ly2 = y2 + o5.current(x * 0.3) * m,
          ly3 = y3 + o6.current(x * 0.4) * m;

        this.ctx.drawImage(vcanvas, x, y0, 1, sh0, x, 0, 1, ly1);
        this.ctx.drawImage(vcanvas, x, y1, 1, sh1, x, ly1 - 0.5, 1, ly2 - ly1 + 0.5);
        this.ctx.drawImage(vcanvas, x, y2, 1, sh2, x, ly2 - 0.5, 1, ly3 - ly2 + 0.5);
        this.ctx.drawImage(vcanvas, x, y3, 1, sh3, x, ly3 - 0.5, 1, y4 - ly3 + 0.5);
      }

      if (finish) {
        this.ctx.drawImage(vcanvas, 0, 0, vcanvas.width, vcanvas.height, 0, 0, this.canvas.width, this.canvas.height);

      } else if (halfWay) {
        m -= 0.3;
        requestAnimationFrame(loop);
      } else {

        m += 0.3;
        requestAnimationFrame(loop);
      }
    };
    loop();
  }

  waves2() {

    const w = this.canvas2.width;
    const h = this.canvas2.height;

    let m = 1;
    let finish = false;
    let halfWay = false;
    setTimeout(() => {
      halfWay = true;
    }, 1500);
    setTimeout(() => {
      finish = true;
    }, 3000);

    const o1 = new Osc(0.05), o2 = new Osc(0.03), o3 = new Osc(0.07),  // osc. for vert
      o4 = new Osc(0.03), o5 = new Osc(0.02), o6 = new Osc(0.05), // osc. for hori

      // source grid lines
      x0 = 0, x1 = w * 0.25, x2 = w * 0.5, x3 = w * 0.75, x4 = w,
      y0 = 0, y1 = h * 0.25, y2 = h * 0.5, y3 = h * 0.75, y4 = h,

      // cache source widths/heights
      sw0 = x1, sw1 = x2 - x1, sw2 = x3 - x2, sw3 = x4 - x3,
      sh0 = y1, sh1 = y2 - y1, sh2 = y3 - y2, sh3 = y4 - y3,

      vcanvas = document.createElement('canvas'),  // off-screen canvas for 2. pass
      vctx = vcanvas.getContext('2d');

    vcanvas.width = w;
    vcanvas.height = h;           // set to same size as main canvas
    console.log(this.img2.width, w);

    const loop = () => {
      this.ctx2.clearRect(0, 0, w, h);

      vctx.clearRect(0, 0, w, h);    // clear off-screen canvas (only if alpha)
      vctx.drawImage(this.img2, 0, 0, this.img2.width, this.img2.height, 0, 0, this.canvas2.width, this.canvas2.height);

      for (let y = 0; y < h; y++) {

        // segment positions
        const lx1 = x1 + o1.current(y * 0.2) * m,
          lx2 = x2 + o2.current(y * 0.2) * m,
          lx3 = x3 + o3.current(y * 0.2) * m,

          // segment widths
          w0 = lx1,
          w1 = lx2 - lx1,
          w2 = lx3 - lx2,
          w3 = x4 - lx3;
        // draw image lines
        this.ctx2.drawImage(vcanvas, x0, y, sw0, 1, 0, y, w0, 1);
        this.ctx2.drawImage(vcanvas, x1, y, sw1, 1, lx1 - 0.5, y, w1 + 0.5, 1);
        this.ctx2.drawImage(vcanvas, x2, y, sw2, 1, lx2 - 0.5, y, w2 + 0.5, 1);
        this.ctx2.drawImage(vcanvas, x3, y, sw3, 1, lx3 - 0.5, y, w3 + 0.5, 1);
      }

      // pass 1 done, copy to off-screen canvas:
      vctx.clearRect(0, 0, w, h);    // clear off-screen canvas (only if alpha)
      vctx.drawImage(this.canvas2, 0, 0);
      this.ctx2.clearRect(0, 0, w, h);     // clear main (onlyif alpha)

      for (let x = 0; x < w; x++) {
        const ly1 = y1 + o4.current(x * 0.32) * m,
          ly2 = y2 + o5.current(x * 0.3) * m,
          ly3 = y3 + o6.current(x * 0.4) * m;

        this.ctx2.drawImage(vcanvas, x, y0, 1, sh0, x, 0, 1, ly1);
        this.ctx2.drawImage(vcanvas, x, y1, 1, sh1, x, ly1 - 0.5, 1, ly2 - ly1 + 0.5);
        this.ctx2.drawImage(vcanvas, x, y2, 1, sh2, x, ly2 - 0.5, 1, ly3 - ly2 + 0.5);
        this.ctx2.drawImage(vcanvas, x, y3, 1, sh3, x, ly3 - 0.5, 1, y4 - ly3 + 0.5);
      }

      if (finish) {
        this.ctx.drawImage(vcanvas, 0, 0, vcanvas.width, vcanvas.height, 0, 0, this.canvas.width, this.canvas.height);
        this.show = false;

      } else if (halfWay) {
        m -= 0.3;
        requestAnimationFrame(loop);
      } else {

        m += 0.3;
        requestAnimationFrame(loop);
      }
    };
    loop();
  }

}

class Osc {

  speed: number;
  frame: number;

  constructor(speed: number) {
    this.speed = speed;
    this.frame = 0;
  }

  current(x) {
    this.frame += 0.002 * this.speed;
    return Math.sin(this.frame + x * this.speed * 10);
  };
}
