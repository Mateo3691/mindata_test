import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() data: Superheroe[] = [];
  @Input() displayedColumns: Column[] = [];

  @Output() iconClick: EventEmitter<any> = new EventEmitter();

  get columnKeys(): string[] {
    return this.displayedColumns.map((col) => col.columnDef);
  }

  onIconClick(action: string, element: any): void {
    this.iconClick.emit({ action, element });
  }
}
