import { Injectable } from '@angular/core';
import { Faction } from './faction.model'; // Import the interface
import { UnitDetailsService } from './unit-details.service';
import {UnitDetails} from "./unit-import/unit-details.model"; // Import the UnitDetailsService

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private factionsKey = 'angular17factions';
  private storageKey = 'angular17lists';

  constructor(private unitDetailsService: UnitDetailsService) {} // Inject the UnitDetailsService

  getFactions(): Faction[] {
    const localFactions = localStorage.getItem(this.factionsKey);
    return localFactions ? JSON.parse(localFactions).sort((a: Faction, b: Faction) => a.name.localeCompare(b.name)) : [];
  }

  saveFactions(factions: Faction[]): void {
    factions.sort((a: Faction, b: Faction) => a.name.localeCompare(b.name));
    localStorage.setItem(this.factionsKey, JSON.stringify(factions));
  }

  addFaction(factionName: string, factionUrl: string): void {
    const factions = this.getFactions();
    factions.push({
      name: factionName,
      detachments: [],
      characters: [],
      battleline: [],
      dedicatedTransports: [],
      fortifications: [],
      otherDatasheets: []
    });
    this.saveFactions(factions);
  }

  renameFaction(oldName: string, newName: string): void {
    const factions = this.getFactions();
    const faction = factions.find(f => f.name === oldName);
    if (faction) {
      faction.name = newName;
      this.saveFactions(factions);
    } else {
      console.error(`Faction ${oldName} not found`);
    }
  }

  deleteFaction(factionName: string): void {
    let factions = this.getFactions();
    factions = factions.filter(f => f.name !== factionName);
    this.saveFactions(factions);
  }

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

  getUnitsForList(listId: string): { [key in keyof Omit<Faction, 'name' | 'url'>]: { name: string; url: string }[] } {
    const listUnits = localStorage.getItem(`units_${listId}`);
    return listUnits ? JSON.parse(listUnits) : { detachments: [], characters: [], battleline: [], dedicatedTransports: [], fortifications: [], otherDatasheets: [] };
  }

  addUnitToList(listId: string, unitName: string, unitUrl: string, category: keyof Omit<Faction, 'name' | 'url'>): void {
    const units = this.getUnitsForList(listId);
    const unit = { name: unitName, url: unitUrl };
    if (!units[category].some(u => u.name === unitName)) { // Check if unit already exists
      units[category].push(unit);
      localStorage.setItem(`units_${listId}`, JSON.stringify(units));
    }
  }

  removeUnitFromList(listId: string, unitName: string, category: keyof Omit<Faction, 'name' | 'url'>): void {
    const units = this.getUnitsForList(listId);
    const index = units[category].findIndex(unit => unit.name === unitName);
    if (index !== -1) {
      units[category].splice(index, 1);
      localStorage.setItem(`units_${listId}`, JSON.stringify(units));
    }
  }

  getLists(): { matched: { id: string, name: string }[], crusade: { id: string, name: string }[] } {
    const localLists = localStorage.getItem(this.storageKey);
    return localLists ? JSON.parse(localLists) : { matched: [], crusade: [] };
  }

  saveLists(lists: { matched: { id: string, name: string }[], crusade: { id: string, name: string }[] }): void {
    localStorage.setItem(this.storageKey, JSON.stringify(lists));
  }

  addList(type: 'matched' | 'crusade', listName: string, faction: string, detachment: string, points: string | number): void {
    const lists = this.getLists();
    const newList = { id: this.generateUUID(), name: `${listName} (${faction}) - ${points} points|${detachment}` };
    lists[type].push(newList);
    lists[type].sort((a, b) => a.name.localeCompare(b.name));
    this.saveLists(lists);
  }

  renameList(type: 'matched' | 'crusade', index: number, newName: string): void {
    const lists = this.getLists();
    lists[type][index].name = newName;
    lists[type].sort((a, b) => a.name.localeCompare(b.name));
    this.saveLists(lists);
  }

  deleteList(type: 'matched' | 'crusade', index: number): void {
    const lists = this.getLists();
    lists[type].splice(index, 1);
    this.saveLists(lists);
  }

  // Method to save unit details using UnitDetailsService
  saveUnitDetails(unitName: string, unitDetails: UnitDetails): void {
    this.unitDetailsService.saveUnitDetails(unitName, unitDetails);
  }

  // Method to get unit details using UnitDetailsService
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
