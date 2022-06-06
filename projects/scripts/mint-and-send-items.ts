import fs from "fs";
import {
  SlotSet,
  slotConfigSet,
  FixedTraitSet,
  substraKnightsAddress,
  fullKusamarauderList,
  SoldierDeployement,
  LATEST_CID,
} from "./constants";
import { createBase } from "./create-base";
import { createSubstraknightCollection } from "./mint-substra";
import {
  mintAndEquipAllItemsFromSetList,
  mintItemsFromSet,
  sendItemsToSoldier,
} from "./mint-substra-items";
import { getApi, getKeyringFromMnemonic, getKeyringFromUri } from "./utils";
import { getLatestSetList, mintListBaseTx } from "./run-mint-fixedParts";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import {
  drawClothSet,
  drawVillainSlotSet,
  selectedSlot,
  slotSet,
} from "./constants/item-list";
import {
  breastplate,
  katanaCollabs,
  katanaList,
} from "./constants/misc-items/katanaList";
import {
  scoutAxe,
  shieldCollabList,
  shieldList,
} from "./constants/misc-items/shieldList";
import { event8List, event8ListTest } from "./constants/itemDeployementList/event8List";
import { eventBoss1 } from "./constants/itemDeployementList/eventBoss1";
import { merchantItems } from "./constants/itemDeployementList/merchantObjects";
import { event2205 } from "./constants/itemDeployementList/event2205";
import { merchant2405 } from "./constants/itemDeployementList/merchant2405";
import { generatePants } from "./constants/itemDeployementList/generatePants";

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
// const addItemsToSoldierDeployement = async (
//   dep: Deployement,
//   _slotSet: SlotSet,
//   cID: string,
//   indexWhiteList: number[]
// ) => {
//   for (let k = 0; k < dep.indexList.length; k++) {
//     if (indexWhiteList.includes(dep.indexList[k])) {
//       await mintOneSetForOneSoldier(
//         dep.mintSubstraBlock,
//         dep.baseBlock,
//         _slotSet,
//         dep.indexList[k] - 1, //write one under the targeted index
//         cID,
//         false
//       );
//     } else {
//       console.log(`Index skiped : ${dep.indexList[k]}`);
//     }
//   }
// };
export const deployItemsForSoldierList = async (
  dep: Deployement[],
  indexWhiteList: number[],
  equipableList: SlotSet,
  ipfsHash: string
) => {
  // TODO CHECK ZINDEX
  await cryptoWaitReady();
  if (checkPresenceOfAllSoldiers(dep, indexWhiteList)) {
    console.log("+all soldiers there+");
    for (let j = 0; j < dep.length; j++) {
      for (let k = 0; k < dep[j].indexList.length; k++) {
        if (indexWhiteList.includes(dep[j].indexList[k])) {
          console.log("Equiping sets : ", equipableList);
          await mintOneSetForOneSoldier(
            dep[j].mintSubstraBlock,
            dep[j].baseBlock,
            equipableList,
            dep[j].indexList[k] - 1, //write one under the targeted index
            ipfsHash,
            false
          );
        } else {
          console.log(`Index skiped : ${dep[j].indexList[k]}`);
        }
      }
    }
  } else {
    console.log("---      MISSING --- SOLDIER     - - ERR");
  }
};

export const main = async (eventList: SoldierDeployement[], ipfsHash) => {
  // TODO CHECK ZINDEX
  for (let k = 0; k < eventList.length; k++) {
    console.log("eventList k",eventList[k])
    if (eventList[k]){
      await deployItemsForSoldierList(
        fullKusamarauderList,
        [eventList[k].kusamarauderNumber],
        eventList[k].items,
        ipfsHash
      );
    } else {
      console.log("EMPTY LIST ITEM")
    }
  }

  // send items
  //   await cryptoWaitReady();
  // const kp = getKeyringFromMnemonic(process.env.MNEMONIC);
  // await cryptoWaitReady();
  // await sendItemsToSoldier(kp,12136319,12310017,83-1,98,{
  //         slotCategory: "Backgrounds",
  //         fileName: "ForestBackground",
  //         traitName: "Forest Camp",
  //         zIndex: 0,
  //         traitDescription: "Out of prison, out of trouble... For now...",
  //       })

  console.log("SCRIPT OVER");
  process.exit();
};
main([
  {
    kusamarauderNumber:92,
    items: [
      {
     slotCategory: "Weapons",
     fileName: "ListenSword",
     traitName: "Listen Katana",
     zIndex: 2,
     traitDescription:
       "A well crafted blade, Listen Shogun Katana.\nPOWER: 1500",
   }
  ]
 },{
  kusamarauderNumber:72,
  items: [
    {
   slotCategory: "Heads",
   fileName: "LegionaryHelmet",
   traitName: "Legionary Helmet",
   zIndex: 16,
   traitDescription:
     "A solid helmet covering most of the head.\nPOWER: 200",
 }
]
}

], LATEST_CID);
