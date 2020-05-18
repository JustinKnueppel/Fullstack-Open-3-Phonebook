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

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

const checkValidNewPerson = (newPerson) => {
  if (!newPerson.name) {
    return "Person must have a name";
  }
  if (!newPerson.number) {
    return "Person must have a number";
  }
  if (persons.map((person) => person.name).includes(newPerson.name)) {
    return `${newPerson.name} is already in the phonebook`;
  }
  return "";
};

app.get("/info", (request, response) => {
  const date = Date();
  const numPersons = persons.length;
  response.send(
    `<p>Phonebook as info for ${numPersons} people</p><p>${date}</p>`
  );
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

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  if (!persons.map((person) => person.id).includes(id)) {
    return response.status(404).end();
  }

  const person = persons.find((person) => person.id === id);
  response.json(person);
});

app.post("/api/persons", (request, response) => {
  const newPerson = request.body;

  const error = checkValidNewPerson(newPerson);
  if (error) {
    return response.status(400).json({ error }).end();
  }

  const id = Math.floor(Math.random() * Math.pow(2, 12));

  persons = persons.concat({ ...newPerson, id });

  response.status(201).send({ id });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  if (!persons.map((person) => person.id).includes(id)) {
    return response.status(204).end();
  }

  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT);
