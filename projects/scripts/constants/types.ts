export type Trait = string;
export type FixedPartClass = string;
export type FixedPartDescription = string;
export type TraitProba = {
  traitName: string;
  traitProba: number;
  fixedPartdescription: FixedPartDescription;
};
export interface FixedPart {
  traitClass: FixedPartClass;
  traits: Trait[];
  zIndex: number;
}
export interface FixedPartProba {
  traitClass: FixedPartClass;
  traits: TraitProba[];
  zIndex: number;
}
export interface FixedTrait {
  traitClass: FixedPartClass;
  trait: Trait;
  zIndex: number;
}
export type FixedTraitSet = FixedTrait[];
export type FixedSetProba = FixedPartProba[];

// Slots
export type SlotTraitName = string;
export type SlotFileName = string;
export type SlotCategory =
  | "Backgrounds"
  | "Mounts"
  | "Weapons"
  | "Legs"
  | "Underhelms"
  | "Feet"
  | "Cloths"
  | "Chests"
  | "Heads"
  | "Arms"
  | "Shield"
  | "Pet";

export type TraitDescription = string;
export interface SlotTrait {
  slotCategory: SlotCategory;
  traitName: SlotTraitName;
  fileName: SlotFileName;
  traitDescription: TraitDescription;
  zIndex: number;
}
export interface SlotConfig {
  slotCategory: SlotCategory;
  zIndex: number;
}
export type SlotConfigSet = SlotConfig[];
export type SlotSet = SlotTrait[];

export interface SlotInfo {
  symbol: string;
  thumb: string;
  resources: string[];
  fileName: string;
  slotCategory: string;
  description: TraitDescription;
}

export interface SoldierDeployement {
  kusamarauderNumber: number;
  items: SlotSet;
}

export interface Deployement {
  mintSubstraBlock: number;
  baseBlock: number;
  indexList: number[];
}
