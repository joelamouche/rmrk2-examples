import fs from "fs";
import {
  WS_URL,
  fixedSetProba,
  FixedSetProba,
  FixedPartProba,
  SlotSet,
  slotConfigSet,
  FixedTraitSet,
  substraKnightsAddress,
  deployementList2,
  drawClothSet,
  deployement1,
  deployementList1,
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

const slotSet: SlotSet = [
  {
    slotCategory: "Backgrounds",
    fileName: "ForestBackground",
    traitName: "Forest Camp",
    zIndex: 0,
    traitDescription:
      "Out of prison, out of trouble... For now...",
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
    `deployements/addItems/add-items-${_slotSet.length}-${new Date(Date.now()).getDate()}-${
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
const addItemToSoldierDeployement = async (
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
    await addItemToSoldierDeployement(
      dep[j],
      slotSet,
      "QmPpmmLfsAs5PpVDY6ZK8Yr3MVfNbcreE9Qa8E283VeoBB"
    );
  }

  console.log("SCRIPT OVER");
  process.exit();
};
runMain(deployementList2);
