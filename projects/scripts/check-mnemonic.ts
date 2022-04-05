import {
  WS_URL,
  fixedSetProba,
  FixedSetProba,
  FixedPartProba,
  SlotSet,
  slotConfigSet,
} from "./constants";

import { getApi, getKeyringFromMnemonic } from "./utils";

const expectedAddress = "FCzwhSLYhFdqdSXXdUM2nGGpgDFit24tX8ajgfXWj49VEwo";

export const runFirstDropSeq = async (_fixedSetProba: FixedSetProba) => {
  try {
    const ws = WS_URL;
    const api = await getApi(ws);

    const pair = getKeyringFromMnemonic(process.env.MNEMONIC);
    // expect(pair.address).toEqual('HSLu2eci2GCfWkRimjjdTXKoFSDL3rBv5Ey2JWCBj68cVZj');
    // expect(encodeAddress(pair.publicKey)).toEqual('35cDYtPsdG1HUa2n2MaARgJyRz1WKMBZK1DL6c5cX7nugQh1');
    console.log("Derived Address " + pair.address);
    console.log("Substraknight Address " + expectedAddress);
    console.log("IS gOOD MNEMONIC " + pair.address === expectedAddress);

    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};

runFirstDropSeq(fixedSetProba);
