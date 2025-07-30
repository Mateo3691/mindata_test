import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperheroesListComponent } from './superheroes-list.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SuperheroeService } from '../../../../core/services/superheroe.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Superheroe } from '../../../../core/models/superheroe.model';
import { of } from 'rxjs';

describe('SuperheroesListComponent', () => {
  let component: SuperheroesListComponent;
  let fixture: ComponentFixture<SuperheroesListComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let serviceSpy: jasmine.SpyObj<SuperheroeService>;

  const mockHero: Superheroe = {
    id: 1,
    nombre: 'Batman',
    poder: 'Dinero',
    origen: 'Gotham'
  };

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    serviceSpy = jasmine.createSpyObj('SuperheroeService', ['add', 'update', 'delete', 'searchByName', 'heroes'], {
      heroes: () => [mockHero]
    });

    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [SuperheroesListComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: SuperheroeService, useValue: serviceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería abrir el diálogo de creación y llamar a add si hay resultado', () => {
    const result = { nombre: 'Nuevo Héroe', poder: 'Velocidad', origen: 'Tierra' };
    dialogSpy.open.and.returnValue({ afterClosed: () => of(result) } as any);
    component.openDialogToCreate();
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(serviceSpy.add).toHaveBeenCalledWith(result);
  });

  it('debería abrir el diálogo de edición y llamar a update si hay resultado', () => {
    const updatedHero = { ...mockHero, nombre: 'Batman Updated' };
    dialogSpy.open.and.returnValue({ afterClosed: () => of(updatedHero) } as any);
    component.openDialogToEdit(mockHero);
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(serviceSpy.update).toHaveBeenCalledWith(updatedHero);
  });

  it('debería abrir el diálogo de confirmación y llamar a delete si se confirma', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as any);
    component.delete(mockHero);
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(serviceSpy.delete).toHaveBeenCalledWith(mockHero.id);
  });

  it('debería reaccionar a iconClick con acción editar', () => {
    spyOn(component, 'openDialogToEdit');
    component.onIconClick({ action: 'editar', element: mockHero });
    expect(component.openDialogToEdit).toHaveBeenCalledWith(mockHero);
  });

  it('debería reaccionar a iconClick con acción eliminar', () => {
    spyOn(component, 'delete');
    component.onIconClick({ action: 'eliminar', element: mockHero });
    expect(component.delete).toHaveBeenCalledWith(mockHero);
  });

  it('debería actualizar el filtro', () => {
    component.filter.set('batman');
    expect(component.filter()).toBe('batman');
  });
});
