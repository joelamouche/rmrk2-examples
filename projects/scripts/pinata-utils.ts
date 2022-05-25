import axios from "axios";
import { sleep } from "./utils";

require("dotenv").config();
import { Metadata } from "rmrk-tools/dist/tools/types";
import pLimit from "p-limit";
import { Readable } from "stream";
import fs from "fs";
// @ts-ignore
import pinataSDK, { PinataOptions, PinataPinOptions } from "@pinata/sdk";

const defaultOptions: Partial<PinataPinOptions> = {
  pinataOptions: {
    cidVersion: 1,
  },
};

export const pinata = pinataSDK(
  process.env.PINATA_KEY,
  process.env.PINATA_SECRET
);

const fsPromises = fs.promises;
export type StreamPinata = Readable & {
  path?: string;
};
const limit = pLimit(1);

export const testAuthentication = (cid: string) => {
  const url = `https://musicgateway.mypinata.cloud/ipfs/${cid}`;
  return axios
    .get(url, {
      headers: {
        pinata_api_key: process.env.PINATA_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET,
      },
    })
    .then(function (response) {
      //handle your response here
    })
    .catch(function (error) {
      //handle error here
    });
};

export const pinFileStreamToIpfs = async (
  file: StreamPinata,
  name?: string
) => {
  const options = { ...defaultOptions, pinataMetadata: { name } };
  const result = await pinata.pinFileToIPFS(file, options);
  return result.IpfsHash;
};

export const uploadAndPinIpfsMetadata = async (
  metadataFields: Metadata
): Promise<string> => {
  const options = {
    ...defaultOptions,
    pinataMetadata: { name: metadataFields.name },
  };
  try {
    const metadata = { ...metadataFields };
    const metadataHashResult = await pinata.pinJSONToIPFS(metadata, options);
    return `ipfs://ipfs/${metadataHashResult.IpfsHash}`;
  } catch (error) {
    return "";
  }
};

export const pinSingleMetadataFromDir = async (
  dir: string,
  path: string,
  name: string,
  metadataBase: Partial<Metadata>
) => {
  try {
    // Check that there is no typo in filename
    const fileNameList=await fsPromises.readdir(`${process.cwd()}${dir}`)
    if (!fileNameList.includes(path)){throw new Error(`${path} not in directory`)}

    // get image from file
    const imageFile = await fsPromises.readFile(
      `${process.cwd()}${dir}/${path}`
    );
    if (!imageFile) {
      throw new Error("No image file");
    }

    const stream: StreamPinata = Readable.from(imageFile);
    stream.path = path;

    const imageCid = await pinFileStreamToIpfs(stream, name);
    console.log(`NFT ${path} IMAGE CID: `, imageCid);
    const metadata: Metadata = {
      ...metadataBase,
      name,
      mediaUri: `ipfs://ipfs/${imageCid}`,
    };
    const metadataCid = await uploadAndPinIpfsMetadata(metadata);
    await sleep(1000);
    console.log(`NFT ${name} METADATA: `, metadataCid);
    return metadataCid;
  } catch (error) {
    console.log("ERR IPFS")
    console.log(error);
    console.log(JSON.stringify(error));
    throw error
  }
};
