import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { getApi, getKeyringFromUri, getKeys, sendAndFinalize } from "./utils";
import {
  ASSETS_CID,
  SUBSTRAKNIGHT_BASE_SYMBOL,
  SUBSTRAKNIGHT_COLLECTION_SYMBOL,
  allFixedPartsList,
  slotList,
  WS_URL,
  soldierIndexList,
  FixedTrait,
} from "./constants";
import { Base, Collection, NFT } from "rmrk-tools";
import { u8aToHex } from "@polkadot/util";
import { pinSingleMetadataFromDir } from "./pinata-utils";
import { nanoid } from "nanoid";

export const addBaseResource = async (
  substraBlock: number,
  baseBlock: number,
  fixedPartSet: FixedTrait[]
) => {
  try {
    console.log("ADD BASE RESOURCE TO SUBSTRAKNIGHT NFT START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const api = await getApi(ws);

    // Create collection
    const { collectionId } = await createSubstraknightCollection();

    //add base res
    const txs = await getTxAddBaseResource(
      substraBlock,
      baseBlock,
      fixedPartSet,
      api,
      collectionId
    );
    const phrase = process.env.PRIVAKE_KEY;
    const kp = getKeyringFromUri(phrase);
    const tx = api.tx.utility.batch(txs);
    const { block } = await sendAndFinalize(tx, kp);
    console.log("Substraknight base resources added at block: ", block);
  } catch (error: any) {
    console.error(error);
  }
};

export const getTxAddBaseResource = async (
  substraBlock: number,
  baseBlock: number,
  fixedPartSet: FixedTrait[],
  api,
  collectionId: string,
  soldierIndex?: number
) => {
  try {
    console.log("ADD BASE RESOURCE TO SUBSTRAKNIGHT NFT START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const phrase = process.env.PRIVAKE_KEY;
    const kp = getKeyringFromUri(phrase);
    const serialNumbers = soldierIndexList;

    const baseEntity = new Base(
      baseBlock,
      SUBSTRAKNIGHT_BASE_SYMBOL,
      encodeAddress(kp.address, 2),
      "svg"
    );

    const BASE_ID = baseEntity.getId();

    const resourceRemarks = [];

    // for each soldier, add base ressource
    serialNumbers.forEach((sn) => {
      let index = soldierIndex ? soldierIndex : sn;
      // instantiate knight nft
      const substraNft = new NFT({
        block: substraBlock,
        collection: collectionId,
        symbol: `soldier_${index}`,
        transferable: 1,
        sn: `${index}`.padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        metadata: "",
      });

      // add base ressource
      const baseResId = nanoid(8);
      resourceRemarks.push(
        substraNft.resadd({
          base: BASE_ID,
          id: baseResId,
          parts: [
            ...fixedPartSet.map((fixedPart) => fixedPart.trait),
            ...slotList,
          ],
          thumb: `ipfs://ipfs/${ASSETS_CID}/substra/fixedParts/nakedman.png`,
        })
      );
    });

    return resourceRemarks.map((remark) => api.tx.system.remark(remark));
    // const tx = api.tx.utility.batch(txs);
    // const { block } = await sendAndFinalize(tx, kp);
    // console.log("Substraknight base resources added at block: ", block);
  } catch (error: any) {
    console.error(error);
  }
};

export const createSubstraknightCollection = async () => {
  try {
    console.log("CREATE SUBSTRAKNIGHT COLLECTION START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.PRIVAKE_KEY;
    const api = await getApi(ws);
    const kp = getKeyringFromUri(phrase);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      SUBSTRAKNIGHT_COLLECTION_SYMBOL
    );

    const collectionMetadataCid = await pinSingleMetadataFromDir(
      "/assets/substra/fixedParts",
      "nakedman.png",
      "Substra demo soldier collection",
      {
        description: "This is Substraknight! RMRK2 demo nested NFT",
        externalUri: "https://rmrk.app",
        properties: {},
      }
    );

    const ItemsCollection = new Collection(
      0,
      10000,
      encodeAddress(accounts[0].address, 2),
      SUBSTRAKNIGHT_COLLECTION_SYMBOL,
      collectionId,
      collectionMetadataCid
    );

    const { block } = await sendAndFinalize(
      api.tx.system.remark(ItemsCollection.create()),
      kp
    );
    console.log("COLLECTION CREATION REMARK: ", ItemsCollection.create());
    console.log("Substraknight collection created at block: ", block);

    return { block, collectionId };
  } catch (error: any) {
    console.error(error);
  }
};

export const mintSubstraknight = async () => {
  try {
    const phrase = process.env.PRIVAKE_KEY;
    const kp = getKeyringFromUri(phrase);
    const ws = WS_URL;
    const api = await getApi(ws);

    // Create collection
    await createSubstraknightCollection();
    // get mint tx
    const txs = await getTxMintSubstraknight(api);
    const tx = api.tx.utility.batchAll(txs);
    // send
    const { block } = await sendAndFinalize(tx, kp);
    console.log("Substraknight NFT minted at block: ", block);
    return block;
  } catch (error: any) {
    console.error(error);
  }
};

export const getTxMintSubstraknight = async (api, i?: number) => {
  try {
    console.log("CREATE SUBSTRAKNIGHT NFT START -------");
    await cryptoWaitReady();
    const accounts = getKeys();

    // Generate collection id
    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      SUBSTRAKNIGHT_COLLECTION_SYMBOL
    );

    const serialNumbers = soldierIndexList;

    // Mint base for each soldier
    const promises = serialNumbers.map(async (sn) => {
      // Create Metadata
      const metadataCid = await pinSingleMetadataFromDir(
        `/assets/substra/fixedParts`,
        "nakedman.png",
        `Substra demo soldier NFT #${i ? i : sn}`,
        {
          description: `This is Substraknight #${
            i ? i : sn
          }! RMRK2 demo nested NFT`,
          externalUri: "https://rmrk.app",
          properties: {
            rarity: {
              type: "string",
              value: sn === 4 ? "epic" : "common",
            },
          },
        }
      );

      // mint nft
      const nft = new NFT({
        block: 0,
        collection: collectionId,
        symbol: `soldier_${i ? i : sn}`,
        transferable: 1,
        sn: `${i ? i : sn}`.padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        metadata: metadataCid,
      });

      return nft.mint();
    });

    // Batch send
    const remarks = await Promise.all(promises);
    return remarks.map((remark) => api.tx.system.remark(remark));
    //return api.tx.utility.batchAll(txs);
    // const { block } = await sendAndFinalize(tx, kp);
    // console.log("Substraknight NFT minted at block: ", block);
    // return block;
  } catch (error: any) {
    console.error(error);
  }
};
