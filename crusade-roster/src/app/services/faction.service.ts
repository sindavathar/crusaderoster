import { Injectable } from '@angular/core';
import { Faction } from './faction.model';

@Injectable({
  providedIn: 'root'
})
export class FactionService {
  private factionsKey = 'angular17factions';

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
}
