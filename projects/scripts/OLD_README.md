## RMRK2 Substraknight minting scripts (DEPRECATED)

This is a collection of script to mint Substraknight composable nested NFTs using RMRK2

Please Run scripts in following order:

- `npx ts-node ./run-mint-sequence.ts`
- `yarn fetch --prefixes=0x726d726b,0x524d524b --append=dumps-unconsolidated.json --ws wss://kusama-rpc.polkadot.io --collection='Substra demo soldier collection'`
- `yarn consolidate --json=dumps-unconsolidated.json`

- `yarn fetch --append=dumps-unconsolidated.json --ws ws://127.0.0.1:9944 --collection='Substra demo soldier collection'` for local

Then look at `consolidated-from-dumps-unconsolidated.json` to verify there's no invalid calls. If everything is ok, you can copy this json fil to `react-demo`
project under `public/substra-dump.json`
