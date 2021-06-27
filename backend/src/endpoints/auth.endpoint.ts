import { Router } from "express";
import passport from "passport";

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user: Express.User, done) {
  done(null, user);
});

function applyAuthEndpoints(router: Router) {
  router.post(
    "/auth/login",
    passport.authenticate("local", {
    }),
    function (req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.redirect("/");
    }
  );
  router.post("/auth/check", function (req, res) {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: 1 });
    }
  });
  router.post("/auth/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });
}

export default applyAuthEndpoints;
