import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SuperheroesListComponent } from './superheroes-list.component';
import { SuperheroeService } from '../../../../core/services/superheroe.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Superheroe } from '../../../../core/models/superheroe.model';
import { DynamicTableComponent } from '../../../../shared/components/dynamic-table/dynamic-table.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { of } from 'rxjs';

describe('SuperheroesListComponent', () => {
  let component: SuperheroesListComponent;
  let fixture: ComponentFixture<SuperheroesListComponent>;
  let superheroeService: jasmine.SpyObj<SuperheroeService>;
  let matDialog: jasmine.SpyObj<MatDialog>;

  const mockHeroes: Superheroe[] = [
    { id: 1, nombre: 'Batman', poder: 'Dinero', origen: 'Gotham' },
    { id: 2, nombre: 'Superman', poder: 'Super fuerza', origen: 'Krypton' }
  ];

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const serviceSpy = jasmine.createSpyObj(
      'SuperheroeService',
      ['searchByName', 'delete', 'update', 'add'],
      { heroes: signal(mockHeroes) }
    );

    await TestBed.configureTestingModule({
      imports: [
        SuperheroesListComponent,
        MatDialogModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        DynamicTableComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: SuperheroeService, useValue: serviceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroesListComponent);
    component = fixture.componentInstance;
    superheroeService = TestBed.inject(SuperheroeService) as jasmine.SpyObj<SuperheroeService>;
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar todos los héroes si el filtro está vacío', () => {
    component.filter.set('');
    const result = component.heroes();
    expect(result.length).toBe(2);
  });

  it('debería filtrar héroes por nombre', () => {
    superheroeService.searchByName.and.returnValue([mockHeroes[0]]);
    component.filter.set('batman');
    const filtered = component.heroes();
    expect(filtered.length).toBe(1);
    expect(filtered[0].nombre).toBe('Batman');
  });

  it('no debería eliminar si el diálogo devuelve false', fakeAsync(() => {
    matDialog.open.and.returnValue({
      afterClosed: () => of(false)
    } as any);

    component.delete(mockHeroes[0]);
    tick();

    expect(matDialog.open).toHaveBeenCalled();
    expect(superheroeService.delete).not.toHaveBeenCalled();
  }));

  it('debería eliminar si el diálogo devuelve true', fakeAsync(() => {
    matDialog.open.and.returnValue({
      afterClosed: () => of(true)
    } as any);

    component.delete(mockHeroes[0]);
    tick();

    expect(superheroeService.delete).toHaveBeenCalledWith(mockHeroes[0].id);
  }));

  it('debería abrir diálogo para editar y llamar update si se devuelve un héroe', fakeAsync(() => {
    const updatedHero = { ...mockHeroes[0], poder: 'Tecnología' };
    matDialog.open.and.returnValue({
      afterClosed: () => of(updatedHero)
    } as any);

    component.openDialogToEdit(updatedHero);
    tick();

    expect(matDialog.open).toHaveBeenCalled();
    expect(superheroeService.update).toHaveBeenCalledWith(updatedHero);
  }));

  it('no debería llamar update si se cancela el diálogo de edición', fakeAsync(() => {
    matDialog.open.and.returnValue({
      afterClosed: () => of(null)
    } as any);

    component.openDialogToEdit(mockHeroes[0]);
    tick();

    expect(superheroeService.update).not.toHaveBeenCalled();
  }));

  it('debería abrir diálogo para crear y llamar add si se devuelve un nuevo héroe', fakeAsync(() => {
    const newHero = { nombre: 'Flash', poder: 'Velocidad', origen: 'Central City' };
    matDialog.open.and.returnValue({
      afterClosed: () => of(newHero)
    } as any);

    component.openDialogToCreate();
    tick();

    expect(superheroeService.add).toHaveBeenCalledWith(newHero);
  }));

  it('no debería llamar add si se cancela el diálogo de creación', fakeAsync(() => {
    matDialog.open.and.returnValue({
      afterClosed: () => of(null)
    } as any);

    component.openDialogToCreate();
    tick();

    expect(superheroeService.add).not.toHaveBeenCalled();
  }));

  it('debería manejar eventos del icono y delegar según el tipo de acción', fakeAsync(() => {
    const hero = mockHeroes[0];
    const editSpy = spyOn(component, 'openDialogToEdit');
    const deleteSpy = spyOn(component, 'delete');

    component.onIconClick({ action: 'editar', element: hero });
    expect(editSpy).toHaveBeenCalledWith(hero);

    component.onIconClick({ action: 'eliminar', element: hero });
    expect(deleteSpy).toHaveBeenCalledWith(hero);
  }));
});
