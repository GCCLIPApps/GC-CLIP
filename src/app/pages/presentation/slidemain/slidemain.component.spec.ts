import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidemainComponent } from './slidemain.component';

describe('SlidemainComponent', () => {
  let component: SlidemainComponent;
  let fixture: ComponentFixture<SlidemainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlidemainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidemainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
