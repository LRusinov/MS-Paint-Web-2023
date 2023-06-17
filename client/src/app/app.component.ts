import {
  Component,
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
    // Create a new Fabric.js canvas with the ID 'canvas' and enable object stacking preservation
    this.fabricCanvas = new fabric.Canvas('canvas', {
      preserveObjectStacking: true,
    });

    // Set the current tool to the pencil tool
    this.setTool(Tool.pencil);

    // Add a mouse down event listener to the canvas
    this.fabricCanvas.on('mouse:down', (event) => {
      if (this.currentTool == Tool.magnifier) {
        // Perform zooming using the doZoom method with the event coordinates
        this.doZoom(event.e);
      }
    });

    this.fabricCanvas.renderAll();
  }

  setTool(tool: Tool) {
    this.currentTool = tool;
    switch (this.currentTool) {
      //72107
      case Tool.pencil: {
        this.fabricCanvas.selection = false;
        this.fabricCanvas.isDrawingMode = true;
        this.fabricCanvas.freeDrawingBrush.width = 5;
        this.fabricCanvas.freeDrawingBrush.color = this.currentColor;
        break;
      }
      //72059
      case Tool.selector: {
        this.fabricCanvas.isDrawingMode = false;
        this.fabricCanvas.selection = true;
        break;
      }
      //72107
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
      //72107
      case Tool.highlighter: {
        this.fabricCanvas.selection = false;
        this.fabricCanvas.isDrawingMode = true;
        this.fabricCanvas.freeDrawingBrush.width = 10;
        this.fabricCanvas.freeDrawingBrush.color = this.setColorWithOpacity();
        break;
      }
      //72059
      case Tool.pen: {
        this.fabricCanvas.selection = false;
        this.fabricCanvas.isDrawingMode = true;
        this.fabricCanvas.freeDrawingBrush.color = this.currentColor;
        this.fabricCanvas.freeDrawingBrush.width = 15;
        break;
      }
      //72059
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

  //72059

  cut(): void {
    // Get the currently active objects on the canvas
    const activeObjects = this.fabricCanvas.getActiveObjects();

    // Check if there are any active objects
    if (activeObjects) {
      const clonedObjects: fabric.Object[] = [];

      // Iterate over each active object
      activeObjects.forEach((obj: fabric.Object) => {
        // Clone each object and add the cloned version to the array
        obj.clone((cloned: fabric.Object) => {
          clonedObjects.push(cloned);
        });

        // Remove the original object from the canvas
        this.fabricCanvas.remove(obj);
      });

      // Create a new active selection with the cloned objects
      this.clipboard = new fabric.ActiveSelection(clonedObjects, {
        canvas: this.fabricCanvas,
      });
      
      this.fabricCanvas.renderAll();
    }
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    // Prevent the default context menu from appearing
    event.preventDefault();
    if (this.currentTool == Tool.magnifier) {
      // Call the doZoom() method if the current tool is the magnifier
      this.doZoom(event);
    }
  }

  doZoom(event: MouseEvent) {
    var zoom: number;
    if (event.button == 2) {
      // Right button pressed
      zoom = -0.1;
    } else if (event.button == 0) {
      // Left button pressed
      zoom = 0.1;
    } else {
      // Other buttons are pressed
      zoom = 0;
    }

    // Get the mouse pointer position relative to the canvas
    const pointer = this.fabricCanvas.getPointer(event);
    const zoomX = pointer.x;
    const zoomY = pointer.y;

    // Zoom to the specified point.
    this.fabricCanvas.zoomToPoint(
      { x: zoomX, y: zoomY },
      this.fabricCanvas.getZoom() + zoom
    );
  }

  setColor(color: string) {
    this.currentColor = color;
    this.setTool(this.currentTool);
  }

  clear() {
    this.fabricCanvas.clear();
    this.fabricCanvas.backgroundColor = 'white';
  }

  // 72054

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
