import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../services/list.service';
import { UnitService } from '../../services/unit.service';
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
  maxPoints: number = 0;
  detachment: string = '';
  units: { [key in keyof Omit<Faction, 'name' | 'url'>]: { name: string, url: string, points: number, id: string }[] } = {
    detachments: [],
    characters: [],
    battleline: [],
    dedicatedTransports: [],
    fortifications: [],
    otherDatasheets: []
  };
  categories: (keyof Omit<Faction, 'name' | 'url'>)[] = ['detachments', 'characters', 'battleline', 'dedicatedTransports', 'fortifications', 'otherDatasheets'];
  totalPoints: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listService: ListService,
    private unitService: UnitService,
    private unitDetailsService: UnitDetailsService
  ) {}

  ngOnInit(): void {
    this.listId = this.route.snapshot.paramMap.get('id') || '';
    this.loadList();
  }

  loadList() {
    const list = this.listService.getLists().matched.find(list => list.id === this.listId);
    if (list) {
      this.listName = list.name;
      this.factionName = list.faction;
      this.maxPoints = parseInt(list.points, 10);
      this.detachment = list.detachment;

      this.units = this.listService.getUnitsForList(this.listId) as any;

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

  removeUnitFromCategory(category: keyof Omit<Faction, 'name' | 'url'>, unitId: string) {
    this.unitService.removeUnitFromList(this.listId, unitId, category);
    this.loadList();
  }
}
