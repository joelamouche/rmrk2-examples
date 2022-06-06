import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import {
  LATEST_CID,
  SUBSTRAKNIGHT_BASE_SYMBOL,
  SUBSTRAKNIGHT_COLLECTION_SYMBOL,
  FixedTrait,
  slotConfigSet,
} from "../constants";
import { Base, Collection, NFT } from "rmrk-tools";
import { u8aToHex } from "@polkadot/util";
import { pinSingleMetadataFromDir } from "../utils/pinata-utils";
import { nanoid } from "nanoid";
import { KeyringPair } from "@polkadot/keyring/types";

export const getTxAddBaseResource = async (
  kp: KeyringPair,
  substraBlock: number,
  baseBlock: number,
  fixedPartSet: FixedTrait[],
  api,
  substraCollectionId: string,
  soldierIndex: number
) => {
  const soldierNumber = soldierIndex + 1;
  try {
    console.log(
      "ADD BASE RESOURCE TO SUBSTRAKNIGHT NFT START ------- " + soldierIndex
    );
    console.log(fixedPartSet);

    const baseEntity = new Base(
      baseBlock,
      SUBSTRAKNIGHT_BASE_SYMBOL,
      encodeAddress(kp.address, 2),
      "svg"
    );

    const BASE_ID = baseEntity.getId();

    // for each soldier, add base ressource

    // instantiate knight nft
    const substraNft = new NFT({
      block: substraBlock,
      collection: substraCollectionId,
      symbol: `soldier_${soldierNumber}`,
      transferable: 1,
      sn: `${soldierNumber}`.padStart(8, "0"),
      owner: encodeAddress(kp.address, 2),
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
          thumb: `ipfs://ipfs/${LATEST_CID}/SoldierPreview.png`,
        })
      ),
    ];
  } catch (error: any) {
    console.error(error);
  }
};

export const getTxMintSubstraknight = async (
  kp: KeyringPair,
  api,
  soldierIndex: number
) => {
  const soldierNumber = soldierIndex + 1;
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
    console.log("pinning soldier metadata on ipfs...");
    const metadataCid = await pinSingleMetadataFromDir(
      "/assets",
      "SoldierPreview.png",
      `Kusamarauder #${soldierNumber}`,
      {
        description: `A mighty Kusamarauder. Member of the warrior cast.\nPOWER: 1000`,
        externalUri: "https://rmrk.app",
        properties: {},
      }
    );

    // mint nft
    const nft = new NFT({
      block: 0,
      collection: collectionId,
      symbol: `soldier_${soldierNumber}`,
      transferable: 1,
      sn: `${soldierNumber}`.padStart(8, "0"),
      owner: encodeAddress(kp.address, 2),
      metadata: metadataCid,
    });

    return [api.tx.system.remark(nft.mint())];
  } catch (error: any) {
    console.error(error);
  }
};
