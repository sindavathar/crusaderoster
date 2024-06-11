import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Faction } from '../../services/faction.model'; // Import the interface
import { UnitDetailsService } from '../../services/unit-details.service'; // Import the UnitDetailsService
import axios from 'axios';

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
  importUrl: string = '';
  unitImportUrl: string = '';
  categories: (keyof Faction)[] = ['detachments', 'characters', 'battleline', 'dedicatedTransports', 'fortifications', 'otherDatasheets']; // Define categories here

  constructor(private storageService: StorageService, private unitDetailsService: UnitDetailsService) {}

  ngOnInit(): void {
    this.loadFactions();
  }

  loadFactions() {
    this.factions = this.storageService.getFactions();
  }

  addFaction() {
    if (this.newFactionName) {
      this.storageService.addFaction(this.newFactionName, '');
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
      this.storageService.addUnit(faction.name, category, this.newUnitName, '');
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
      this.storageService.renameUnit(faction.name, category, unitName, newName, '');
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

  getUnits(faction: Faction, category: keyof Faction): { name: string, url: string }[] {
    return faction[category] as { name: string, url: string }[];
  }

  async importFactions() {
    if (this.importUrl) {
      try {
        const response = await axios.get(`http://localhost:3000/proxy?url=${encodeURIComponent(this.importUrl)}`);
        const content = response.data;
        const regex = /<a href="\/wh40k10ed\/factions\/[^"]+"[^>]*>([^<]+)<\/a>/g;
        let match;
        const factionNames: string[] = [];

        while ((match = regex.exec(content)) !== null) {
          const factionName = match[1].trim();
          if (!this.factions.find(f => f.name === factionName)) {
            factionNames.push(factionName);
          }
        }

        for (const factionName of factionNames) {
          this.storageService.addFaction(factionName, '');
        }

        this.loadFactions();
        alert('Factions imported successfully!');
      } catch (error) {
        console.error('Error importing factions:', error);
        alert('Error importing factions. Please check the console for details.');
      }
    }
  }

  async importUnits(faction: Faction) {
    if (this.unitImportUrl) {
      try {
        const response = await axios.get(`http://localhost:3000/proxy?url=${encodeURIComponent(this.unitImportUrl)}`);
        const content = response.data;

        // Regex to match each category and its units
        const categoryRegex = /<div class="i5 ArmyType_line "><span class="contentColor"><b class="BatRole">([^<]+)<\/b><\/span><\/div>(.*?)<div style="margin-bottom:8px;">/gs;
        const unitRegex = /<div class="i15 ArmyType_line [^"]*"[^>]*>.*?<a href="([^"]+)" class="contentColor"[^>]*>([^<]+)<\/a><\/div>/g;

        const categoryMapping: { [key: string]: keyof Faction } = {
          'Characters': 'characters',
          'Battleline': 'battleline',
          'Dedicated Transports': 'dedicatedTransports',
          'Fortifications': 'fortifications',
          'Other': 'otherDatasheets'
        };

        const categories = [...content.matchAll(categoryRegex)];

        if (categories.length > 0) {
          for (const categoryMatch of categories) {
            const categoryName = categoryMatch[1].trim();
            const categoryKey = categoryMapping[categoryName] || null;
            const categoryContent = categoryMatch[2];
            if (categoryKey && this.categories.includes(categoryKey)) {
              let unitMatch;
              while ((unitMatch = unitRegex.exec(categoryContent)) !== null) {
                if (!unitMatch[0].includes('sLegendary')) {
                  const unitUrl = `https://wahapedia.ru${unitMatch[1].trim()}`;
                  const unitName = unitMatch[2].trim();
                  if (!this.unitExists(faction, categoryKey, unitName)) {
                    this.storageService.addUnit(faction.name, categoryKey, unitName, unitUrl);
                    console.log(`Added ${categoryKey}: ${unitName}`);
                  } else {
                    console.log(`${categoryKey} already exists: ${unitName}`);
                  }
                  // New function call to import unit details
                  await this.unitDetailsService.importUnitDetails(unitUrl, unitName); // Pass the name
                }
              }
            }
          }
          this.loadFactions();
          alert('Units imported successfully!');
        } else {
          console.log('No categories found.');
          alert('No categories found.');
        }
      } catch (error) {
        console.error('Error importing units:', error);
        alert('Error importing units. Please check the console for details.');
      }
    }
  }

  unitExists(faction: Faction, category: keyof Faction, unitName: string): boolean {
    const units = this.storageService.getFactions().find(f => f.name === faction.name)?.[category];
    if (Array.isArray(units)) {
      return units.some((unit: { name: string }) => unit.name === unitName);
    }
    return false;
  }
}
