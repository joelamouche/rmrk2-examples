import { createBase } from "./create-base";
import { mintSubstraknight } from "./mint-substra";
import { addBaseResource } from "./mint-substra";
import { mintItems } from "./mint-substra-items";

export const runMintSequence = async () => {
  try {
    const baseBlock = await createBase();
    const substrasBlock = await mintSubstraknight();
    await addBaseResource(substrasBlock, baseBlock);
    await mintItems(substrasBlock, baseBlock,1,1);
    await mintItems(substrasBlock, baseBlock,1,2);
    await mintItems(substrasBlock, baseBlock,1,3);
    await mintItems(substrasBlock, baseBlock,1,4);
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};

runMintSequence();
