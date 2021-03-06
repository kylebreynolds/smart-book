const router = require("express").Router();

const apiRoutes = require("./api");
const routesView = require("./routes-view");

router.use("/api", apiRoutes);
router.use("/", routesView);

// if a request not an endpoint that does not exist
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
