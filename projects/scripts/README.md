# RMRK2 Substraknight minting scripts

This is a collection of script to mint Substraknight composable nested NFTs using RMRK2

Please Run scripts in following order:

- `npx ts-node ./run-mint-sequence.ts`
- `yarn fetch --prefixes=0x726d726b,0x524d524b --append=dumps-unconsolidated.json --ws wss://kusama-rpc.polkadot.io --collection='RMRK2 demo chunky collection'`
- `yarn consolidate --json=dumps-unconsolidated.json`

Then look at `consolidated-from-dumps-unconsolidated.json` to verify there's no invalid calls. If everything is ok, you can copy this json fil to `react-demo`
 project under `public/chunky-dump.json`
