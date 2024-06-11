import { Injectable } from '@angular/core';
import { UnitDetails } from './unit-import/unit-details.model'; // Import the new UnitDetails interface

@Injectable({
  providedIn: 'root'
})
export class UnitDetailsService {

  private unitDetailsKey = 'angular17unitdetails';

  saveUnitDetails(unitName: string, unitDetails: UnitDetails): void {
    const localUnitDetails = localStorage.getItem(this.unitDetailsKey);
    const unitDetailsData = localUnitDetails ? JSON.parse(localUnitDetails) : {};
    unitDetailsData[unitName] = unitDetails;
    localStorage.setItem(this.unitDetailsKey, JSON.stringify(unitDetailsData));
  }

  getUnitDetails(unitName: string): UnitDetails | null {
    const localUnitDetails = localStorage.getItem(this.unitDetailsKey);
    const unitDetailsData = localUnitDetails ? JSON.parse(localUnitDetails) : {};
    return unitDetailsData[unitName] || null;
  }
}
