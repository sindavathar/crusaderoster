import { Injectable } from '@angular/core';
import { UnitDetails } from './unit-details.model'; // Import the UnitDetails interface
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class UnitDetailsService {
  private unitDetailsKey = 'angular17unitDetails';

  async importUnitDetails(unitUrl: string, name: string): Promise<void> {
    try {
      const response = await axios.get(`http://localhost:3000/proxy?url=${encodeURIComponent(unitUrl)}`);
      const content = response.data;
      const unitDetails: UnitDetails = this.parseUnitDetails(content);
      if (unitDetails) {
        unitDetails.name = name; // Set the name directly
        this.saveUnitDetails(unitDetails.name, unitDetails);
        console.log(`Details imported for unit: ${unitDetails.name}`);
      }
    } catch (error) {
      console.error(`Error importing details for unit:`, error);
    }
  }


  private parseUnitDetails(content: string): UnitDetails {
    const unitDetails: UnitDetails = {
      name: this.extractUnitName(content),
      baseSize: this.extractBaseSize(content),
      stats: this.extractStats(content),
      rangedWeapons: this.extractWeapons(content, 'ranged'),
      meleeWeapons: this.extractWeapons(content, 'melee'),
      abilities: this.extractAbilities(content),
      composition: this.extractComposition(content),
      rules: this.extractRules(content),
      keywords: this.extractKeywords(content)
    };

    console.log(unitDetails.stats);
    return unitDetails;
  }

  private extractStats(content: string): UnitDetails['stats'] {
    const stats = {
      movement: 'N/A',
      toughness: 'N/A',
      save: 'N/A',
      wounds: 'N/A',
      leadership: 'N/A',
      objectiveControl: 'N/A',
      invulnerableSave: 'N/A'
    };

    const charRegex = /<div class="dsCharWrap">\s*<div class="dsCharName">(\w+)<\/div>\s*<div class="dsCharFrame[^>]*>\s*<div class="dsCharFrameBack">\s*<div class="dsCharValue[^>]*">([^<]+)<\/div>/g;
    const invulRegex = /<div class="dsInvulWrap">\s*<div class="dsCharInvulText[^>]*>INVULNERABLE SAVE<\/div>\s*<div class="dsCharInvul[^>]*>\s*<div class="dsCharInvulBack">\s*<div class="dsCharInvulValue[^>]*>(\d+\+?)<\/div>/;

    let match;
    while ((match = charRegex.exec(content)) !== null) {
      const charName = match[1];  // e.g., "M", "T", "Sv"
      const charValue = match[2];  // e.g., "10", "6", "3+"
      console.log(charName);
      switch (charName) {
        case 'M':
          stats.movement = charValue;

          break;
        case 'T':
          stats.toughness = charValue;
          break;
        case 'Sv':
          stats.save = charValue;
          break;
        case 'W':
          stats.wounds = charValue;
          break;
        case 'Ld':
          stats.leadership = charValue;
          break;
        case 'OC':
          stats.objectiveControl = charValue;
          break;
      }
    }

    const invulMatch = invulRegex.exec(content);
    if (invulMatch) {
      stats.invulnerableSave = invulMatch[1];
    }

    return stats;
  }

  private extractUnitName(content: string): string {
    // Placeholder implementation
    return 'N/A';
  }

  private extractBaseSize(content: string): string {
    // Placeholder implementation
    return 'N/A';
  }

  private extractWeapons(content: string, type: 'ranged' | 'melee'): UnitDetails['rangedWeapons'] | UnitDetails['meleeWeapons'] {
    // Placeholder implementation
    return [];
  }

  private extractAbilities(content: string): UnitDetails['abilities'] {
    // Placeholder implementation
    return {
      core: [],
      faction: [],
      detachment: [],
      unit: []
    };
  }

  private extractComposition(content: string): UnitDetails['composition'] {
    // Placeholder implementation
    return {
      models: 'N/A',
      points: 0
    };
  }

  private extractRules(content: string): string[] {
    // Placeholder implementation
    return [];
  }

  private extractKeywords(content: string): UnitDetails['keywords'] {
    // Placeholder implementation
    return {
      core: [],
      faction: [],
      detachment: [],
      unit: []
    };
  }

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
