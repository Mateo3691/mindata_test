import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Superheroe } from '../../../../core/models/superheroe.model';
import { SuperheroeService } from '../../../../core/services/superheroe.service';
import { DynamicTableComponent } from '../../../../shared/components/dynamic-table/dynamic-table.component';
import { ConfirmDeleteDialogComponent } from '../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { CreateEditHeroDialogComponent } from '../../dialogs/create-edit-hero-dialog/create-edit-hero-dialog.component';

@Component({
  selector: 'app-superheroes-list',
  imports: [DynamicTableComponent, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './superheroes-list.component.html',
  styleUrl: './superheroes-list.component.scss'
})
export class SuperheroesListComponent {
  dialog = inject(MatDialog);
  service = inject(SuperheroeService);
  filter = signal('');
  heroes = computed(() => {
    const term = this.filter().trim().toLowerCase();
    return term
      ? this.service.searchByName(term)
      : this.service.heroes();
  });
  displayedColumns = [
    { columnDef: 'id', header: 'ID' },
    { columnDef: 'nombre', header: 'Nombre' },
    { columnDef: 'poder', header: 'Poder' },
    { columnDef: 'origen', header: 'Origen' },
    {
      columnDef: 'acciones',
      header: 'Acciones',
      icons: [
        { name: 'edit', action: 'editar', tooltip: 'Editar héroe' },
        { name: 'delete', action: 'eliminar', tooltip: 'Eliminar héroe' },
      ],
    },
  ];

  delete(hero: Superheroe): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: hero.nombre
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.service.delete(hero.id);
      }
    });
  }

  onIconClick(event: { action: string; element: any }): void {
    if (event.action === 'editar') {
      this.openDialogToEdit(event.element);
    } else if (event.action === 'eliminar') {
      this.delete(event.element);
    }
  }

  openDialogToEdit(hero: Superheroe) {
    this.dialog.open(CreateEditHeroDialogComponent, {
      data: hero,
    }).afterClosed().subscribe(result => {
      if (result) {
        this.service.update(result);
      }
    });
  }

  openDialogToCreate() {
    this.dialog.open(CreateEditHeroDialogComponent, {
      data: null,
    }).afterClosed().subscribe(result => {
      if (result) {
        this.service.add(result);
      }
    });
  }
}
