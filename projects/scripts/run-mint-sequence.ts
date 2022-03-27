import { createBase } from "./create-base";
import { mintSubstraknight } from "./mint-substra";
import { addBaseResource } from "./mint-substra";
import { mintItems } from "./mint-substra-items";

export const runMintSequence = async () => {
  try {
    const baseBlock = await createBase();
    const chunkiesBlock = await mintSubstraknight();
    await addBaseResource(chunkiesBlock, baseBlock);
    await mintItems(chunkiesBlock, baseBlock,1,1);
    await mintItems(chunkiesBlock, baseBlock,1,2);
    await mintItems(chunkiesBlock, baseBlock,1,3);
    await mintItems(chunkiesBlock, baseBlock,1,4);
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};

runMintSequence();
