/* MongoDB настраиваем тут */

import mongoose from "mongoose";
/* 
import autoIncrement from "mongoose-auto-increment";
autoIncrement.initialize(mongoose.connection);
*  */

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const dbConnectURI: string = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

let dbConnectOptions: {} = {
  autoIndex: true,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: !true,
  useUnifiedTopology: true,
};

var db = mongoose.connection;
mongoose.connect(dbConnectURI, dbConnectOptions); // монго соединение с авторизацией
mongoose.set("useCreateIndex", true);

db.on("connected", function () {
  console.log("\x1b[36m%s\x1b[0m \x1b[32m%s\x1b[0m", "@GBX:", "DB connected!");
});

db.on("error", function (error) {
  console.log("\x1b[36m%s\x1b[0m \x1b[32m%s\x1b[0m", "@GBX:", "Error in Db connection: ");
});

export { db };
