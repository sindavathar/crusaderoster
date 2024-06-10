import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Faction } from '../../services/faction.model';

interface ListItem {
  id: string;
  name: string;
}

@Component({
  selector: 'app-matched-list',
  templateUrl: './matched-list.component.html',
  styleUrls: ['./matched-list.component.css']
})
export class MatchedListComponent implements OnInit {
  listName: string = '';
  factionName: string = '';
  listId: string = '';
  units: { [key in keyof Omit<Faction, 'name' | 'url'>]: { name: string; url: string }[] } = {
    detachments: [],
    characters: [],
    battleline: [],
    dedicatedTransports: [],
    fortifications: [],
    otherDatasheets: []
  };
  categories: (keyof Omit<Faction, 'name' | 'url'>)[] = ['detachments', 'characters', 'battleline', 'dedicatedTransports', 'fortifications', 'otherDatasheets'];

  constructor(private route: ActivatedRoute, private storageService: StorageService, private router: Router) {}

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id') || '';
    this.loadUnits();
  }

  loadUnits() {
    this.units = this.storageService.getUnitsForList(this.listId);
    const lists = this.storageService.getLists();
    const list = lists.matched.find((list: ListItem) => list.id === this.listId) || lists.crusade.find((list: ListItem) => list.id === this.listId);
    if (list) {
      this.listName = list.name.split('|')[0];
      this.factionName = list.name.split('(')[1].split(')')[0];
    } else {
      console.error(`List ${this.listId} not found`);
    }
  }

  addUnitToCategory(category: keyof Omit<Faction, 'name' | 'url'>) {
    this.router.navigate(['/matched-list-add-unit', this.factionName, category, this.listId]);
  }

  removeUnitFromCategory(category: keyof Omit<Faction, 'name' | 'url'>, unitName: string) {
    this.storageService.removeUnitFromList(this.listId, unitName, category);
    this.loadUnits(); // Refresh the list after removing the unit
  }
}
