const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WatchSchema = new Schema ({
    name: { type: String, required: true },
    manufacturer: { type: Schema.Types.ObjectId, ref: "Manufacturer", required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
});

WatchSchema.virtual("url").get(function() {
    return `/catalog/watch/${this._id}`;
});

module.exports = mongoose.model("Watch", WatchSchema);