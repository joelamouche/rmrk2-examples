import { Collection } from "rmrk-tools";
import { u8aToHex } from "@polkadot/util";
import fs from "fs";

import {
  Deployement,
  FULL_KUSAMARAUDER_LIST,
  SlotSet,
  SlotTrait,
  SoldierDeployement,
  substraKnightsAddress,
  SUBSTRAKNIGHT_COLLECTION_SYMBOL,
  WS_URL,
} from "../constants";
import { getApi, sendAndFinalize } from "../utils";
import {
  getSendItemsToSoldierTx,
  mintAndEquipAllItemsFromSetList,
} from "./mint-substra-items";
import { KeyringPair } from "@polkadot/keyring/types";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { getKeyringFromMnemonic } from "../utils/mnemonic-utils";

export const mintOneSetForOneSoldier = async (
  mintSubstraBlock,
  baseBlock,
  _slotSet: SlotSet,
  soldierNumber: number,
  customCID: string,
  needCreateItemCollection: boolean
) => {
  const kp = getKeyringFromMnemonic(process.env.MNEMONIC);
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

export const deployItemsForSoldierList = async (
  dep: Deployement[],
  indexWhiteList: number[],
  equipableList: SlotSet,
  ipfsHash: string
) => {
  // TODO CHECK ZINDEX
  // await cryptoWaitReady();
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

export async function mintAndSendItemsForEvent(
  eventList: SoldierDeployement[],
  ipfsHash: any
) {
  // TODO CHECK ZINDEX
  for (let k = 0; k < eventList.length; k++) {
    console.log("eventList k", eventList[k]);
    if (eventList[k]) {
      await deployItemsForSoldierList(
        FULL_KUSAMARAUDER_LIST,
        [eventList[k].kusamarauderNumber],
        eventList[k].items,
        ipfsHash
      );
    } else {
      console.log("EMPTY LIST ITEM");
    }
  }
}

export const sendItemsToSoldier = async (
  kp: KeyringPair,
  destSubstraBlock: number,
  mintItemBlock: number,
  soldierNumber: number,
  slotIndex: number,
  slot: SlotTrait
) => {
  try {
    console.log(`SEND ITEM TO ${soldierNumber + 1} SOLDIER START -------`);
    await cryptoWaitReady();
    const ws = WS_URL;
    const api = await getApi(ws);

    const substraCollectionId = Collection.generateId(
      u8aToHex(kp.publicKey),
      SUBSTRAKNIGHT_COLLECTION_SYMBOL
    );

    // Get add base and equip tx
    //let totalTxAddBase = [];
    // for (let j = 0; j < numberOfSoldiers; j++) {
    const txsSendItemToSoldier = await getSendItemsToSoldierTx(
      kp,
      destSubstraBlock,
      mintItemBlock,
      substraCollectionId,
      soldierNumber,
      slotIndex,
      slot
    );
    //totalTxAddBase = [...totalTxAddBase, ...txsAddBaseItem];
    //}

    const resbatch = api.tx.utility.batch(txsSendItemToSoldier);
    const { block: resaddSendBlock } = await sendAndFinalize(resbatch, kp);
    console.log(
      "SUBSTRAKNIGHT ITEMS RESOURCE ADDED AND SENT: ",
      resaddSendBlock
    );
    return { mintItemBlock, resaddSendBlock };
  } catch (error: any) {
    console.log("ERR HIGH LVL");
    throw error;
    process.exit();
  }
};
