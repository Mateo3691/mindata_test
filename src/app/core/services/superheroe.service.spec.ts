import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SuperheroeService } from './superheroe.service';
import { Superheroe } from '../models/superheroe.model';
import { LoaderService } from './loader.service';

describe('SuperheroeService', () => {
  let service: SuperheroeService;
  let loader: jasmine.SpyObj<LoaderService>;

  const mockHeroes: Superheroe[] = [
    { id: 1, nombre: 'Batman', poder: 'Inteligencia', origen: 'Gotham' },
    { id: 2, nombre: 'Flash', poder: 'Velocidad', origen: 'Central City' }
  ];

  beforeEach(() => {
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        SuperheroeService,
        { provide: LoaderService, useValue: loaderSpy }
      ]
    });

    service = TestBed.inject(SuperheroeService);
    loader = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
    (service as any)._heroes.set([...mockHeroes]);
  });

  it('debería instanciar el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería ejecutar métodos del servicio', () => {
    service.searchByName('batman');
    service.add({ nombre: 'Flash', poder: 'Velocidad', origen: 'Central City' });
    service.update({ id: 1, nombre: 'Batman', poder: 'Tecnología', origen: 'Gotham' });
    service.delete(1);
    expect(service.heroes()).toBeTruthy();
  });

  it('heroes() debería reflejar el estado actual', () => {
    const current = service.heroes();
    expect(current.length).toBe(2);
    expect(current[0].nombre).toBe('Batman');
  });

  it('debería agregar un nuevo héroe', fakeAsync(() => {
    const nuevo: Omit<Superheroe, 'id'> = {
      nombre: 'Wonder Woman',
      poder: 'Fuerza',
      origen: 'Themyscira'
    };

    service.add(nuevo);
    tick(1000);

    const resultado = service.heroes();
    expect(resultado.length).toBe(3);
    expect(resultado[2].nombre).toBe('Wonder Woman');
    expect(loader.show).toHaveBeenCalled();
    expect(loader.hide).toHaveBeenCalled();
  }));

  it('debería actualizar un héroe existente', fakeAsync(() => {
    const actualizado: Superheroe = {
      id: 1,
      nombre: 'Batman',
      poder: 'Tecnología',
      origen: 'Gotham'
    };

    service.update(actualizado);
    tick(1000);

    const resultado = service.heroes();
    expect(resultado[0].poder).toBe('Tecnología');
  }));

  it('no debería modificar si actualiza un héroe inexistente', fakeAsync(() => {
    const noExistente: Superheroe = {
      id: 999,
      nombre: 'Ghost',
      poder: 'Invisible',
      origen: 'Nowhere'
    };

    service.update(noExistente);
    tick(1000);

    const resultado = service.heroes();
    expect(resultado.length).toBe(2);
    expect(resultado.find(h => h.id === 999)).toBeUndefined();
  }));

  it('debería eliminar un héroe por id', fakeAsync(() => {
    service.delete(2);
    tick(1000);

    const resultado = service.heroes();
    expect(resultado.length).toBe(1);
    expect(resultado.find(h => h.id === 2)).toBeUndefined();
  }));

  it('no debería modificar nada si intenta eliminar un héroe inexistente', fakeAsync(() => {
    service.delete(999);
    tick(1000);

    const resultado = service.heroes();
    expect(resultado.length).toBe(2);
  }));

  it('debería retornar héroe por id', fakeAsync(() => {
    let hero: Superheroe | undefined;

    service.getById(1).then(h => hero = h);
    tick(1000);

    expect(hero?.id).toBe(1);
  }));

  it('debería retornar undefined si el héroe no existe', fakeAsync(() => {
    let hero: Superheroe | undefined;

    service.getById(999).then(h => hero = h);
    tick(1000);

    expect(hero).toBeUndefined();
  }));

  it('debería filtrar héroes por nombre (sin coincidencia)', () => {
    const resultados = service.searchByName('no-existe');
    expect(resultados.length).toBe(0);
  });

  it('debería filtrar héroes por nombre (múltiples coincidencias)', () => {
    (service as any)._heroes.set([
      ...mockHeroes,
      { id: 3, nombre: 'Batgirl', poder: 'Agilidad', origen: 'Gotham' }
    ]);

    const resultados = service.searchByName('bat');
    expect(resultados.length).toBe(2);
    expect(resultados[0].nombre.toLowerCase()).toContain('bat');
    expect(resultados[1].nombre.toLowerCase()).toContain('bat');
  });
});
