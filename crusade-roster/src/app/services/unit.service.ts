import { Injectable } from '@angular/core';
import { Faction } from './faction.model';
import { UnitDetailsService } from './unit-details.service';
import { UnitDetails } from './unit-details.model';
import { Unit } from './unit.model'; // Import the Unit interface

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  constructor(private unitDetailsService: UnitDetailsService) {} // Inject the UnitDetailsService

  getUnitsForList(listId: string): { [key in keyof Omit<Faction, 'name' | 'url'>]: Unit[] } {
    const listUnits = localStorage.getItem(`units_${listId}`);
    return listUnits ? JSON.parse(listUnits) : { detachments: [], characters: [], battleline: [], dedicatedTransports: [], fortifications: [], otherDatasheets: [] };
  }

  addUnitToList(listId: string, unitName: string, unitUrl: string, category: keyof Omit<Faction, 'name' | 'url'>): void {
    const units = this.getUnitsForList(listId);
    const unit: Unit = { name: unitName, url: unitUrl, id: this.generateUUID() }; // Add id property here
    units[category].push(unit);
    localStorage.setItem(`units_${listId}`, JSON.stringify(units));
  }

  removeUnitFromList(listId: string, unitId: string, category: keyof Omit<Faction, 'name' | 'url'>): void {
    const units = this.getUnitsForList(listId);
    const index = units[category].findIndex(unit => unit.id === unitId); // Use id property here
    if (index !== -1) {
      units[category].splice(index, 1);
      localStorage.setItem(`units_${listId}`, JSON.stringify(units));
    }
  }

  saveUnitDetails(unitName: string, unitDetails: UnitDetails): void {
    this.unitDetailsService.saveUnitDetails(unitName, unitDetails);
  }

  getUnitDetails(unitName: string): UnitDetails | null {
    return this.unitDetailsService.getUnitDetails(unitName);
  }

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
