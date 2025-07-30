import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Superheroe } from '../../../../core/models/superheroe.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UppercaseDirective } from '../../../../shared/directives/uppercase.directive';

@Component({
  selector: 'app-create-edit-hero-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    UppercaseDirective
  ],
  templateUrl: './create-edit-hero-dialog.component.html',
  styleUrl: './create-edit-hero-dialog.component.scss'
})
export class CreateEditHeroDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateEditHeroDialogComponent>);
  data = inject<Superheroe | null>(MAT_DIALOG_DATA, { optional: true }) ?? null;

  isEdit = !!this.data;

  form = this.fb.group({
    id: [this.data?.id ?? null],
    nombre: [this.data?.nombre ?? '', Validators.required],
    poder: [this.data?.poder ?? '', Validators.required],
    origen: [this.data?.origen ?? '', Validators.required],
  });

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
