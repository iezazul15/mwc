// import all pre defined routes
const rootRoute = require("./rootRoute");
const authRoute = require("./authRoute");
const dashboardRoute = require("./dashboardRoute");
const postRoute = require("./postRoute");
const authorRoute = require("./authorRoute");
const activityRoute = require("./activityRoute");
const searchRoute = require("./searchRoute");
const donationRoute = require("./donationRoute");
const routes = [
  {
    path: "/",
    handler: rootRoute,
  },
  {
    path: "/auth",
    handler: authRoute,
  },
  {
    path: "/dashboard",
    handler: dashboardRoute,
  },
  {
    path: "/dashboard/post",
    handler: postRoute,
  },
  {
    path: "/author",
    handler: authorRoute,
  },
  {
    path: "/dashboard/activity",
    handler: activityRoute,
  },
  {
    path: "/search",
    handler: searchRoute,
  },
  {
    path: "/donation",
    handler: donationRoute,
  },
];

const setRouter = (app) => {
  routes.forEach((route) => {
    if (route.path === "/") {
      app.get(route.path, route.handler);
    } else {
      app.use(route.path, route.handler);
    }
  });
};

module.exports = setRouter;
