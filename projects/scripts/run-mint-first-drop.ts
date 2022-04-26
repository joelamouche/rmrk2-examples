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
  drawSlotSet,
} from "./constants";
import { createBase } from "./create-base";
import { createSubstraknightCollection } from "./mint-substra";
import { mintAndEquipAllItemsFromSetList } from "./mint-substra-items";
import {
  getApi,
  getKeyringFromMnemonic,
  getKeyringFromUri,
  sleep,
} from "./utils";
import { getSetList, mintListBaseTx } from "./run-mint-fixedParts";
import { cryptoWaitReady } from "@polkadot/util-crypto";


// not used
export const runFirstDropSeq = async (_fixedSetProba: FixedSetProba) => {
  try {
    const ws = WS_URL;
    const api = await getApi(ws);

    // Fetch Key Pair
    await cryptoWaitReady();
    //const kp=getKeyringFromUri(process.env.PRIVAKE_KEY)
    const kp = getKeyringFromMnemonic(process.env.MNEMONIC); //getKeyringFromMnemonic(process.env.MNEMONIC);
    if (kp.address === substraKnightsAddress) {
      console.log("RIGHT ADDRESS : " + kp.address);
    } else {
      console.log("WRONG ADDRESS : " + kp.address);
      console.log("SHOULD BE : " + substraKnightsAddress);
      return;
    }

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
    const baseBlock = await createBase(kp, allBaseParts, slotConfigSet);
    console.log("BASE CREATED");

    // Create Subtra collection
    const { collectionId } = await createSubstraknightCollection(kp);

    const fixedPartList = await getSetList();

    // mint all bases
    console.log("baseBlock", baseBlock);
    console.log("collectionId", collectionId);
    let data = JSON.stringify({
      address: kp.address,
      time: Date.now().toLocaleString(),
      baseBlock,
      collectionId,
    });
    fs.writeFileSync(
      `drawnSets/base-and-collection-${fixedPartList.length}-${new Date(
        Date.now()
      ).getDate()}-${new Date(Date.now()).getMonth() + 1}-${new Date(
        Date.now()
      ).getUTCFullYear()}-${new Date(Date.now()).toLocaleTimeString()}.json`,
      data
    );

    const step = 2;
    for (let j = 0; j < 50; j++) {
      console.log(
        "++++++++++++______________++++++++++++_____________+++++++++____________SEQ___ " +
          j +
          "____" +
          j * step
      );
      await mintSeries(
        kp,
        baseBlock,
        fixedPartList.slice(j * step, (j + 1) * step),
        api,
        collectionId,
        j * step,
        j === 0
      );
      await wait(60000);
    }

    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }

  async function wait(duration: number) {
    return new Promise((res) => setTimeout(res, duration));
  }
};

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
  const drawnSlotList = fixedPartList.map((_) => drawSlotSet());
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
    `drawnSets/deployement-${fixedPartList.length}-${new Date(
      Date.now()
    ).getDate()}-${new Date(Date.now()).getMonth() + 1}-${new Date(
      Date.now()
    ).getUTCFullYear()}-${new Date(Date.now()).toLocaleTimeString()}.json`,
    data
  );
}

export const runMain = async () => {
  try {
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
    const fixedPartList = await getSetList();
    //await mintSeries(kp, 12126274, fixedPartList.slice(16,17), api, "7472058104f9f93924-SKC",16,false);

    const step = 4;
    for (let j = 20; j < 25; j++) {
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
        j * step,
        j === 0
      );
      await sleep(60000);
    }
    //runFirstDropSeq
    console.log("SCRIPT OVER");
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};
runMain();
