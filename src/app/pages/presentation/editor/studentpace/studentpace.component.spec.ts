import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentpaceComponent } from './studentpace.component';

describe('StudentpaceComponent', () => {
  let component: StudentpaceComponent;
  let fixture: ComponentFixture<StudentpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentpaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
