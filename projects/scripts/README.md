# RMRK2 Substraknight 2.0 Example

## Collection Settings

The collection settings are in `constants/collection-setings`.

The `fixedSetProba` file lists all Fixed Parts with associated probabilities to be drawned randomly.

The `slotConfigSet` list will determine all nested slots for your collection.

The item lists for minting are in the `itemDeployementList` and `misc-items` folders.

## Generate your Fixed Part List

Choose NUMBER_OF_SETS to determine the number of soldier fixed trait sets that will be minted.

Run `npm run generate`

## Mint Naked Soldiers with Fixed Part Features (Hair, Mouth, Skin, etc)

To mint soldiers, change the `LATEST_SOLDIER_SET` in `constants`, using the generated fixed part list.

Run `npm run mint`

## Mint Items and Send them to the Soldiers

After minting all your soldiers, update the file `FULL_KUSAMARAUDER_LIST` in `constants/kusamrauder-item-deployement` using the files saved in `deployements/deployement`

To add items to the soldiers, use the right format (`SoldierDeployement[]`) in the `mint-and-send-items` file.

Run `npm run add-items`
