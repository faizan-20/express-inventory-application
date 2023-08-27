const Watch = require('../models/watch');
const Manufacturer = require('../models/manufacturer');
const Category = require('../models/category');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const [
    numWatches,
    numManufacturer,
    numCategory
  ] = await Promise.all([
    Watch.countDocuments({}).exec(),
    Manufacturer.countDocuments({}).exec(),
    Category.countDocuments({}).exec()
  ]);

  res.render("index", {
    title: "Watch Store",
    watch_count: numWatches,
    manufacturer_count: numManufacturer,
    category_count: numCategory
  });
});

exports.watch_list = asyncHandler(async (req, res, next) => {
  const allWatches = await Watch.find({}, "name manufacturer")
    .sort({ name: 1 })
    .populate("manufacturer")
    .exec();

    res.render("watch_list", { title: "Watch List", watch_list: allWatches });
});

exports.watch_detail = asyncHandler(async (req, res, next) => {
  const watch = await Watch.findById(req.params.id).populate("manufacturer").populate("category").exec();

  if (watch === null) {
    const err = new Error("Watch not found");
    err.status = 404;
    return next(err);
  }

  res.render("watch_detail", {
    name: watch.name,
    watch: watch,
  })
});

exports.watch_create_get = asyncHandler(async (req, res, next) => {
  const [allManufacturers, allCategories] = await Promise.all([
    Manufacturer.find().exec(),
    Category.find().exec(),
  ]);

  res.render("watch_form", {
    title: "Create Watch",
    manufacturers: allManufacturers,
    categories: allCategories,
  });
});

exports.watch_create_post = [

  // (req, res, next) => {
  //   if (!(req.body.genre instanceof Array)) {
  //     if (typeof req.body.genre === "undefined") req.body.genre = [];
  //     else req.body.genre = new Array(req.body.genre);
  //   }
  //   next();
  // },

  body("name", "Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("manufacturer", "Manufacturer must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("stock", "Stock must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "category must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const watch = new Watch({
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      const [allManufacturers, allCategories] = await Promise.all([
        Manufacturer.find().exec(),
        Category.find().exec(),
      ]);

      // for (const category of allCategories) {
      //   if (watch.category.includes(category._id)) {
      //     category.checked = "true";
      //   }
      // }
      res.render("watch_form", {
        title: "Create Watch",
        manufacturers: allManufacturers,
        categories: allCategories,
        watch: watch,
        errors: errors.array(),
      });
    } else {
      await watch.save();
      res.redirect(watch.url);
    }
  }),
];

exports.watch_delete_get = asyncHandler(async (req, res, next) => {
  const watch = await Watch.findById(req.params.id).exec();

  if (watch === null) {
    res.redirect("/catalog/watches");
  }

  res.render("watch_delete", {
    title: "Delete Watch",
    watch: watch,
  });
});

exports.watch_delete_post = asyncHandler(async (req, res, next) => {
  await Watch.findByIdAndRemove(req.body.watchid);
  res.redirect("/catalog/watches");
});

exports.watch_update_get = asyncHandler(async (req, res, next) => {
  const [watch, allmanufacturers, allCategories] = await Promise.all([
    Watch.findById(req.params.id).populate("manufacturer").populate("category").exec(),
    Manufacturer.find().exec(),
    Category.find().exec(),
  ]);

  if (watch === null) {
    const err = new Error("Watch not found");
    err.status = 404;
    return next(err);
  }

  // for (const category of allCategories) {
  //   for (const watch_c of watch.category) {
  //     if (category._id.toString() === watch_c._id.toString()) {
  //       category.checked = "true";
  //     }
  //   }
  // }

  res.render("watch_form", {
    title: "Update Watch",
    manufacturers: allmanufacturers,
    categories: allCategories,
    watch: watch,
  });
});

exports.watch_update_post = [
  // (req, res, next) => {
  //   if (!(req.body.category instanceof Array)) {
  //     if (typeof req.body.category === "undefined") {
  //       req.body.category = [];
  //     } else {
  //       req.body.category = new Array(req.body.category);
  //     }
  //   }
  //   next();
  // },

  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("manufacturer", "Manufacturer must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("stock", "Stock must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const watch = new Watch({
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      // genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      category: req.body.category,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const [allManufacturers, allCategories] = await Promise.all([
        Manufacturer.find().exec(),
        Category.find().exec(),
      ]);

      // for (const category of allCategories) {
      //   if (watch.category.indexOf(category._id) > -1) {
      //     category.checked = "true";
      //   }
      // }

      res.render("watch_form", {
        title: "Update Watch",
        manufacturers: allManufacturers,
        categories: allCategories,
        watch: watch,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedWatch = await Watch.findByIdAndUpdate(req.params.id, watch, {});
      res.redirect(updatedWatch.url);
    }
  }),
];
