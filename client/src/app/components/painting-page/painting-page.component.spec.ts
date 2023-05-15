import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintingPageComponent } from './painting-page.component';

describe('PaintingPageComponent', () => {
  let component: PaintingPageComponent;
  let fixture: ComponentFixture<PaintingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaintingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaintingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
