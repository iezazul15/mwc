// importing necessary modules
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const morgan = require("morgan");
const { bindUserWithReq } = require("./authMiddleware");
const setLocals = require("./setLocals");

// middlewares
const middlewares = [
  morgan("dev"),
  express.static("node_modules/bootstrap/dist"),
  express.static("public"),
  express.json(),
  express.urlencoded({ extended: true }),
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 72 * 1000,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 60 * 60 * 24 * 7,
    }),
  }),
  flash(),
  bindUserWithReq,
  setLocals,
];

const setMiddleware = (app) => {
  app.use(middlewares);
};

module.exports = setMiddleware;
