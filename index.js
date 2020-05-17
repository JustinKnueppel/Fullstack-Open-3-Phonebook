const express = require("express");

const app = express();

const persons = [
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

app.get("/api/persons", (request, response) => {
  response.send(persons);
});

app.get("/info", (request, response) => {
  const date = Date();
  const numPersons = persons.length;
  response.send(`<p>Phonebook as info for ${numPersons} people</p><p>${date}</p>`)
})

const PORT = 3001;
app.listen(PORT);
