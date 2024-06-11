import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { UnitDetails } from '../../../services/unit-details.model';

@Component({
  selector: 'app-unit-detail',
  templateUrl: './unit-detail.component.html',
  styleUrls: ['./unit-detail.component.css']
})
export class UnitDetailComponent implements OnInit {
  @Input() unitName: string = '';
  unitDetails: UnitDetails | null = null;

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.unitName = this.route.snapshot.paramMap.get('unitName') || '';
    this.unitDetails = this.storageService.getUnitDetails(this.unitName);

    if (!this.unitDetails) {
      this.unitDetails = {
        name: this.unitName,
        baseSize: 'N/A',
        stats: {
          movement: 'N/A',
          toughness: 'N/A',
          save: 'N/A',
          wounds: 'N/A',
          leadership: 'N/A',
          objectiveControl: 'N/A',
          invulnerableSave: 'N/A'
        },
        rangedWeapons: [],
        meleeWeapons: [],
        abilities: {
          core: [],
          faction: [],
          detachment: [],
          unit: []
        },
        composition: {
          models: 'N/A',
          points: 'N/A',
          equipment: 'N/A',
          modelsNames: 'N/A'
        },
        rules: [],
        keywords: {
          core: [],
          faction: [],
          detachment: [],
          unit: []
        }
      };
    }
  }
}
