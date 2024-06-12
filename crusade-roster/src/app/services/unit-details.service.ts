import { Injectable } from '@angular/core';
import {Ability, UnitDetails} from './unit-details.model'; // Import the UnitDetails interface
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
    console.log("Extracting base size from content:", content);

    // Improved regex pattern to handle multiple class name variations
    const baseSizeRegex = /<span\s+class="dsModelBase(?:2)?(?:\s+dsModelBase2Top)?\s+ShowBaseSize">\((.*?)\)<\/span>/;
    console.log("Regex pattern used:", baseSizeRegex);

    // Execute the regex pattern on the provided content
    const match = baseSizeRegex.exec(content);
    console.log("Regex match result:", match);

    // Check if a match is found and extract the base size
    if (match && match[1]) {
      console.log("Extracted base size:", match[1]);
      return match[1]; // Return the extracted base size
    }

    // If no match is found, return the default value
    console.log("No base size found, returning default value 'N/A'");
    return 'N/A'; // Default value if not found
  }






  private extractWeapons(content: string, type: 'ranged' | 'melee'): UnitDetails['rangedWeapons'] | UnitDetails['meleeWeapons'] {
    // Placeholder implementation
    return [];
  }

  private extractAbilities(content: string): UnitDetails['abilities'] {
    console.log("Extracting abilities from content:", content);

    // Regex to match the abilities section and stop at 'WARGEAR ABILITIES'
    const abilitiesSectionRegex = /<div class="dsHeader dsColorBgAS">ABILITIES<\/div>(.*?)<div class="dsHeader dsColorBgAS">WARGEAR ABILITIES<\/div>/s;
    const match = abilitiesSectionRegex.exec(content);

    if (!match) {
      console.log("No abilities section found, returning empty abilities.");
      return {
        core: [],
        faction: [],
        detachment: [],
        unit: []
      };
    }

    const abilitiesContent = match[1];
    console.log("Abilities content:", abilitiesContent);

    // Regex to extract individual abilities
    const coreRegex = /<div class="dsAbility">CORE: <b>(.*?)<\/b><\/div>/g;
    const factionRegex = /<div class="dsAbility">FACTION: <b>(.*?)<\/b><\/div>/g;
    const detachmentRegex = /<div class="dsAbility">DETACHMENT: <b>(.*?)<\/b><\/div>/g;
    const unitAbilityRegex = /<div class="dsAbility"><b>([^<]+):<\/b>(.*?)<\/div>/gs;

    const extractAbilities = (regex: RegExp, content: string): Ability[] => {
      const matches = [];
      let match;
      while ((match = regex.exec(content)) !== null) {
        const name = match[1].trim();
        const description = match[2]?.trim().replace(/<.*?>/g, '').replace(/\s+/g, ' ') || '';
        matches.push({ name, description });
        console.log("Extracted ability:", { name, description });
      }
      return matches;
    };

    const coreAbilities = extractAbilities(coreRegex, abilitiesContent);
    const factionAbilities = extractAbilities(factionRegex, abilitiesContent);
    const detachmentAbilities = extractAbilities(detachmentRegex, abilitiesContent);
    const unitAbilities = extractAbilities(unitAbilityRegex, abilitiesContent);

    return {
      core: coreAbilities,
      faction: factionAbilities,
      detachment: detachmentAbilities,
      unit: unitAbilities
    };
  }





  private extractComposition(content: string): UnitDetails['composition'] {
    const composition = {
      models: 'N/A',
      points: '0',
      equipment: 'N/A',
      modelsNames: 'N/A'
    };

    const tableRegex = /<tr><td>([^<]+)<\/td><td><div class="PriceTag">([^<]+)<\/div><\/td><\/tr>/g;
    const equipmentRegex = /<b>([^<]+) is equipped with:<\/b>([^<]+)\./g;
    const modelRegex = /<ul class="dsUl"><li><b>([^<]+)<\/b><\/li><\/ul>/g;

    let match;
    let models = '';
    let points = '';
    let equipment = '';
    let modelsNames = '';


    while ((match = tableRegex.exec(content)) !== null) {
      const modelInfo = match[1].trim().match(/\d+/); // Extract only numeric part from the modelInfo
      const modelCount = modelInfo ? modelInfo[0] : '0'; // Default to "0" if no numbers are found
      const price = match[2].trim(); // Contains the price

      if (models.length > 0) {
        models += ', ';
        points += ', ';
      }
      models += modelCount;
      points += price;
    }



    while ((match = equipmentRegex.exec(content)) !== null) {
      if (equipment.length > 0) {
        equipment += ' ';
      }
      equipment += `${match[1].trim()} is equipped with: ${match[2].trim()}.`;
    }

    while ((match = modelRegex.exec(content)) !== null) {
      if (modelsNames.length > 0) {
        modelsNames += ', ';
      }
      modelsNames += match[1].replace(/<span class="kwb">([^<]+)<\/span>/g, '$1').trim(); // Remove the span tags around keywords
    }

    if (models.length > 0) {
      composition.models = models;
      composition.points = points;
      composition.equipment = equipment;
      composition.modelsNames = modelsNames;

    }

    return composition;
  }


  private extractRules(content: string): string[] {
    // Placeholder implementation
    return [];
  }

  private extractKeywords(content: string): UnitDetails['keywords'] {
    const coreRegex = /<div class="dsAbility">CORE: <b>(.*?)<\/b><\/div>/g;
    const factionRegex = /<div class="dsAbility">FACTION: <b>(.*?)<\/b><\/div>/g;
    const keywordsRegex = /<div class="dsLeftСolKW">\s*KEYWORDS:\s*(.*?)<\/div>/gs;
    const factionKeywordsRegex = /<div class="dsRightСolKW">\s*FACTION KEYWORDS:\s*(.*?)<\/div>/gs;
    const detachmentRegex = /<div class="dsHeader dsColorBgAS">\s*DETACHMENT ABILITY\s*<\/div>\s*<div class="dsAbility">\s*(.*?)\s*<\/div>/gs;

    const extractMatches = (regex: RegExp, content: string): string[] => {
      const matches = [];
      let match;
      while ((match = regex.exec(content)) !== null) {
        console.log(`Match found for ${regex}:`, match[1]);
        matches.push(match[1]);
      }
      return matches;
    };

    const stripHtmlTags = (html: string): string => {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    };

    const cleanKeywords = (keywords: string): string[] => {
      return stripHtmlTags(keywords)
        .split(/,\s*|\s+/) // Split by commas or spaces
        .map(keyword => keyword.trim()) // Trim whitespace
        .filter(keyword => keyword); // Remove empty strings
    };

    const extractAndCleanKeywords = (regex: RegExp, content: string): string[] => {
      return extractMatches(regex, content).flatMap(match => cleanKeywords(match));
    };

    const coreMatches = extractAndCleanKeywords(coreRegex, content);
    const factionMatches = extractAndCleanKeywords(factionRegex, content);
    const keywordsMatches = extractMatches(keywordsRegex, content).flatMap(match => {
      const div = document.createElement('div');
      div.innerHTML = match;
      return Array.from(div.querySelectorAll('span')).map(span => span.textContent || '');
    });

    const factionKeywordsMatches = extractMatches(factionKeywordsRegex, content).flatMap(match => {
      const div = document.createElement('div');
      div.innerHTML = match;
      return Array.from(div.querySelectorAll('span')).map(span => span.textContent || '');
    });

    const detachmentMatches = extractMatches(detachmentRegex, content).flatMap(match => {
      const div = document.createElement('div');
      div.innerHTML = match;
      return Array.from(div.querySelectorAll('span')).map(span => span.textContent || '');
    });

    //const detachmentMatches = extractAndCleanKeywords(detachmentRegex, content);
    let uniqueFactionKeywordsArray: string[] = Array.from(new Set(factionKeywordsMatches));

    console.log("coreMatches: ", coreMatches);
    console.log("factionMatches: ", factionMatches);
    console.log("keywordsMatches: ", keywordsMatches);
    console.log("factionKeywordsMatches: ", uniqueFactionKeywordsArray);
    console.log("detachmentMatches: ", detachmentMatches);

    return {
      core: coreMatches,
      faction: factionMatches,
      detachment: detachmentMatches,
      unit: keywordsMatches,
      factionKeywords: uniqueFactionKeywordsArray // Ensure unique values
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
