import UserModel from "@/models/user.model";
import { Strategy } from "passport-local";
import passwordHash from "password-hash";
import passport from "passport";
import expressSession from "express-session";
import connectMongo from "connect-mongo";
import { db } from "./db.init";
import { app, router } from "./server.init";

const MongoStore = connectMongo(expressSession);
const authStore = new MongoStore({ mongooseConnection: db });

passport.use(
  new Strategy(async function (username, password, done) {
    try {
      const user = await UserModel.findOne({ login: username });
      if (!user) {
        return done(null, false, { message: "Неверное имя пользователя." });
      }
      if (!passwordHash.verify(password, user.password)) {
        return done(null, false, { message: "Неверный пароль." });
      }
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  })
);
router.post(
  "/auth/signup",
  async (req,res,next)=> {
    try {
      const {username, password} = req.body;
      if (!username) {
        return res.status(401).json({ message: "Неверное имя пользователя." });
      }
      if (!password) {
        return res.status(401).json({ message: "Неверный пароль." });
      }
      const user = await UserModel.create({ login: username, password: passwordHash.generate(password) });
      return res.json(user);
    } catch (e) {
      if(e.code === 11000) res.status(401).json({message:"Пользователь уже существует"})
      else  next(e);
    }
  })

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: authStore,
  })
);

app.use(passport.initialize());
app.use(passport.session());

export { authStore };
