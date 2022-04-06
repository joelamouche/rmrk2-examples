import { IBasePart } from "rmrk-tools/dist/classes/base";
import {
  ASSETS_CID,
  SUBSTRAKNIGHT_BASE_SYMBOL,
  WS_URL,
  FixedPart,
  SlotConfig,
} from "./constants";
import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { getApi, sendAndFinalize } from "./utils";
import { Base } from "rmrk-tools";
import { getItemCollectionId } from "./mint-substra-items";
import { KeyringPair } from "@polkadot/keyring/types";

export const allFixedParts = (list: FixedPart[]): IBasePart[] => {
  let res = [];
  list.forEach((fixedPart) => {
    fixedPart.traits.forEach((trait) => {
      res.push({
        type: "fixed",
        id: trait,
        src: `ipfs://ipfs/${ASSETS_CID}/FixedParts/${fixedPart.traitClass}/${trait}.svg`,
        z: fixedPart.zIndex,
      });
    });
  });
  return res;
};

const getSlotKanariaParts = (
  slotConfigList: SlotConfig[],
  equippable: string[] | "*" = []
): IBasePart[] => {
  return slotConfigList.map((slotConfig, i) => {
    return {
      type: "slot",
      id: slotConfig.slotCategory,
      equippable,
      z: slotConfig.zIndex,
    };
  });
};

export const createBase = async (
  kp: KeyringPair,
  allFixedPartJSON: FixedPart[],
  _slotList: SlotConfig[]
) => {
  try {
    console.log("CREATE SUBSTRAKNIGHT BASE START -------");
    await cryptoWaitReady();
    const ws = WS_URL;
    const api = await getApi(ws);

    const _allFixedParts = allFixedParts(allFixedPartJSON);

    const baseParts = [
      ..._allFixedParts,
      ...getSlotKanariaParts(
        _slotList,
        _slotList.map((slot) => {
          return getItemCollectionId(kp, slot.slotCategory);
        })
      ),
    ];

    const baseEntity = new Base(
      0,
      SUBSTRAKNIGHT_BASE_SYMBOL,
      encodeAddress(kp.address, 2),
      "svg",
      baseParts
    );

    const { block, success } = await sendAndFinalize(
      api.tx.system.remark(baseEntity.base()),
      kp
    );
    console.log("Substraknight Base created at block: ", block);
    console.log("successk: ", success);
    return block;
  } catch (error: any) {
    console.error(error);
  }
};
