import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { getApi, getKeyringFromUri, getKeys, sendAndFinalize } from "./utils";
import {
  ASSETS_CID,
  SUBSTRAKNIGHT_BASE_SYMBOL,
  SUBSTRAKNIGHT_COLLECTION_SYMBOL,
  WS_URL,
  FixedTrait,
  slotConfigSet,
  substraCollectionDescription,
} from "./constants";
import { Base, Collection, NFT } from "rmrk-tools";
import { u8aToHex } from "@polkadot/util";
import { pinSingleMetadataFromDir } from "./pinata-utils";
import { nanoid } from "nanoid";
import { KeyringPair } from "@polkadot/keyring/types";

export const addBaseResource = async (
  kp:KeyringPair,
  substraBlock: number,
  baseBlock: number,
  fixedPartSet: FixedTrait[],
  soliderNumber: number
) => {
  try {
    console.log("ADD BASE RESOURCE TO SUBSTRAKNIGHT NFT START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const api = await getApi(ws);

    // Create collection
    const { collectionId } = await createSubstraknightCollection(kp);

    //add base res
    const txs = await getTxAddBaseResource(
      kp,
      substraBlock,
      baseBlock,
      fixedPartSet,
      api,
      collectionId,
      soliderNumber
    );
    const tx = api.tx.utility.batch(txs);
    const { block } = await sendAndFinalize(tx, kp);
    console.log("Substraknight base resources added at block: ", block);
  } catch (error: any) {
    console.error(error);
  }
};

export const getTxAddBaseResource = async (
  kp:KeyringPair,
  substraBlock: number,
  baseBlock: number,
  fixedPartSet: FixedTrait[],
  api,
  collectionId: string,
  soldierIndex: number
) => {
  try {
    console.log("ADD BASE RESOURCE TO SUBSTRAKNIGHT NFT START -------");
    console.log(fixedPartSet);
    await cryptoWaitReady();
    const accounts = getKeys();

    const baseEntity = new Base(
      baseBlock,
      SUBSTRAKNIGHT_BASE_SYMBOL,
      encodeAddress(kp.address, 2),
      "svg"
    );

    const BASE_ID = baseEntity.getId();

    // for each soldier, add base ressource
    let index = soldierIndex;

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

    return [
      api.tx.system.remark(
        substraNft.resadd({
          base: BASE_ID,
          id: baseResId,
          parts: [
            ...fixedPartSet.map((fixedPart) => fixedPart.trait),
            ...slotConfigSet.map((slot) => slot.slotCategory),
          ],
          thumb: `ipfs://ipfs/${ASSETS_CID}/SoldierPreview.png`,
        })
      ),
    ];
  } catch (error: any) {
    console.error(error);
  }
};

export const createSubstraknightCollection = async (kp:KeyringPair) => {
  try {
    console.log("CREATE SUBSTRAKNIGHT COLLECTION START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const api = await getApi(ws);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      SUBSTRAKNIGHT_COLLECTION_SYMBOL
    );

    const collectionMetadataCid = await pinSingleMetadataFromDir(
      "/assets",
      "SubstraCollectionLogo.png", 
      "Substra Soldier Collection",
      {
        description: substraCollectionDescription,
        externalUri: "https://rmrk.app",
        properties: {},
      }
    );

    const substraCollection = new Collection(
      0,
      500,
      encodeAddress(accounts[0].address, 2),
      SUBSTRAKNIGHT_COLLECTION_SYMBOL,
      collectionId,
      collectionMetadataCid
    );

    const { block } = await sendAndFinalize(
      api.tx.system.remark(substraCollection.create()),
      kp
    );
    console.log("COLLECTION CREATION REMARK: ", substraCollection.create());
    console.log("Substraknight collection created at block: ", block);

    return { block, collectionId };
  } catch (error: any) {
    console.error(error);
  }
};

export const mintSubstraknight = async (kp:KeyringPair,soliderNumber: number) => {
  try {
    const ws = WS_URL;
    const api = await getApi(ws);

    // Create collection
    await createSubstraknightCollection(kp);
    // get mint tx
    const txs = await getTxMintSubstraknight(kp,api, soliderNumber);
    const tx = api.tx.utility.batchAll(txs);
    // send
    const { block } = await sendAndFinalize(tx, kp);
    console.log("Substraknight NFT minted at block: ", block);
    return block;
  } catch (error: any) {
    console.error(error);
  }
};

export const getTxMintSubstraknight = async (kp:KeyringPair,api, soldierIndex: number) => {
  try {
    console.log("CREATE SUBSTRAKNIGHT NFT START -------");
    await cryptoWaitReady();

    // Generate collection id
    const collectionId = Collection.generateId(
      u8aToHex(kp.publicKey),
      SUBSTRAKNIGHT_COLLECTION_SYMBOL
    );

    // Mint base for each soldier
    // Create Metadata
    const metadataCid = await pinSingleMetadataFromDir(
      "/assets",
      "SoldierPreview.png", 
      `Substra Soldier NFT #${soldierIndex}`,
      {
        description: `This is Substraknight #${soldierIndex}! RMRK2 demo nested NFT`,
        externalUri: "https://rmrk.app",
        properties: {
          rarity: {
            type: "string",
            value: soldierIndex === 4 ? "epic" : "common",
          },
        },
      }
    );

    // mint nft
    const nft = new NFT({
      block: 0,
      collection: collectionId,
      symbol: `soldier_${soldierIndex}`,
      transferable: 1,
      sn: `${soldierIndex}`.padStart(8, "0"),
      owner: encodeAddress(kp.address, 2),
      metadata: metadataCid,
    });

    return [api.tx.system.remark(nft.mint())];

  } catch (error: any) {
    console.error(error);
  }
};
