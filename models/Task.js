const { Schema, model } = require("mongoose");

const taskSchema = Schema({
  text: { type: String, required: true },
});

module.exports = model("Task", taskSchema);
