import { router } from "@/inits/server.init";
import CollectionModel from "@/models/collection.model";
import CRUDEndpoints from "./CRUDEndpoints";

router.get("/collections", async function (req, res, next) {
  try {
    const all = await CollectionModel.find();
    res.json(all);
  } catch (e) {
    next(e);
    console.log(e);
  }
});
CRUDEndpoints(router, {
  endpoint: "collections",
  parameters: ["name", "description", "image"],
  model: CollectionModel,
});
