import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Faction } from '../../services/faction.model';

@Component({
  selector: 'app-matched-list',
  templateUrl: './matched-list.component.html',
  styleUrls: ['./matched-list.component.css']
})
export class MatchedListComponent implements OnInit {
  listId: string = '';
  listName: string = '';
  factionName: string = '';
  units: { [key in keyof Omit<Faction, 'name'>]: string[] } = {
    detachments: [],
    characters: [],
    battleline: [],
    dedicatedTransports: [],
    otherDatasheets: []
  };
  categories: (keyof Omit<Faction, 'name'>)[] = ['detachments', 'characters', 'battleline', 'dedicatedTransports', 'otherDatasheets'];

  constructor(private route: ActivatedRoute, private storageService: StorageService, private router: Router) {}

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id') || '';
    this.loadListDetails();
    this.loadUnits();
  }

  loadListDetails() {
    const lists = this.storageService.getLists();
    const allLists = [...lists.matched, ...lists.crusade];
    const list = allLists.find(list => list.id === this.listId);
    if (list) {
      this.listName = list.name;
      this.factionName = list.name.split('(')[1].split(')')[0];
    } else {
      console.error(`List ${this.listId} not found`);
    }
  }

  loadUnits() {
    this.units = this.storageService.getUnitsForList(this.listId);
  }

  addUnitToCategory(category: keyof Omit<Faction, 'name'>) {
    this.router.navigate(['/matched-list-add-unit', this.factionName, category, this.listId]);
  }
}
