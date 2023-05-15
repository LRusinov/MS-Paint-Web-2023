import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaintingPageComponent } from './components/painting-page/painting-page.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FileSaverComponent } from './components/file-saver/file-saver.component';

const routes: Routes = [
  {
    path: 'paint',
    component: PaintingPageComponent,
  },
  {
    path: 'toolbar',
    component: ToolbarComponent,
  },
  {
    path: 'file-saver',
    component: FileSaverComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
