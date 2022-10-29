import { SoldierDeployement, LATEST_CID } from "./constants";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { mintAndSendItemsForEvent } from "./item-lib/send-item-to-soldier-utils";
import { eventList0506 } from "./constants/itemDeployementList/eventList0506";
import { mint1006 } from "./constants/itemDeployementList/mint1006";
import { bossEvent2 } from "./constants/itemDeployementList/bossEvent2";
import { distrib1506 } from "./constants/itemDeployementList/distrib1506";
import { event1906 } from "./constants/itemDeployementList/event1906";
import { event2406 } from "./constants/itemDeployementList/event2406";
import { event0307 } from "./constants/itemDeployementList/event0307";
import { event1007 } from "./constants/itemDeployementList/event1007";
import { event1707 } from "./constants/itemDeployementList/event1707";
import { event3107 } from "./constants/itemDeployementList/event3107";
import { event0808 } from "./constants/itemDeployementList/event0808";
import { event1408 } from "./constants/itemDeployementList/event1408";
import { event2808 } from "./constants/itemDeployementList/event2808";
import { event0509 } from "./constants/itemDeployementList/event0509";
import { event1109 } from "./constants/itemDeployementList/event1109";
import { event2509 } from "./constants/itemDeployementList/event2509";
import { event0210 } from "./constants/itemDeployementList/event0210";
import { event0910 } from "./constants/itemDeployementList/event0910";
import { event2410 } from "./constants/itemDeployementList/event2410";

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
  event2410,
  LATEST_CID
);
