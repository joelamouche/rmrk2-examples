import { cryptoWaitReady } from "@polkadot/util-crypto";
import { fixedSetProba, FixedSetProba } from "./constants";

import { getKeyringFromMnemonic } from "./utils";

const expectedAddress = "FCzwhSLYhFdqdSXXdUM2nGGpgDFit24tX8ajgfXWj49VEwo";

export const runFirstDropSeq = async (_fixedSetProba: FixedSetProba) => {
  try {
    await cryptoWaitReady();
    const pair = getKeyringFromMnemonic(process.env.MNEMONIC);

    console.log("Derived Address " + pair.address);
    console.log("Substraknight Address " + expectedAddress);
    console.log("IS GOOD MNEMONIC " + (pair.address === expectedAddress));

    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};

runFirstDropSeq(fixedSetProba);
