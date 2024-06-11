import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { UnitDetailsService } from '../../services/unit-details.service';
import { UnitDetails } from '../../services/unit-details.model';
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
  units: { [key in keyof Omit<Faction, 'name' | 'url'>]: { name: string, url: string, points: number }[] } = {
    detachments: [],
    characters: [],
    battleline: [],
    dedicatedTransports: [],
    fortifications: [],
    otherDatasheets: []
  };
  categories: (keyof Omit<Faction, 'name' | 'url'>)[] = ['detachments', 'characters', 'battleline', 'dedicatedTransports', 'fortifications', 'otherDatasheets'];
  totalPoints: number = 0;
  maxPoints: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private unitDetailsService: UnitDetailsService
  ) {}

  ngOnInit(): void {
    this.listId = this.route.snapshot.paramMap.get('id') || '';
    this.loadList();
  }

  loadList() {
    const list = this.storageService.getLists().matched.find(list => list.id === this.listId);
    if (list) {
      const listNameParts = list.name.split('|');
      this.listName = listNameParts[0];
      const maxPointsMatch = listNameParts[0].match(/\((.*?)\) - (\d+) points/);
      if (maxPointsMatch) {
        this.maxPoints = parseInt(maxPointsMatch[2], 10);
      }
      this.units = this.storageService.getUnitsForList(this.listId) as any;

      // Extract faction name from listName
      const factionMatch = this.listName.match(/\((.*?)\)/);
      if (factionMatch) {
        this.factionName = factionMatch[1];
      }

      // Calculate total points
      this.totalPoints = 0;
      for (const category of this.categories) {
        for (const unit of this.units[category]) {
          const unitDetails = this.unitDetailsService.getUnitDetails(unit.name);
          if (unitDetails) {
            unit.points = parseInt(unitDetails.composition.points) || 0;
            this.totalPoints += unit.points;
          } else {
            unit.points = 0;
          }
        }
      }
    }
  }

  addUnitToCategory(category: keyof Omit<Faction, 'name' | 'url'>) {
    this.router.navigate(['/matched-list-add-unit', this.factionName, category, this.listId]);
  }

  removeUnitFromCategory(category: keyof Omit<Faction, 'name' | 'url'>, unitName: string) {
    this.storageService.removeUnitFromList(this.listId, unitName, category);
    this.loadList();
  }
}
