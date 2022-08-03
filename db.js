const mongoose = require("mongoose");

const { username, password, database } = process.env;

mongoose
  .connect(
    `mongodb+srv://${username}:${password}@cluster0.nnbxv.mongodb.net/${database}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB connected..."))
  .catch(() => console.log("Connection to MongoDB failed..."));
