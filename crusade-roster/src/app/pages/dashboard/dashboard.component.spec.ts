import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [RouterTestingModule, FormsModule, MatSlideToggleModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to matched lists', () => {
    const navigateSpy = spyOn(component['router'], 'navigate');
    component.navigateTo('matched-lists');
    expect(navigateSpy).toHaveBeenCalledWith(['/matched-lists']);
  });

  it('should navigate to crusade lists', () => {
    const navigateSpy = spyOn(component['router'], 'navigate');
    component.navigateTo('crusade-lists');
    expect(navigateSpy).toHaveBeenCalledWith(['/crusade-lists']);
  });

  it('should add a matched list to localStorage', () => {
    component.isCrusadeList = false;
    component.listName = 'Test Matched List';
    component.onAddList();

    const localLists = JSON.parse(localStorage.getItem('angular17lists') || '{}');
    expect(localLists.matched).toContain('Test Matched List');
  });

  it('should add a crusade list to localStorage', () => {
    component.isCrusadeList = true;
    component.listName = 'Test Crusade List';
    component.onAddList();

    const localLists = JSON.parse(localStorage.getItem('angular17lists') || '{}');
    expect(localLists.crusade).toContain('Test Crusade List');
  });

  it('should rename a crusade list in localStorage', () => {
    const newName = 'Renamed Crusade List';
    component.isCrusadeList = true;
    component.crusadeLists = ['Test Crusade List'];
    spyOn(window, 'prompt').and.returnValue(newName);
    component.renameList('crusade', 0);

    const localLists = JSON.parse(localStorage.getItem('angular17lists') || '{}');
    expect(localLists.crusade).toContain(newName);
  });

  it('should delete a crusade list from localStorage', () => {
    component.isCrusadeList = true;
    component.crusadeLists = ['Test Crusade List'];
    component.deleteList('crusade', 0);

    const localLists = JSON.parse(localStorage.getItem('angular17lists') || '{}');
    expect(localLists.crusade).not.toContain('Test Crusade List');
  });

  it('should rename a matched list in localStorage', () => {
    const newName = 'Renamed Matched List';
    component.isCrusadeList = false;
    component.matchedLists = ['Test Matched List'];
    spyOn(window, 'prompt').and.returnValue(newName);
    component.renameList('matched', 0);

    const localLists = JSON.parse(localStorage.getItem('angular17lists') || '{}');
    expect(localLists.matched).toContain(newName);
  });

  it('should delete a matched list from localStorage', () => {
    component.isCrusadeList = false;
    component.matchedLists = ['Test Matched List'];
    component.deleteList('matched', 0);

    const localLists = JSON.parse(localStorage.getItem('angular17lists') || '{}');
    expect(localLists.matched).not.toContain('Test Matched List');
  });
});
