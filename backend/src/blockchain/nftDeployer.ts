import HDWalletProvider from "@truffle/hdwallet-provider";
import nftGenerator from "./nftGenerator";

// @ts-nocheck
import Contract from "@truffle/contract";
import NFTModel from "@/models/nft.model";

/* 
import Web3 from "web3";
const provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545"); // local tests with Ganache!
*  */
 
const provider = new HDWalletProvider(
  process.env.WALLET_KEY || "",
  `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
);
export default async function nftDeployer(nftId: string, toWalletAddress: string, price: number) {
  const nftDoc = await NFTModel.findOne({ _id: nftId });
  if (!nftDoc) throw new Error("NFT_NOT_FOUND");
  if (nftDoc.deploying) throw new Error("ALREADY_DEPLOYING");

  const contractJSON = nftGenerator({
    name: nftDoc.name,
    sym: nftDoc.sym,
    uri: `${process.env.HOST}${process.env.API_PATH}nft-meta/${nftDoc._id}/`,
  });

  console.log("GENERATION SUCCESS");
  // @ts-expect-error NO TYPE DEF
  const SergazinContract = Contract(contractJSON);
  SergazinContract.setProvider(provider);

  try {
    console.log("PUSH_START");

    // Wait for transaction approval....
    nftDoc.deploying = true;
    await nftDoc.save();
    const result = await SergazinContract.new({
      from: process.env.WALLET_ADDRESS,
    });
    console.log("PUSH_END");

    const { address, transactionHash } = result;

    result.safeMint(toWalletAddress, 0, { from: process.env.WALLET_ADDRESS });

    nftDoc.price = price;
    nftDoc.contractAddress = address;
    nftDoc.transactionHash = transactionHash;
  } catch (e) {
    throw e;
  } finally {
    nftDoc.deploying = false;
    await nftDoc.save();
    return nftDoc;
  }
}
