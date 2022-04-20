import { FixedSetProba, SlotConfigSet } from "./types";

export const ASSETS_CID = "QmVrRsTBcSh8mswQYpKMfaGwFKvNrpLiZVNmWQY9CXLozD";

export const SUBSTRAKNIGHT_ITEMS_COLLECTION_SYMBOL = "SKITMS";
export const SUBSTRAKNIGHT_COLLECTION_SYMBOL = "SKC";
export const SUBSTRAKNIGHT_BASE_SYMBOL = "SKBS";

export const substraKnightsAddress =
  "FCzwhSLYhFdqdSXXdUM2nGGpgDFit24tX8ajgfXWj49VEwo";

export const CHUNK_SIZE = 70;

export const substraCollectionDescription =
  "Kusamarauders is the name given to members of the warrior cast, the one that achieved dominance and started imposing the God of War as the only true god.\nEver since the Fall of the Empire, Tribal Houses have been fighting for hegemony.\nIn the shattered empire, sacred tournaments are organised in order to calm Tribal quarrels and eventually find the rightful heir to the Throne.\nTo achieve their goals, Kusamarauders have mastered the art of war and rely on their gear to overcome their ennemies. Armours are their skin and weapons their limbs.\nRead more : https://app.subsocial.network/6384/substra-knights-2-0-collection-here-come-the-kusamarauders-32374";

export const slotConfigSet: SlotConfigSet = [
  {
    slotCategory: "Backgrounds",
    zIndex: 0,
  },
  {
    slotCategory: "Mounts",
    zIndex: 1,
  },
  {
    slotCategory: "Weapons",
    zIndex: 2,
  },
  {
    slotCategory: "Legs",
    zIndex: 11,
  },
  {
    slotCategory: "Underhelms",
    zIndex: 12,
  },
  {
    slotCategory: "Feet",
    zIndex: 13,
  },
  {
    slotCategory: "Cloths",
    zIndex: 14,
  },
  {
    slotCategory: "Chests",
    zIndex: 15,
  },
  {
    slotCategory: "Heads",
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
