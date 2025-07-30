import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Superheroe } from '../../../core/models/superheroe.model';
import { Column } from '../../../core/models/columns.model';
import { MOCK_SUPERHEROES } from '../../../core/mocks/superheroes-mock';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dynamic-table',
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatLabel],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss',
})
export class DynamicTableComponent implements AfterViewInit, OnChanges {
  @Input() data: Superheroe[] = [];
  @Input() displayedColumns: Column[] = [];

  @Output() iconClick: EventEmitter<any> = new EventEmitter();
  @Output() createClicked = new EventEmitter<void>();
  @Output() filterChanged = new EventEmitter<string>();

  dataSource = new MatTableDataSource<Superheroe>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  get columnKeys(): string[] {
    return this.displayedColumns.map((col) => col.columnDef);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // esto lo hago para que se vayan actualizando los datos en la tabla cuando cambian
  ngOnChanges(): void {
    this.dataSource.data = this.data;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  onFilterChange(value: string) {
  this.filterChanged.emit(value);
  }

  onCreateClick() {
    this.createClicked.emit();
  }

  onIconClick(action: string, element: any): void {
    this.iconClick.emit({ action, element });
  }
}
