const Category = require('../models/category');
const Watch = require('../models/watch');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategory = await Category.find({}).sort({ name: 1 }).exec();

    res.render("category_list", {title: "Category List", category_list: allCategory});
});

exports.category_detail = asyncHandler(async (req, res, next) => {
    const [category, watchesInCategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Watch.find({ category: req.params.id }).exec(),
    ]);

    if (category === null) {
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }

    res.render("category_detail", {
      title: "Category Detail",
      category: category,
      category_watches: watchesInCategory, 
    });
});

exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
};

exports.category_create_post = [
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      const category = new Category({ name: req.body.name });

      if(!errors.isEmpty()) {
        res.render("category_form", {
          title: "Create Category",
          category: category,
          errors: errors.array(),
        });
        return;
      } else {
        const categoryExists = await Category.findOne({ name: req.body.name }).exec();
        if (categoryExists) {
          res.redirect(categoryExists.url);
        } else {
          await category.save();
          res.redirect(category.url);
        }
      }
    }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, allWatchesByCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Watch.find({ category: req.params.id }).exec(),
  ]);

  if (category === null) {
    res.redirect("/catalog/categories");
  }

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    category_watches: allWatchesByCategory,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, allWatchesByCAtegory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Watch.find({ category: req.params.id }).exec(),
  ]);

  if (allWatchesByCAtegory.length > 0) {
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_watches: allWatchesByCAtegory,
    });
    return;
  } else {
    await Category.findByIdAndRemove(req.body.categoryid);
    res.redirect("/catalog/categories");
  }
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", {
    title: "Update Category",
    category: category,
  });
});

exports.category_update_post = [
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
      res.redirect(updatedCategory.url);
    }
  })
];
