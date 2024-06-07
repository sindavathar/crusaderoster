import { Injectable } from '@angular/core';
import { Faction } from './faction.model'; // Import the interface

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storageKey = 'angular17lists';
  private factionsKey = 'angular17factions';

  getLists(): { matched: string[], crusade: string[] } {
    const localLists = localStorage.getItem(this.storageKey);
    return localLists ? JSON.parse(localLists) : { matched: [], crusade: [] };
  }

  saveLists(lists: { matched: string[], crusade: string[] }): void {
    localStorage.setItem(this.storageKey, JSON.stringify(lists));
  }

  addList(type: 'matched' | 'crusade', listName: string, faction: string, detachment: string, points: string | number): void {
    const lists = this.getLists();
    lists[type].push(`${listName} (${faction}) - ${points} points|${detachment}`);
    lists[type].sort();
    this.saveLists(lists);
  }

  renameList(type: 'matched' | 'crusade', index: number, newName: string): void {
    const lists = this.getLists();
    lists[type][index] = newName;
    lists[type].sort();
    this.saveLists(lists);
  }

  deleteList(type: 'matched' | 'crusade', index: number): void {
    const lists = this.getLists();
    lists[type].splice(index, 1);
    this.saveLists(lists);
  }

  getFactions(): Faction[] {
    const localFactions = localStorage.getItem(this.factionsKey);
    return localFactions ? JSON.parse(localFactions).sort((a: Faction, b: Faction) => a.name.localeCompare(b.name)) : [];
  }

  saveFactions(factions: Faction[]): void {
    factions.sort((a: Faction, b: Faction) => a.name.localeCompare(b.name));
    localStorage.setItem(this.factionsKey, JSON.stringify(factions));
  }

  addFaction(factionName: string): void {
    const factions = this.getFactions();
    factions.push({
      name: factionName,
      detachments: [],
      characters: [],
      battleline: [],
      dedicatedTransports: [],
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

  addUnit(factionName: string, category: keyof Faction, unitName: string): void {
    const factions = this.getFactions();
    const faction = factions.find(f => f.name === factionName);
    if (faction && faction[category] !== undefined) {
      (faction[category] as string[]).push(unitName);
      (faction[category] as string[]).sort();
      this.saveFactions(factions);
    } else {
      console.error(`Category ${category} not found in faction ${factionName}`);
    }
  }

  renameUnit(factionName: string, category: keyof Faction, oldUnitName: string, newUnitName: string): void {
    const factions = this.getFactions();
    const faction = factions.find(f => f.name === factionName);
    if (faction && faction[category] !== undefined) {
      const units = faction[category] as string[];
      const index = units.indexOf(oldUnitName);
      if (index !== -1) {
        units[index] = newUnitName;
        units.sort();
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
      const units = faction[category] as string[];
      const index = units.indexOf(unitName);
      if (index !== -1) {
        units.splice(index, 1);
        this.saveFactions(factions);
      }
    } else {
      console.error(`Category ${category} not found in faction ${factionName}`);
    }
  }
}
