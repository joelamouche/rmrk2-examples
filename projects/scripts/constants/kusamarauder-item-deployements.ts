import { SlotSet } from "./types";

// deployement details
export const deployement1 = {
  mintSubstraBlock: 12126344,
  baseBlock: 12126274,
  indexList: [5],
};
export const deployement2 = {
  mintSubstraBlock: 12126404,
  baseBlock: 12126274,
  indexList: [10],
};
export const deployementList1 = [
  {
    mintSubstraBlock: 12126283,
    baseBlock: 12126274,
    indexList: [1],
  },
  {
    mintSubstraBlock:12126317,
    baseBlock:12126274,
    indexList:[
      3
      //,4
    ]
  },
  // {
  //   mintSubstraBlock: 12126344,
  //   baseBlock: 12126274,
  //   indexList: [5],
  // },
  {
    mintSubstraBlock:12126376,
    baseBlock:12126274,
    indexList:[
      7,
      8
    ]
  },
  {
    mintSubstraBlock:12126404,
    baseBlock:12126274,
    indexList:[
      //9,
      10]
  },
  {
    mintSubstraBlock:12126431,
    baseBlock:12126274,
    indexList:[11]
  },
  {
    mintSubstraBlock:12126461,
    baseBlock:12126274,
    indexList:[13
     // ,14
    ]
  }
];
export const deployementList2 = [
  // {
  //   mintSubstraBlock:12135505,
  //   baseBlock:12126274,
  //   indexList:[15,16]
  // },
  // {
  //   mintSubstraBlock:12135533,
  //   baseBlock:12126274,
  //   indexList:[
  //     //17,
  //     18]
  // },
  // {
  //   mintSubstraBlock: 12135574,
  //   baseBlock: 12126274,
  //   indexList: [
  //     //19,
  //     20,
  //     21
  //   ],
  // },
  // {
  //   mintSubstraBlock:12135606,
  //   baseBlock:12126274,
  //   indexList:[
  //     22,23,
  //     24]
  // },
  // {
  //   mintSubstraBlock:12135636,
  //   baseBlock:12126274,
  //   indexList:[26]
  // },
  // {
  //   mintSubstraBlock:12135697,
  //   baseBlock:12126274,
  //   indexList:[
  //      28,
  //     29
  //     ,30
  //   ]
  // },
  // {
  //   mintSubstraBlock:12135730,
  //   baseBlock:12126274,
  //   indexList:[
  //     //31,
  //     32,
  //     33]
  // },
  // {
  //   mintSubstraBlock:12135763,
  //   baseBlock:12126274,
  //   indexList:[34
  //     //,36
  //   ]
  // },
  // {
  //   mintSubstraBlock: 12135794,
  //   baseBlock: 12126274,
  //   indexList: [
  //    // 37,
  //     38,
  //     39,
  //   ],
  // },
  // {
  //   mintSubstraBlock: 12135841,
  //   baseBlock: 12126274,
  //   indexList: [
  //     40,
  //     //41,
  //     42
  //   ],
  // },
  // {
  //   mintSubstraBlock:12135874,
  //   baseBlock:12126274,
  //   indexList:[
  //     43,
  //     44
  //   ]
  // },
  // {
  //   mintSubstraBlock:12135905,
  //   baseBlock:12126274,
  //   indexList:[
  //     // 46,
  //     // 47,
  //     48
  //   ]
  // },
  // {
  //   mintSubstraBlock:12135936,
  //   baseBlock:12126274,
  //   indexList:[49,51]
  // },
  // {
  //   mintSubstraBlock:12136000,
  //   baseBlock:12126274,
  //   indexList:[57]
  // },
  {
    mintSubstraBlock:12136052,
    baseBlock:12126274,
    indexList:[
      60
    ]
  },
  {
    mintSubstraBlock:12136096,
    baseBlock:12126274,
    indexList:[
      //60
      //61,63
    ]
  }
  // {
  //   mintSubstraBlock:12136452,
  //   baseBlock:12126274,
  //   indexList:[98]
  // }
];

export const fullKusamarauderList=[...deployementList1,...deployementList2]

// Items for first mint

const weaponsFileNames = ["Fourche", "Gourdin", "Poele"];
const weaponsNames = ["Pitchfork", "Club", "Frying Pan"];
const weaponsDescription = [
  `Wooden pitchfork. Better than nothing...\nPOWER: 500`,
  `Wooden club. Better than nothing...\nPOWER: 500`,
  `Frying pan. Better than nothing...\nPOWER: 500`,
];
export const drawSlotSet = (): SlotSet => {
  const weaponIndex = Math.floor(weaponsNames.length * Math.random());
  return [
    {
      slotCategory: "Backgrounds",
      fileName: "Prison",
      traitName: "Prison Cell",
      zIndex: 0,
      traitDescription:
        "Tax fraud is no joke! In jail. It's cold and humid and there are rats about...",
    },
    {
      slotCategory: "Weapons",
      traitName: weaponsNames[weaponIndex],
      fileName: weaponsFileNames[weaponIndex],
      zIndex: 2,
      traitDescription: weaponsDescription[weaponIndex],
    },
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
  ];
};

// Items for 3rd items mint

const clothList=[{
  slotCategory: "Cloths",
  fileName: "Black",
  traitName: "Basic Cloth",
  zIndex: 14,
  traitDescription:
    "Basic black attire\nPOWER: 0 ",
},{
  slotCategory: "Cloths",
  fileName: "Blue",
  traitName: "Basic Cloth",
  zIndex: 14,
  traitDescription:
    "Basic blue attire\nPOWER: 0 ",
},{
  slotCategory: "Cloths",
  fileName: "Brown",
  traitName: "Basic Cloth",
  zIndex: 14,
  traitDescription:
    "Basic brown attire\nPOWER: 0 ",
},{
  slotCategory: "Cloths",
  fileName: "Cyan",
  traitName: "Basic Cloth",
  zIndex: 14,
  traitDescription:
    "Basic cyan attire\nPOWER: 0 ",
},{
  slotCategory: "Cloths",
  fileName: "Green",
  traitName: "Basic Cloth",
  zIndex: 14,
  traitDescription:
    "Basic green attire\nPOWER: 0 ",
},{
  slotCategory: "Cloths",
  fileName: "Orange",
  traitName: "Basic Cloth",
  zIndex: 14,
  traitDescription:
    "Basic orange attire\nPOWER: 0 ",
},{
  slotCategory: "Cloths",
  fileName: "Purple",
  traitName: "Basic Cloth",
  zIndex: 14,
  traitDescription:
    "Basic purple attire\nPOWER: 0 ",
},{
  slotCategory: "Cloths",
  fileName: "Red",
  traitName: "Basic Cloth",
  zIndex: 14,
  traitDescription:
    "Basic red attire\nPOWER: 0 ",
},{
  slotCategory: "Cloths",
  fileName: "White",
  traitName: "Basic Cloth",
  zIndex: 14,
  traitDescription:
    "Basic white attire\nPOWER: 0 ",
},{
  slotCategory: "Cloths",
  fileName: "Yellow",
  traitName: "Basic Cloth",
  zIndex: 14,
  traitDescription:
    "Basic yellow attire\nPOWER: 0 ",
}]
export const drawClothSet = (): SlotSet => {
  const clothIndex = Math.floor(clothList.length * Math.random());
  return [clothList[clothIndex]];
};