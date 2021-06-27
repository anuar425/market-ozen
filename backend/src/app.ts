if (process.env.NODE_ENV !== "development") {
  const result = require("dotenv").config();
  console.log(process.env);
}
import "@/inits/db.init";
import { app, router, httpServer } from "@/inits/server.init";
import "@/inits/auth.init";

import applyAuthEndpoints from "./endpoints/auth.endpoint";
import applyUploadEndpoints from "./endpoints/upload.endpoint";
import applyNFTGeneratorEndpoints from "./endpoints/nft.endpoint";
import "./endpoints/collections.endpoint";
import { NextFunction, Request, Response } from "express";

applyAuthEndpoints(router);
applyUploadEndpoints(router);
applyNFTGeneratorEndpoints(router);

app.use(process.env.API_PATH || "/api/", router);

// ERROR HANDLING
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  let { name, message } = err;
  res.status(400).json({ name, message });
});



process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });
console.log("APP STARTED! PORT: ", process.env.PORT);
