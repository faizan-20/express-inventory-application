const Manufacturer = require('../models/manufacturer');
const Watch = require('../models/watch');
const { body, validationResult } = require("express-validator");

const asyncHandler = require('express-async-handler');

exports.manufacturer_list = asyncHandler(async (req, res, next) => {
    const allManufacturer = await Manufacturer.find({}).sort({ name: 1 }).exec();

    res.render("manufacturer_list", {title: "Manufacturers List", manufacturer_list: allManufacturer});
});

exports.manufacturer_detail = asyncHandler(async (req, res, next) => {
  const [manufacturer, allWatchesByManufacturer] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
    Watch.find({ manufacturer: req.params.id }).exec(),
  ]);

  if (manufacturer === null) {
    const err = new Error("Manufacturer not found");
    err.status = 404;
    return next(err);
  }

  res.render("manufacturer_detail", {
    title: "Manufacturer Detail",
    manufacturer: manufacturer,
    manufacturer_watches: allWatchesByManufacturer,
  });
});

exports.manufacturer_create_get = (req, res, next) => {
  res.render("manufacturer_form", { title: "Create Manufacturer" });
};

exports.manufacturer_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters"),
  body("est")
    .trim()
    .isLength({ min:4 })
    .escape()
    .withMessage("Year must be specified"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const manufacturer = new Manufacturer({
      name: req.body.name,
      est: req.body.est,
    });

    if (!errors.isEmpty()) {
      res.render("manufacturer_form", {
        title: "Create Manufacturer",
        manufacturer: manufacturer,
        errors: errors.array(),
      });
      return;
    } else {
      await manufacturer.save();
      res.redirect(manufacturer.url);
    }
  }),
];

exports.manufacturer_delete_get = asyncHandler(async (req, res, next) => {
  const [manufacturer, allWatchesByManufacturer] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
    Watch.find({ manufacturer: req.params.id }).exec(),
  ]);

  if (manufacturer === null) {
    res.redirect("/catalog/manufacturers");
  }

  res.render("manufacturer_delete", {
    title: "Delete Manufacturer",
    manufacturer: manufacturer,
    manufacturer_watches: allWatchesByManufacturer,
  });
});

exports.manufacturer_delete_post = asyncHandler(async (req, res, next) => {
  const [manufacturer, allWatchesByManufacturer] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
    Watch.find({ manufacturer: req.params.id }).exec(),
  ]);

  if (allWatchesByManufacturer.length > 0) {
    res.render("manufacturer_delete", {
      title: "Delete Manufacturer",
      manufacturer: manufacturer,
      manufacturer_watches: allWatchesByManufacturer,
    });
    return;
  } else {
    await Manufacturer.findByIdAndRemove(req.body.manufacturerid);
    res.redirect("/catalog/manufacturers");
  }
});

exports.manufacturer_update_get = asyncHandler(async (req, res, next) => {
  const manufacturer = await Manufacturer.findById(req.params.id).exec();

  if (manufacturer === null) {
    const err = new Error("Manufacturer not found");
    err.status = 404;
    return next(err);
  }

  res.render("manufacturer_form", {
    title: "Update Manufacturer",
    manufacturer: manufacturer,
  });
});

exports.manufacturer_update_post = [
  body("name", "Name of Manufacturer must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("est", "Year must not be empty")
    .trim() 
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const manufacturer = new Manufacturer({
      name: req.body.name,
      est: req.body.est,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      res.render ("manufacturer_form", {
        title: "Update Manufacturer",
        manufacturer: manufacturer,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedManufacturer = await Manufacturer.findByIdAndUpdate(req.params.id, manufacturer, {});
      res.redirect(updatedManufacturer.url);
    }
  }),
];
