import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImsMasterComponent } from './ims-master.component';

describe('ImsMasterComponent', () => {
  let component: ImsMasterComponent;
  let fixture: ComponentFixture<ImsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImsMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
