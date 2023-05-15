import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent {
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
}
