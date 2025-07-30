import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditHeroDialogComponent } from './create-edit-hero-dialog.component';

describe('CreateEditHeroDialogComponent', () => {
  let component: CreateEditHeroDialogComponent;
  let fixture: ComponentFixture<CreateEditHeroDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditHeroDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditHeroDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
