import { Component, effect, signal } from '@angular/core';
import { DynamicTableComponent } from '../../../../shared/components/dynamic-table/dynamic-table.component';
import { MatCardModule } from '@angular/material/card';
import { Superheroe } from '../../../../core/models/superheroe.model';
import { SuperheroeService } from '../../../../core/services/superheroe.service';

@Component({
  selector: 'app-superheroes-list',
  imports: [DynamicTableComponent, MatCardModule],
  templateUrl: './superheroes-list.component.html',
  styleUrl: './superheroes-list.component.scss'
})
export class SuperheroesListComponent {

  filter = signal('');
  heroes = signal<Superheroe[]>([]);

  constructor(public service: SuperheroeService) {
    effect(() => {
      const term = this.filter().trim().toLowerCase();
      this.heroes.set(
        term ? this.service.searchByName(term) : this.service.heroes()
      );
    });
  }

  delete(id: number) {
    if (confirm('¿Estás seguro?')) this.service.delete(id);
  }

  onIconClick(event: { action: string; element: any }): void {
    console.log('Acción:', event.action);
    console.log('Elemento:', event.element);
  }
}
