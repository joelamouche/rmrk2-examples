import { WS_URL } from "../constants";
import fs from "fs";
require("dotenv").config();
import { KeyringPair, KeyringPair$Json } from "@polkadot/keyring/types";
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { CodecHash } from "@polkadot/types/interfaces";

export const getKeys = (): KeyringPair[] => {
  const k = [];
  const keyring = new Keyring({ type: "sr25519" });
  console.log(process.env.PRIVAKE_KEY);
  k.push(keyring.addFromUri(process.env.PRIVAKE_KEY));
  return k;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};

export const getKeyringFromUri = (phrase: string): KeyringPair => {
  const keyring = new Keyring({ type: "sr25519" });
  return keyring.addFromUri(phrase);
};

// Get list if fixed parts
export const getJSONString = async (): Promise<any> => {
  return new Promise((res) => {
    fs.readFile(
      "secretJSON/FCzwhSLYhFdqdSXXdUM2nGGpgDFit24tX8ajgfXWj49VEwo.json",
      (err, data) => {
        if (err) throw err;
        let setList = JSON.parse(data.toString());
        res(setList);
      }
    );
  });
};

export const getApi = async (wsEndpoint: string): Promise<ApiPromise> => {
  const wsProvider = new WsProvider(wsEndpoint);
  const api = ApiPromise.create({ provider: wsProvider });
  return api;
};

export const chunkArray = (array: any[], size: number) => {
  let result = [];
  for (let i = 0; i < array.length; i += size) {
    let chunk = array.slice(i, i + size);
    result.push(chunk);
  }
  return result;
};

/*
 Thanks to Martin for this util example
 */
export const sendAndFinalize = async (
  tx: SubmittableExtrinsic<"promise", ISubmittableResult>,
  account: KeyringPair
): Promise<{
  block: number;
  success: boolean;
  hash: CodecHash;
  included: any[];
  finalized: any[];
}> => {
  return new Promise(async (resolve) => {
    let success = false;
    let included = [];
    let finalized = [];
    let block = 0;
    try {
      let unsubscribe = await tx.signAndSend(
        account,
        async ({ events = [], status, dispatchError }) => {
          if (status.isInBlock) {
            success = dispatchError ? false : true;
            console.log(
              `📀 Transaction ${tx.meta.name} included at blockHash ${status.asInBlock} [success = ${success}]`
            );
            included = [...events];
          } else if (status.isBroadcast) {
            console.log(`🚀 Transaction broadcasted.`);
          } else if (status.isFinalized) {
            console.log(
              `💯 Transaction ${tx.meta.name}(..) Finalized at blockHash ${status.asFinalized}`
            );
            finalized = [...events];
            let hash = status.asFinalized;
            const api = await getApi(WS_URL);
            const signedBlock = await api.rpc.chain.getBlock(hash);
            block = signedBlock.block.header.number.toNumber();
            unsubscribe();
            resolve({ success, hash, included, finalized, block });
          } else if (status.isReady) {
            // let's not be too noisy..
          } else {
            console.log(`🤷 Other status ${status}`);
          }
        }
      );
    } catch (error: any) {
      console.error("error sendAndFinalize ", error);
      process.exit();
    }
  });
};
