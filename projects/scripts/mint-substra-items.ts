import {
  ASSETS_CID,
  SUBSTRAKNIGHT_COLLECTION_SYMBOL,
  SUBSTRAKNIGHT_ITEMS_COLLECTION_SYMBOL,
  WS_URL,
  SUBSTRAKNIGHT_BASE_SYMBOL,
  // slotList,
  SlotSet,
  SlotTrait,
  slotList,
} from "./constants";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { getApi, getKeyringFromUri, getKeys, sendAndFinalize } from "./utils";
import { Collection, NFT, Base } from "rmrk-tools";
import { u8aToHex } from "@polkadot/util";
import { encodeAddress } from "@polkadot/keyring";
import { nanoid } from "nanoid";
import { pinSingleMetadataFromDir } from "./pinata-utils";
interface SlotInfo {
  symbol: string;
  thumb: string;
  resources: string[];
  fileName: string;
  slotCategory: string;
  description: string;
}
const substraItems = (list: SlotSet): SlotInfo[] => {
  return list.map((slot: SlotTrait) => {
    return {
      symbol: slot.traitName,
      thumb: `${slot.traitName}.png`,
      resources: [`${slot.traitName}.svg`],
      fileName: slot.traitName,
      description: `Soldier1 likes his ${slot.traitName}!`,
      slotCategory: slot.slotCategory,
    };
  });
};
//  [
//   {
//     symbol: "soldier_bone",
//     thumb: "Substraknight_bone_thumb.png",
//     resources: ["Substraknight_bone_left.svg", "Substraknight_bone_right.svg"],
//     name: "The Bone",
//     description: "Substraknight likes his bone!",
//   },
//   {
//     symbol: "soldier_flag",
//     thumb: "Substraknight_flag_thumb.png",
//     resources: ["Substraknight_flag_left.svg", "Substraknight_flag_right.svg"],
//     name: "The Flag",
//     description: "Substraknight likes his flag!",
//   },
//   {
//     symbol: "soldier_pencil",
//     thumb: "Substraknight_pencil_thumb.png",
//     resources: ["Substraknight_pencil_left.svg", "Substraknight_pencil_right.svg"],
//     name: "The Pencil",
//     description: "Substraknight likes his pencil!",
//   },
//   {
//     symbol: "soldier_spear",
//     thumb: "Substraknight_spear_thumb.png",
//     resources: ["Substraknight_spear_left.svg", "Substraknight_spear_right.svg"],
//     name: "The Spear",
//     description: "Substraknight likes his spear!",
//   },
// ];

export const mintItems = async (
  substraBlock: number,
  baseBlock: number,
  soldierNumber: number,
  itemNumber
) => {
  try {
    console.log(`CREATE SUBSTRAKNIGHT ITEMS # ${itemNumber} START -------`);
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.PRIVAKE_KEY;
    const api = await getApi(ws);
    const kp = getKeyringFromUri(phrase);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      SUBSTRAKNIGHT_ITEMS_COLLECTION_SYMBOL
    );

    const substraCollectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      SUBSTRAKNIGHT_COLLECTION_SYMBOL
    );

    const baseEntity = new Base(
      baseBlock,
      SUBSTRAKNIGHT_BASE_SYMBOL,
      encodeAddress(kp.address, 2),
      "svg"
    );

    await createItemsCollection();

    // First mint all the items
    const promises = substraItems(slotList).map(async (item, index) => {
      const sn = index + 1;

      const metadataCid = await pinSingleMetadataFromDir(
        `/assets/Set${itemNumber}/items`,
        item.thumb,
        item.symbol,
        {
          description: item.description,
          externalUri: "https://rmrk.app",
        }
      );

      const nft = new NFT({
        block: 0,
        sn: sn.toString().padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        transferable: 1,
        metadata: metadataCid,
        collection: collectionId,
        symbol: item.symbol,
      });

      return nft.mint();
    });

    const remarks = await Promise.all(promises);

    const txs = remarks.map((remark) => api.tx.system.remark(remark));
    const batch = api.tx.utility.batch(txs);
    const { block } = await sendAndFinalize(batch, kp);
    console.log("SUBSTRAKNIGHT ITEMS MINTED AT BLOCK: ", block);

    console.log(
      `ADD,SEND,EQUIP SUBSTRAKNIGHT ITEMS # ${itemNumber} TO SOLDIER # ${soldierNumber}  START -------`
    );

    // then add base, send and equip
    const resaddSendRemarks = [];

    substraItems(slotList).forEach((item, index) => {
      const sn = index + 1;
      const itemNft = new NFT({
        block,
        sn: sn.toString().padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        transferable: 1,
        metadata: `ipfs://ipfs/trololo`,
        collection: collectionId,
        symbol: item.symbol,
      });

      item.resources.forEach((resource) => {
        resaddSendRemarks.push(
          itemNft.resadd({
            src: `ipfs://ipfs/${ASSETS_CID}/Set${itemNumber}/items/${resource}`,
            thumb: `ipfs://ipfs/${ASSETS_CID}/Set${itemNumber}/items/${item.thumb}`,
            id: nanoid(8),
            slot: `${baseEntity.getId()}.${item.slotCategory}`,
            //  resource.includes("left")
            //   ? `${baseEntity.getId()}.soldier_objectLeft`
            //   : `${baseEntity.getId()}.soldier_objectRight`,
          })
        );
      });

      // instantiate soldier nft
      const soldierNft = new NFT({
        block: substraBlock,
        collection: substraCollectionId,
        symbol: `soldier_${soldierNumber}`,
        transferable: 1,
        sn: `${1}`.padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        metadata: "",
      });

      // send and equip
      resaddSendRemarks.push(itemNft.send(soldierNft.getId()));
      resaddSendRemarks.push(
        itemNft.equip(
          `${baseEntity.getId()}.${
            //index % 2 ? "soldier_objectLeft" : "soldier_objectRight"
            item.symbol
          }`
        )
      );
    });

    const restxs = resaddSendRemarks.map((remark) =>
      api.tx.system.remark(remark)
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

export const getMintItemTx = async (
  soldierNumber: number,
  slotSet: SlotSet
) => {
  try {
    console.log(
      `CREATE SUBSTRAKNIGHT ITEMS FOR SOLDIER # ${soldierNumber} START -------`
    );
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.PRIVAKE_KEY;
    const api = await getApi(ws);
    const kp = getKeyringFromUri(phrase);

    const itemCollectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      SUBSTRAKNIGHT_ITEMS_COLLECTION_SYMBOL
    );

    // const substraCollectionId = Collection.generateId(
    //   u8aToHex(accounts[0].publicKey),
    //   SUBSTRAKNIGHT_COLLECTION_SYMBOL
    // );

    // const baseEntity = new Base(
    //   baseBlock,
    //   SUBSTRAKNIGHT_BASE_SYMBOL,
    //   encodeAddress(kp.address, 2),
    //   "svg"
    // );

    // await createItemsCollection();

    // First mint all the items
    const promises = substraItems(slotSet).map(
      async (item: SlotInfo, index) => {
        const sn = index + 1;

        // pin metadat on ipfs
        console.log("pinning metadat on ipfs...")
        const metadataCid = await pinSingleMetadataFromDir(
          `/assets/SlotParts/${item.slotCategory}`,
          item.thumb,
          item.fileName,
          {
            description: item.description+soldierNumber.toString(),
            externalUri: "https://rmrk.app",
          }
        );

        const nft = new NFT({
          block: 0,
          sn: soldierNumber.toString().padStart(8, "0"),
          owner: encodeAddress(accounts[0].address, 2),
          transferable: 1,
          metadata: metadataCid,
          collection: itemCollectionId,
          symbol: item.symbol+soldierNumber.toString(),
        });

        return nft.mint();
      }
    );

    const remarks = await Promise.all(promises);

    return remarks.map((remark) => api.tx.system.remark(remark));

  } catch (error: any) {
    console.error(error);
  }
};

export const getAddItemsTx = async (
  substraBlock: number,
  baseBlock: number,
  itemBlock: number,
  itemCollectionId,
  substraCollectionId,
  soldierNumber: number,
  slotSet: SlotSet
) => {
  try {
    console.log(
      `ADD BASE SUBSTRAKNIGHT ITEMS FOR SOLDIER # ${soldierNumber} START -------`
    );
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.PRIVAKE_KEY;
    const api = await getApi(ws);
    const kp = getKeyringFromUri(phrase);


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
      const sn = index + 1;
      const itemNft = new NFT({
        block:itemBlock,
        sn: soldierNumber.toString().padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        transferable: 1,
        metadata: `ipfs://ipfs/trololo`,
        collection: itemCollectionId,
        symbol: item.symbol+soldierNumber.toString(),
      });

      item.resources.forEach((resource) => {
        resaddSendRemarks.push(
          itemNft.resadd({
            src: `ipfs://ipfs/${ASSETS_CID}/SlotParts/${item.slotCategory}/${resource}`,
            thumb: `ipfs://ipfs/${ASSETS_CID}/SlotParts/${item.slotCategory}/${item.thumb}`,
            id: nanoid(8),
            slot: `${baseEntity.getId()}.${item.slotCategory}`,
            //  resource.includes("left")
            //   ? `${baseEntity.getId()}.soldier_objectLeft`
            //   : `${baseEntity.getId()}.soldier_objectRight`,
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
        owner: encodeAddress(accounts[0].address, 2),
        metadata: "",
      });

      // send and equip
      resaddSendRemarks.push(itemNft.send(soldierNft.getId()));
      resaddSendRemarks.push(
        itemNft.equip(
          `${baseEntity.getId()}.${
            //index % 2 ? "soldier_objectLeft" : "soldier_objectRight"
            item.slotCategory
          }`
        )
      );
    });

    return resaddSendRemarks.map((remark) =>
      api.tx.system.remark(remark)
    );
    // const resbatch = api.tx.utility.batch(restxs);
    // const { block: resaddSendBlock } = await sendAndFinalize(resbatch, kp);
    // console.log(
    //   "SUBSTRAKNIGHT ITEMS RESOURCE ADDED AND SENT: ",
    //   resaddSendBlock
    // );
    // return true;
  } catch (error: any) {
    console.error(error);
  }
};

export const mintItemsFromSet = async (
  substraBlock: number,
  baseBlock: number,
  soldierNumber: number,
  slotSet: SlotSet
) => {
  try {
    console.log(
      `CREATE SUBSTRAKNIGHT ITEMS FOR SOLDIER # ${soldierNumber} START -------`
    );
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.PRIVAKE_KEY;
    const api = await getApi(ws);
    const kp = getKeyringFromUri(phrase);

    const itemCollectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      SUBSTRAKNIGHT_ITEMS_COLLECTION_SYMBOL
    );

    const substraCollectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      SUBSTRAKNIGHT_COLLECTION_SYMBOL
    );

    // const baseEntity = new Base(
    //   baseBlock,
    //   SUBSTRAKNIGHT_BASE_SYMBOL,
    //   encodeAddress(kp.address, 2),
    //   "svg"
    // );

    await createItemsCollection();

    // Get mint item tx
    const txs=await getMintItemTx(soldierNumber,slotSet)
    const batch = api.tx.utility.batch(txs);
    const { block: mintItemBlock } = await sendAndFinalize(batch, kp);
    console.log("SUBSTRAKNIGHT ITEMS MINTED AT BLOCK: ", mintItemBlock);

    console.log(
      `ADD,SEND,EQUIP SUBSTRAKNIGHT ITEMS TO SOLDIER # ${soldierNumber}  START -------`
    );

    // Get add base and equip tx
    const restxs=await getAddItemsTx(substraBlock,baseBlock,mintItemBlock,itemCollectionId,substraCollectionId,soldierNumber,slotSet)
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
  substraBlock: number,
  baseBlock: number,
  numberOfSoldiers: number,
  slotSetList: SlotSet[]
) => {
  try {
    console.log(
      `CREATE SUBSTRAKNIGHT ITEMS FOR ${numberOfSoldiers} SOLDIER START -------`
    );
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.PRIVAKE_KEY;
    const api = await getApi(ws);
    const kp = getKeyringFromUri(phrase);

    const itemCollectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      SUBSTRAKNIGHT_ITEMS_COLLECTION_SYMBOL
    );

    const substraCollectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      SUBSTRAKNIGHT_COLLECTION_SYMBOL
    );

    // const baseEntity = new Base(
    //   baseBlock,
    //   SUBSTRAKNIGHT_BASE_SYMBOL,
    //   encodeAddress(kp.address, 2),
    //   "svg"
    // );

    await createItemsCollection();

    // Get mint item tx
    let totalTxListMint = [];
    for (let i = 0; i < numberOfSoldiers; i++) {
      const txsMintItem = await getMintItemTx(i,slotSetList[i]);
      console.log("got tx for substra ", i);
      totalTxListMint = [...totalTxListMint, ...txsMintItem];
    }
    // const txs=await getMintItemTx(substraBlock,baseBlock,soldierNumber,slotSet)
    const batch = api.tx.utility.batch(totalTxListMint);
    const { block: mintItemBlock } = await sendAndFinalize(batch, kp);
    console.log("SUBSTRAKNIGHT ITEMS MINTED AT BLOCK: ", mintItemBlock);

    console.log(
      `ADD,SEND,EQUIP SUBSTRAKNIGHT ITEMS TO ${numberOfSoldiers} SOLDIERS  START -------`
    );

    // Get add base and equip tx
    let totalTxAddBase = [];
    for (let j = 0; j < numberOfSoldiers; j++) {
      const txsAddBaseItem =await getAddItemsTx(substraBlock,baseBlock,mintItemBlock,itemCollectionId,substraCollectionId,j,slotSetList[j])
      console.log("got tx for substra ", j);
      totalTxAddBase = [...totalTxAddBase, ...txsAddBaseItem];
    }
    // const restxs=await getAddItemsTx(substraBlock,baseBlock,mintItemBlock,itemCollectionId,substraCollectionId,soldierNumber,slotSet)
    const resbatch = api.tx.utility.batch(totalTxAddBase);
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

export const createItemsCollection = async () => {
  try {
    console.log("CREATE SUBSTRAKNIGHT ITEMS COLLECTION START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.PRIVAKE_KEY;
    const api = await getApi(ws);
    const kp = getKeyringFromUri(phrase);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      SUBSTRAKNIGHT_ITEMS_COLLECTION_SYMBOL
    );

    const collectionMetadataCid = await pinSingleMetadataFromDir(
      `/assets/substra/fixedParts`,
      "nakedman.png",
      "RMRK2 demo substra items collection",
      {
        description: "This is Substraknight items! RMRK2 demo nested NFTs",
        externalUri: "https://rmrk.app",
        properties: {},
      }
    );
    console.log("collectionMetadataCid", collectionMetadataCid);

    const ItemsCollection = new Collection(
      0,
      0,
      encodeAddress(accounts[0].address, 2),
      SUBSTRAKNIGHT_ITEMS_COLLECTION_SYMBOL,
      collectionId,
      collectionMetadataCid
    );

    const { block } = await sendAndFinalize(
      api.tx.system.remark(ItemsCollection.create()),
      kp
    );
    console.log("Substraknight items collection created at block: ", block);

    return {block,collectionMetadataCid};
  } catch (error: any) {
    console.error(error);
  }
};
