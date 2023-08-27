const express = require("express");
const router = express.Router();

// Require controller modules.
const watch_controller = require("../controllers/watchController");
const manufacturer_controller = require("../controllers/manufacturerController");
const category_controller = require("../controllers/categoryController");

/// WATCH ROUTES ///

// GET catalog home page.
router.get("/", watch_controller.index);

// GET request for creating a watch. NOTE This must come before routes that display watch (uses id).
router.get("/watch/create", watch_controller.watch_create_get);

// POST request for creating watch.
router.post("/watch/create", watch_controller.watch_create_post);

// GET request to delete watch.
router.get("/watch/:id/delete", watch_controller.watch_delete_get);

// POST request to delete watch.
router.post("/watch/:id/delete", watch_controller.watch_delete_post);

// GET request to update watch.
router.get("/watch/:id/update", watch_controller.watch_update_get);

// POST request to update watch.
router.post("/watch/:id/update", watch_controller.watch_update_post);

// GET request for one watch.
router.get("/watch/:id", watch_controller.watch_detail);

// GET request for list of all watch items.
router.get("/watches", watch_controller.watch_list);

/// manufacturer ROUTES ///

// GET request for creating manufacturer. NOTE This must come before route for id (i.e. display manufacturer).
router.get("/manufacturer/create", manufacturer_controller.manufacturer_create_get);

// POST request for creating manufacturer.
router.post("/manufacturer/create", manufacturer_controller.manufacturer_create_post);

// GET request to delete manufacturer.
router.get("/manufacturer/:id/delete", manufacturer_controller.manufacturer_delete_get);

// POST request to delete manufacturer.
router.post("/manufacturer/:id/delete", manufacturer_controller.manufacturer_delete_post);

// GET request to update manufacturer.
router.get("/manufacturer/:id/update", manufacturer_controller.manufacturer_update_get);

// POST request to update manufacturer.
router.post("/manufacturer/:id/update", manufacturer_controller.manufacturer_update_post);

// GET request for one manufacturer.
router.get("/manufacturer/:id", manufacturer_controller.manufacturer_detail);

// GET request for list of all manufacturers.
router.get("/manufacturers", manufacturer_controller.manufacturer_list);

/// GENRE ROUTES ///

// GET request for creating a Category. NOTE This must come before route that displays category (uses id).
router.get("/category/create", category_controller.category_create_get);

//POST request for creating Genre.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Genre.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Genre.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Genre.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Genre.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one Genre.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all Genre.
router.get("/categories", category_controller.category_list);

module.exports = router;
