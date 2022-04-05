const mongoose = require('mongoose')
const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl).then((result) => {
    console.log("Connected to Database!")
}).catch(err => {
    console.log("Error connecting to database", error.message)
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number,
})

personSchema.set('toJSON', {
    transform: (document, resultObj) => {
        resultObj.id = resultObj._id.toString()
        delete resultObj._id
        delete resultObj.__v
    }
})


module.exports =  mongoose.model('Person', personSchema);