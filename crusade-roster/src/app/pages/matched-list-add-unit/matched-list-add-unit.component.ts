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
  category: keyof Omit<Faction, 'name'> = 'characters';
  listId: string = '';
  units: string[] = [];
  selectedUnits: { [key: string]: number } = {}; // Object to store the count of each unit added to the list

  constructor(private route: ActivatedRoute, private storageService: StorageService, private router: Router) {}

  ngOnInit() {
    this.factionName = this.route.snapshot.paramMap.get('faction') || '';
    this.category = this.route.snapshot.paramMap.get('category') as keyof Omit<Faction, 'name'>;
    this.listId = this.route.snapshot.paramMap.get('listId') || '';
    this.loadUnits();
    this.loadSelectedUnits();
  }

  loadUnits() {
    const factions = this.storageService.getFactions();
    const faction = factions.find(f => f.name === this.factionName);
    if (faction) {
      this.units = faction[this.category] as string[];
    } else {
      this.units = [];
    }
  }

  loadSelectedUnits() {
    const listUnits = this.storageService.getUnitsForList(this.listId);
    this.selectedUnits = listUnits[this.category].reduce((acc, unit) => {
      acc[unit] = (acc[unit] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }

  addUnit(unit: string) {
    if (this.canAddUnit(unit)) {
      this.storageService.addUnitToList(this.listId, unit, this.category);
      this.loadSelectedUnits();
    }
  }

  canAddUnit(unit: string): boolean {
    const maxCounts: { [key in keyof Omit<Faction, 'name'>]: number } = {
      characters: 3,
      battleline: 6,
      dedicatedTransports: Infinity,
      otherDatasheets: 3,
      detachments: Infinity
    };

    return (this.selectedUnits[unit] || 0) < maxCounts[this.category];
  }
}
