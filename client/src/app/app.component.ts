import {
  Component,
  ElementRef,
  ViewChild,
  Inject,
  HostListener,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { fabric } from 'fabric';
import { Tool } from './common/Tool';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  fabricCanvas!: fabric.Canvas;
  lastTool!: Tool;
  PaintTool = Tool;
  currentColor: string = 'black';
  currentTool: Tool = Tool.pencil;
  selectedArrowTool: Tool = Tool.pen;
  clipboard!: fabric.Object;
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

  ngOnInit() {
    this.fabricCanvas = new fabric.Canvas('canvas', {
      preserveObjectStacking: true,
    });
    this.setTool(Tool.pencil);
  }

  setTool(tool: Tool) {
    this.currentTool = tool;
    switch (this.currentTool) {
      case Tool.pencil: {
        this.fabricCanvas.selection = false;
        this.fabricCanvas.isDrawingMode = true;
        this.fabricCanvas.freeDrawingBrush.width = 5;
        this.fabricCanvas.freeDrawingBrush.color = this.currentColor;
        break;
      }
      case Tool.selector: {
        break;
      }
      case Tool.eraser: {
        this.fabricCanvas.selection = false;
        this.fabricCanvas.isDrawingMode = true; // Enable drawing mode
        this.fabricCanvas.freeDrawingBrush.color = 'white'; // Set brush color to white (eraser)
        this.fabricCanvas.freeDrawingBrush.width = 10; // Set brush width as needed
        break;
      }
      case Tool.bucket: {
        break;
      }
      case Tool.type: {
        break;
      }
      case Tool.highlighter: {
        this.fabricCanvas.selection = false;
        this.fabricCanvas.isDrawingMode = true;
        this.fabricCanvas.freeDrawingBrush.width = 10;
        this.fabricCanvas.freeDrawingBrush.color = this.setColorWithOpacity();
        break;
      }
      case Tool.pen: {
        break;
      }
      case Tool.magnifier:
        this.fabricCanvas.isDrawingMode = false;
    }
  }

  private setColorWithOpacity(): string {
    const opacity = 0.4;
    switch (this.currentColor) {
      case 'white':
        return `rgba(255,255,255, ${opacity})`;
      case 'black':
        return `rgba(0,0,0, ${opacity})`;
      case 'lightgrey':
        return `rgba(211, 211, 211, ${opacity})`;
      case 'brown':
        return `rgba(150, 75, 0, ${opacity})`;
      case 'red':
        return `rgba(255,0,0, ${opacity})`;
      case 'deeppink':
        return `rgba(255,20,147, ${opacity})`;
      case 'yellow':
        return `rgba(255,255,0, ${opacity})`;
      case 'orange':
        return `rgba(255, 165, 0, ${opacity})`;
      case 'green':
        return `rgba(0,255,0, ${opacity})`;
      case 'lightgreen':
        return `rgba(144, 238, 144, ${opacity})`;
      case 'blue':
        return `rgba(0, 0, 255, ${opacity})`;
      case 'turquoise':
        return `rgba(48,213,200, ${opacity})`;
      case 'purple':
        return `rgba(160, 32, 240, ${opacity})`;
      case 'plum':
        return `rgba(221, 160, 221, ${opacity})`;
      default:
        return `rgba(0,0,0, ${opacity})`;
    }
  }

  copy(): void {
    const activeObject = this.fabricCanvas.getActiveObject();
    if (activeObject) {
      activeObject.clone((cloned: fabric.Object) => {
        this.clipboard = cloned;
      });
    }
  }

  paste(): void {
    if (!this.clipboard) return;

    this.clipboard.clone((clonedObject: fabric.Object) => {
      clonedObject.set({
        left: (clonedObject.left || 0) + 10,
        top: (clonedObject.top || 0) + 10,
        evented: true,
      });

      if (clonedObject.type === 'activeSelection') {
        const activeSelection = clonedObject as fabric.ActiveSelection;
        activeSelection.canvas = this.fabricCanvas;
        activeSelection.forEachObject((obj: fabric.Object) => {
          this.fabricCanvas.add(obj);
        });
        clonedObject.setCoords();
      } else {
        this.fabricCanvas.add(clonedObject);
      }

      this.clipboard.top! += 10;
      this.clipboard.left! += 10;

      this.fabricCanvas.setActiveObject(clonedObject);
      this.fabricCanvas.requestRenderAll();
    });
  }

  enableColorPicker() {
    this.lastTool = this.currentTool;
    this.currentTool = Tool.colorPicker;

    this.fabricCanvas.on('mouse:down', this.pickColor);
  }

  private pickColor = (event: fabric.IEvent) => {
    if (this.currentTool === Tool.colorPicker) {
      const target = event.target;
      if (target && target instanceof fabric.Object) {
        this.currentColor = target.stroke as string;
        this.fabricCanvas.freeDrawingBrush.color = this.currentColor;
      }
      this.setTool(this.lastTool);
    }
  };

  setColor(color: string) {
    this.currentColor = color;
    this.setTool(this.currentTool);
  }

  clear() {
    this.fabricCanvas.clear();
    this.fabricCanvas.backgroundColor = 'white';
  }

  downloadCanvas() {
    let canvas = <HTMLCanvasElement>document.getElementById('canvas');
    let canvasUrl = canvas.toDataURL('image/png', 0.5);

    const createEl = document.createElement('a');
    createEl.href = canvasUrl;
    createEl.download = 'download-canvas';
    createEl.click();
    createEl.remove();
  }
}
