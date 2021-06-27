import { router } from "@/inits/server.init";
import NFTModel from "@/models/nft.model";
import CRUDEndpoints from "./CRUDEndpoints";

router.get("/nft", async function (req, res, next) {
  try {
    const all = await NFTModel.find();
    res.json(all);
  } catch (e) {
    next(e);
    console.log(e);
  }
});
CRUDEndpoints(router, {
  endpoint: "nft",
  parameters: ["name", "description", "image", "sym", "attributes", "externalUri", "type", "collectionId"],
  model: NFTModel,
});

import { Router } from "express";
//import truffle from "truffle";
import "@/blockchain/nftDeployer";
import nftDeployer from "@/blockchain/nftDeployer";

export default function applyNFTGeneratorEndpoints(router: Router) {
  router.get("/nft-meta/:id/0", async function (req, res, next) {
    try {
      const nftId = req.params.id;
      const nftDoc = await NFTModel.findOne({ _id: nftId });

      if (!nftDoc) throw new Error("NFT_NOT_FOUND");
      const { name, description, image, externalUri } = nftDoc;
      res.json({
        id: 0,
        name,
        description,
        image: process.env.HOST + image,
        externalUri,
      });
    } catch (e) {
      next(e);
    }
  });
  router.post("/nft-deploy", async function (req, res, next) {
    try {
      const { nftId, wallet, price } = req.body;
      if (!nftId || !wallet || !price || typeof price !== "number") throw new Error("BAD_REQUEST");
      const nftDoc = await nftDeployer(nftId, wallet, price);
      res.json(nftDoc);
    } catch (e) {
      next(e);
      console.log(e);
    }
  });
}
