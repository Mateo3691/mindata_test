import { Component } from '@angular/core';
import { DynamicTableComponent } from '../../../../shared/components/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-superheroes-list',
  imports: [DynamicTableComponent],
  templateUrl: './superheroes-list.component.html',
  styleUrl: './superheroes-list.component.scss'
})
export class SuperheroesListComponent {

}
