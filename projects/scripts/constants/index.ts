import { SlotConfigSet } from "./types";

export const isProd = true;

export const WS_URL = isProd
  ? "wss://kusama-rpc.polkadot.io"
  : "ws://127.0.0.1:9944";

// export const slotList = [];
// [
//   "weapon",
//   "pants",
//   "feet",
//   "cloth",
//   "hands",
//   "arm",
//   "underhelm",
//   "head",
//   "chest",
//   "hood",
//   "shoulder",
//   "shield",
// ];

// export const soldierIndexList = [1]; //,2,3,4]

export * from "./types";
export * from "./collection-settings";
export * from "./kusamarauder-item-deployements";
