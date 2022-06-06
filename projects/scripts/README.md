# RMRK2 Substraknight 2.0 Example

## Collection Settings

The collection settings are in `constants/collection-setings`.

The `fixedSetProba` file lists all Fixed Parts with associated probabilities to be drawned randomly.

The `slotConfigSet` list will determine all nested slots for your collection.

The item lists for minting are in the `itemDeployementList` and `misc-items` folders.

## Generate your Fixed Part List

Run `npm run generate`

## Mint Naked Soldiers with Fixed Part Features (Hai, Mouth, Skin, etc)

Run `npm run mint`

## Mint Items and Send them to the Soldiers

After minting all your soldiers, update the file `FULL_KUSAMARAUDER_LIST` in `constants/kusamrauder-item-deployement` using the files saved in `deployements/deployement`

Run `npm run add-items`