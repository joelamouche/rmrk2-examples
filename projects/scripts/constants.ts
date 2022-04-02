export const isProd = true;

export const WS_URL = isProd
  ? "wss://kusama-rpc.polkadot.io"
  : "ws://127.0.0.1:9944";

export const ASSETS_CID = "QmPrKoTGp3johzJEu6uZeNia6E6sgwFgfNRCpTpBStkswB";

export const SUBSTRAKNIGHT_ITEMS_COLLECTION_SYMBOL = "SKITMS";
export const SUBSTRAKNIGHT_COLLECTION_SYMBOL = "CHNK";
export const SUBSTRAKNIGHT_BASE_SYMBOL = "SKBS";

export const CHUNK_SIZE = 70;

export type Trait = string;
export type TraitProba = { traitName: string; traitProba: number };
export interface FixedPart {
  traitClass: string;
  traits: Trait[];
  zIndex: number;
}
export interface FixedPartProba {
  traitClass: string;
  traits: TraitProba[];
  zIndex: number;
}
export interface FixedTrait {
  traitClass: string;
  trait: Trait;
  zIndex: number;
}
export type FixedSet = FixedTrait[];
export type FixedSetProba = FixedPartProba[];

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
      { traitName: "Blue", traitProba: 0.1 },
      { traitName: "Grey", traitProba: 0.1 },
      { traitName: "Purple", traitProba: 0.1 },
    ],
    zIndex: 0,
  },
  {
    traitClass: "Mouth",
    traits: [
      { traitName: "Mouth1", traitProba: 1 },
      { traitName: "Mouth2", traitProba: 1 },
      { traitName: "Mouth3", traitProba: 1 },
      { traitName: "Mouth4", traitProba: 1 },
      { traitName: "Mouth5", traitProba: 1 },
    ],
    zIndex: 1,
  },
  {
    traitClass: "Scars",
    traits: [
      { traitName: "_Scar1", traitProba: 60 },
      { traitName: "Scar1", traitProba: 10 },
      { traitName: "Scar2", traitProba: 20 },
      { traitName: "Scar3", traitProba: 5 },
      { traitName: "Scar4", traitProba: 5 },
    ],
    zIndex: 2,
  },
  {
    traitClass: "Hair",
    traits: [
      { traitName: "_Hair", traitProba: 20 },
      { traitName: "Hair1white", traitProba: 15 },
      { traitName: "Hair2white", traitProba: 15},
      { traitName: "Hair3white", traitProba: 10 },
      { traitName: "Hair1brown", traitProba: 15 },
      { traitName: "Hair2brown", traitProba: 15 },
      { traitName: "Hair3brown", traitProba: 10 },
    ],
    zIndex: 3,
  },
  {
    traitClass: "Beards",
    traits: [
      { traitName: "_Beard1white", traitProba: 0.1 },
      { traitName: "Beard1white", traitProba: 0.1 },
      { traitName: "Beard2white", traitProba: 0.1 },
      { traitName: "Beard3white", traitProba: 0.1 },
      { traitName: "Beard4white", traitProba: 0.1 },
      { traitName: "Beard5white", traitProba: 0.1 },
      { traitName: "Beard6white", traitProba: 0.1 },
      { traitName: "Beard7white", traitProba: 0.1 },
      { traitName: "Beard8white", traitProba: 0.1 },
      { traitName: "Beard9white", traitProba: 0.1 },
      { traitName: "Beard1brown", traitProba: 0.1 },
      { traitName: "Beard2brown", traitProba: 0.1 },
      { traitName: "Beard3brown", traitProba: 0.1 },
      { traitName: "Beard4brown", traitProba: 0.1 },
      { traitName: "Beard5brown", traitProba: 0.1 },
      { traitName: "Beard6brown", traitProba: 0.1 },
      { traitName: "Beard7brown", traitProba: 0.1 },
      { traitName: "Beard8brown", traitProba: 0.1 },
      { traitName: "Beard9brown", traitProba: 0.1 },
    ],
    zIndex: 4,
  },
  {
    traitClass: "Eyebrows",
    traits: [
      { traitName: "Eyebrows1white", traitProba: 0.1 },
      { traitName: "Eyebrows2white", traitProba: 0.1 },
      { traitName: "Eyebrows3white", traitProba: 0.1 },
      { traitName: "Eyebrows4white", traitProba: 0.1 },
      { traitName: "Eyebrows1brown", traitProba: 0.1 },
      { traitName: "Eyebrows2brown", traitProba: 0.1 },
      { traitName: "Eyebrows3brown", traitProba: 0.1 },
      { traitName: "Eyebrows4brown", traitProba: 0.1 },
    ],
    zIndex: 5,
  },
  {
    traitClass: "Eyepatch",
    traits: [
      { traitName: "_Eyepatch1", traitProba: 91 },
      { traitName: "Eyepatch1", traitProba: 3 },
      { traitName: "Eyepatch2", traitProba: 3 },
      { traitName: "Eyepatch3", traitProba: 3 },
    ],
    zIndex: 6,
  },
  {
    traitClass: "Earings",
    traits: [
      { traitName: "_Earings1", traitProba: 25 },
      { traitName: "Earings1", traitProba: 10 },
      { traitName: "Earings2", traitProba: 15 },
      { traitName: "Earings3", traitProba: 15 },
      { traitName: "Earings4", traitProba: 17.5 },
      { traitName: "Earings5", traitProba: 17.5 },
    ],
    zIndex: 7,
  }
];

export const fixedPartsSet: FixedSet = [
  {
    traitClass: "NakedMan",
    trait: "NakedMan",
    zIndex: 0,
  },
  {
    traitClass: "Earings",
    trait: "EaringDiamond",
    zIndex: 2,
  },
  {
    traitClass: "Nose",
    trait: "Nose",
    zIndex: 1,
  },
];
export const slotList = [];
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
