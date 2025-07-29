import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Superheroe } from '../../../core/models/superheroe.model';
import { Column } from '../../../core/models/columns.model';
import { MOCK_SUPERHEROES } from '../../../core/mocks/superheroes-mock';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dynamic-table',
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss',
})
export class DynamicTableComponent {
  data: Superheroe[] = [...MOCK_SUPERHEROES];
  displayedColumns: Column[] = [
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

  columnKeys = this.displayedColumns.map((col) => col.columnDef);

  onActionClick(element: any): void {
    console.log('Acción realizada en el elemento:', element);
  }

  onIconClick(action: string, element: any): void {
    console.log(`Icono ${action} clicado en el elemento:`, element);
  }
}
