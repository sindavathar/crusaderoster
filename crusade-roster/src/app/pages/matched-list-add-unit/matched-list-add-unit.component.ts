import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Faction } from '../../services/faction.model';

@Component({
  selector: 'app-matched-list-add-unit',
  templateUrl: './matched-list-add-unit.component.html',
  styleUrls: ['./matched-list-add-unit.component.css']
})
export class MatchedListAddUnitComponent implements OnInit {
  factionName: string = '';
  category: keyof Omit<Faction, 'name' | 'url'> = 'characters';
  listId: string = '';
  units: { name: string, url: string }[] = [];
  selectedUnits: { [key: string]: number } = {}; // Object to store the count of each unit added to the list

  constructor(private route: ActivatedRoute, private storageService: StorageService, private router: Router) {}

  ngOnInit() {
    this.factionName = this.route.snapshot.paramMap.get('faction') || '';
    this.category = this.route.snapshot.paramMap.get('category') as keyof Omit<Faction, 'name' | 'url'>;
    this.listId = this.route.snapshot.paramMap.get('listId') || '';
    this.loadUnits();
    this.loadSelectedUnits();
  }

  loadUnits() {
    const factions = this.storageService.getFactions();
    const faction = factions.find(f => f.name === this.factionName);
    if (faction) {
      this.units = faction[this.category] as { name: string, url: string }[];
    } else {
      this.units = [];
    }
  }

  loadSelectedUnits() {
    const listUnits = this.storageService.getUnitsForList(this.listId);
    this.selectedUnits = listUnits[this.category].reduce((acc, unit) => {
      acc[unit.name] = (acc[unit.name] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }

  addUnit(unit: { name: string, url: string }) {
    if (this.canAddUnit(unit.name)) {
      this.storageService.addUnitToList(this.listId, unit.name, unit.url, this.category);
      this.loadSelectedUnits();
    }
  }

  canAddUnit(unitName: string): boolean {
    const maxCounts: { [key in keyof Omit<Faction, 'name' | 'url'>]: number } = {
      characters: 3,
      battleline: 6,
      dedicatedTransports: Infinity,
      fortifications: 3,
      otherDatasheets: 3,
      detachments: Infinity
    };

    return (this.selectedUnits[unitName] || 0) < maxCounts[this.category];
  }
}