import { WS_URL } from "./constants";
import fs from "fs";
require("dotenv").config();
import { KeyringPair, KeyringPair$Json } from "@polkadot/keyring/types";
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { CodecHash } from "@polkadot/types/interfaces";
import { generateKey } from "crypto";
//import { keyring  } from '@polkadot/ui-keyring';

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

export const getKeyringFromMnemonic = (mnemonic: string): KeyringPair => {
  const keyring = new Keyring({ ss58Format: 42, type: "sr25519" });
  keyring.setSS58Format(2);
  return keyring.addFromMnemonic(mnemonic); //, {genesisHash}, "sr25519");
};

function parseFile(
  keyring,
  file: Uint8Array,
  genesisHash?: string | null
): KeyringPair | null {
  try {
    return keyring.createFromJson(
      JSON.parse(u8aToString(file)) as KeyringPair$Json,
      { genesisHash }
    );
  } catch (error) {
    console.error(error);
  }

  return null;
}

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

const genesisHash =
  "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe";

export const getKeyringFromJSON = async (): Promise<KeyringPair> => {
  const keyring = new Keyring({ type: "sr25519" });
  const json = await getJSONString();
  console.log("json", json);
  //keyring.loadAll({genesisHash})

  let pair = keyring.createFromJson(
    {
      encoded:
        "2gZ2dmz4+YLt4juetJ3JhOCFqviXwptmK6hfeyQCbHgAgAAAAQAAAAgAAAAI/xqCjYUZmbCzqsBxd0Oi2yHD9Y2nP/tLjn9x1yyA4RknCtBmwBNBvsckE5vF5vk7rGxRUL78pqfLYw7ruzhruCbEg/IonRBWWRlRrCL7Mc36wzXPtnA0RUIA7OhyqBzZLP7SEasMDZgopuWviQrtVgcC35TaLNO5N4EmMpTdqqd690cNTyQJN5dsO9kiaZNkrYwNlpcKtTNVBILH",
      encoding: {
        content: ["pkcs8", "sr25519"],
        type: ["scrypt", "xsalsa20-poly1305"],
        version: "3",
      },
      address: "FCzwhSLYhFdqdSXXdUM2nGGpgDFit24tX8ajgfXWj49VEwo",
      meta: {
        genesisHash:
          "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe",
        isHardware: false,
        name: "Substraknight acc",
        tags: [],
        whenCreated: 1649182151932,
      },
    }
    //JSON.parse(
    //json
    //)
  );

  // console.log("decode", pair.decodePkcs8('password'));
  const password = "password";
  pair.unlock("password");
  console.log("unlocked pair", pair);
  pair.unlock("password");
  console.log("unlocked pair", pair.toJson("password"));
  return pair;
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
    let unsubscribe = await tx.signAndSend(
      account,
      async ({ events = [], status, dispatchError }) => {
        if (status.isInBlock) {
          success = dispatchError ? false : true;
          console.log(
            `📀 Transaction ${tx.meta.name} included at blockHash ${status.asInBlock} [success = ${success}]`
          );
          const api = await getApi(WS_URL);
          const signedBlock = await api.rpc.chain.getBlock(status.asInBlock);
          block = signedBlock.block.header.number.toNumber();
          included = [...events];
        } else if (status.isBroadcast) {
          console.log(`🚀 Transaction broadcasted.`);
        } else if (status.isFinalized) {
          console.log(
            `💯 Transaction ${tx.meta.name}(..) Finalized at blockHash ${status.asFinalized}`
          );
          finalized = [...events];
          let hash = status.hash;
          unsubscribe();
          resolve({ success, hash, included, finalized, block });
        } else if (status.isReady) {
          // let's not be too noisy..
        } else {
          console.log(`🤷 Other status ${status}`);
        }
      }
    );
  });
};
function u8aToString(file: Uint8Array): string {
  throw new Error("Function not implemented.");
}
