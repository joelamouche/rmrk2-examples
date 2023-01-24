import fs from "fs";
import { sendAndFinalize, getApi } from "../utils";
import {
  FixedTrait,
  FixedTraitSet,
  WS_URL,
  FixedSetProba,
  FixedPartProba,
  LATEST_SOLDIER_SET,
} from "../constants";
import { createBase } from "./create-soldier-collection-base";
import {
  getTxAddBaseResource,
  getTxMintSubstraknight,
} from "./mint-soldier-tx";
import { KeyringPair } from "@polkadot/keyring/types";
import { allFixedPartsList } from "../constants/misc";
import { createSubstraknightCollection } from "soldier-lib/soldier-collection-utils";

export const getMintOneBaseTx = async (
  kp: KeyringPair,
  baseBlock: number,
  fixedPartsSet: FixedTraitSet,
  api,
  soldierIndex
) => {
  // Create collection
  const { collectionId } = await createSubstraknightCollection(kp);

  const txsMintSubtra = await getTxMintSubstraknight(kp, api, soldierIndex);
  const tx = api.tx.utility.batchAll(txsMintSubtra);
  const { block } = await sendAndFinalize(tx, kp);
  console.log("Batch Substraknight NFT minted at block: ", block);
  // Add Base
  const txsAddBase = await getTxAddBaseResource(
    kp,
    block,
    baseBlock,
    fixedPartsSet,
    api,
    collectionId,
    soldierIndex
  );
  const tx2 = api.tx.utility.batchAll(txsAddBase);
  const { block: block2 } = await sendAndFinalize(tx2, kp);
  console.log("Batch Substraknight NFT minted at block: ", block2);
};

export const mintListBaseTx = async (
  kp: KeyringPair,
  baseBlock: number,
  fixedSetList: FixedTraitSet[],
  api,
  collectionId,
  offset: number
) => {
  //Batch Mint Substras
  console.log(
    "----------------------------------STARTING MINT FOR FIRST BATCH"
  );
  let totalTxListMint = [];
  for (let i = 0; i < fixedSetList.length; i++) {
    const txsMintSubtra = await getTxMintSubstraknight(kp, api, i + offset);
    totalTxListMint = [...totalTxListMint, ...txsMintSubtra];
  }
  const tx = api.tx.utility.batchAll(totalTxListMint);
  const { block } = await sendAndFinalize(tx, kp);
  console.log("Batch Substraknight NFT minted at block: ", block);

  // Batch Add Base
  console.log(
    "----------------------------------STARTING MINT FOR ADD BASE BATCH"
  );
  let totalTxListAddABase = [];
  for (let i = 0; i < fixedSetList.length; i++) {
    const txsAddBase = await getTxAddBaseResource(
      kp,
      block,
      baseBlock,
      fixedSetList[i],
      api,
      collectionId,
      i + offset
    );
    totalTxListAddABase = [...totalTxListAddABase, ...txsAddBase];
  }
  const tx2 = api.tx.utility.batchAll(totalTxListAddABase);
  const { block: block2 } = await sendAndFinalize(tx2, kp);
  console.log("Batch Substraknight NFT base added at block: ", block2);
  return { mintSubstraBlock: block, addBaseBlock: block2 };
};

export const runMintSequenceBatch = async (kp: KeyringPair) => {
  try {
    const ws = WS_URL;
    const api = await getApi(ws);
    const baseBlock = await createBase(kp, allFixedPartsList, []);
    console.log("BASE CREATED");
    let mintList: FixedTraitSet[] = [];
    // Create collection
    const { collectionId } = await createSubstraknightCollection(kp);
    // create list of sets
    allFixedPartsList[0].traits.forEach(async (trait0, i) => {
      allFixedPartsList[1].traits.forEach(async (trait1, j) => {
        allFixedPartsList[2].traits.forEach(async (trait2, k) => {
          mintList.push(
            [
              {
                traitClass: allFixedPartsList[0].traitClass,
                trait: trait0,
                zIndex: 0,
              },
              {
                traitClass: allFixedPartsList[1].traitClass,
                trait: trait1,
                zIndex: 1,
              },
              {
                traitClass: allFixedPartsList[2].traitClass,
                trait: trait2,
                zIndex: 2,
              },
            ].filter((fixedTrait: FixedTrait) => fixedTrait.trait !== "_")
          );
        });
      });
    });
    console.log("mintList", mintList);
    await mintListBaseTx(kp, baseBlock, mintList, api, collectionId, 0);

    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};

async function getListFromPath(path: string): Promise<FixedTraitSet[]> {
  return new Promise((res) => {
    fs.readFile(path, (err, data) => {
      if (err) throw err;
      let setList = JSON.parse(data.toString());
      res(setList);
    });
  });
}

// Get list of fixed trait set
export const getLatestSetList = async (): Promise<FixedTraitSet[]> => {
  return await getListFromPath(LATEST_SOLDIER_SET);
};

// Get list of fixed trait set
export const getOldSetList = async (): Promise<FixedTraitSet[]> => {
  return [
    ...(await getListFromPath(
      "drawnSets/drawnset-100-5-4-2022-9:58:22 PM.json"
    )),
    ...(await getListFromPath(
      "drawnSets/drawnset-100-5-4-2022-9:58:22 PM.json"
    )),
  ];
};

// Run mint seq with probas
//unused
export const runMintSequenceBatchWithProba = async (
  kp: KeyringPair,
  _fixedSetProba: FixedSetProba
) => {
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
    const baseBlock = await createBase(kp, allBaseParts, []);
    console.log("BASE CREATED");
    // Create collection
    const { collectionId } = await createSubstraknightCollection(kp);

    // mint all
    await mintListBaseTx(
      kp,
      baseBlock,
      await getLatestSetList(),
      api,
      collectionId,
      0
    );
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};
