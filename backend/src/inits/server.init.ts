/* Express JS настраиваем тут */
import express from "express";
import HttpModule from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import compression from "compression";

const app = express();
const router = express.Router();

app.use(
  compression({
    filter: function (req, res) {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    },
  })
);

app.use(
  bodyParser.json({
    limit: process.env.MAX_BODY_SIZE + "mb" || "5mb",
  })
);
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  fileUpload({
    limits: {
      fileSize: parseInt(process.env.MAX_BODY_SIZE || "8") * 1024 * 1024,
    },
  })
);

const httpServer = HttpModule.createServer(app);
httpServer.listen(process.env.PORT);

export { app, router, httpServer };
