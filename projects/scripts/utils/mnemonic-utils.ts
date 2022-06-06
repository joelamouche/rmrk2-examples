import Keyring from "@polkadot/keyring";
import { KeyringPair } from "@polkadot/keyring/types";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { fixedSetProba, FixedSetProba } from "../constants";

const expectedAddress = "FCzwhSLYhFdqdSXXdUM2nGGpgDFit24tX8ajgfXWj49VEwo";

export const checkMnemonic = async (_fixedSetProba: FixedSetProba) => {
  try {
    await cryptoWaitReady();
    const pair = getKeyringFromMnemonic(process.env.MNEMONIC);

    console.log("Derived Address : " + pair.address);
    console.log("Substraknight Address : " + expectedAddress);
    console.log("GOOD MNEMONIC " + (pair.address === expectedAddress));

    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};

export const getKeyringFromMnemonic = (mnemonic: string): KeyringPair => {
  const keyring = new Keyring({ ss58Format: 42, type: "sr25519" });
  keyring.setSS58Format(2);
  return keyring.addFromMnemonic(mnemonic); //, {genesisHash}, "sr25519");
};

// checkMnemonic(fixedSetProba);
