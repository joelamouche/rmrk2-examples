import { KeyringPair } from "@polkadot/keyring/types";
import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { getApi } from "rmrk-tools/dist/tools/utils";
import { Collection } from "rmrk-tools";
import { sendAndFinalize } from "utils";
import { u8aToHex } from "@polkadot/util";

import {
  SlotCategory,
  SUBSTRAKNIGHT_ITEMS_COLLECTION_SYMBOL,
  WS_URL,
} from "../constants";
import { pinSingleMetadataFromDir } from "../utils/pinata-utils";

export const getItemCollectionId = (accountsZero, slotCategory) => {
  return Collection.generateId(
    u8aToHex(accountsZero.publicKey),
    SUBSTRAKNIGHT_ITEMS_COLLECTION_SYMBOL + slotCategory
  );
};

export const createItemsCollections = async (
  kp: KeyringPair,
  slotCatList: SlotCategory[]
) => {
  try {
    console.log("CREATE SUBSTRAKNIGHT ITEMS COLLECTION START -------");
    await cryptoWaitReady();
    const ws = WS_URL;
    const api = await getApi(ws);

    // First pin all item collection metadata
    const collectionMetadataCids: string[] = await Promise.all(
      slotCatList.map(async (slotCat) => {
        console.log("pinning collection metadata on ipfs...");
        let collectionMetadataCid = await pinSingleMetadataFromDir(
          `/assets/SlotParts/${slotCat}`,
          `${slotCat}.png`,
          "SubstraKnights 2.0 Items : " + slotCat,
          {
            description: `Item collection for ${slotCat}`,
            externalUri: "https://rmrk.app",
            properties: {},
          }
        );
        console.log("collectionMetadataCid", collectionMetadataCid);
        return collectionMetadataCid;
      })
    );

    const remarks = await Promise.all(
      collectionMetadataCids.map(async (collectionMetadataCid, i) => {
        const collectionId = getItemCollectionId(kp, slotCatList[i]);

        const itemsCollection = new Collection(
          0,
          0,
          encodeAddress(kp.address, 2),
          SUBSTRAKNIGHT_ITEMS_COLLECTION_SYMBOL + slotCatList[i],
          collectionId,
          collectionMetadataCid
        );
        return itemsCollection.create();
      })
    );

    const restxs = remarks.map((remark) => api.tx.system.remark(remark));
    const resbatch = api.tx.utility.batch(restxs);
    const { block: addItemCollectionsBlock } = await sendAndFinalize(
      resbatch,
      kp
    );

    console.log(
      "Substraknight items collection created at block: ",
      addItemCollectionsBlock
    );

    return { addItemCollectionsBlock, collectionMetadataCids };
  } catch (error: any) {
    console.error(error);
  }
};
