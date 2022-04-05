import fs from "fs";
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
import {
  mintAndEquipAllItemsFromSetList,
  mintItemsFromSet,
} from "./mint-substra-items";
import { getApi, getKeyringFromMnemonic, getKeyringFromUri } from "./utils";
import { getSetList, mintListBaseTx } from "./run-mint-fixedParts";
import { cryptoWaitReady } from "@polkadot/util-crypto";

const weaponsFileNames = ["Fourche", "Gourdin", "Poele"];
const weaponsNames = ["Pitchfork", "Club", "Frying Pan"];
const weaponsDescription = [`Wooden pitchfork. Better than nothing...\nPOWER: 500`, `Wooden club. Better than nothing...\nPOWER: 500`, `Frying pan. Better than nothing...\nPOWER: 500`];
export const drawSlotSet = (): SlotSet => {
  const weaponIndex=Math.floor(weaponsNames.length * Math.random())
  return [
    {
      slotCategory: "Background",
      fileName: "Prison",
      traitName: "Prison cell",
      zIndex: 0,
      traitDescription: "Tax fraud is no joke! In jail. It's cold and humid and there are rats about...",
    },
    {
      slotCategory: "Weapon",
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
      slotCategory: "Underhelm",
      traitName: "Basic Collar",
      fileName: "Underhelm1",
      zIndex: 12,
      traitDescription: "Basic attire\nPOWER: 10",
    },
    {
      slotCategory: "Cloth",
      traitName: "Prisoner Cloth",
      fileName: "Cloth1",
      zIndex: 13,
      traitDescription: "Prisoner attire\nPOWER: 0",
    },
    {
      slotCategory: "Feet",
      traitName: "Prisoner Boots",
      fileName: "Feet1",
      zIndex: 14,
      traitDescription: "Prisoner attire\nPOWER: 20",
    },
    {
      slotCategory: "Head",
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
};

const substraKnightsAddress="FCzwhSLYhFdqdSXXdUM2nGGpgDFit24tX8ajgfXWj49VEwo"

export const runFirstDropSeq = async (_fixedSetProba: FixedSetProba) => {
  try {
    const ws = WS_URL;
    const api = await getApi(ws);

    // Fetch Key Pair
    await cryptoWaitReady();
    const kp=getKeyringFromUri(process.env.PRIVAKE_KEY)
    // const kp=getKeyringFromMnemonic(process.env.MNEMONIC)
    // if (kp.address===substraKnightsAddress){
    //   console.log("RIGHT ADDRESS : "+kp.address)
    // } else {
    //   console.log("WRONG ADDRESS : "+kp.address)
    //   console.log("SHOULD BE : "+substraKnightsAddress)
    //   return;
    // }

    // Create Base
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
    const baseBlock = await createBase(kp,allBaseParts, slotConfigSet);
    console.log("BASE CREATED");

    // Create Subtra collection
    const { collectionId } = await createSubstraknightCollection(kp);

    const fixedPartList = await getSetList();

    // mint all bases
    const { mintSubstraBlock, addBaseBlock } = await mintListBaseTx(
      kp,
      baseBlock,
      fixedPartList,
      api,
      collectionId
    );

    // Add items
    const drawnSlotList = fixedPartList.map((_) => drawSlotSet());
    console.log("drawnSlotList", drawnSlotList);

    const { mintItemBlock, resaddSendBlock } =
      await mintAndEquipAllItemsFromSetList(
        kp,
        mintSubstraBlock,
        baseBlock,
        fixedPartList.length,
        drawnSlotList
      );

    // Save deployement
    let data = JSON.stringify({
      address:kp.address,
      time: Date.now().toLocaleString(),
      baseBlock,
      collectionId,
      mintSubstraBlock,
      addBaseBlock,
      mintItemBlock,
      resaddSendBlock,
    });
    fs.writeFileSync(
      `drawnSets/deployement-${fixedPartList.length}-${new Date(Date.now()).getDate()}-${
        new Date(Date.now()).getMonth() + 1
      }-${new Date(Date.now()).getUTCFullYear()}-${new Date(
        Date.now()
      ).toLocaleTimeString()}.json`,
      data
    );

    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};

runFirstDropSeq(fixedSetProba);
