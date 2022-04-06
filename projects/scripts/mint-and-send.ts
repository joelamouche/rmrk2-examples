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
    slotCategory: "Pet",
    fileName: "Fourche",
    traitName: "Test Pet",
    zIndex: 1,
    traitDescription: "Test pet will be burned",
  },
];

export const runMain = async (
  mintSubstraBlock,
  baseBlock,
  _slotSet: SlotSet,
  soldierNumber: number,
  customCID: string
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
      true,
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
  console.log("SCRIPT OVER");
  process.exit();
  // runFirstDropSeq(fixedSetProba);
};
runMain(
  12134818,
  12126274,
  slotSet,
  15,
  "QmU5fiuLSNaxpLq8Q9SV6cvEZSuHJp6QHwm8jNdrUBZwYY"
);
