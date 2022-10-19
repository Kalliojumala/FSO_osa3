const mongoose = require('mongoose')
const dbUrl = process.env.DB_URL

mongoose.connect(dbUrl).then((result) => {
    console.log("Connected to Database!")
}).catch(err => {
    console.log("Error connecting to database", err.message)
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        required: true
    },
    number:{
        type: String,
        minlength: 8,
        validate: {
            validator: function(x) {
                var regexp = /^([0-9]{2,3}-[0-9]{6,8})/;
                return regexp.test(x)
            },
            message: 'Number is invalid'
        }
    },
    id: Number,
})

personSchema.set('toJSON', {
    transform: (document, resultObj) => {
        resultObj.id = resultObj._id.toString()
        delete resultObj._id
        delete resultObj.__v
    }
})
module.exports =  mongoose.model('Person', personSchema)