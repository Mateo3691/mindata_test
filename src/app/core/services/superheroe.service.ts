import { Injectable, signal, computed, inject } from '@angular/core';
import { Superheroe } from '../models/superheroe.model';
import { MOCK_SUPERHEROES } from '../mocks/superheroes-mock';
import { LoaderService } from './loader.service';

@Injectable({ providedIn: 'root' })
export class SuperheroeService {
  private _heroes = signal<Superheroe[]>([...MOCK_SUPERHEROES]);
  private loader = inject(LoaderService);
  // aca simulo una tardanza en el "servicio" para podr mostrar el loader
  private simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  // la propiedad se va a actualizar cada vez que el signal _heroes cambie
  heroes = computed(() => this._heroes());

  async add(hero: Omit<Superheroe, 'id'>) {
    this.loader.show();
    await this.simulateDelay();
    this._heroes.update(list => [...list, { ...hero, id: list.length + 1 }]);
    this.loader.hide();
  }

  async update(updated: Superheroe) {
    this.loader.show();
    await this.simulateDelay();
    this._heroes.update(list =>
      list.map(hero => (hero.id === updated.id ? updated : hero))
    );
    this.loader.hide();
  }

  async delete(id: number) {
    this.loader.show();
    await this.simulateDelay();
    this._heroes.update(list => list.filter(h => h.id !== id));
    this.loader.hide();
  }

  async getById(id: number) {
    this.loader.show();
    await this.simulateDelay();
    const hero = this._heroes().find(h => h.id === id);
    this.loader.hide();
    return hero;
  }

  searchByName(term: string) {
    const results = this._heroes().filter(h =>
      h.nombre.toLowerCase().includes(term.toLowerCase())
    );
    return results;
  }
}
