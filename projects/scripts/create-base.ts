import { IBasePart } from "rmrk-tools/dist/classes/base";
import {
  ASSETS_CID,
  SUBSTRAKNIGHT_BASE_SYMBOL,
  SUBSTRAKNIGHT_ITEMS_COLLECTION_SYMBOL,
  slotList,
  fixedPartsList,
  WS_URL,
} from "./constants";
import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { getApi, getKeyringFromUri, getKeys, sendAndFinalize } from "./utils";
import { Collection, Base } from "rmrk-tools";
import { u8aToHex } from "@polkadot/util";

export const fixedParts =(list:string[],setNumber):IBasePart[]=>{
  return list.map((name,i)=>{
    return {
      type: "fixed",
      id: name,
      src: `ipfs://ipfs/${ASSETS_CID}/Set${setNumber}/fixedParts/${name}.svg`,
      z: i,
    }
  })
}

const getSlotKanariaParts = (itemList:string[],equippable: string[] | "*" = []): IBasePart[] => {
  return itemList.map((itemName,i)=>{
    return {
          type: "slot",
          id: itemName,
          equippable,
          z: i+fixedPartsList.length,
        }
  })
  // [
  //   {
  //     type: "slot",
  //     id: "soldier_objectLeft",
  //     equippable,
  //     z: 1,
  //   },
  //   {
  //     type: "slot",
  //     id: "soldier_objectRight",
  //     equippable,
  //     z: 2,
  //   },
  // ];
};

export const createBase = async () => {
  try {
    console.log("CREATE SUBSTRAKNIGHT BASE START -------");
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
    console.log("collectionId", collectionId);

    console.log("getSlotKanariaParts(slotList,[collectionId])")
    console.log(getSlotKanariaParts(slotList,[collectionId]))
    const baseParts = [
    //   {
    //   type: "fixed",
    //   id: "nakedman",
    //   src: `ipfs://ipfs/${ASSETS_CID}/ityems/nakedman.svg`,
    //   z: 0,
    // } as IBasePart,
    // TODO fix base index
    ...fixedParts(fixedPartsList,1), ...getSlotKanariaParts(slotList,[collectionId])];

    const baseEntity = new Base(
      0,
      SUBSTRAKNIGHT_BASE_SYMBOL,
      encodeAddress(kp.address, 2),
      "svg",
      baseParts
    );

    const { block } = await sendAndFinalize(
      api.tx.system.remark(baseEntity.base()),
      kp
    );
    console.log("Substraknight Base created at block: ", block);
    return block;
  } catch (error: any) {
    console.error(error);
  }
};
