import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorpaceComponent } from './instructorpace.component';

describe('InstructorpaceComponent', () => {
  let component: InstructorpaceComponent;
  let fixture: ComponentFixture<InstructorpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructorpaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
