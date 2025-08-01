/* istanbul ignore file */
import { AfterViewInit, Component, ViewChild, computed, effect, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Column } from '../../../core/models/columns.model';
import { Superheroe } from '../../../core/models/superheroe.model';

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
