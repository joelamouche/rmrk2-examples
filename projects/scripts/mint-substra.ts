import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { getApi, getKeyringFromUri, getKeys, sendAndFinalize } from "./utils";
import {
  ASSETS_CID,
  SUBSTRAKNIGHT_BASE_SYMBOL,
  SUBSTRAKNIGHT_COLLECTION_SYMBOL,
  fixedPartsList,
  slotList,
  WS_URL,
  soldierIndexList,
} from "./constants";
import { Base, Collection, NFT } from "rmrk-tools";
import { u8aToHex } from "@polkadot/util";
import { pinSingleMetadataFromDir } from "./pinata-utils";
import { nanoid } from "nanoid";

export const addBaseResource = async (
  substraBlock: number,
  baseBlock: number
) => {
  try {
    console.log("ADD BASE RESOURCE TO SUBSTRAKNIGHT NFT START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.PRIVAKE_KEY;
    const kp = getKeyringFromUri(phrase);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      SUBSTRAKNIGHT_COLLECTION_SYMBOL
    );

    const api = await getApi(ws);
    const serialNumbers = soldierIndexList

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
      const nft = new NFT({
        block: substraBlock,
        collection: collectionId,
        symbol: `soldier_${sn}`,
        transferable: 1,
        sn: `${sn}`.padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        metadata: "",
      });

      const baseResId = nanoid(8);
console.log("[...fixedPartsList,...itemList]")
console.log([...fixedPartsList,...slotList])
console.log("...fixedPartsList,...itemList")
console.log(...fixedPartsList,...slotList)
      resourceRemarks.push(
        nft.resadd({
          base: BASE_ID,
          id: baseResId,
          parts: [...fixedPartsList,...slotList],
          // [
          //   // `soldier_body_${sn}`,
          //   // `soldier_head_${sn}`,
          //   // `soldier_hand_${sn}`,
          //   // "soldier_objectLeft",
          //   // "soldier_objectRight",

          // ],
          thumb: `ipfs://ipfs/${ASSETS_CID}/Set${sn}/fixedParts/nakedman.png`,
        })
      );

      // if (sn === 4) {
      //   const secondaryArtResId = nanoid(8);
      //   resourceRemarks.push(
      //     nft.resadd({
      //       src: `ipfs://ipfs/${ASSETS_CID}/fixedParts/nakedman.jpg`,
      //       thumb: `ipfs://ipfs/${ASSETS_CID}/fixedParts/nakedman.jpg`,
      //       id: secondaryArtResId,
      //     })
      //   );

      //   resourceRemarks.push(nft.setpriority([secondaryArtResId, baseResId]));
      //}
    });

    const txs = resourceRemarks.map((remark) => api.tx.system.remark(remark));
    const tx = api.tx.utility.batch(txs);
    const { block } = await sendAndFinalize(tx, kp);
    console.log("Substraknight base resources added at block: ", block);
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

    return block;
  } catch (error: any) {
    console.error(error);
  }
};

export const mintSubstraknight = async () => {
  try {
    console.log("CREATE SUBSTRAKNIGHT NFT START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.PRIVAKE_KEY;
    const kp = getKeyringFromUri(phrase);

    // Generate collection id
    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      SUBSTRAKNIGHT_COLLECTION_SYMBOL
    );

    await createSubstraknightCollection();

    const api = await getApi(ws);

    const serialNumbers = soldierIndexList

    // Mint base for each soldier
    const promises = serialNumbers.map(async (sn) => {
      // Create Metadata
      const metadataCid = await pinSingleMetadataFromDir(
        `/assets/Set${sn}/fixedParts`,
        "nakedman.png",
        `Substra demo soldier NFT #${sn}`,
        {
          description: `This is Substraknight #${sn}! RMRK2 demo nested NFT`,
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
        symbol: `soldier_${sn}`,
        transferable: 1,
        sn: `${sn}`.padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        metadata: metadataCid,
      });

      return nft.mint();
    });

    // Batch send
    const remarks = await Promise.all(promises);
    const txs = remarks.map((remark) => api.tx.system.remark(remark));
    const tx = api.tx.utility.batchAll(txs);
    const { block } = await sendAndFinalize(tx, kp);
    console.log("Substraknight NFT minted at block: ", block);
    return block;
  } catch (error: any) {
    console.error(error);
  }
};
