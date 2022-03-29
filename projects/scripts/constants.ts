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
export interface FixedPart {
  traitClass: string;
  traits: Trait[];
  zIndex: number;
}
export interface FixedTrait {
  traitClass: string;
  trait: Trait;
  zIndex: number;
}
export type FixedSet=FixedTrait[]

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
export const slotList = []
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
