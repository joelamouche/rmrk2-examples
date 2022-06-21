import {
  LATEST_CID,
  SUBSTRAKNIGHT_COLLECTION_SYMBOL,
  WS_URL,
  SUBSTRAKNIGHT_BASE_SYMBOL,
  SlotSet,
  SlotTrait,
  SlotInfo,
} from "../constants";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { getApi, sendAndFinalize } from "../utils";
import { Collection, NFT, Base } from "rmrk-tools";
import { u8aToHex } from "@polkadot/util";
import { encodeAddress } from "@polkadot/keyring";
import { nanoid } from "nanoid";
import { pinSingleMetadataFromDir } from "../utils/pinata-utils";
import { KeyringPair } from "@polkadot/keyring/types";
import {
  createItemsCollections,
  getItemCollectionId,
} from "./item-collection-util";

const substraItems = (list: SlotSet): SlotInfo[] => {
  return list.map((slot: SlotTrait) => {
    return {
      symbol: slot.traitName,
      thumb: `${slot.fileName}.png`,
      resources: [`${slot.fileName}.svg`],
      fileName: slot.fileName,
      description: slot.traitDescription,
      slotCategory: slot.slotCategory,
    };
  });
};
export const getMintItemTx = async (
  kp: KeyringPair,
  _soldierNumber: number,
  slotSet: SlotSet
) => {
  const soldierNumber = _soldierNumber + 1;
  try {
    console.log(
      `CREATE SUBSTRAKNIGHT ITEMS FOR SOLDIER # ${soldierNumber} START -------`
    );
    await cryptoWaitReady();
    const ws = WS_URL;
    const api = await getApi(ws);

    // First mint all the items
    const promises = substraItems(slotSet).map(
      async (item: SlotInfo, index) => {
        // pin metadat on ipfs
        console.log("pinning item metadata on ipfs...");
        const metadataCid = await pinSingleMetadataFromDir(
          `/assets/SlotParts/${item.slotCategory}`,
          item.thumb,
          item.symbol,
          {
            description:
              item.description + `\n${item.slotCategory} #` + soldierNumber,
            externalUri: "https://rmrk.app",
          }
        );

        const nft = new NFT({
          block: 0,
          sn: soldierNumber.toString().padStart(8, "0"),
          owner: encodeAddress(kp.address, 2),
          transferable: 1,
          metadata: metadataCid,
          collection: getItemCollectionId(kp, item.slotCategory),
          symbol: item.symbol + soldierNumber.toString(),
        });

        return nft.mint();
      }
    );

    const remarks = await Promise.all(promises);

    return remarks.map((remark) => api.tx.system.remark(remark));
  } catch (error: any) {
    console.log("ERR");
    console.error(error);
    throw error;
  }
};

export const getAddItemsTx = async (
  kp: KeyringPair,
  substraBlock: number,
  baseBlock: number,
  itemBlock: number,
  substraCollectionId,
  _soldierNumber: number,
  slotSet: SlotSet,
  customCID?: string
) => {
  const soldierNumber = _soldierNumber + 1;
  try {
    console.log(
      `ADD BASE SUBSTRAKNIGHT ITEMS FOR SOLDIER # ${soldierNumber} START -------`
    );
    await cryptoWaitReady();
    const ws = WS_URL;
    const api = await getApi(ws);

    const baseEntity = new Base(
      baseBlock,
      SUBSTRAKNIGHT_BASE_SYMBOL,
      encodeAddress(kp.address, 2),
      "svg"
    );

    console.log(
      `ADD,SEND,EQUIP SUBSTRAKNIGHT ITEMS TO SOLDIER # ${soldierNumber}  START -------`
    );

    // then add base, send and equip
    const resaddSendRemarks = [];

    substraItems(slotSet).forEach((item, index) => {
      const itemNft = new NFT({
        block: itemBlock,
        sn: soldierNumber.toString().padStart(8, "0"),
        owner: encodeAddress(kp.address, 2),
        transferable: 1,
        metadata: `ipfs://ipfs/trololo`,
        collection: getItemCollectionId(kp, item.slotCategory),
        symbol: item.symbol + soldierNumber.toString(),
      });

      const CID = customCID ? customCID : LATEST_CID;
      console.log("CID FOR Added ressources : " + CID);
      item.resources.forEach((resource) => {
        resaddSendRemarks.push(
          itemNft.resadd({
            src: `ipfs://ipfs/${CID}/SlotParts/${item.slotCategory}/${resource}`,
            thumb: `ipfs://ipfs/${CID}/SlotParts/${item.slotCategory}/${item.thumb}`,
            id: nanoid(8),
            slot: `${baseEntity.getId()}.${item.slotCategory}`,
          })
        );
      });

      // instantiate soldier nft
      const soldierNft = new NFT({
        block: substraBlock,
        collection: substraCollectionId,
        symbol: `soldier_${soldierNumber}`,
        transferable: 1,
        sn: `${soldierNumber}`.padStart(8, "0"),
        owner: encodeAddress(kp.address, 2),
        metadata: "",
      });

      // send and equip
      resaddSendRemarks.push(itemNft.send(soldierNft.getId()));
      resaddSendRemarks.push(
        itemNft.equip(`${baseEntity.getId()}.${item.slotCategory}`)
      );
    });

    return resaddSendRemarks.map((remark) => api.tx.system.remark(remark));
  } catch (error: any) {
    console.log("ERR");
    console.error(error);
    throw error;
  }
};

export const getSendItemsToSoldierTx = async (
  kp: KeyringPair,
  substraBlock: number,
  itemBlock: number,
  substraCollectionId,
  _soldierNumber: number,
  slotNumber: number,
  slotItem: SlotTrait
) => {
  const soldierNumber = _soldierNumber + 1;
  try {
    console.log(
      `ADD BASE SUBSTRAKNIGHT ITEMS FOR SOLDIER # ${soldierNumber} START -------`
    );
    await cryptoWaitReady();
    const ws = WS_URL;
    const api = await getApi(ws);

    // const baseEntity = new Base(
    //   baseBlock,
    //   SUBSTRAKNIGHT_BASE_SYMBOL,
    //   encodeAddress(kp.address, 2),
    //   "svg"
    // );

    console.log(
      `ADD,SEND,EQUIP SUBSTRAKNIGHT ITEMS TO SOLDIER # ${soldierNumber}  START -------`
    );

    // then add base, send and equip
    const resaddSendRemarks = [];

    substraItems([slotItem]).forEach((item, index) => {
      const itemNft = new NFT({
        block: itemBlock,
        sn: slotNumber.toString().padStart(8, "0"),
        owner: encodeAddress(kp.address, 2),
        transferable: 1,
        metadata: `ipfs://ipfs/trololo`,
        collection: getItemCollectionId(kp, item.slotCategory),
        symbol: item.symbol + slotNumber.toString(),
      });
      console.log("itemNft", itemNft, itemNft.getId());

      // const CID = customCID ? customCID : ASSETS_CID;
      // console.log("CID FOR Added ressources : " + CID);
      // item.resources.forEach((resource) => {
      //   resaddSendRemarks.push(
      //     itemNft.resadd({
      //       src: `ipfs://ipfs/${CID}/SlotParts/${item.slotCategory}/${resource}`,
      //       thumb: `ipfs://ipfs/${CID}/SlotParts/${item.slotCategory}/${item.thumb}`,
      //       id: nanoid(8),
      //       slot: `${baseEntity.getId()}.${item.slotCategory}`,
      //     })
      //   );
      // });

      // instantiate soldier nft
      const soldierNft = new NFT({
        block: substraBlock,
        collection: substraCollectionId,
        symbol: `soldier_${soldierNumber}`,
        transferable: 1,
        sn: `${soldierNumber}`.padStart(8, "0"),
        owner: encodeAddress(kp.address, 2), //TODO?
        metadata: "",
      });
      console.log("soldierNft.getId()", soldierNft.getId());

      // send and equip
      resaddSendRemarks.push(itemNft.send(soldierNft.getId()));
      // resaddSendRemarks.push(
      //   itemNft.equip(`${baseEntity.getId()}.${item.slotCategory}`)
      // );
    });

    return resaddSendRemarks.map((remark) => api.tx.system.remark(remark));
  } catch (error: any) {
    console.log("ERR");
    console.error(error);
    throw error;
  }
};

export const mintItemsFromSet = async (
  kp: KeyringPair,
  substraBlock: number,
  baseBlock: number,
  _soldierNumber: number,
  slotSet: SlotSet
) => {
  const soldierNumber = _soldierNumber;
  try {
    console.log(
      `CREATE SUBSTRAKNIGHT ITEMS FOR SOLDIER # ${soldierNumber} START -------`
    );
    await cryptoWaitReady();
    const ws = WS_URL;
    const api = await getApi(ws);

    const substraCollectionId = Collection.generateId(
      u8aToHex(kp.publicKey),
      SUBSTRAKNIGHT_COLLECTION_SYMBOL
    );

    await createItemsCollections(
      kp,
      slotSet.map((slot) => slot.slotCategory)
    );

    // Get mint item tx
    const txs = await getMintItemTx(kp, soldierNumber, slotSet);
    const batch = api.tx.utility.batch(txs);
    const { block: mintItemBlock } = await sendAndFinalize(batch, kp);
    console.log("SUBSTRAKNIGHT ITEMS MINTED AT BLOCK: ", mintItemBlock);

    console.log(
      `ADD,SEND,EQUIP SUBSTRAKNIGHT ITEMS TO SOLDIER # ${soldierNumber}  START -------`
    );

    // Get add base and equip tx
    const restxs = await getAddItemsTx(
      kp,
      substraBlock,
      baseBlock,
      mintItemBlock,
      substraCollectionId,
      soldierNumber,
      slotSet
    );
    const resbatch = api.tx.utility.batch(restxs);
    const { block: resaddSendBlock } = await sendAndFinalize(resbatch, kp);
    console.log(
      "SUBSTRAKNIGHT ITEMS RESOURCE ADDED AND SENT: ",
      resaddSendBlock
    );
    return true;
  } catch (error: any) {
    console.error(error);
  }
};

export const mintAndEquipAllItemsFromSetList = async (
  kp: KeyringPair,
  substraBlock: number,
  baseBlock: number,
  numberOfSoldiers: number,
  slotSetList: SlotSet[],
  offset: number,
  needCollectionMint: boolean,
  customCID?: string
) => {
  try {
    console.log(`------------------------------------------------------------------------------------------------ `)
    console.log(
      `-------- CREATE SUBSTRAKNIGHT ITEMS FOR ${numberOfSoldiers} SOLDIER START -------`
    );
    await cryptoWaitReady();
    const ws = WS_URL;
    const api = await getApi(ws);

    const substraCollectionId = Collection.generateId(
      u8aToHex(kp.publicKey),
      SUBSTRAKNIGHT_COLLECTION_SYMBOL
    );

    if (needCollectionMint) {
      const slotCategories = slotSetList[0].map((slot) => slot.slotCategory);
      console.log("CREATING ITEM COLLECTION FOR ", slotCategories);
      await createItemsCollections(kp, slotCategories);
    }

    // Get mint item tx
    let totalTxListMint = [];
    for (let i = 0; i < numberOfSoldiers; i++) {
      const txsMintItem = await getMintItemTx(kp, i + offset, slotSetList[i]);
      totalTxListMint = [...totalTxListMint, ...txsMintItem];
    }

    const batch = api.tx.utility.batch(totalTxListMint);
    const { block: mintItemBlock } = await sendAndFinalize(batch, kp);
    console.log("SUBSTRAKNIGHT ITEMS MINTED AT BLOCK: ", mintItemBlock);

    console.log(
      `-------- ADD,SEND,EQUIP SUBSTRAKNIGHT ITEMS TO ${numberOfSoldiers} SOLDIERS  START -------`
    );

    // Get add base and equip tx
    let totalTxAddBase = [];
    for (let j = 0; j < numberOfSoldiers; j++) {
      const txsAddBaseItem = await getAddItemsTx(
        kp,
        substraBlock,
        baseBlock,
        mintItemBlock,
        substraCollectionId,
        j + offset,
        slotSetList[j],
        customCID
      );
      totalTxAddBase = [...totalTxAddBase, ...txsAddBaseItem];
    }

    const resbatch = api.tx.utility.batch(totalTxAddBase);
    const { block: resaddSendBlock } = await sendAndFinalize(resbatch, kp);
    console.log(
      "SUBSTRAKNIGHT ITEMS RESOURCE ADDED AND SENT: ",
      resaddSendBlock
    );
    return { mintItemBlock, resaddSendBlock };
  } catch (error: any) {
    console.log("ERR HIGH LVL");
    console.error(error);
    process.exit();
    throw error;
  }
};
