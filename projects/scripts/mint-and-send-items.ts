import { SoldierDeployement, LATEST_CID } from "./constants";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { mintAndSendItemsForEvent } from "./item-lib/send-item-to-soldier-utils";
import { eventList0506 } from "./constants/itemDeployementList/eventList0506";
import { mint1006 } from "./constants/itemDeployementList/mint1006";
import { bossEvent2 } from "./constants/itemDeployementList/bossEvent2";
import { distrib1506 } from "./constants/itemDeployementList/distrib1506";
import { event1906 } from "./constants/itemDeployementList/event1906";

export const main = async (eventList: SoldierDeployement[], ipfsHash) => {
  await cryptoWaitReady();

  // Mint and send items
  await mintAndSendItemsForEvent(eventList, ipfsHash);

  // send existing items to another soldier
  // const kp = getKeyringFromMnemonic(process.env.MNEMONIC);
  // await sendItemsToSoldier(kp,12136319,12310017,83-1,98,{
  //         slotCategory: "Backgrounds",
  //         fileName: "ForestBackground",
  //         traitName: "Forest Camp",
  //         zIndex: 0,
  //         traitDescription: "Out of prison, out of trouble... For now...",
  //       })

  console.log("SCRIPT OVER");
  process.exit();
};
main(
  event1906,
  LATEST_CID
);
