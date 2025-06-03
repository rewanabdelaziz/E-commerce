import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmincartComponent } from './admincart.component';

describe('AdmincartComponent', () => {
  let component: AdmincartComponent;
  let fixture: ComponentFixture<AdmincartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmincartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmincartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
