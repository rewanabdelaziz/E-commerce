import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryManagementsComponent } from './category-managements.component';

describe('CategoryManagementsComponent', () => {
  let component: CategoryManagementsComponent;
  let fixture: ComponentFixture<CategoryManagementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryManagementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryManagementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
