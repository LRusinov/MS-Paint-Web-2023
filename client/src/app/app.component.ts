import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { fabric } from 'fabric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  fabricCanvas!: fabric.Canvas;
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
    if (tool === 'pencil') {
      this.fabricCanvas.isDrawingMode = true;
    } else {
      this.fabricCanvas.isDrawingMode = false;
      this.fabricCanvas.selection = true; // Add this line to enable object selection
    }
  }
  ngOnInit() {
    this.fabricCanvas = new fabric.Canvas('canvas', {
      preserveObjectStacking: true,
    });
    this.fabricCanvas.freeDrawingBrush.width = 5;
    this.fabricCanvas.freeDrawingBrush.color = this.currentColor;
    this.fabricCanvas.backgroundColor = 'white';

    this.fabricCanvas.renderAll();
  }

  // Sets the color for writing
  setColor(color: string) {
    this.currentColor = color;
    this.fabricCanvas.freeDrawingBrush.color = color;
  }

  // Clears the canvas
  clear() {
    this.fabricCanvas.clear();
    this.fabricCanvas.backgroundColor = 'white';
  }

  downloadCanvas() {
    let canvas = <HTMLCanvasElement>document.getElementById('canvas');
    let canvasUrl = canvas.toDataURL('image/png', 0.5);

    console.log(canvasUrl);
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;
    createEl.download = 'download-canvas';
    createEl.click();
    createEl.remove();
  }
}
