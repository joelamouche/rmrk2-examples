export const isProd = true;

export const WS_URL = isProd
  ? "wss://kusama-rpc.polkadot.io"
  : "ws://127.0.0.1:9944";

export const ASSETS_CID = "QmQE99zLZ9oKMnYLDQV7MvnvdTweHVhd9XwWQHzLYp1jsv";

export const SUBSTRAKNIGHT_ITEMS_COLLECTION_SYMBOL = "SKITMS";
export const SUBSTRAKNIGHT_COLLECTION_SYMBOL = "CHNK";
export const SUBSTRAKNIGHT_BASE_SYMBOL = "SKBS";

export const CHUNK_SIZE = 70;

export type Trait = string;
export type TraitProba = {traitName:string,traitProba:number};
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
  //   {
  //     traitClass: "Eyes",
  //     traits: ["_Eyes", "EyesGreen", "EyesWhite"],
  //     zIndex: 1,
  //   },
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
    traits: [{traitName:"NakedManBlue",traitProba:0.1},{traitName:"NakedManGrey",traitProba:0.5}, {traitName:"NakedManPurple",traitProba:0.2}],
    zIndex: 0,
  },
  {
    traitClass: "Earings",
    traits: [{traitName:"EaringDiamond",traitProba:0.5},{traitName:"EaringDoubleRing",traitProba:0.1}],
    zIndex: 2,
  },
  {
    traitClass: "Nose",
    traits: [{traitName:"_Nose",traitProba:0.2},{traitName:"Nose",traitProba:0.1}],
    zIndex: 1,
  },
];

export const fixedPartsSet: FixedSet = [
  {
    traitClass: "NakedMan",
    trait: "NakedMan",
    zIndex: 0,
  },
  //   {
  //     traitClass: "Eyes",
  //     trait: "Eyes",
  //     zIndex: 1,
  //   },
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

export const soldierIndexList = [1]; //,2,3,4]
