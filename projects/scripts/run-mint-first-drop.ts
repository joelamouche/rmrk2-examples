import {
  WS_URL,
  fixedSetProba,
  FixedSetProba,
  FixedPartProba,
  SlotSet,
  slotConfigSet,
} from "./constants";
import { createBase } from "./create-base";
import { createSubstraknightCollection } from "./mint-substra";
import { mintAndEquipAllItemsFromSetList, mintItemsFromSet } from "./mint-substra-items";
import { getApi } from "./utils";
import { getSetList, mintListBaseTx } from "./run-mint-fixedParts";

const weapons = ["Fourche", "Gourdin", "Poele"];
export const drawSlotSet = (): SlotSet => {
  return [
    { slotCategory: "Background", traitName: "Prison", zIndex: 0 },
    {
      slotCategory: "Weapon",
      traitName: weapons[Math.floor(weapons.length * Math.random())],
      zIndex: 1,
    },
    { slotCategory: "Legs", traitName: "Pants1", zIndex: 10 },
    { slotCategory: "Underhelm", traitName: "Underhelm1", zIndex: 11 },
    { slotCategory: "Cloth", traitName: "Cloth1", zIndex: 12 },
    { slotCategory: "Feet", traitName: "Feet1", zIndex: 13 },
    { slotCategory: "Arms", traitName: "Arms1", zIndex: 14 }
  ];
};

export const runFirstDropSeq = async (_fixedSetProba: FixedSetProba) => {
  try {
    const ws = WS_URL;
    const api = await getApi(ws);
    const allBaseParts = _fixedSetProba.map(
      (fixedPartProba: FixedPartProba) => {
        const { traits, traitClass, zIndex } = fixedPartProba;
        return {
          traitClass,
          zIndex,
          traits: traits.map((trait) => trait.traitName),
        };
      }
    );
    console.log("allBaseParts", allBaseParts);
    const baseBlock = await createBase(allBaseParts, slotConfigSet);
    console.log("BASE CREATED");
    // Create collection
    const { collectionId } = await createSubstraknightCollection();

    const fixedPartList=await getSetList()

    // mint all bases
    const { mintSubstraBlock } = await mintListBaseTx(
      baseBlock,
      fixedPartList,
      api,
      collectionId
    );

    // Add items
    const drawnSlotList=fixedPartList.map((_)=>drawSlotSet()) 
    console.log("drawnSlotList",drawnSlotList)
    await mintAndEquipAllItemsFromSetList(mintSubstraBlock, baseBlock, fixedPartList.length, drawnSlotList);
    //   await mintItemsFromSet(mintSubstraBlock,baseBlock,1,drawSlotSet())
    //   await mintItemsFromSet(mintSubstraBlock,baseBlock,2,drawSlotSet())

    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};

runFirstDropSeq(fixedSetProba);
