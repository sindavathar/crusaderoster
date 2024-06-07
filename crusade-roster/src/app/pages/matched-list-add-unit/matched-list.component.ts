import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../services/storage.service'; // Import the service
import { Faction } from '../../services/faction.model'; // Import the interface

@Component({
  selector: 'app-matched-list',
  templateUrl: './matched-list.component.html',
  styleUrls: ['./matched-list.component.css']
})
export class MatchedListComponent implements OnInit {
  listName: string = '';
  faction: Faction | null = null;
  categories: (keyof Faction)[] = ['characters', 'battleline', 'dedicatedTransports', 'otherDatasheets'];

  constructor(private route: ActivatedRoute, private storageService: StorageService) {}

  ngOnInit() {
    const listDetails = this.route.snapshot.paramMap.get('name') || '';
    const factionName = listDetails.split(' (')[1].split(')')[0]; // Extract the faction name from the list name
    this.faction = this.storageService.getFactions().find(f => f.name === factionName) || null;
    this.listName = listDetails.split(' - ')[0]; // Extract the list name
  }

  getUnits(category: keyof Faction): string[] {
    return this.faction ? (this.faction[category] as string[]) : [];
  }

  addUnitToCategory(category: keyof Faction) {
    const unitName = prompt(`Enter new unit name for ${category}`);
    if (unitName && this.faction) {
      this.storageService.addUnit(this.faction.name, category, unitName);
      // Refresh the faction data after adding the unit
      this.faction = this.storageService.getFactions().find(f => f.name === this.faction!.name) || null;
    }
  }
}
