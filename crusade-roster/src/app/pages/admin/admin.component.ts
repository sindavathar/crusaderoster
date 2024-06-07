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
  newUnitName: string = '';
  selectedFaction: Faction | null = null;
  selectedCategory: keyof Faction | '' = '';
  categories: (keyof Faction)[] = ['characters', 'battleline', 'dedicatedTransports', 'otherDatasheets']; // Define categories here

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
    }
  }

  addUnit(faction: Faction, category: keyof Faction) {
    if (this.newUnitName) {
      this.storageService.addUnit(faction.name, category, this.newUnitName);
      this.newUnitName = '';
      this.loadFactions();
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
