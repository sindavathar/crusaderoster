import { Injectable } from '@angular/core';
import { Faction } from './faction.model';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private storageKey = 'angular17lists';

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

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
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
}
