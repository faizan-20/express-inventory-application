#! /usr/bin/env node

console.log(
  'This script populates some test watches, manufacturers and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Watch = require("./models/watch");
const Manufacturer = require("./models/manufacturer");
const Category = require("./models/category");

const categorys = [];
const manufacturers = [];
const watches = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategorys();
  await createManufacturers();
  await createWatches();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name) {
  const category = new Category({ name: name });
  await category.save();
  categorys[index] = category;
  console.log(`Added category: ${name}`);
}

async function manufacturerCreate(index, name, est) {
  const manufacturerdetail = { name: name, est: est};

  const manufacturer = new Manufacturer(manufacturerdetail);

  await manufacturer.save();
  manufacturers[index] = manufacturer;
  console.log(`Added manufacturer: ${name} ${est}`);
}

async function watchCreate(index, name, manufacturer, description, category, price, stock) {
  const watchdetail = {
    name: name,
    manufacturer: manufacturer,
    description: description,
    category: category,
    price: price,
    stock: stock,
  };
  if (category != false) watchdetail.category = category;

  const watch = new Watch(watchdetail);
  await watch.save();
  watches[index] = watch;
  console.log(`Added watch: ${name}`);
}

async function createCategorys() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Smart Watches"),
    categoryCreate(1, "Digital Watches"),
    categoryCreate(2, "Analog Watches"),
  ]);
}

async function createManufacturers() {
  console.log("Adding manufacturers");
  await Promise.all([
    manufacturerCreate(0, "Titan", "1984"),
    manufacturerCreate(1, "Fossil", "1984"),
    manufacturerCreate(2, "Armani", "1975"),
    manufacturerCreate(3, "Amazefit", "2015"),
  ]);
}

async function createWatches() {
  console.log("Adding Watches");
  await Promise.all([
    watchCreate(0,
      "Titan watch 1",
      manufacturers[0],
      "great titan watch",
      categorys[1],
      40,
      30
    ),
    watchCreate(1,
      "Titan watch 2",
      manufacturers[0],
      "great titan watch 2",
      categorys[2],
      35,
      19
    ),
    watchCreate(2,
      "Fossil watch 1",
      manufacturers[1],
      "great fossil watch",
      categorys[2],
      120,
      12
    ),
    watchCreate(3,
      "Fossil watch 2",
      manufacturers[1],
      "great Fossil watch 2",
      categorys[1],
      200,
      90
    ),
    watchCreate(4,
      "Armani watch 1",
      manufacturers[3],
      "great armani watch",
      categorys[2],
      250,
      10
    ),
    watchCreate(5,
      "armani watch 2",
      manufacturers[3],
      "great titan watch",
      categorys[1],
      400,
      2
    ),
  ]);
}