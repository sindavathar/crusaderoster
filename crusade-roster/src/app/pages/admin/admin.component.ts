import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Faction } from '../../services/faction.model'; // Import the interface

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  factions: Faction[] = [];
  newFactionName: string = '';
  newDetachmentName: string = '';
  newUnitName: string = '';
  selectedFaction: Faction | null = null;
  selectedCategory: keyof Faction | '' = '';
  categories: (keyof Faction)[] = ['detachments', 'characters', 'battleline', 'dedicatedTransports', 'otherDatasheets']; // Define categories here

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadFactions();
  }

  loadFactions() {
    this.factions = this.storageService.getFactions();
  }

  addFaction() {
    if (this.newFactionName) {
      this.storageService.addFaction(this.newFactionName);
      this.newFactionName = '';
      this.loadFactions();
      // Keep the newly added faction selected
      this.selectedFaction = this.factions.find(f => f.name === this.newFactionName) || null;
    }
  }

  renameFaction(faction: Faction) {
    const newName = prompt('Enter new name for the faction', faction.name);
    if (newName && newName !== faction.name) {
      this.storageService.renameFaction(faction.name, newName);
      this.loadFactions();
      this.selectedFaction = this.factions.find(f => f.name === newName) || null;
    }
  }

  deleteFaction(faction: Faction) {
    if (confirm(`Are you sure you want to delete the faction ${faction.name}?`)) {
      this.storageService.deleteFaction(faction.name);
      this.loadFactions();
      this.selectedFaction = null;
    }
  }

  addUnit(faction: Faction, category: keyof Faction) {
    if (this.newUnitName) {
      this.storageService.addUnit(faction.name, category, this.newUnitName);
      this.newUnitName = '';
      this.loadFactions();
      // Keep the selected faction and category after adding a unit
      this.selectedFaction = this.factions.find(f => f.name === faction.name) || null;
      this.selectedCategory = category;
    }
  }

  renameUnit(faction: Faction, category: keyof Faction, unitName: string) {
    const newName = prompt('Enter new name for the unit', unitName);
    if (newName && newName !== unitName) {
      this.storageService.renameUnit(faction.name, category, unitName, newName);
      this.loadFactions();
      // Keep the selected faction and category after renaming a unit
      this.selectedFaction = this.factions.find(f => f.name === faction.name) || null;
      this.selectedCategory = category;
    }
  }

  deleteUnit(faction: Faction, category: keyof Faction, unitName: string) {
    if (confirm(`Are you sure you want to delete ${unitName}?`)) {
      this.storageService.deleteUnit(faction.name, category, unitName);
      this.loadFactions();
      // Keep the selected faction and category after deleting a unit
      this.selectedFaction = this.factions.find(f => f.name === faction.name) || null;
      this.selectedCategory = category;
    }
  }

  toggleFaction(faction: Faction) {
    this.selectedFaction = this.selectedFaction === faction ? null : faction;
  }

  toggleCategory(faction: Faction, category: keyof Faction) {
    if (this.selectedFaction === faction && this.selectedCategory === category) {
      this.selectedCategory = '';
    } else {
      this.selectedFaction = faction;
      this.selectedCategory = category;
    }
  }

  getUnits(faction: Faction, category: keyof Faction): string[] {
    return faction[category] as string[];
  }
}
