import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseviewerComponent } from './responseviewer.component';

describe('ResponseviewerComponent', () => {
  let component: ResponseviewerComponent;
  let fixture: ComponentFixture<ResponseviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseviewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
