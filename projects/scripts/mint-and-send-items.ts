import fs from "fs";
import {
  WS_URL,
  fixedSetProba,
  FixedSetProba,
  FixedPartProba,
  SlotSet,
  slotConfigSet,
  FixedSet,
  substraKnightsAddress,
  deployementList2,
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

const slotSet: SlotSet = [
  {
    slotCategory: "Weapons",
    fileName: "EvilFork",
    traitName: "Evil Fork",
    zIndex: 2,
    traitDescription:
      "Taken from the void monster, sharp & pointy.\nPOWER: 900",
  },
];

export const mintOneSetForOneSoldier = async (
  mintSubstraBlock,
  baseBlock,
  _slotSet: SlotSet,
  soldierNumber: number,
  customCID: string,
  needCreateItemCollection: boolean
) => {
  const ws = WS_URL;
  const api = await getApi(ws);
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
      _slotSet.length,
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
    `drawnSets/add-items-${_slotSet.length}-${new Date(Date.now()).getDate()}-${
      new Date(Date.now()).getMonth() + 1
    }-${new Date(Date.now()).getUTCFullYear()}-${new Date(
      Date.now()
    ).toLocaleTimeString()}.json`,
    data
  );
  // runFirstDropSeq(fixedSetProba);
};

interface Deployement {
  mintSubstraBlock: number;
  baseBlock: number;
  indexList: number[];
}
const addToDeployement = async (
  dep: Deployement,
  _slotSet: SlotSet,
  cID: string
) => {
  for (let j = 0; j < dep.indexList.length; j++) {
    await mintOneSetForOneSoldier(
      dep.mintSubstraBlock,
      dep.baseBlock,
      _slotSet,
      dep.indexList[j] - 1, //write one under the targeted index
      cID,
      false
    );
  }
};
export const runMain = async (dep: Deployement[]) => {
  // await addToDeployement(deployement1,slotSet,"QmX2nTV2TpT6snZJt4eD189CkzzFFxuQUy1VbEQxKisncU")
  // await addToDeployement(deployement2,slotSet,"QmX2nTV2TpT6snZJt4eD189CkzzFFxuQUy1VbEQxKisncU")

  for (let j = 0; j < dep.length; j++) {
    await addToDeployement(
      dep[j],
      slotSet,
      "QmX2nTV2TpT6snZJt4eD189CkzzFFxuQUy1VbEQxKisncU"
    );
  }

  console.log("SCRIPT OVER");
  process.exit();
};
runMain(deployementList2);
