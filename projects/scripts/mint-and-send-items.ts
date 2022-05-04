import fs from "fs";
import {
  SlotSet,
  slotConfigSet,
  FixedTraitSet,
  substraKnightsAddress,
  fullKusamarauderList,
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
import { drawClothSet, drawVillainSlotSet, selectedSlot, slotSet } from "./constants/item-list";
import { breastplate, katanaCollabs, katanaList } from "./constants/misc-items/katanaList";
import { scoutAxe, shieldCollabList, shieldList } from "./constants/misc-items/shieldList";

export const mintOneSetForOneSoldier = async (
  mintSubstraBlock,
  baseBlock,
  _slotSet: SlotSet,
  soldierNumber: number,
  customCID: string,
  needCreateItemCollection: boolean
) => {
  // const ws = WS_URL;
  // const api = await getApi(ws);
  const kp = getKeyringFromMnemonic(process.env.MNEMONIC); //getKeyringFromMnemonic(process.env.MNEMONIC);
  if (kp.address === substraKnightsAddress) {
    console.log("RIGHT ADDRESS : " + kp.address);
  } else {
    console.log("WRONG ADDRESS : " + kp.address);
    console.log("SHOULD BE : " + substraKnightsAddress);
    return;
  }
  // Add items

  const { mintItemBlock, resaddSendBlock } =
    await mintAndEquipAllItemsFromSetList(
      kp,
      mintSubstraBlock,
      baseBlock,
      1,
      [_slotSet],
      soldierNumber,
      needCreateItemCollection,
      customCID
    );
  // Save deployement
  let data = JSON.stringify({
    address: kp.address,
    time: Date.now().toLocaleString(),
    baseBlock,
    mintSubstraBlock,
    mintItemBlock,
    resaddSendBlock,
    soldierNumber,
  });
  fs.writeFileSync(
    `deployements/addItems/add-items-${_slotSet.length}-${new Date(
      Date.now()
    ).getDate()}-${new Date(Date.now()).getMonth() + 1}-${new Date(
      Date.now()
    ).getUTCFullYear()}-${new Date(Date.now()).toLocaleTimeString()}.json`,
    data
  );
  // runFirstDropSeq(fixedSetProba);
};

const checkPresenceOfAllSoldiers = (
  _depList: Deployement[],
  indexWhiteList: number[]
) => {
  function lookForIndex(index, depList: Deployement[]) {
    for (let j = 0; j < depList.length; j++) {
      let indexList = depList[j].indexList;
      for (let k = 0; k < indexList.length; k++) {
        if (indexList[k] === index) {
          return true;
        }
      }
    }
    console.log(`Missing Soldier info : ${index}`);
    return false;
  }
  let areAllThere = indexWhiteList.reduce((prev, cur) => {
    return prev && lookForIndex(cur, _depList);
  }, true);
  if (!areAllThere) {
    console.log("NOT ALL THERE");
  }
  return areAllThere;
};

interface Deployement {
  mintSubstraBlock: number;
  baseBlock: number;
  indexList: number[];
}
const addItemsToSoldierDeployement = async (
  dep: Deployement,
  _slotSet: SlotSet,
  cID: string,
  indexWhiteList: number[]
) => {
  for (let k = 0; k < dep.indexList.length; k++) {
    if (indexWhiteList.includes(dep.indexList[k])) {
      await mintOneSetForOneSoldier(
        dep.mintSubstraBlock,
        dep.baseBlock,
        _slotSet,
        dep.indexList[k] - 1, //write one under the targeted index
        cID,
        false
      );
    } else {
      console.log(`Index skiped : ${dep.indexList[k]}`);
    }
  }
};
export const runMain = async (dep: Deployement[], indexWhiteList: number[]) => {
  // await addToDeployement(deployement1,slotSet,"QmX2nTV2TpT6snZJt4eD189CkzzFFxuQUy1VbEQxKisncU")
  // await addToDeployement(deployement2,slotSet,"QmX2nTV2TpT6snZJt4eD189CkzzFFxuQUy1VbEQxKisncU")
  await cryptoWaitReady()
  if (checkPresenceOfAllSoldiers(dep,indexWhiteList)) {
    console.log("+all soldiers there+")
    let kanataIndex=2
    for (let j = 0; j < dep.length; j++) {
  for (let k = 0; k < dep[j].indexList.length; k++) {
    if (indexWhiteList.includes(dep[j].indexList[k])) {
      console.log(kanataIndex)
      //console.log(shieldCollabList[kanataIndex])
      await mintOneSetForOneSoldier(
        dep[j].mintSubstraBlock,
        dep[j].baseBlock,
        [{
          slotCategory: "Weapons",
          fileName: "IntegriteeSword",
          traitName: "Integritee Katana",
          zIndex: 2,
          traitDescription:
            "A well crafted blade, Integritee Shogun Katana.\nPOWER: 1500",
        }],
         //[scoutAxe],
        dep[j].indexList[k] - 1, //write one under the targeted index
        "QmYSPchjrfnTBEH3hmxi9pDons9kURoNtwiMtYHmT2uw3Q",
        false
      );
      kanataIndex=1+kanataIndex
    } else {
      console.log(`Index skiped : ${dep[j].indexList[k]}`);
    }
  }
    }
  } else {
    console.log("---      MISSING --- SOLDIER     - -");
  }

  console.log("SCRIPT OVER");
  process.exit();
};
runMain(fullKusamarauderList, [
  24
]);
