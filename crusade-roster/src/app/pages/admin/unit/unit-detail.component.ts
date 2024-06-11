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
  }
}
