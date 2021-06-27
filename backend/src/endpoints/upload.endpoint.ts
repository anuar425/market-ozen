import express, { Router } from "express";
import Path from "path";
import fs from "fs";
import { v4 } from "uuid";
import { UploadedFile } from "express-fileupload";

function applyUploadEndpoints(router: Router) {
  router.use("/uploads", express.static(process.env.UPLOAD_PATH || "/_uploads"));
  router.post("/upload", async function (req, res, next) {
    try {
      const user = req.user!;
      if (!req.files || !req.files.file) throw new Error("FILES_NOT_FOUND");
      const file = req.files.file as UploadedFile;
      let ext = Path.extname(file.name).replace(".", "").toLowerCase();

      let fileName = v4() + "." + ext;
      let finalPath = Path.resolve(process.env.UPLOAD_PATH || "/_uploads");
      let finalUrl = process.env.UPLOAD_URL;

      if (!fs.existsSync(finalPath)) {
        fs.mkdirSync(finalPath);
      }

      finalPath += `/${fileName}`;
      finalUrl += `/${fileName}`;
      await file.mv(finalPath);

      res.json(finalUrl);
    } catch (e) {
      next(e);
    }
  });
}

export default applyUploadEndpoints;
