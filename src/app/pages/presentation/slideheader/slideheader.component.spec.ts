import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideheaderComponent } from './slideheader.component';

describe('SlideheaderComponent', () => {
  let component: SlideheaderComponent;
  let fixture: ComponentFixture<SlideheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlideheaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
