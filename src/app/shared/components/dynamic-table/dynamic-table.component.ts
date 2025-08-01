/* istanbul ignore file */
import { AfterViewInit, Component, OnChanges, SimpleChanges, ViewChild, computed, effect, input, output } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Superheroe } from '../../../core/models/superheroe.model';
import { Column } from '../../../core/models/columns.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel
  ],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss',
})
export class DynamicTableComponent implements AfterViewInit {
  // Inputs y Outputs modernos
  data = input<Superheroe[]>([]);
  displayedColumns = input<Column[]>([]);
  showFilter = input<boolean>(false);
  showPagination = input<boolean>(false);

  iconClick = output<any>();
  createClicked = output<void>();
  filterChanged = output<string>();

  dataSource = new MatTableDataSource<Superheroe>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnKeys = computed(() =>
    this.displayedColumns().map((col) => col.columnDef)
  );

  // lo pongo como propiedad para poder limpiarlo si es necesario
  private dataEffect = effect(() => {
    this.dataSource.data = this.data();
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  });

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
