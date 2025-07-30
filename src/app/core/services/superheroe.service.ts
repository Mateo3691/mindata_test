import { Injectable, signal, computed } from '@angular/core';
import { Superheroe } from '../models/superheroe.model';
import { MOCK_SUPERHEROES } from '../mocks/superheroes-mock';

@Injectable({ providedIn: 'root' })
export class SuperheroeService {
  private idCounter = 1;
  private _heroes = signal<Superheroe[]>([...MOCK_SUPERHEROES]);

  heroes = computed(() => this._heroes());

  add(hero: Omit<Superheroe, 'id'>) {
    this._heroes.update(list => [...list, { ...hero, id: this.idCounter++ }]);
  }

  update(updated: Superheroe) {
    this._heroes.update(list =>
      list.map(hero => (hero.id === updated.id ? updated : hero))
    );
  }

  delete(id: number) {
    this._heroes.update(list => list.filter(h => h.id !== id));
  }

  getById(id: number) {
    return this._heroes().find(h => h.id === id);
  }

  searchByName(term: string) {
    return this._heroes().filter(h =>
      h.nombre.toLowerCase().includes(term.toLowerCase())
    );
  }
}
