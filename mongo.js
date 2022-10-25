const mongoose = require('mongoose')
//comment

if (process.argv.length < 3) {
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://Kalliojumala:${password}@fullstackopen2022.o7qg8.mongodb.net/retryWrites=true&w=majority`

//const url = `mongodb+srv://Kalliojumala:<password>@fullstackopen2022.o7qg8.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number,
})

const Person =  mongoose.model('Person', personSchema);

const addPerson = () => {
    const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4],
        id : Math.floor(Math.random() * 20000)
    })

    newPerson.save().then((result) => {
        console.log(`Added ${process.argv[3]}, ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}

const getPersons = () => {
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })
}

if(process.argv[3] && process.argv[4]) {
    addPerson();
}
else {
    getPersons();
}



