import fs from 'fs'
import { getKeyringFromUri, sendAndFinalize, getApi } from "./utils";
import {
  allFixedPartsList,
  // fixedPartsSet,
  FixedTrait,
  FixedSet,
  WS_URL,
  fixedSetProba,
  FixedSetProba,
  FixedPartProba,
} from "./constants";
import { createBase } from "./create-base";
import {
  createSubstraknightCollection,
  getTxAddBaseResource,
  getTxMintSubstraknight,
  mintSubstraknight,
} from "./mint-substra";
import { addBaseResource } from "./mint-substra";
import { mintItems } from "./mint-substra-items";

export const mintOneBase = async (
  baseBlock: number,
  fixedPartsSet: FixedSet,
  soldierIndex
) => {
  const substrasBlock = await mintSubstraknight(soldierIndex);
  await addBaseResource(substrasBlock, baseBlock, fixedPartsSet,soldierIndex);
};

export const mintOneBaseTx = async (
  baseBlock: number,
  fixedPartsSet: FixedSet,
  api,
  soldierIndex
) => {
  // Create collection
  const { collectionId } = await createSubstraknightCollection();

  const phrase = process.env.PRIVAKE_KEY;
  const kp = getKeyringFromUri(phrase);
  const txsMintSubtra = await getTxMintSubstraknight(api,soldierIndex);
  const tx = api.tx.utility.batchAll(txsMintSubtra);
  const { block } = await sendAndFinalize(tx, kp);
  console.log("Batch Substraknight NFT minted at block: ", block);
  // Add Base
  const txsAddBase = await getTxAddBaseResource(
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

  //await addBaseResource(block, baseBlock, fixedPartsSet);
};

export const mintListBaseTx = async (
  baseBlock: number,
  fixedSetList: FixedSet[],
  api,
  collectionId
) => {
  //Batch Mint Substras
  console.log(
    "----------------------------------STARTING MINT FOR FIRST BATCH"
  );
  const phrase = process.env.PRIVAKE_KEY;
  const kp = getKeyringFromUri(phrase);
  let totalTxListMint = [];
  for (let i = 0; i < fixedSetList.length; i++) {
    const txsMintSubtra = await getTxMintSubstraknight(api, i);
    console.log("got tx for substra ",i)
    totalTxListMint = [ ...totalTxListMint,...txsMintSubtra];
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
      block,
      baseBlock,
      fixedSetList[i],
      api,
      collectionId,
      i
    );
    totalTxListAddABase = [...totalTxListAddABase , ...txsAddBase];
  }
  const tx2 = api.tx.utility.batchAll(totalTxListAddABase);
  const { block: block2 } = await sendAndFinalize(tx2, kp);
  console.log("Batch Substraknight NFT base added at block: ", block2);

  //await addBaseResource(block, baseBlock, fixedPartsSet);
};
export const runMintSequence = async () => {
  try {
    const baseBlock = await createBase(allFixedPartsList,[]);
    console.log("BASE CREATED");
    let mintList = [];
    allFixedPartsList[0].traits.forEach(async (trait0, i) => {
      allFixedPartsList[1].traits.forEach(async (trait1, j) => {
        allFixedPartsList[2].traits.forEach(async (trait2, k) => {
          mintList.push(
            [
              {
                traitClass: "NakedMan",
                trait: trait0,
                zIndex: 0,
              },
              {
                traitClass: "Eyes",
                trait: trait1,
                zIndex: 1,
              },
              {
                traitClass: "Node",
                trait: trait2,
                zIndex: 2,
              },
            ].filter((fixedTrait: FixedTrait) => fixedTrait.trait !== "_")
          );
        });
      });
    });
    console.log("mintList", mintList);
    for (let i = 0; i < mintList.length; i++) {
      console.log("----------------------------------STARTING MINT FOR");
      console.log(mintList[i]);
      await mintOneBase(baseBlock, mintList[i],i);
    }
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};
export const runMintSequenceBatch = async () => {
  try {
    const ws = WS_URL;
    const api = await getApi(ws);
    const baseBlock = await createBase(allFixedPartsList,[]);
    console.log("BASE CREATED");
    let mintList:FixedSet[] = [];
    // Create collection
    const { collectionId } = await createSubstraknightCollection();
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
    await mintListBaseTx(baseBlock, mintList, api, collectionId);
    // for(let i=0;i<mintList.length;i++){
    //     console.log("----------------------------------STARTING MINT FOR")
    //     console.log(mintList[i])
    //     await mintOneBase(baseBlock,mintList[i])
    // }
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};
export const getSetList=async():Promise<FixedSet[]>=>{
  return new Promise((res)=>{
    fs.readFile("drawnSets/drawnset1.json", (err, data) => {
      if (err) throw err;
      let setList = JSON.parse(data.toString());
      res(setList)
    });
  })
}
export const runMintSequenceBatchWithProba = async (_fixedSetProba:FixedSetProba) => {
  try {
    const ws = WS_URL;
    const api = await getApi(ws);
    const allBaseParts=_fixedSetProba.map((fixedPartProba:FixedPartProba)=>{
      const {traits,traitClass,zIndex}=fixedPartProba;
      return {
        traitClass,
        zIndex,
        traits:traits.map((trait)=>trait.traitName)
      }
    })
    console.log("allBaseParts",allBaseParts)
    const baseBlock = await createBase(allBaseParts,[]);
    console.log("BASE CREATED");
    // Create collection
    const { collectionId } = await createSubstraknightCollection();
    
    // mint all
    await mintListBaseTx(baseBlock, await getSetList(), api, collectionId);
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};

runMintSequenceBatchWithProba(fixedSetProba);
