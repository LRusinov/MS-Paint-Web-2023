import { Component } from '@angular/core';

@Component({
  selector: 'app-file-saver',
  templateUrl: './file-saver.component.html',
  styleUrls: ['./file-saver.component.css'],
})
export class FileSaverComponent {
  title = 'my-app';

  //downloadButton = document.getElementById('download');

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

  //this.downloadButton.addEventListener('click', )
}
