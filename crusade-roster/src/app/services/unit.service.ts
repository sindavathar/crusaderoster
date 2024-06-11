import { Injectable } from '@angular/core';
import { Faction } from './faction.model';
import { UnitDetailsService } from './unit-details.service';
import { UnitDetails } from './unit-details.model';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  constructor(private unitDetailsService: UnitDetailsService) {} // Inject the UnitDetailsService

  addUnit(factionName: string, category: keyof Faction, unitName: string, unitUrl: string): void {
    const factions = this.getFactions();
    const faction = factions.find(f => f.name === factionName);
    if (faction && faction[category] !== undefined) {
      const unit = { name: unitName, url: unitUrl };
      const units = faction[category] as { name: string; url: string }[];
      if (!units.some(u => u.name === unitName)) { // Check if unit already exists
        units.push(unit);
        units.sort((a, b) => a.name.localeCompare(b.name));
        this.saveFactions(factions);
      }
    } else {
      console.error(`Category ${category} not found in faction ${factionName}`);
    }
  }

  renameUnit(factionName: string, category: keyof Faction, oldUnitName: string, newUnitName: string, newUnitUrl: string): void {
    const factions = this.getFactions();
    const faction = factions.find(f => f.name === factionName);
    if (faction && faction[category] !== undefined) {
      const units = faction[category] as { name: string; url: string }[];
      const index = units.findIndex(unit => unit.name === oldUnitName);
      if (index !== -1) {
        units[index] = { name: newUnitName, url: newUnitUrl };
        units.sort((a, b) => a.name.localeCompare(b.name));
        this.saveFactions(factions);
      }
    } else {
      console.error(`Category ${category} not found in faction ${factionName}`);
    }
  }

  deleteUnit(factionName: string, category: keyof Faction, unitName: string): void {
    const factions = this.getFactions();
    const faction = factions.find(f => f.name === factionName);
    if (faction && faction[category] !== undefined) {
      const units = faction[category] as { name: string; url: string }[];
      const index = units.findIndex(unit => unit.name === unitName);
      if (index !== -1) {
        units.splice(index, 1);
        this.saveFactions(factions);
      }
    } else {
      console.error(`Category ${category} not found in faction ${factionName}`);
    }
  }

  // Method to save unit details using UnitDetailsService
  saveUnitDetails(unitName: string, unitDetails: UnitDetails): void {
    this.unitDetailsService.saveUnitDetails(unitName, unitDetails);
  }

  // Method to get unit details using UnitDetailsService
  getUnitDetails(unitName: string): UnitDetails | null {
    return this.unitDetailsService.getUnitDetails(unitName);
  }

  private getFactions(): Faction[] {
    const localFactions = localStorage.getItem('angular17factions');
    return localFactions ? JSON.parse(localFactions).sort((a: Faction, b: Faction) => a.name.localeCompare(b.name)) : [];
  }

  private saveFactions(factions: Faction[]): void {
    factions.sort((a: Faction, b: Faction) => a.name.localeCompare(b.name));
    localStorage.setItem('angular17factions', JSON.stringify(factions));
  }
}
