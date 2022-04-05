export const isProd = true;

export const WS_URL = isProd
  ? "wss://kusama-rpc.polkadot.io"
  : "ws://127.0.0.1:9944";

export const ASSETS_CID = "QmWBrAPXQvtT5GztdX52PXB5t9RJ71f1nwRMN5BE6Qi89o";

export const SUBSTRAKNIGHT_ITEMS_COLLECTION_SYMBOL = "SKITMS";
export const SUBSTRAKNIGHT_COLLECTION_SYMBOL = "SKC";
export const SUBSTRAKNIGHT_BASE_SYMBOL = "SKBS";

export const CHUNK_SIZE = 70;

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
export type FixedSet = FixedTrait[];
export type FixedSetProba = FixedPartProba[];

// Slots
export type SlotTraitName = string;
export type SlotFileName = string;
export type SlotCategory = string;
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

export const slotConfigSet: SlotConfigSet = [
  {
    slotCategory: "Background",
    zIndex: 0,
  },
  {
    slotCategory: "Mount",
    zIndex: 1,
  },
  {
    slotCategory: "Weapon",
    zIndex: 2,
  },
  {
    slotCategory: "Legs",
    zIndex: 11,
  },
  {
    slotCategory: "Underhelm",
    zIndex: 12,
  },
  {
    slotCategory: "Cloth",
    zIndex: 13,
  },
  {
    slotCategory: "Feet",
    zIndex: 14,
  },
  {
    slotCategory: "Chest",
    zIndex: 15,
  },
  {
    slotCategory: "Head",
    zIndex: 16,
  },
  {
    slotCategory: "Arms",
    zIndex: 17,
  },
  {
    slotCategory: "Shield",
    zIndex: 18,
  },
  {
    slotCategory: "Pet",
    zIndex: 19,
  },
];

export const allFixedPartsList: FixedPart[] = [
  {
    traitClass: "NakedMan",
    traits: ["NakedManBlue", "NakedManGrey", "NakedManPurple"],
    zIndex: 0,
  },
  {
    traitClass: "Earings",
    traits: ["EaringDiamond", "EaringDoubleRing"],
    zIndex: 2,
  },
  {
    traitClass: "Nose",
    traits: ["_Nose", "Nose"],
    zIndex: 1,
  },
];

export const fixedSetProba: FixedSetProba = [
  {
    traitClass: "Skin",
    traits: [
      { traitName: "Blue", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Grey", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Purple", traitProba: 0.1, fixedPartdescription: "ok" },
    ],
    zIndex: 3,
  },
  {
    traitClass: "Mouth",
    traits: [
      { traitName: "Mouth1", traitProba: 1, fixedPartdescription: "ok" },
      { traitName: "Mouth2", traitProba: 1, fixedPartdescription: "ok" },
      { traitName: "Mouth3", traitProba: 1, fixedPartdescription: "ok" },
      { traitName: "Mouth4", traitProba: 1, fixedPartdescription: "ok" },
      { traitName: "Mouth5", traitProba: 1, fixedPartdescription: "ok" },
    ],
    zIndex: 4,
  },
  {
    traitClass: "Scars",
    traits: [
      { traitName: "_Scar1", traitProba: 60, fixedPartdescription: "ok" },
      { traitName: "Scar1", traitProba: 10, fixedPartdescription: "ok" },
      { traitName: "Scar2", traitProba: 20, fixedPartdescription: "ok" },
      { traitName: "Scar3", traitProba: 5, fixedPartdescription: "ok" },
      { traitName: "Scar4", traitProba: 5, fixedPartdescription: "ok" },
    ],
    zIndex: 5,
  },
  {
    traitClass: "Hair",
    traits: [
      { traitName: "_Hair", traitProba: 20, fixedPartdescription: "ok" },
      { traitName: "Hair1white", traitProba: 15, fixedPartdescription: "ok" },
      { traitName: "Hair2white", traitProba: 15, fixedPartdescription: "ok" },
      { traitName: "Hair3white", traitProba: 10, fixedPartdescription: "ok" },
      { traitName: "Hair1brown", traitProba: 15, fixedPartdescription: "ok" },
      { traitName: "Hair2brown", traitProba: 15, fixedPartdescription: "ok" },
      { traitName: "Hair3brown", traitProba: 10, fixedPartdescription: "ok" },
    ],
    zIndex: 6,
  },
  {
    traitClass: "Beards",
    traits: [
      {
        traitName: "_Beard1white",
        traitProba: 0.1,
        fixedPartdescription: "ok",
      },
      { traitName: "Beard1white", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard2white", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard3white", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard4white", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard5white", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard6white", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard7white", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard8white", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard9white", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard1brown", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard2brown", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard3brown", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard4brown", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard5brown", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard6brown", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard7brown", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard8brown", traitProba: 0.1, fixedPartdescription: "ok" },
      { traitName: "Beard9brown", traitProba: 0.1, fixedPartdescription: "ok" },
    ],
    zIndex: 7,
  },
  {
    traitClass: "Eyebrows",
    traits: [
      {
        traitName: "Eyebrows1white",
        traitProba: 0.1,
        fixedPartdescription: "ok",
      },
      {
        traitName: "Eyebrows2white",
        traitProba: 0.1,
        fixedPartdescription: "ok",
      },
      {
        traitName: "Eyebrows3white",
        traitProba: 0.1,
        fixedPartdescription: "ok",
      },
      {
        traitName: "Eyebrows4white",
        traitProba: 0.1,
        fixedPartdescription: "ok",
      },
      {
        traitName: "Eyebrows1brown",
        traitProba: 0.1,
        fixedPartdescription: "ok",
      },
      {
        traitName: "Eyebrows2brown",
        traitProba: 0.1,
        fixedPartdescription: "ok",
      },
      {
        traitName: "Eyebrows3brown",
        traitProba: 0.1,
        fixedPartdescription: "ok",
      },
      {
        traitName: "Eyebrows4brown",
        traitProba: 0.1,
        fixedPartdescription: "ok",
      },
    ],
    zIndex: 8,
  },
  {
    traitClass: "Eyepatch",
    traits: [
      { traitName: "_Eyepatch1", traitProba: 91, fixedPartdescription: "ok" },
      { traitName: "Eyepatch1", traitProba: 3, fixedPartdescription: "ok" },
      { traitName: "Eyepatch2", traitProba: 3, fixedPartdescription: "ok" },
      { traitName: "Eyepatch3", traitProba: 3, fixedPartdescription: "ok" },
    ],
    zIndex: 9,
  },
  {
    traitClass: "Earings",
    traits: [
      { traitName: "_Earings1", traitProba: 25, fixedPartdescription: "ok" },
      { traitName: "Earings1", traitProba: 10, fixedPartdescription: "ok" },
      { traitName: "Earings2", traitProba: 15, fixedPartdescription: "ok" },
      { traitName: "Earings3", traitProba: 15, fixedPartdescription: "ok" },
      { traitName: "Earings4", traitProba: 17.5, fixedPartdescription: "ok" },
      { traitName: "Earings5", traitProba: 17.5, fixedPartdescription: "ok" },
    ],
    zIndex: 10,
  },
];

// export const fixedPartsSet: FixedSet = [
//   {
//     traitClass: "NakedMan",
//     trait: "NakedMan",
//     zIndex: 0,
//   },
//   {
//     traitClass: "Earings",
//     trait: "EaringDiamond",
//     zIndex: 2,
//   },
//   {
//     traitClass: "Nose",
//     trait: "Nose",
//     zIndex: 1,
//   },
// ];

export const substraCollectionDescription="This is Substraknight! RMRK2 Nested NFT"
// export const slotList = [];
// [
//   "weapon",
//   "pants",
//   "feet",
//   "cloth",
//   "hands",
//   "arm",
//   "underhelm",
//   "head",
//   "chest",
//   "hood",
//   "shoulder",
//   "shield",
// ];

// export const soldierIndexList = [1]; //,2,3,4]
