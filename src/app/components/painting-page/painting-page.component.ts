import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  templateUrl: './painting-page.component.html',
  styleUrls: ['./painting-page.component.css']
})
export class PaintingPageComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>; 
  context!: CanvasRenderingContext2D; 
  // Sets the default color
  currentColor: string = 'black'; 

  ngAfterViewInit() {
    // Getting the context of Canvas for painting
    this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.context.strokeStyle = this.currentColor;

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
  setColor(color:string){
    this.context.strokeStyle = color;
    this.currentColor=color
  }

  // Clears the canvas
  clear() {
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }
}