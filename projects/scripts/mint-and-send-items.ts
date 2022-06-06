import fs from "fs";
import { SoldierDeployement, LATEST_CID } from "./constants";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { mintAndSendItemsForEvent } from "./item-lib/send-item-to-soldier-utils";

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
  [
    {
      kusamarauderNumber: 92,
      items: [
        {
          slotCategory: "Weapons",
          fileName: "ListenSword",
          traitName: "Listen Katana",
          zIndex: 2,
          traitDescription:
            "A well crafted blade, Listen Shogun Katana.\nPOWER: 1500",
        },
      ],
    },
    {
      kusamarauderNumber: 72,
      items: [
        {
          slotCategory: "Heads",
          fileName: "LegionaryHelmet",
          traitName: "Legionary Helmet",
          zIndex: 16,
          traitDescription:
            "A solid helmet covering most of the head.\nPOWER: 200",
        },
      ],
    },
  ],
  LATEST_CID
);
