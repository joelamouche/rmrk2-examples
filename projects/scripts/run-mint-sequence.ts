import { allFixedPartsList, fixedPartsSet, slotList } from "./constants";
import { createBase } from "./create-base";
import { mintSubstraknight } from "./mint-substra";
import { addBaseResource } from "./mint-substra";
import { mintItems } from "./mint-substra-items";

export const runMintSequence = async () => {
  try {
    const baseBlock = await createBase(allFixedPartsList, slotList);
    const substrasBlock = await mintSubstraknight(1);
    await addBaseResource(substrasBlock, baseBlock, fixedPartsSet, 1);
    await mintItems(substrasBlock, baseBlock, 1, 1);
    await mintItems(substrasBlock, baseBlock, 1, 2);
    await mintItems(substrasBlock, baseBlock, 1, 3);
    await mintItems(substrasBlock, baseBlock, 1, 4);
    await mintItems(substrasBlock, baseBlock, 1, 5);
    await mintItems(substrasBlock, baseBlock, 1, 6);
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};

runMintSequence();
