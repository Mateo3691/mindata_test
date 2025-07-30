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

  it('debería filtrar héroes por nombre', () => {
    superheroeService.searchByName.and.returnValue([mockHeroes[0]]);
    component.filter.set('batman');

    const filtered = component.heroes();
    expect(filtered.length).toBe(1);
    expect(filtered[0].nombre).toBe('Batman');
  });

  it('debería abrir diálogo para eliminar y llamar delete en servicio si se confirma', fakeAsync(() => {
    matDialog.open.and.returnValue({
      afterClosed: () => of(true)
    } as any);

    const hero = mockHeroes[0];
    component.delete(hero);

    tick();
    expect(matDialog.open).toHaveBeenCalled();
    expect(superheroeService.delete).toHaveBeenCalledWith(hero.id);
  }));

  it('debería abrir diálogo para editar y llamar update si se devuelve un héroe', fakeAsync(() => {
    const editedHero: Superheroe = { id: 1, nombre: 'Batman', poder: 'Tecnología', origen: 'Gotham' };

    matDialog.open.and.returnValue({
      afterClosed: () => of(editedHero)
    } as any);

    component.openDialogToEdit(editedHero);

    tick();
    expect(matDialog.open).toHaveBeenCalled();
    expect(superheroeService.update).toHaveBeenCalledWith(editedHero);
  }));

  it('debería abrir diálogo para crear y llamar add si se devuelve un héroe', fakeAsync(() => {
    const newHero: Omit<Superheroe, 'id'> = { nombre: 'Flash', poder: 'Velocidad', origen: 'Central City' };

    matDialog.open.and.returnValue({
      afterClosed: () => of(newHero)
    } as any);

    component.openDialogToCreate();

    tick();
    expect(matDialog.open).toHaveBeenCalled();
    expect(superheroeService.add).toHaveBeenCalledWith(newHero);
  }));
});
