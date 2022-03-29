import { createBase } from "./create-base";
import { mintSubstraknight } from "./mint-substra";
import { addBaseResource } from "./mint-substra";
import { mintItems } from "./mint-substra-items";

export const runAddItemMintSequence = async (baseBlock, substrasBlock) => {
  try {
    // const baseBlock = await createBase();
    // const substrasBlock = await mintSubstraknight();
    // await addBaseResource(substrasBlock, baseBlock);
    await mintItems(substrasBlock, baseBlock, 1, 5);
    await mintItems(substrasBlock, baseBlock, 1, 6);
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};

runAddItemMintSequence(11995244, 11995254);
