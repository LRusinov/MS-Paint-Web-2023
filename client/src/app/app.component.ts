import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'project';
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D;
  // Sets the default color
  currentColor: string = 'black';
  currentTool: string = 'pencil';
  selectedArrowTool: string = 'pen';
  icons = [
    { name: 'bucket', path: '../assets/bucket.svg' },
    { name: 'highlighter', path: '../assets/highlighter.svg' },
    { name: 'brush', path: '../assets/brush.svg' },
    { name: 'dropper', path: '../assets/dropper.svg' },
    { name: 'pencil', path: '../assets/pencil.svg' },
    { name: 'palettea', path: '../assets/palettea.svg' },
    { name: 'eraser', path: '../assets/eraser.svg' },
    { name: 'crop', path: '../assets/crop.svg' },
    { name: 'selection', path: '../assets/selection.svg' },
    { name: 'pen', path: '../assets/pen.svg' },
    { name: 'magnifier', path: '../assets/magnifier.svg' },
    { name: 'type', path: '../assets/type.svg' },
    { name: 'scissors', path: '../assets/scissors.svg' },
    { name: 'clipboard', path: '../assets/clipboard.svg' },
    { name: 'copy', path: '../assets/copy.svg' },
  ];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    //Adds the svg icons to the material registry.
    this.icons.forEach(({ name, path }) => {
      this.matIconRegistry.addSvgIcon(
        name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(path)
      );
    });
  }

  //Sets the current tool.
  setTool(tool: string) {
    this.currentTool = tool;
  }
  ngOnInit() {
    // Getting the context of Canvas for painting
    this.context = this.canvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    this.context.fillStyle = 'white';
    this.context.fillRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
    this.context.strokeStyle = this.currentColor;
  }
  ngAfterViewInit() {
    //Mouse position variables
    let lastX = 0;
    let lastY = 0;

    // Listening to the "mousedown" event on canvas
    this.canvas.nativeElement.addEventListener('mousedown', (event) => {
      // Remembering the start position of the maouse
      lastX = event.offsetX;
      lastY = event.offsetY;
      // Starting the painting path
      this.context.beginPath();
      this.context.lineWidth = 5;
      this.context.moveTo(lastX, lastY);
    });

    // Listening to the event "mousemove" on canvas
    this.canvas.nativeElement.addEventListener('mousemove', (event) => {
      // Check if the mouse button is pressed
      if (event.buttons !== 1) return;

      // Drawing a line from the previous position to the current position
      this.context.lineTo(event.offsetX, event.offsetY);
      this.context.stroke();
    });
  }

  // Sets the color for writing
  setColor(color: string) {
    this.context.strokeStyle = color;
    this.currentColor = color;
  }

  // Clears the canvas
  clear() {
    this.context.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
    this.context.fillStyle = 'white';
    this.context.fillRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
    this.context.strokeStyle = this.currentColor;
  }

  downloadCanvas() {
    let canvas = <HTMLCanvasElement>document.getElementById('canvas');
    let canvasUrl = canvas.toDataURL('image/jpeg', 0.5);

    console.log(canvasUrl);
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;
    createEl.download = 'download-canvas';
    createEl.click();
    createEl.remove();
  }
}
