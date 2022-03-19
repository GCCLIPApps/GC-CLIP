import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenviewComponent } from './fullscreenview.component';

describe('FullscreenviewComponent', () => {
  let component: FullscreenviewComponent;
  let fixture: ComponentFixture<FullscreenviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullscreenviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullscreenviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
