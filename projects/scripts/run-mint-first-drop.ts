import fs from "fs";
import { WS_URL, FixedTraitSet, substraKnightsAddress } from "./constants";
import { mintAndEquipAllItemsFromSetList } from "./item-lib/mint-substra-items";
import { getApi, sleep } from "./utils";
import {
  getLatestSetList,
  mintListBaseTx,
} from "./soldier-lib/mint-soldier-fixedParts";
import { drawVillainSlotSet } from "./constants/item-list";
import { getKeyringFromMnemonic } from "./utils/mnemonic-utils";

async function mintSeries(
  kp,
  baseBlock: number,
  fixedPartList: FixedTraitSet[],
  api,
  collectionId: string,
  offset: number,
  needCollectionMint
) {
  const { mintSubstraBlock, addBaseBlock } = await mintListBaseTx(
    kp,
    baseBlock,
    fixedPartList,
    api,
    collectionId,
    offset
  );

  // Add items
  const drawnSlotList = fixedPartList.map((_) => drawVillainSlotSet());
  console.log("drawnSlotList", drawnSlotList);

  const { mintItemBlock, resaddSendBlock } =
    await mintAndEquipAllItemsFromSetList(
      kp,
      mintSubstraBlock,
      baseBlock,
      fixedPartList.length,
      drawnSlotList,
      offset,
      needCollectionMint
    );

  // Save deployement
  let data = JSON.stringify({
    address: kp.address,
    time: Date.now().toLocaleString(),
    baseBlock,
    collectionId,
    mintSubstraBlock,
    addBaseBlock,
    mintItemBlock,
    resaddSendBlock,
    offset,
  });
  fs.writeFileSync(
    `deployements/deployement/deployement-${fixedPartList.length}-${new Date(
      Date.now()
    ).getDate()}-${new Date(Date.now()).getMonth() + 1}-${new Date(
      Date.now()
    ).getUTCFullYear()}-${new Date(Date.now()).toLocaleTimeString()}.json`,
    data
  );
}

export const mintSoldiersInBatches = async () => {
  try {
    const ws = WS_URL;
    const api = await getApi(ws);

    // CHECK MNEMONIC
    const kp = getKeyringFromMnemonic(process.env.MNEMONIC);
    if (kp.address === substraKnightsAddress) {
      console.log("RIGHT ADDRESS : " + kp.address);
    } else {
      console.log("WRONG ADDRESS : " + kp.address);
      console.log("SHOULD BE : " + substraKnightsAddress);
      return;
    }

    // GET FIXED PART LIST TO EQUIP ON THE SOLDIERS
    const fixedPartList = await getLatestSetList();

    // MINT SOLDIERS IN BATCHES
    const step = 2; // adjust the number of soldiers per batch here
    for (let j = 8; j < 15; j++) {
      // adjust the maximum number of soldiers here
      console.log(
        "++++++++++++______________++++++++++++_____________+++++++++____________SEQ___ " +
          j +
          "____" +
          j * step
      );
      await mintSeries(
        kp,
        12126274,
        fixedPartList.slice(j * step, (j + 1) * step),
        api,
        "7472058104f9f93924-SKC",
        120 + j * step,
        false //j === 0
      );
      await sleep(10000);
    }
    console.log("SCRIPT OVER");
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};
mintSoldiersInBatches();
