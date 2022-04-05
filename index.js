require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("build"));

//Morgan config, longer "logs" on POST- reqs
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

//CORS for dev frontend connection
const cors = require("cors");
app.use(cors());



//Module "Person"
const Person = require("./modules/personSchema");

//Get request, all data.
app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

//Get single entry
app.get("/api/persons/:id", (request, response) => {
  Person.find({ id: request.params.id }).then((result) => {
    console.log(result.length);
    if (result.length > 0) {
      response.json(result);
    } else {
      response.status(404).end();
    }
  });
});

//Delete entry
app.delete("/api/persons/:id", (request, response, next) => {
  
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response
      .status(400)
      .json({ error: "Pass name and number with your request!" });
  }

  Person.find({ name: request.body.name }).then((result) => {
    let nameComparison = result.length > 0 ? result[0].name : "Okay";
    if (nameComparison === request.body.name) {
      return response
        .status(400)
        .json({ error: "Number/Person already added! Name must be unique." });
    } else {
      const newPerson = new Person({
        name: request.body.name,
        number: request.body.number,
      });

      newPerson.save().then((result) => {
        console.log("Saved new entry!", result);
        response.json(newPerson);
      });
    }
  });
});

app.put("/api/persons/:id", (request, response) => {
  
  const updatedPerson = {
    name: request.body.name,
    number: request.body.number,
  }

  Person.findByIdAndUpdate(request.params.id, updatedPerson, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

//Get info page (date, no of entries/numbers)
app.get("/info", (request, response) => {
  let numberOfEntries = 0;
  Person.find({})
    .then((result) => {
      console.log(result);
      result.forEach((item) => {
        numberOfEntries += 1;
      });
    })
    .then(() => {
      let requestDateTime = new Date();
      const info = `<div>Phonebook has ${numberOfEntries} entries</div><div>${requestDateTime}</div>`;
      response.send(info);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
