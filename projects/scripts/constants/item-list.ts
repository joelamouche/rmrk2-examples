import { SlotCategory, SlotSet } from "./types";

export const selectedSlot = {
  slotCategory: "Heads",
  fileName: "CyanHood",
  traitName: "Cloth Hood",
  zIndex: 16,
  traitDescription: "A basic cyan cloth hat\nPOWER: 30",
};
export const slotSet: SlotSet = [
  {
    slotCategory: "Backgrounds",
    fileName: "ForestBackground",
    traitName: "Forest Camp",
    zIndex: 0,
    traitDescription: "Out of prison, out of trouble... For now...",
  },

  {
    slotCategory: "Weapons",
    fileName: "ShortSword",
    traitName: "Short Sword",
    zIndex: 2,
    traitDescription: "A sharp short sword.\nPOWER: 700",
  },

  {
    slotCategory: "Weapons",
    fileName: "ShortAxe",
    traitName: "Short Axe",
    zIndex: 2,
    traitDescription: "A solid iron axe.\nPOWER: 700",
  },

  {
    slotCategory: "Backgrounds",
    fileName: "NightForestCamp",
    traitName: "Forest Camp at night",
    zIndex: 0,
    traitDescription: "Settled in the forest for the night, cold and windy",
  },

  {
    slotCategory: "Chests",
    fileName: "FreemanJacket",
    traitName: "Freeman Jacket",
    zIndex: 15,
    traitDescription: "A thin leather jacket! Stylish!\nPOWER: 40",
  },

  {
    slotCategory: "Weapons",
    fileName: "RangerAxe",
    traitName: "Scout Axe",
    zIndex: 2,
    traitDescription: "A solid iron axe.\nPOWER: 900",
  },

  {
    slotCategory: "Weapons",
    fileName: "Morgenstern",
    traitName: "Morgenstern",
    zIndex: 2,
    traitDescription: "Spiky!\nPOWER: 1100",
  },

  {
    slotCategory: "Heads",
    fileName: "KettleHat",
    traitName: "Kettle Hat",
    zIndex: 16,
    traitDescription: "A solid kettle hat\nPOWER: 120",
  },

  {
    slotCategory: "Backgrounds",
    fileName: "Village",
    traitName: "Village",
    zIndex: 0,
    traitDescription: "A calm and peaceful village, or…",
  },
  {
    slotCategory: "Heads",
    fileName: "BlackHood",
    traitName: "Cloth Hood",
    zIndex: 16,
    traitDescription: "A basic black cloth hat\nPOWER: 30",
  },

  {
    slotCategory: "Heads",
    fileName: "BlueHood",
    traitName: "Cloth Hood",
    zIndex: 16,
    traitDescription: "A basic blue cloth hat\nPOWER: 30",
  },

  {
    slotCategory: "Heads",
    fileName: "RedHood",
    traitName: "Cloth Hood",
    zIndex: 16,
    traitDescription: "A basic red cloth hat\nPOWER: 30",
  },

  {
    slotCategory: "Heads",
    fileName: "CyanHood",
    traitName: "Cloth Hood",
    zIndex: 16,
    traitDescription: "A basic cyan cloth hat\nPOWER: 30",
  },
];

// Start Set
const weaponsFileNames = ["Fourche", "Gourdin", "Poele"];
const weaponsNames = ["Pitchfork", "Club", "Frying Pan"];
const weaponsDescription = [
  `Wooden pitchfork. Better than nothing...\nPOWER: 500`,
  `Wooden club. Better than nothing...\nPOWER: 500`,
  `Frying pan. Better than nothing...\nPOWER: 500`,
];
export const villainSet = [
  {
    slotCategory: "Backgrounds",
    fileName: "ForestBackground",
    traitName: "Forest Camp",
    zIndex: 0,
    traitDescription: "Out of prison, out of trouble... For now...",
  },
  {
    slotCategory: "Backgrounds",
    fileName: "Prison",
    traitName: "Prison Cell",
    zIndex: 0,
    traitDescription:
      "Tax fraud is no joke! In jail. It's cold and humid and there are rats about...",
  },
  // {
  //   slotCategory: "Weapons",
  //   traitName: weaponsNames[weaponIndex],
  //   fileName: weaponsFileNames[weaponIndex],
  //   zIndex: 2,
  //   traitDescription: weaponsDescription[weaponIndex],
  // },
  {
    slotCategory: "Legs",
    traitName: "Prisoner Pants",
    fileName: "Pants1",
    zIndex: 11,
    traitDescription: "Prisonner attire\nPOWER: 0",
  },
  {
    slotCategory: "Underhelms",
    traitName: "Basic Collar",
    fileName: "Underhelm1",
    zIndex: 12,
    traitDescription: "Basic attire\nPOWER: 10",
  },
  {
    slotCategory: "Feet",
    traitName: "Prisoner Boots",
    fileName: "Feet1",
    zIndex: 13,
    traitDescription: "Prisoner attire\nPOWER: 20",
  },
  {
    slotCategory: "Cloths",
    traitName: "Prisoner Cloth",
    fileName: "Cloth1",
    zIndex: 14,
    traitDescription: "Prisoner attire\nPOWER: 0",
  },
  {
    slotCategory: "Heads",
    traitName: "Prisoner Collar",
    fileName: "PrisonerCollar",
    zIndex: 16,
    traitDescription: "Prisoner attire\nPOWER: -500",
  },
  {
    slotCategory: "Arms",
    traitName: "Prisoner Shackles",
    fileName: "Arms1",
    zIndex: 17,
    traitDescription: "Prisoner attire\nPOWER: -1000",
  },
];
export const drawVillainSlotSet = (): SlotSet => {
  const weaponIndex = Math.floor(weaponsNames.length * Math.random());
  return [
    ...villainSet,
    {
      slotCategory: "Weapons" as SlotCategory,
      traitName: weaponsNames[weaponIndex],
      fileName: weaponsFileNames[weaponIndex],
      zIndex: 2,
      traitDescription: weaponsDescription[weaponIndex],
    },
  ];
};

// Items for 3rd items mint

const clothList:SlotSet = [
  {
    slotCategory: "Cloths",
    fileName: "Black",
    traitName: "Basic Cloth",
    zIndex: 14,
    traitDescription: "Basic black attire\nPOWER: 0 ",
  },
  {
    slotCategory: "Cloths",
    fileName: "Blue",
    traitName: "Basic Cloth",
    zIndex: 14,
    traitDescription: "Basic blue attire\nPOWER: 0 ",
  },
  {
    slotCategory: "Cloths",
    fileName: "Brown",
    traitName: "Basic Cloth",
    zIndex: 14,
    traitDescription: "Basic brown attire\nPOWER: 0 ",
  },
  {
    slotCategory: "Cloths",
    fileName: "Cyan",
    traitName: "Basic Cloth",
    zIndex: 14,
    traitDescription: "Basic cyan attire\nPOWER: 0 ",
  },
  {
    slotCategory: "Cloths",
    fileName: "Green",
    traitName: "Basic Cloth",
    zIndex: 14,
    traitDescription: "Basic green attire\nPOWER: 0 ",
  },
  {
    slotCategory: "Cloths",
    fileName: "Orange",
    traitName: "Basic Cloth",
    zIndex: 14,
    traitDescription: "Basic orange attire\nPOWER: 0 ",
  },
  {
    slotCategory: "Cloths",
    fileName: "Purple",
    traitName: "Basic Cloth",
    zIndex: 14,
    traitDescription: "Basic purple attire\nPOWER: 0 ",
  },
  {
    slotCategory: "Cloths",
    fileName: "Red",
    traitName: "Basic Cloth",
    zIndex: 14,
    traitDescription: "Basic red attire\nPOWER: 0 ",
  },
  {
    slotCategory: "Cloths",
    fileName: "White",
    traitName: "Basic Cloth",
    zIndex: 14,
    traitDescription: "Basic white attire\nPOWER: 0 ",
  },
  {
    slotCategory: "Cloths",
    fileName: "Yellow",
    traitName: "Basic Cloth",
    zIndex: 14,
    traitDescription: "Basic yellow attire\nPOWER: 0 ",
  },
];
export const drawClothSet = (): SlotSet => {
  const clothIndex = Math.floor(clothList.length * Math.random());
  return [clothList[clothIndex]];
};
