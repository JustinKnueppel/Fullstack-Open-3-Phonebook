require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
morgan.token("body", (request, response) => {
  return request.method.toUpperCase() === "POST"
    ? JSON.stringify(request.body)
    : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const checkValidNewPerson = (newPerson) => {
  if (!newPerson.name) {
    return "Person must have a name";
  }
  if (!newPerson.number) {
    return "Person must have a number";
  }
  return "";
};

app.get("/info", (request, response) => {
  Person.find({})
    .then((persons) => {
      const date = Date();
      const numPersons = persons.length;
      response.send(
        `<p>Phonebook as info for ${numPersons} people</p><p>${date}</p>`
      );
    })
    .catch((error) => {
      response.send("Error loading persons");
    });
});

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((persons) => {
      response.send(persons);
    })
    .catch((error) => {
      response.send([]);
    });
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findById(id)
    .then((person) => {
      response.send(person);
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons", (request, response, next) => {
  const newPerson = request.body;

  const error = checkValidNewPerson(newPerson);
  if (error) {
    next(error);
  } else {
    const person = new Person(newPerson);
    person.save().then((savedPerson) => {
      response.json(savedPerson);
    });
  }
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndRemove(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  const person = request.body;

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => {
      response.send(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  response.status(400).send({ error: error }).end();
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);
