import { Component } from '@angular/core';

@Component({
  selector: 'app-file-saver',
  templateUrl: './file-saver.component.html',
  styleUrls: ['./file-saver.component.css'],
})
export class FileSaverComponent {
  downloadCanvas() {
    let canvas = <HTMLCanvasElement>document.getElementById('canvas');
    let canvasUrl = canvas.toDataURL('image/jpeg', 1);

    console.log(canvasUrl);
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;
    createEl.download = 'canvas';
    createEl.click();
    createEl.remove();
  }
}
