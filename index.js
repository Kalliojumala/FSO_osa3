const express = require("express");
const app = express();
app.use(express.json());

const morgan = require("morgan");

app.use(
  morgan("tiny", {
    skip: function (req, res) {
      return req.method === "POST";
    },
  })
);

morgan.token("resbody", function (req, res) {
  return `ms ${JSON.stringify(req.body)}`;
});

app.use(
  morgan(":method :url :status :res[content-length]  :response-time :resbody", {
    skip: function (req, res) {
      return req.method !== "POST";
    },
  })
);

//Hardcoded/Calculated variables below
let numbers = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-1231231",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "040-1255555",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "040-777777",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "040-123111",
  },
];

const createInfoPage = () => {
  const numberOfEntries = numbers.length;
  const requestDateTime = Date();
  return `<div>Phonebook has ${numberOfEntries} entries</div><div>${requestDateTime}</div>`;
};

//Get request, all data.
app.get("/api/persons/", (request, response) => {
  response.json(numbers);
});

//Get single entry
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  let number = numbers.find((number) => number.id === id);
  console.log(number);
  if (number) {
    response.json(number);
  } else {
    response.status(404).end();
  }
});

//Delete entry
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  numbers = numbers.filter((number) => number.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  if (numbers.find((item) => item.name === request.body.name)) {
    return response
      .status(400)
      .json({ error: "Number/Person already added! Name must be unique." });
  }
  if (!request.body.name || !request.body.number) {
    return response
      .status(400)
      .json({ error: "Pass name and number with your request!" });
  }

  const newId = Math.floor(Math.random() * 20000);
  let newNumber = { ...request.body, id: newId };
  numbers = numbers.concat(newNumber);
  response.json(newNumber);
});

//Get info page (date, no of entries/numbers)
app.get("/info", (request, response) => {
  let info = createInfoPage();
  response.send(info);
  console.log(Date());
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
