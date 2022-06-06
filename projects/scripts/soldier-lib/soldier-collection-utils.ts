import { KeyringPair } from "@polkadot/keyring/types";
import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { getApi } from "rmrk-tools/dist/tools/utils";
import { Collection } from "rmrk-tools";
import { u8aToHex } from "@polkadot/util";

import {
  substraCollectionDescription,
  SUBSTRAKNIGHT_COLLECTION_SYMBOL,
  WS_URL,
} from "../constants";
import { pinSingleMetadataFromDir } from "utils/pinata-utils";
import { sendAndFinalize } from "utils";

export const createSubstraknightCollection = async (kp: KeyringPair) => {
  try {
    console.log("CREATE SUBSTRAKNIGHT COLLECTION START -------");
    await cryptoWaitReady();
    const ws = WS_URL;
    const api = await getApi(ws);

    const collectionId = Collection.generateId(
      u8aToHex(kp.publicKey),
      SUBSTRAKNIGHT_COLLECTION_SYMBOL
    );

    console.log("pinning substra collection metadat on ipfs...");
    const collectionMetadataCid = await pinSingleMetadataFromDir(
      "/assets",
      "SubstraCollectionLogo.png",
      "SubstraKnights 2.0",
      {
        description: substraCollectionDescription,
        externalUri: "https://rmrk.app",
        properties: {},
      }
    );

    const substraCollection = new Collection(
      0,
      500,
      encodeAddress(kp.address, 2),
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
