const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

mongoose.set('useCreateIndex', true);

const personSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true, unique: true },
  number: { type: String, minlength: 8, required: true },
});

personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

const connect = () => {
  const url = process.env.MONGO_URL;
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
};

const close = () => {
  mongoose.connection.close();
};

connect();

module.exports = Person;
