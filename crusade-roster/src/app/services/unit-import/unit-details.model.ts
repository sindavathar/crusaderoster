// import-unit-details.model.ts

export interface Weapon {
  name: string;
  range: string;
  type: string;
  strength: string;
  armorPenetration: string;
  damage: string;
}

export interface Ability {
  name: string;
  description: string;
}

export interface Composition {
  models: string;
  points: number;
}

export interface Keywords {
  core: string[];
  faction: string[];
  detachment: string[];
  unit: string[];
}

export interface UnitDetails {
  name: string;
  baseSize: string;
  stats: {
    movement: string;
    toughness: string;
    save: string;
    wounds: string;
    leadership: string;
    objectiveControl: string;
    invulnerableSave?: string;
  };
  rangedWeapons?: Weapon[];
  meleeWeapons?: Weapon[];
  abilities: {
    core: Ability[];
    faction: Ability[];
    detachment: Ability[];
    unit: Ability[];
  };
  composition: Composition;
  rules: string[];
  keywords: Keywords;
}
